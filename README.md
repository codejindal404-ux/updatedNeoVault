NeoVault
AI Document Vault & Intelligent Form Autofill Engine
NeoVault lets users upload identity/financial documents (Aadhaar, PAN, etc.), automatically extracts structured data using OCR + Google Gemini AI, and securely stores selected fields in an encrypted vault.
Tech Stack
Backend: Flask, SQLAlchemy, Flask-Migrate, Flask-JWT-Extended, Flask-Bcrypt, Flask-Mail, Flask-CORS, Fernet (cryptography), PyTesseract, pdf2image, Google Gemini API
Frontend: React, Vite, React Router, Axios
Database: SQLite (dev)
External dependencies: Tesseract OCR, Poppler, Gmail SMTP (App Password), Google Gemini API key
Features (Completed)

Full authentication: Register → Email OTP verification (real SMTP) → Login → JWT-protected routes
Document upload: PDF/JPG/PNG (max 10MB), validated and stored
OCR text extraction (PyTesseract + Poppler for PDFs)
AI-powered parsing via Gemini: detects document type, extracts structured fields (name, DOB, ID number, address, etc.)
Document management: list, view parsed details, soft-delete
Encrypted Vault: save extracted fields (Fernet encryption), categorized (Identity/Financial/Medical/Other), view/delete
13 fully designed React screens, dark glassmorphism theme, all wired to real backend endpoints (no mock data)

Roadmap (Not Yet Implemented)

URL security scanner (HTTPS/SSL/phishing/blacklist checks)
Real-time Dashboard stats (currently placeholder counts)
Form autofill agent (external site field detection/filling)
Admin panel backend (user management, logs)
Rate limiting, CSRF protection, broader input validation
Background job queue (Celery/Redis) for document processing
Production deployment config (currently SQLite + Flask dev server + local storage)

Setup
Backend
cd neovault-backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
Copy .env.example to .env and fill in:
SECRET_KEY=
JWT_SECRET_KEY=
DATABASE_URL=sqlite:///neovault.db
GMAIL_USER=
GMAIL_APP_PASSWORD=
GEMINI_API_KEY=
FERNET_KEY=
Generate FERNET_KEY:
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
System dependencies (must be installed separately, not via pip):

Tesseract OCR — add install path to system PATH
Poppler for Windows — add Library/bin folder to system PATH

Run migrations and start the server:
flask db upgrade
python run.py
API runs at http://localhost:5000
Frontend
cd neovault-frontend
npm install
npm run dev
App runs at http://localhost:5173