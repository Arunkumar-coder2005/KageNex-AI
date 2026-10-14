
# KageNex AI

KageNex AI is a web application with a Next.js frontend and a Python FastAPI backend.

## Project Folder Structure

```text
backend/
├── frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   └── next.config.ts
├── main.py
├── pyproject.toml
├── uv.lock
├── .gitignore
└── README.md
```

## Prerequisites

Install the following software:

- **Node.js and npm** — to run the frontend.
- **Python 3.14 or later** — as specified in `pyproject.toml`.
- **uv** — to manage Python dependencies and run the backend.
- **Git** — to manage source code.

Verify your installations:

```powershell
node --version
npm --version
python --version
uv --version
git --version
```

## Installation

### 1. Open the project folder

Open a terminal in the project directory containing `main.py` and `pyproject.toml`.

### 2. Install frontend dependencies

```powershell
cd frontend
npm install
cd ..
```

### 3. Install backend dependencies

```powershell
uv sync
```

This installs the Python dependencies defined by the backend project and lock file.

## Environment Configuration

The backend currently configures CORS to allow the local frontend origin:

```text
http://localhost:3000
```

If the application requires environment variables in the future, document their names and example values here. Do not commit passwords, API keys, or other secrets.

## Running the Application

Open two terminals from the project directory.

### Terminal 1: Start the backend

```powershell
uv run uvicorn main:app --reload --port 8000
```

Backend URL: http://localhost:8000

API documentation: http://localhost:8000/docs

### Terminal 2: Start the frontend

```powershell
cd frontend
npm run dev
```

Frontend URL: http://localhost:3000

## Health Check

The backend provides a health endpoint to verify that the API is running.

Open this URL in a browser:

http://localhost:8000/health

Expected response:

```json
{
  "status": "ok"
}
```

## Available Frontend Commands

Run these commands from the `frontend/` directory.

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the frontend for production |
| `npm run start` | Starts the production server after building |
| `npm run lint` | Runs ESLint |

## Backend Technologies

- Python
- FastAPI
- Uvicorn
- uv

## Frontend Technologies

- Next.js
- React
- TypeScript
- Tailwind CSS

## Development Notes

- Start the backend and frontend in separate terminals.
- The frontend uses port `3000` by default.
- The backend uses port `8000`.
- Ensure that CORS allows the frontend origin when connecting to the API.
