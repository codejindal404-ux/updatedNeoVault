from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from email_validator import validate_email, EmailNotValidError
from app.extensions import db, bcrypt, mail, limiter
from flask_mail import Message
from app.models import User, OTP, ActivityLog, Document, VaultEntry, ScanHistory
import random
import string
import time
from datetime import datetime, timedelta, timezone

auth_bp = Blueprint('auth', __name__)

# Simple in-memory rate limiting dict: email -> timestamp
otp_rate_limits = {}

@auth_bp.route('/register', methods=['POST'])
@limiter.limit("3 per hour")
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
        
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
        
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400
        
    try:
        # Validate email format
        valid = validate_email(email)
        email = valid.normalized
    except EmailNotValidError as e:
        return jsonify({"error": str(e)}), 400
        
    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 409
        
    # Hash password
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    # Create user
    new_user = User(email=email, password_hash=password_hash, is_verified=False)
    db.session.add(new_user)
    db.session.commit()
    
    # Generate 6-digit code and save to DB
    code = ''.join(random.choices(string.digits, k=6))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    new_otp = OTP(email=email, code=code, expires_at=expires_at)
    db.session.add(new_otp)
    db.session.commit()
    
    # Send email
    try:
        msg = Message(
            subject="Your NeoVault Verification Code",
            recipients=[email]
        )
        msg.body = f"Your NeoVault verification code is: {code}. It expires in 10 minutes. If you didn't request this, ignore this email."
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email to {email}: {e}")
    
    return jsonify({
        "id": new_user.id,
        "email": new_user.email,
        "message": "Registration successful. OTP sent."
    }), 201

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
        
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
        
    user = User.query.filter_by(email=email).first()
    
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401
        
    if not user.is_active:
        return jsonify({"error": "Your account has been blocked by an administrator"}), 403
        
    if not user.is_verified:
        return jsonify({
            "error": "Please verify your email first",
            "email": user.email
        }), 403
        
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    
    # Update last_login and log activity
    user.last_login = datetime.now(timezone.utc)
    log = ActivityLog(
        user_id=user.id,
        action="login",
        ip_address=request.remote_addr
    )
    db.session.add(log)
    db.session.commit()
    
    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "email": user.email
        }
    }), 200

@auth_bp.route('/request-otp', methods=['POST'])
def request_otp():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
        
    email = data.get('email', '').strip()
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
        
    try:
        valid = validate_email(email)
        email = valid.normalized
    except EmailNotValidError as e:
        return jsonify({"error": str(e)}), 400
        
    current_time = time.time()
    if email in otp_rate_limits:
        time_since_last = current_time - otp_rate_limits[email]
        if time_since_last < 60:
            return jsonify({"error": f"Please wait {int(60 - time_since_last)} seconds before requesting another OTP."}), 429
            
    otp_rate_limits[email] = current_time
        
    # Generate 6-digit code
    code = ''.join(random.choices(string.digits, k=6))
    
    # Save to DB with 10-min expiry
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    new_otp = OTP(email=email, code=code, expires_at=expires_at)
    db.session.add(new_otp)
    db.session.commit()
    
    # Send email
    try:
        msg = Message(
            subject="Your NeoVault Verification Code",
            recipients=[email]
        )
        msg.body = f"Your NeoVault verification code is: {code}. It expires in 10 minutes. If you didn't request this, ignore this email."
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email to {email}: {e}")
    
    return jsonify({"message": "OTP generated and sent successfully"}), 200

