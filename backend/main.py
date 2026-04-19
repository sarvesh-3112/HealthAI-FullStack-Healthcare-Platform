"""
HealthAI FastAPI Backend — Main Entry Point
Runs on port 8000
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import predict, patients, organizations, admin, auth

app = FastAPI(
    title="HealthAI API",
    description="Medical AI platform for hospitals — AI-powered disease prediction",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,          prefix="/auth",  tags=["Auth"])
app.include_router(predict.router,       prefix="/predict", tags=["AI Prediction"])
app.include_router(patients.router,      prefix="/patients", tags=["Patients"])
app.include_router(organizations.router, prefix="/org",   tags=["Organizations"])
app.include_router(admin.router,         prefix="/admin", tags=["Admin"])

@app.get("/health", tags=["Health"])
async def health_check():
    try:
        import joblib
        model = joblib.load("models/disease_model.pkl")
        model_status = "loaded"
    except Exception:
        model_status = "not_found (run ml/train_model.py first)"
    return {
        "status": "ok",
        "model": model_status,
        "version": "1.0.0",
        "demo_mode": os.getenv("DEMO_MODE", "true") == "true",
    }

@app.get("/symptoms", tags=["AI Prediction"])
async def get_symptoms():
    """Return the full list of symptoms the model understands."""
    try:
        import joblib
        symptoms = joblib.load("models/symptoms_list.pkl")
        return {"symptoms": symptoms, "count": len(symptoms)}
    except Exception:
        return {"symptoms": [], "count": 0, "error": "Model not trained yet"}
