from app.extensions import db
from datetime import datetime, timezone

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    is_verified = db.Column(db.Boolean, default=False)
    is_admin = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    
    full_name = db.Column(db.String(150), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    email_notifications_enabled = db.Column(db.Boolean, default=True)

class OTP(db.Model):
    __tablename__ = 'otps'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False, index=True)
    code = db.Column(db.String(6), nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_used = db.Column(db.Boolean, default=False)
    
    # Optionally, keep a timestamp of when it was generated
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

class Document(db.Model):
    __tablename__ = 'documents'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False, unique=True)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(512), nullable=False)
    file_type = db.Column(db.String(10), nullable=False)
    file_size_bytes = db.Column(db.Integer, nullable=False)
    upload_status = db.Column(db.String(50), default='pending') # pending/processing/completed/failed
    uploaded_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    parsed_data = db.Column(db.Text, nullable=True) # JSON or Text
    is_deleted = db.Column(db.Boolean, default=False)
    
class VaultEntry(db.Model):
    __tablename__ = 'vault_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    document_id = db.Column(db.Integer, db.ForeignKey('documents.id'), nullable=True)
    field_name = db.Column(db.String(100), nullable=False)
    field_value_encrypted = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=True) # identity, financial, medical
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class ActivityLog(db.Model):
    __tablename__ = 'activity_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(100), nullable=False)
    ip_address = db.Column(db.String(45), nullable=True)
    timestamp = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

class ScanHistory(db.Model):
    __tablename__ = 'scan_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    url = db.Column(db.String(2048), nullable=False)
    verdict = db.Column(db.String(50), nullable=False) # Safe, Suspicious, Dangerous
    safety_score = db.Column(db.Integer, nullable=False)
    scanned_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

