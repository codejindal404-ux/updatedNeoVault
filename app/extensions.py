from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_mail import Mail
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Initialize extensions here (without the app instance) to avoid circular imports.
# We will attach them to the app instance in the app factory (app/__init__.py)
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
bcrypt = Bcrypt()
cors = CORS()
mail = Mail()

# Initialize Rate Limiter
# Note: For production, consider using Redis instead of in-memory storage.
# Example: limiter = Limiter(key_func=get_remote_address, storage_uri="redis://localhost:6379/0")
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)
