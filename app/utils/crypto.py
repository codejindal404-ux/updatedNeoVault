from cryptography.fernet import Fernet
from flask import current_app

def get_fernet():
    key = current_app.config['FERNET_KEY']
    return Fernet(key)

def encrypt_value(plain_text):
    if not plain_text:
        return None
    f = get_fernet()
    encrypted_bytes = f.encrypt(plain_text.encode('utf-8'))
    return encrypted_bytes.decode('utf-8')

def decrypt_value(encrypted_text):
    if not encrypted_text:
        return None
    f = get_fernet()
    decrypted_bytes = f.decrypt(encrypted_text.encode('utf-8'))
    return decrypted_bytes.decode('utf-8')