@auth_bp.route('/verify-otp', methods=['POST'])
@limiter.limit("5 per minute")
def verify_otp():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
        
    email = data.get('email', '').strip()
    code = data.get('code', '').strip()
    
    if not email or not code:
        return jsonify({"error": "Email and code are required"}), 400
        
    try:
        valid = validate_email(email)
        email = valid.normalized
    except EmailNotValidError as e:
        return jsonify({"error": str(e)}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    # Get latest OTP for this email
    otp = OTP.query.filter_by(email=email).order_by(OTP.id.desc()).first()
    
    if not otp:
        return jsonify({"error": "No OTP found — request a new one"}), 400
        
    if otp.is_used:
        return jsonify({"error": "OTP has already been used — request a new one"}), 400
        
    # datetime.now(timezone.utc) is offset-aware, ensure expires_at is handled properly if it's naive in SQLite
    # Since we set it with datetime.now(timezone.utc), it should compare correctly, but if SQLAlchemy returns naive:
    expires_at = otp.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
        
    if expires_at < datetime.now(timezone.utc):
        return jsonify({"error": "Code expired"}), 400
        
    if otp.code != code:
        return jsonify({"error": "Invalid code"}), 400
        
    otp.is_used = True
    user.is_verified = True
    db.session.commit()
    
    return jsonify({"message": "Email verified successfully"}), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    return jsonify({
        "id": user.id,
        "email": user.email,
        "is_admin": user.is_admin,
        "is_verified": user.is_verified,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "last_login": user.last_login.isoformat() if user.last_login else None,
        "full_name": user.full_name,
        "phone": user.phone,
        "email_notifications_enabled": user.email_notifications_enabled
    }), 200

@auth_bp.route('/forgot-password', methods=['POST'])
@limiter.limit("5 per hour")
def forgot_password():
    data = request.get_json()
    if not data or 'email' not in data:
        return jsonify({"error": "Email is required"}), 400
        
    email = data['email'].strip()
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "No account found with this email"}), 404

    # Generate 6-digit code
    code = ''.join(random.choices(string.digits, k=6))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    new_otp = OTP(email=email, code=code, expires_at=expires_at)
    db.session.add(new_otp)
    db.session.commit()

    # Send email
    try:
        msg = Message(
            subject="Your NeoVault Password Reset Code",
            recipients=[email]
        )
        msg.body = f"Your NeoVault password reset code is: {code}. It expires in 10 minutes. If you didn't request this, ignore this email."
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email to {email}: {e}")

    return jsonify({"message": "Password reset code sent successfully"}), 200

