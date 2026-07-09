import os
from dotenv import load_dotenv
load_dotenv()

from app.extensions import db
from app.models import User
from app import create_app

app = create_app()

with app.app_context():
    users = User.query.all()
    for user in users:
        user.is_admin = True
    db.session.commit()
    print("All users are now admins!")
