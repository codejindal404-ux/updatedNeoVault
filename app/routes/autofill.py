from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.services.autofill_service import get_normalized_vault_data
import logging

autofill_bp = Blueprint('autofill', __name__)
logger = logging.getLogger(__name__)

@autofill_bp.route('/get-data', methods=['GET'])
@jwt_required()
def get_autofill_data():
    """
    Retrieves normalized vault data for the current user for form autofill purposes.
    """
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({'message': 'Invalid user identity'}), 401
            
        # Fetch and normalize data
        data = get_normalized_vault_data(current_user_id)
        
        return jsonify({
            'message': 'Autofill data retrieved successfully',
            'data': data
        }), 200
        
    except Exception as e:
        logger.error(f"Error in get_autofill_data route: {str(e)}")
        return jsonify({
            'message': 'Failed to retrieve autofill data',
            'error': str(e)
        }), 500
