from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import VaultEntry, User
from app.utils.crypto import encrypt_value, decrypt_value
from datetime import datetime, timezone
import logging

vault_bp = Blueprint('vault', __name__)
logger = logging.getLogger(__name__)

VALID_CATEGORIES = ["identity", "financial", "medical", "other"]

@vault_bp.route('/save', methods=['POST'], strict_slashes=False)
@jwt_required()
def save_vault_entries():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    document_id = data.get('document_id')
    category = data.get('category', 'other').lower()
    if category not in VALID_CATEGORIES:
        category = 'other'

    fields = data.get('fields', [])
    if not fields or not isinstance(fields, list):
        return jsonify({"error": "No valid fields provided"}), 400

    saved_count = 0
    for field in fields:
        field_name = field.get('field_name')
        field_value = field.get('field_value')

        if not field_name or field_value is None:
            continue

        try:
            encrypted_value = encrypt_value(str(field_value))
            
            entry = VaultEntry(
                user_id=user.id,
                document_id=document_id,
                field_name=field_name,
                field_value_encrypted=encrypted_value,
                category=category
            )
            db.session.add(entry)
            saved_count += 1
        except Exception as e:
            logger.error(f"Failed to encrypt/save field {field_name}: {str(e)}")
            continue

    try:
        db.session.commit()
        return jsonify({"message": f"Successfully saved {saved_count} entries to vault", "count": saved_count}), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Database commit error in save_vault_entries: {str(e)}")
        return jsonify({"error": "Database error while saving vault entries"}), 500


@vault_bp.route('/', methods=['GET'], strict_slashes=False)
@vault_bp.route('', methods=['GET'], strict_slashes=False)
@jwt_required()
def get_vault_entries():
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    entries = VaultEntry.query.filter_by(user_id=user.id).all()
    
    decrypted_entries = []
    for entry in entries:
        try:
            decrypted_value = decrypt_value(entry.field_value_encrypted)
            decrypted_entries.append({
                "id": entry.id,
                "document_id": entry.document_id,
                "field_name": entry.field_name,
                "field_value": decrypted_value,
                "category": entry.category,
                "created_at": entry.created_at.isoformat() if entry.created_at else None
            })
        except Exception as e:
            logger.error(f"Failed to decrypt VaultEntry {entry.id}: {str(e)}")
            # Skip corrupted entries gracefully
            continue
            
    # Optional: group by category server-side, but the requirement said "group or sort by category in the response"
    # Returning a flat list sorted by category is fine, and frontend can group it.
    decrypted_entries.sort(key=lambda x: (x['category'] or 'other', x['field_name']))

    return jsonify(decrypted_entries), 200


@vault_bp.route('/<int:entry_id>', methods=['DELETE'], strict_slashes=False)
@jwt_required()
def delete_vault_entry(entry_id):
    current_user_id = int(get_jwt_identity())
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    entry = VaultEntry.query.filter_by(id=entry_id).first()
    if not entry:
        return jsonify({"error": "Vault entry not found"}), 404
        
    if entry.user_id != user.id:
        return jsonify({"error": "Permission denied"}), 403
        
    try:
        db.session.delete(entry)
        db.session.commit()
        return jsonify({"message": "Vault entry deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Database error deleting vault entry {entry_id}: {str(e)}")
        return jsonify({"error": "Database error while deleting entry"}), 500
