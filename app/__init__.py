import os
from flask import Flask
from app.config import config_by_name
from app.extensions import db, migrate, jwt, bcrypt, cors, mail
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def create_app(config_name=None):
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'development')
        
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])
    
    # Initialize extensions with the app
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    bcrypt.init_app(app)
    mail.init_app(app)
    # Enable CORS for the React frontend (usually localhost:3000 or 5173 for Vite)
    cors.init_app(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:5173"]}})
    
    # Register blueprints (routes)
    from app.routes.auth import auth_bp
    from app.routes.documents import documents_bp
    from app.routes.vault import vault_bp
    from app.routes.admin import admin_bp
    from app.routes.scanner import scanner_bp
    from app.routes.autofill import autofill_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(documents_bp, url_prefix='/api/documents')
    app.register_blueprint(vault_bp, url_prefix='/api/vault')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(scanner_bp, url_prefix='/api/scanner')
    app.register_blueprint(autofill_bp, url_prefix='/api/autofill')
    
    # Debug print for all routes
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        print(rule)
        
    return app
