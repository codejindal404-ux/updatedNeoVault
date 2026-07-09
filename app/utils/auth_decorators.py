from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models import User

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user or not user.is_admin:
                # Log the suspicious attempt
                from app.models import ActivityLog
                from app.extensions import db
                from flask import request
                
                log = ActivityLog(
                    user_id=current_user_id,
                    action="unauthorized_admin_access_attempt",
                    ip_address=request.remote_addr
                )
                db.session.add(log)
                try:
                    db.session.commit()
                except:
                    db.session.rollback()
                    
                return jsonify({"error": "Admin access required"}), 403
                
            return fn(*args, **kwargs)
        return decorator
    return wrapper
