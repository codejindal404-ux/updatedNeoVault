# NeoVault Backend

AI Document Vault & Intelligent Form Autofill Engine — Flask backend.

## Getting Started

1. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in the required values (e.g., `SECRET_KEY`, `JWT_SECRET_KEY`, `SQLALCHEMY_DATABASE_URI`).

4. Run the development server:
   ```bash
   python run.py
   ```
   The API will be available at http://localhost:5000

## Current Features

- **Authentication Setup**: The backend uses Flask-JWT-Extended and Flask-Bcrypt for secure token-based authentication and password hashing.
- **Database Models**: SQLAlchemy is set up with `User` and `OTP` models.
- **Auth Routes (`app/routes/auth.py`)**:
  - `POST /register`: Register a new user.
  - `POST /login`: Authenticate and receive access/refresh JWTs.
  - `POST /request-otp`: Generate a 6-digit OTP and store it in the database (simulating email dispatch).
  - `GET /me`: Get details of the currently authenticated user.

## Next Steps

- Implement an endpoint to verify the generated OTPs.
- Create endpoints for the Document Vault (file upload, retrieval, metadata storage).
- Integrate AI (OCR + Gemini) for document parsing.
- Build URL security scanning endpoints.
- Wire these endpoints to the React frontend.
