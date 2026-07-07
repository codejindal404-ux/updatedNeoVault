from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import uuid
from werkzeug.utils import secure_filename
from app.extensions import db
from app.models import Document
from datetime import datetime, timezone
import json
from app.services.ocr_service import extract_text_from_file
from app.services.gemini_service import parse_document_text

documents_bp = Blueprint('documents', __name__)

ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@documents_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_document():
    current_user_id = get_jwt_identity()
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
        
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed. Only PDF, JPG, JPEG, and PNG are supported."}), 400
        
    # Check size is handled by Flask's MAX_CONTENT_LENGTH, but we can verify it here if needed,
    # however Flask automatically throws 413 if it exceeds the config.
    
    # Create user folder if not exists
    user_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], str(current_user_id))
    os.makedirs(user_folder, exist_ok=True)
    
    original_filename = secure_filename(file.filename)
    extension = original_filename.rsplit('.', 1)[1].lower()
    
    # UUID filename to avoid collision
    unique_filename = f"{uuid.uuid4()}.{extension}"
    file_path = os.path.join(user_folder, unique_filename)
    
    # Save file to disk
    file.save(file_path)
    file_size = os.path.getsize(file_path)
    
    # Create Document record
    new_doc = Document(
        user_id=current_user_id,
        filename=unique_filename,
        original_filename=original_filename,
        file_path=file_path,
        file_type=extension,
        file_size_bytes=file_size,
        upload_status='pending'
    )
    db.session.add(new_doc)
    db.session.commit()
    
    # Process document synchronously
    new_doc.upload_status = 'processing'
    db.session.commit()
    
    try:
        raw_text = extract_text_from_file(file_path, extension)
        parsed_dict = parse_document_text(raw_text)
        
        new_doc.parsed_data = json.dumps(parsed_dict) if parsed_dict else None
        new_doc.upload_status = 'completed'
    except Exception as e:
        print(f"Error processing document {new_doc.id}: {e}")
        new_doc.upload_status = 'failed'
        
    db.session.commit()
    
    return jsonify({
        "id": new_doc.id,
        "filename": new_doc.original_filename,
        "upload_status": new_doc.upload_status
    }), 201

@documents_bp.route('', methods=['GET'])
@jwt_required()
def list_documents():
    current_user_id = get_jwt_identity()
    
    docs = Document.query.filter_by(user_id=current_user_id, is_deleted=False).all()
    
    results = []
    for doc in docs:
        results.append({
            "id": doc.id,
            "original_filename": doc.original_filename,
            "file_type": doc.file_type,
            "upload_status": doc.upload_status,
            "uploaded_at": doc.uploaded_at.isoformat() if doc.uploaded_at else None
        })
        
    return jsonify(results), 200

@documents_bp.route('/<int:doc_id>', methods=['GET'])
@jwt_required()
def get_document(doc_id):
    current_user_id = get_jwt_identity()
    
    doc = Document.query.get(doc_id)
    if not doc or doc.is_deleted:
        return jsonify({"error": "Document not found"}), 404
        
    # Verify ownership
    if str(doc.user_id) != str(current_user_id):
        return jsonify({"error": "Unauthorized"}), 403
        
    parsed_data = None
    if doc.parsed_data:
        try:
            parsed_data = json.loads(doc.parsed_data)
        except:
            pass
            
    return jsonify({
        "id": doc.id,
        "original_filename": doc.original_filename,
        "file_type": doc.file_type,
        "file_size_bytes": doc.file_size_bytes,
        "upload_status": doc.upload_status,
        "uploaded_at": doc.uploaded_at.isoformat() if doc.uploaded_at else None,
        "parsed_data": parsed_data
    }), 200

@documents_bp.route('/<int:doc_id>', methods=['DELETE'])
@jwt_required()
def delete_document(doc_id):
    current_user_id = get_jwt_identity()
    
    doc = Document.query.get(doc_id)
    if not doc or doc.is_deleted:
        return jsonify({"error": "Document not found"}), 404
        
    # Verify ownership
    if str(doc.user_id) != str(current_user_id):
        return jsonify({"error": "Unauthorized"}), 403
        
    doc.is_deleted = True
    db.session.commit()
    
    return jsonify({"message": "Document deleted successfully"}), 200
