# NeoVault

NeoVault is an AI-powered Document Vault application featuring a Flask backend and a React frontend. It allows users to securely store documents, extract structured data using AI (OCR and Gemini), and manage their sensitive information in an encrypted vault.

## 🚀 Tech Stack

**Backend:**
- Flask, SQLAlchemy, Flask-Migrate
- Flask-JWT-Extended, Flask-Bcrypt, Flask-CORS, Flask-Limiter
- Flask-Mail (OTP Verification)
- Fernet (Cryptography)
- PyTesseract, pdf2image (OCR)
- Google Gemini API (AI Parsing)
- Google Safe Browsing API (URL Security)

**Frontend:**
- React (13 screens, dark glassmorphism theme)
- Vite, React Router, Axios

**Database:**
- PostgreSQL (hosted on Neon)

**External Dependencies:**
- Tesseract OCR & Poppler
- Gmail SMTP (App Password)
- Google Gemini API Key
- Google Safe Browsing API Key
- Neon PostgreSQL Connection String

---

## ✨ Features (Completed)

1. **Authentication System** — Register, Email OTP verification (real SMTP), Login, JWT-protected routes.
2. **Document Upload** — PDF/JPG/PNG upload (max 10MB) with validation.
3. **OCR + AI Parsing** — PyTesseract for text extraction, Google Gemini AI for structured data extraction (name, DOB, ID number, address, etc.).
4. **Document Management** — List, view, and soft-delete documents.
5. **Encrypted Vault** — Fernet encryption for individual field entries, categorized by Identity, Financial, Medical, and Other.
6. **Admin Panel Backend** — User list, toggle user status, dashboard stats, document overview, activity logs, admin-only access control.
7. **URL Security Scanner** — HTTPS/SSL check, domain pattern analysis (IP-based, typosquatting), Google Safe Browsing API blacklist check, and scan history.
8. **Form Autofill Agent (Phase 1, in-app)** — Normalizes Vault data into standard fields for autofilling.
9. **Rate-Limiting** — Flask-Limiter on login, register, OTP, and upload endpoints.
10. **Database Migration** — Migrated from SQLite to PostgreSQL (Neon cloud).
11. **Frontend UI** — 13 responsive React screens featuring a sleek dark glassmorphism theme, fully connected to the live backend.

---

## 🗺️ Roadmap (Not Yet Implemented)

1. **Form Autofill Phase 2** — Chrome Extension for external website form filling.
2. **Background Job Queue** — Celery/Redis for heavy asynchronous document processing.
3. **Redis-backed Rate-limit Storage** — Migrate from in-memory to Redis for rate-limiting.
4. **Security Hardening & 2FA** — Broader input validation, Security Audit Logging, and Time-based One-Time Passwords (TOTP).
5. **End-to-End Encryption (E2EE)** — Shift from server-side encryption to client-side encryption for zero-knowledge architecture.
6. **Automated Testing (CI/CD)** — Implement pytest, Jest, and GitHub Actions for continuous integration.
7. **Production Deployment Config & Dockerization** — Transition from Flask dev server to production WSGI/ASGI setup using Docker containers.

---

## 🛠️ Setup Instructions

### Backend Setup

1. **Navigate to the backend directory** (if separate from the frontend):
   ```bash
   cd backend
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   > **Note:** You must install system dependencies for Tesseract OCR and Poppler.
   > - **Windows:** Download and install [Tesseract](https://github.com/UB-Mannheim/tesseract/wiki) and [Poppler](https://github.com/oschwartz10612/poppler-windows/releases/), and ensure they are added to your System PATH.
   > - **macOS:** `brew install tesseract poppler`
   > - **Linux:** `sudo apt-get install tesseract-ocr poppler-utils`

4. **Environment Variables (`.env`)**:
   Create a `.env` file in the backend directory and configure the following:
   ```env
   # Database
   DATABASE_URL=your_neon_postgres_connection_string

   # Authentication & Security
   JWT_SECRET_KEY=your_jwt_secret_key
   ENCRYPTION_KEY=your_fernet_encryption_key

   # External APIs
   GEMINI_API_KEY=your_gemini_api_key
   SAFE_BROWSING_API_KEY=your_google_safe_browsing_api_key

   # SMTP (Email OTP)
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=your_gmail_address
   MAIL_PASSWORD=your_gmail_app_password
   ```
   *Tip: To generate a secure Fernet encryption key, you can run:*
   ```bash
   python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
   ```

5. **Database Migration:**
   ```bash
   flask db upgrade
   ```

6. **Run the Backend Server:**
   ```bash
   flask run
   ```

### Frontend Setup

1. **Navigate to the frontend directory** (if applicable):
   ```bash
   cd frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the Vite development server:**
   ```bash
   npm run dev
   ```