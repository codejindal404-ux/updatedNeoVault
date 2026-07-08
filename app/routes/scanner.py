from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models import ScanHistory
from app.services.url_scanner_service import scan_url

scanner_bp = Blueprint('scanner', __name__)

@scanner_bp.route('/check-url', methods=['POST'])
@jwt_required()
def check_url():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "Missing 'url' in request body"}), 400
        
    url = data['url'].strip()
    if not url:
        return jsonify({"error": "URL cannot be empty"}), 400
        
    current_user_id = get_jwt_identity()
    
    try:
        # Call the scanner service
        result = scan_url(url)
        
        # Save to history
        history = ScanHistory(
            user_id=current_user_id,
            url=url,
            verdict=result['verdict'],
            safety_score=result['safety_score']
        )
        db.session.add(history)
        db.session.commit()
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"URL Scanner Error: {e}")
        return jsonify({"error": "An error occurred while scanning the URL"}), 500

@scanner_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    current_user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = ScanHistory.query.filter_by(user_id=current_user_id)\
        .order_by(ScanHistory.scanned_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)
        
    history_list = []
    for item in pagination.items:
        history_list.append({
            "id": item.id,
            "url": item.url,
            "verdict": item.verdict,
            "safety_score": item.safety_score,
            "scanned_at": item.scanned_at.isoformat() if item.scanned_at else None
        })
        
    return jsonify({
        "history": history_list,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page,
        "per_page": pagination.per_page
    }), 200
