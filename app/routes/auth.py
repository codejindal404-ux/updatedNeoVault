from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from email_validator import validate_email, EmailNotValidError
from app.extensions import db, bcrypt, mail, limiter
from flask_mail import Message
from app.models import User, OTP, ActivityLog
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
        "is_admin": user.is_admin
    }), 200