@auth_bp.route('/reset-password', methods=['POST'])
@limiter.limit("5 per minute")
def reset_password():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400
        
    email = data.get('email', '').strip()
    code = data.get('code', '').strip()
    new_password = data.get('new_password', '')
    
    if not email or not code or not new_password:
        return jsonify({"error": "Email, code, and new password are required"}), 400
        
    if len(new_password) < 8:
        return jsonify({"error": "Password must be at least 8 characters long"}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    # Get latest OTP for this email
    otp = OTP.query.filter_by(email=email).order_by(OTP.id.desc()).first()
    
    if not otp:
        return jsonify({"error": "No password reset request found"}), 400
        
    if otp.is_used:
        return jsonify({"error": "This code has already been used"}), 400
        
    expires_at = otp.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
        
    if expires_at < datetime.now(timezone.utc):
        return jsonify({"error": "Code expired"}), 400
        
    if otp.code != code:
        return jsonify({"error": "Invalid code"}), 400
        
    # Mark OTP as used
    otp.is_used = True
    
    # Hash password & update
    user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
    
    # Log activity
    log = ActivityLog(
        user_id=user.id,
        action="password_reset",
        ip_address=request.remote_addr
    )
    db.session.add(log)
    db.session.commit()
    
    return jsonify({"message": "Password reset successfully. Please log in with your new password."}), 200

@auth_bp.route('/dashboard-stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    current_user_id = get_jwt_identity()
    
    total_docs = Document.query.filter_by(user_id=current_user_id, is_deleted=False).count()
    vault_entries = VaultEntry.query.filter_by(user_id=current_user_id).count()
    total_scans = ScanHistory.query.filter_by(user_id=current_user_id).count()
    
    # Get latest activity logs for this user (up to 5)
    logs = ActivityLog.query.filter_by(user_id=current_user_id).order_by(ActivityLog.timestamp.desc()).limit(5).all()
    
    log_list = []
    for log in logs:
        log_list.append({
            "id": log.id,
            "action": log.action,
            "ip_address": log.ip_address,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None
        })
        
    return jsonify({
        "total_documents": total_docs,
        "vault_entries": vault_entries,
        "total_scans": total_scans,
        "recent_activity": log_list
    }), 200

@auth_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    current_user_id = get_jwt_identity()
    
    # Fetch last 10 activity logs for the user to serve as notifications
    logs = ActivityLog.query.filter_by(user_id=current_user_id).order_by(ActivityLog.timestamp.desc()).limit(10).all()
    
    log_list = []
    for log in logs:
        log_list.append({
            "id": log.id,
            "action": log.action,
            "ip_address": log.ip_address,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None
        })
        
    return jsonify({"notifications": log_list}), 200

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
@limiter.limit("5 per hour")
def change_password():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    current_password = data.get('current_password', '')
    new_password = data.get('new_password', '')
    confirm_password = data.get('confirm_password', '')

    if not current_password or not new_password or not confirm_password:
        return jsonify({"error": "All fields are required"}), 400

    if not bcrypt.check_password_hash(user.password_hash, current_password):
        return jsonify({"error": "Current password is incorrect"}), 401

    if len(new_password) < 8:
        return jsonify({"error": "New password must be at least 8 characters"}), 400

    if new_password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')

    log = ActivityLog(
        user_id=user.id,
        action="password_reset",
        ip_address=request.remote_addr
    )
    db.session.add(log)
    db.session.commit()

    return jsonify({"message": "Password changed successfully"}), 200

@auth_bp.route('/delete-account', methods=['DELETE'])
@jwt_required()
@limiter.limit("3 per hour")
def delete_account():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    confirm_phrase = data.get('confirm', '') if data else ''
    if confirm_phrase != 'DELETE MY ACCOUNT':
        return jsonify({"error": "Confirmation phrase did not match. Send confirm: 'DELETE MY ACCOUNT'"}), 400

    try:
        # Cascade delete all user data
        ActivityLog.query.filter_by(user_id=user.id).delete()
        OTP.query.filter_by(email=user.email).delete()
        ScanHistory.query.filter_by(user_id=user.id).delete()
        VaultEntry.query.filter_by(user_id=user.id).delete()
        Document.query.filter_by(user_id=user.id).delete()
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "Account and all associated data permanently deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete account: {str(e)}"}), 500


@auth_bp.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    if 'full_name' in data:
        user.full_name = data['full_name']
    if 'phone' in data:
        user.phone = data['phone']

    db.session.commit()
    
    return jsonify({
        "message": "Profile updated successfully",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "phone": user.phone
        }
    }), 200

@auth_bp.route('/update-preferences', methods=['PUT'])
@jwt_required()
def update_preferences():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON body"}), 400

    if 'email_notifications_enabled' in data:
        user.email_notifications_enabled = bool(data['email_notifications_enabled'])

    db.session.commit()
    
    return jsonify({
        "message": "Preferences updated successfully",
        "email_notifications_enabled": user.email_notifications_enabled
    }), 200

@auth_bp.route('/login-history', methods=['GET'])
@jwt_required()
def login_history():
    current_user_id = get_jwt_identity()
    
    logs = ActivityLog.query.filter_by(
        user_id=current_user_id, 
        action="login"
    ).order_by(ActivityLog.timestamp.desc()).limit(10).all()
    
    history = [{
        "id": log.id,
        "ip_address": log.ip_address,
        "timestamp": log.timestamp.isoformat() if log.timestamp else None
    } for log in logs]
    
    return jsonify({"login_history": history}), 200

@auth_bp.route('/clear-activity-log', methods=['DELETE'])
@jwt_required()
def clear_activity_log():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
        
    try:
        ActivityLog.query.filter_by(user_id=user.id).delete()
        db.session.commit()
        return jsonify({"message": "Activity log cleared successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to clear activity log: {str(e)}"}), 500
