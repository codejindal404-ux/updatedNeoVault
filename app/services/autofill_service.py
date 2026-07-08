from app.models import VaultEntry
from app.utils.crypto import decrypt_value
import logging

logger = logging.getLogger(__name__)

FIELD_ALIASES = {
    "full_name": ["name", "full name", "applicant name", "full_name"],
    "date_of_birth": ["dob", "date of birth", "birth date", "date_of_birth"],
    "address": ["address", "residential address", "current address"],
    "id_number": ["aadhaar", "aadhaar number", "pan", "pan number", "id number", "id_number"],
    "phone": ["phone", "mobile", "contact number", "mobile number", "phone number"],
    "email": ["email", "email address", "email_address"],
    "gender": ["gender", "sex"],
    "father_name": ["father name", "father's name", "guardian name", "father_name"]
}

def get_normalized_vault_data(user_id):
    """
    Fetches user's vault entries, decrypts them, and normalizes the fields
    according to standard FIELD_ALIASES.
    """
    # Initialize the default return dictionary with None values
    normalized_data = {standard_field: None for standard_field in FIELD_ALIASES.keys()}
    
    # Fetch all vault entries for the user
    try:
        entries = VaultEntry.query.filter_by(user_id=user_id).all()
        if not entries:
            return normalized_data
            
        for entry in entries:
            # Decrypt the value safely
            try:
                decrypted_val = decrypt_value(entry.field_value_encrypted)
            except Exception as e:
                logger.error(f"Failed to decrypt vault entry {entry.id}: {str(e)}")
                continue
                
            if not entry.field_name:
                continue
                
            field_name_lower = entry.field_name.lower().strip()
            
            # Find matching standard field
            for standard_field, aliases in FIELD_ALIASES.items():
                if field_name_lower in [alias.lower() for alias in aliases]:
                    # Update normalized data (latest matching entry wins)
                    normalized_data[standard_field] = decrypted_val
                    break
                    
    except Exception as e:
        logger.error(f"Error fetching vault data for user {user_id}: {str(e)}")
        raise
        
    return normalized_data
