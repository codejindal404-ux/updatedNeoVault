from flask import Blueprint, request, jsonify
from app.extensions import db
from app.models import User, Document, VaultEntry, ActivityLog
from app.utils.auth_decorators import admin_required
from sqlalchemy import func

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@admin_required()
def get_users():
    users = User.query.all()
    result = []
    for user in users:
        result.append({
            "id": user.id,
            "email": user.email,
            "is_verified": user.is_verified,
            "is_active": user.is_active,
            "is_admin": user.is_admin,
            "last_login": user.last_login.isoformat() if user.last_login else None,
            "created_at": user.created_at.isoformat() if user.created_at else None
        })
    return jsonify({"users": result}), 200

@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@admin_required()
def get_user_details(user_id):
    user = User.query.get_or_404(user_id)
    doc_count = Document.query.filter_by(user_id=user.id).count()
    vault_count = VaultEntry.query.filter_by(user_id=user.id).count()
    
    return jsonify({
        "id": user.id,
        "email": user.email,
        "is_verified": user.is_verified,
        "is_active": user.is_active,
        "is_admin": user.is_admin,
        "last_login": user.last_login.isoformat() if user.last_login else None,
        "created_at": user.created_at.isoformat() if user.created_at else None,
        "stats": {
            "documents_count": doc_count,
            "vault_entries_count": vault_count
        }
    }), 200

@admin_bp.route('/users/<int:user_id>/toggle-status', methods=['PATCH'])
@admin_required()
def toggle_user_status(user_id):
    user = User.query.get_or_404(user_id)
    if user.is_admin:
        return jsonify({"error": "Cannot modify admin user status"}), 400
        
    user.is_active = not user.is_active
    db.session.commit()
    
    action = "unblocked" if user.is_active else "blocked"
    return jsonify({
        "message": f"User successfully {action}",
        "is_active": user.is_active
    }), 200

@admin_bp.route('/stats', methods=['GET'])
@admin_required()
def get_stats():
    total_users = User.query.count()
    verified_users = User.query.filter_by(is_verified=True).count()
    unverified_users = total_users - verified_users
    total_documents = Document.query.count()
    total_vault_entries = VaultEntry.query.count()
    
    return jsonify({
        "total_users": total_users,
        "verified_users": verified_users,
        "unverified_users": unverified_users,
        "total_documents": total_documents,
        "total_vault_entries": total_vault_entries
    }), 200

@admin_bp.route('/documents', methods=['GET'])
@admin_required()
def get_all_documents():
    documents = Document.query.order_by(Document.uploaded_at.desc()).all()
    result = []
    for doc in documents:
        result.append({
            "id": doc.id,
            "user_id": doc.user_id,
            "original_filename": doc.original_filename,
            "file_type": doc.file_type,
            "file_size_bytes": doc.file_size_bytes,
            "upload_status": doc.upload_status,
            "uploaded_at": doc.uploaded_at.isoformat() if doc.uploaded_at else None,
            "is_deleted": doc.is_deleted
        })
    return jsonify({"documents": result}), 200

@admin_bp.route('/logs', methods=['GET'])
@admin_required()
def get_logs():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = ActivityLog.query.order_by(ActivityLog.timestamp.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )
    
    logs = []
    for log in pagination.items:
        logs.append({
            "id": log.id,
            "user_id": log.user_id,
            "action": log.action,
            "ip_address": log.ip_address,
            "timestamp": log.timestamp.isoformat() if log.timestamp else None
        })
        
    return jsonify({
        "logs": logs,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page,
        "per_page": pagination.per_page
    }), 200
