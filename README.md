# KageNex AI

## Project Folder Structure
```text
KageNex-AI/
├── frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── next.config.ts
├── main.py
├── pyproject.toml
├── uv.lock
├── .gitignore
└── README.md
```
## Prerequisites

Install the following software before running the project:

- Node.js and npm
- Python 3.14 or later, as specified in `pyproject.toml`
- uv for managing Python dependencies
- Git for version control

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the frontend dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:

   ```bash
   npm run dev
   ```

4. Open your browser and visit:

   http://localhost:3000

### Frontend Commands

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application |
| `npm run start` | Start the production server |
| `npm run lint` | Check code quality |
## Backend Setup

The backend is built using FastAPI and runs on Uvicorn.

### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install the Python dependencies using uv:

   ```bash
   uv sync
   ```

### Run the Backend

Start the backend server:

```bash
uv run uvicorn main:app --reload --port 8000
```

The backend will be available at:

- API: http://localhost:8000
- Health check: http://localhost:8000/health
- API documentation: http://localhost:8000/docs

### Verify the Backend

Run this command in a separate terminal:

```bash
curl.exe http://localhost:8000/health
```

Expected response:

```json
{"status":"ok"}
```
## Environment Configuration

Configure environment variables when required by the application.

For local development, the frontend runs on port `3000` and the backend runs on port `8000`.

The backend CORS configuration should allow the frontend origin:

```text
http://localhost:3000
```

Do not commit passwords, API keys, or other secrets to the repository.