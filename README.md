# Medical Backend API

Lightweight FastAPI backend providing patient management, appointments, and AI-assisted symptom normalization and agent runs.

## Features
- REST endpoints for health, auth, patients, and appointments
- AI routes for symptom normalization and LangGraph / Groq proxying
- Database initialization that runs SQL files from `database/sql` on startup
- Symptom normalization using an embedding model

## Requirements
- Python 3.11+ (recommended)
- MySQL server for the application's schema and stored procedures
- See `requirements.txt` for Python dependencies

## Quickstart

1. Create and activate a virtual environment

   - Windows PowerShell:

     ```powershell
     python -m venv venv
     .\venv\Scripts\Activate.ps1
     ```

2. Install dependencies

   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables

   - Copy `.env.example` (if present) or create a `.env` file in the `backend/` folder
   - At minimum, set database connection variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
   - Other settings are loaded from `backend/config/settings.py` via pydantic settings

4. Prepare the database

   - The app will attempt to run SQL files found at `database/sql/schema.sql` and `database/sql/functions/*.sql` on startup.
   - Ensure the configured MySQL user has privileges to create schema and stored procedures.

5. Run locally

   ```bash
   python main.py
   # or
   uvicorn main:app --reload --host 127.0.0.1 --port 8000
   ```

6. Open the API docs

   - Swagger UI: `http://127.0.0.1:8000/docs`
   - ReDoc: `http://127.0.0.1:8000/redoc`

## Important API routes

- Health: included via `health_router`
- Auth: `auth_router` (signup, login)
- Patients: `patients_router` (patient CRUD)
- Appointments: `appointments_router` (book/manage appointments)
- AI routes (see `routes/ai.py`):
  - `POST /normalize` — normalize symptom phrases (requires embedding model ready)
  - `POST /run_langgraph` — run medical agent via LangGraph
  - `POST /api/run_groq` and `POST /api/run_gemini` — proxy to Groq/Gemini

## Project structure (top-level)

- `main.py` — app entrypoint and lifespan initialization
- `routes/` — API routers
- `services/` — DB, embedding, Groq, and other backend services
- `agents/` — agent orchestration (medical agent)
- `models/` — pydantic schemas for requests/responses
- `database/sql/` — SQL schema and stored procedures (executed at startup)

## Notes
- The app initializes a `SymptomNormalizer` on startup and runs SQL migrations from `database/sql` — a working DB is required.
- AI features depend on models and external services configured in `backend/config/settings.py`.
- If you want, I can add a `.env.example`, CI, or Dockerfile next.

## Contact
If you need the README expanded (examples, full env vars, Docker), tell me which sections to add.
