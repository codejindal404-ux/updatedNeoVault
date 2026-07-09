# NeoVault: AI-Powered Secure Document Vault

NeoVault is an advanced, highly secure document management and vault application. It leverages AI (Google Gemini) and OCR technology to automatically extract structured data from uploaded documents, encrypts sensitive information using Fernet encryption, and provides a suite of security tools including URL scanning and system-wide audit trails. 

The platform features a modern, dark glassmorphism React frontend and a robust Flask-based REST API backend.

## Tech Stack

**Backend:**
- Flask, SQLAlchemy, Flask-Migrate
- Flask-JWT-Extended (Authentication)
- Flask-Bcrypt (Password Hashing)
- Flask-Mail (SMTP OTPs)
- Flask-CORS, Flask-Limiter (Rate Limiting)
- Fernet (Cryptography/Encryption)
- PyTesseract, pdf2image (OCR)
- Google Gemini API (AI Parsing)
- Google Safe Browsing API (URL Scanning)

**Frontend:**
- React, Vite, React Router
- Tailwind CSS (Custom Dark Glassmorphism Theme)
- Axios

**Database:**
- PostgreSQL (Hosted on Neon)

---

## Features (Completed)

### 1. Authentication System
- Secure Registration & Login with JWT-protected routes
- Email OTP verification flow using real SMTP
- Forgot Password / Reset Password flow (OTP-based)
- Robust Rate-limiting on login, register, and OTP endpoints

### 2. Document Management
- Upload PDF, JPG, and PNG documents (up to 10MB) with strict validation
- Advanced OCR text extraction via PyTesseract and Poppler
- AI-powered parsing via Google Gemini to automatically extract name, DOB, ID number, address, etc.
- List, view, and soft-delete document capabilities

### 3. Encrypted Vault
- AES-level Fernet encryption for individual data fields
- Categorized entries (Identity, Financial, Medical, Other)
- Custom field addition (users can manually add custom vault entries)
- Secure CSV export of decrypted vault data

### 4. Admin Panel (Full Security & Auditing)
- Comprehensive user management (list, activate/deactivate users)
- Real-time dashboard statistics and document overview
- **Admin Promotion/Demotion:** Existing admins can securely grant or revoke admin access (with self-demotion protection built-in)
- **Security Alerts:** Automatically logs unauthorized 403 admin access attempts by standard users
- **Audit Trail:** Full system logging of all critical admin actions
- **Tabbed Interface:** Effortlessly switch between Personnel, Documents, System Logs, and Security Alerts

### 5. URL Security Scanner
- HTTPS/SSL validity checks and domain pattern analysis (detects IP-based URLs and typosquatting)
- Google Safe Browsing API integration for active blacklist checking
- Rate-limited scan history (60 scans per hour)

### 6. Form Autofill Agent (Phase 1)
- Normalizes Vault data into standard fields (Name, DOB, Address, ID Number, Phone, Email, Gender, Father's Name)
- Dedicated in-app interface for form autofilling preparation

### 7. Profile & Settings
- Editable user profile (Full Name, Phone Number) with read-only email security
- Secure password change functionality
- Account deletion with 2-step confirmation (cascades to delete all user data and documents)
- System Settings (e.g., Dark mode toggles persisted via `localStorage`)
- Email notification preferences (synced with backend)
- Active Sessions & Login History panel with Clear Activity Log options

### 8. Notifications
- Real-time notification dropdown in the global header, backed by actual system activity events (login, vault sync, etc.)

### 9. Infrastructure & UI/UX
- PostgreSQL database hosted on Neon
- Layout perfectly optimized: fixed sidebar and header, scrolling restricted only to the main content area (no horizontal scrolling issues)
- 13+ fully designed React screens utilizing a premium dark glassmorphism theme, completely wired to the real backend (zero mock data)

---

## Roadmap (Not Yet Implemented)
1. **Form Autofill Phase 2:** Chrome Extension for injecting vault data into external website forms.
2. **Background Job Queue:** Implementation of Celery/Redis for asynchronous, heavy document processing.
3. **Redis Rate-Limiting:** Transitioning rate-limit storage from in-memory to Redis for horizontal scalability.
4. **Two-Factor Authentication (2FA):** Backend implementation for the existing UI placeholder.
5. **Production Deployment Configuration:** Containerization and deployment configurations for production environments (replacing Flask/Vite dev servers).

---

## Setup Instructions

### Backend Setup

1. **Navigate to the backend directory and set up a virtual environment:**
   ```bash
   cd neovault-backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: Ensure Tesseract OCR and Poppler are installed on your system path for document processing).*

3. **Generate a Fernet Key for encryption:**
   Run the following Python snippet in your terminal to generate a secure encryption key:
   ```bash
   python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
   ```

4. **Environment Variables (`.env`):**
   Create a `.env` file in the backend root and configure the following variables:
   ```env
   # Flask App
   SECRET_KEY=your_super_secret_flask_key
   JWT_SECRET_KEY=your_jwt_secret_key

   # Database
   DATABASE_URL=postgresql://user:password@ep-cool-snowflake-123456.us-east-2.aws.neon.tech/neovault?sslmode=require

   # Encryption
   ENCRYPTION_KEY=the_fernet_key_you_generated_above

   # Email Setup (SMTP)
   MAIL_SERVER=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USE_TLS=True
   MAIL_USERNAME=your_email@gmail.com
   MAIL_PASSWORD=your_gmail_app_password
   MAIL_DEFAULT_SENDER=your_email@gmail.com

   # External APIs
   GEMINI_API_KEY=your_google_gemini_api_key
   SAFE_BROWSING_API_KEY=your_google_safe_browsing_api_key
   ```

5. **Database Migration & Run Server:**
   ```bash
   flask db upgrade
   python run.py
   ```

> **IMPORTANT: Initial Admin Setup**
> For security reasons, there is no self-service endpoint to become an admin. **The first administrative user must be manually configured directly in the database.**
> 1. Register a normal account via the frontend.
> 2. Connect to your PostgreSQL database and run: `UPDATE users SET is_admin = true WHERE email = 'your_email@domain.com';`
> 3. Once the first admin is set, they can promote other users securely via the Admin Portal UI.

---

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd neovault-frontend
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables (`.env`):**
   Create a `.env` file in the frontend root if required by your setup (e.g., specifying the API URL):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run the Vite development server:**
   ```bash
   npm run dev
   ```