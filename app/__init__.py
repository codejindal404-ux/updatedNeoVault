import os
from flask import Flask, jsonify, request as flask_request
from app.config import config_by_name
from app.extensions import db, migrate, jwt, bcrypt, cors, mail, limiter
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
    limiter.init_app(app)
    # Enable CORS for the React frontend and the Chrome Extension
    cors.init_app(app, resources={r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "http://localhost:5173",
            # Allow Chrome Extension requests (origin is the extension's ID prefix)
            # Using a broad match here for development; tighten with the real extension ID in production.
        ],
        "supports_credentials": True
    }})

    # Additionally allow chrome-extension:// origins via a CORS header
    @app.after_request
    def add_cors_headers(response):
        origin = flask_request.environ.get('HTTP_ORIGIN', '')
        if origin.startswith('chrome-extension://') or origin.startswith('moz-extension://'):
            allowed_ext_id = os.environ.get('ALLOWED_EXTENSION_ID')
            # If ALLOWED_EXTENSION_ID is configured in .env, restrict Access-Control-Allow-Origin only to that extension
            if allowed_ext_id:
                allowed_origin = f"chrome-extension://{allowed_ext_id}"
                if origin == allowed_origin:
                    response.headers['Access-Control-Allow-Origin'] = origin
                    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
                    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
                    response.headers['Access-Control-Allow-Credentials'] = 'true'
            else:
                # In development mode without a configured ID, allow broad matching
                response.headers['Access-Control-Allow-Origin'] = origin
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
                response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
                response.headers['Access-Control-Allow-Credentials'] = 'true'
        return response
    
    # Custom 429 Rate Limit Error Handler
    @app.errorhandler(429)
    def ratelimit_handler(e):
        return jsonify({
            "error": "Rate limit exceeded. Please try again later.",
            "retry_after": "60 seconds"
        }), 429
    
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
