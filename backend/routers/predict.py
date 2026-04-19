from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, validator
from typing import List, Optional
import numpy as np
import os

router = APIRouter()

# Lazy-load model artifacts
_model = None
_le = None
_symptom_list = None

def load_model():
    global _model, _le, _symptom_list
    if _model is None:
        import joblib
        models_dir = os.path.join(os.path.dirname(__file__), "..", "models")
        model_path = os.path.join(models_dir, "disease_model.pkl")
        if not os.path.exists(model_path):
            return False
        _model = joblib.load(os.path.join(models_dir, "disease_model.pkl"))
        _le    = joblib.load(os.path.join(models_dir, "label_encoder.pkl"))
        _symptom_list = joblib.load(os.path.join(models_dir, "symptoms_list.pkl"))
    return True


class SymptomRequest(BaseModel):
    symptoms: List[str] = Field(..., min_length=1, max_length=50)
    patient_id: Optional[str] = None

    @validator("symptoms", each_item=True)
    def sanitize_symptom(cls, v):
        return v.strip().lower()[:100]


def get_risk_level(top_prob: float) -> str:
    if top_prob >= 0.75: return "high"
    if top_prob >= 0.45: return "medium"
    return "low"


@router.post("/")
async def predict_disease(request: SymptomRequest):
    if not load_model():
        # Demo fallback when model not trained yet
        demo_predictions = [
            {"disease": "Influenza",       "probability": 0.62},
            {"disease": "Common Cold",     "probability": 0.25},
            {"disease": "Viral Infection", "probability": 0.08},
            {"disease": "Pneumonia",       "probability": 0.05},
        ]
        return {
            "predictions": demo_predictions,
            "risk_level": "medium",
            "recommendation": "Monitor symptoms. Consult a doctor soon.",
            "symptoms_analyzed": request.symptoms,
            "top_disease": "Influenza",
            "top_probability": 0.62,
            "demo_mode": True,
        }

    norm_syms = [s.strip().lower() for s in request.symptoms]
    vector = np.array([
        1 if s in norm_syms else 0
        for s in _symptom_list
    ]).reshape(1, -1)

    probs = _model.predict_proba(vector)[0]
    top_idx = np.argsort(probs)[::-1][:5]

    predictions = [
        {
            "disease": _le.inverse_transform([i])[0],
            "probability": round(float(probs[i]), 4)
        }
        for i in top_idx if probs[i] > 0.01
    ]

    if not predictions:
        raise HTTPException(status_code=422, detail="No predictions generated")

    risk = get_risk_level(predictions[0]["probability"])

    return {
        "predictions": predictions,
        "risk_level": risk,
        "recommendation": {
            "high":   "Seek immediate medical attention.",
            "medium": "Monitor symptoms. Consult a doctor soon.",
            "low":    "Rest and stay hydrated. Monitor for changes.",
        }[risk],
        "symptoms_analyzed": request.symptoms,
        "top_disease": predictions[0]["disease"],
        "top_probability": predictions[0]["probability"],
        "demo_mode": False,
    }


@router.get("/history/{patient_id}")
async def get_prediction_history(patient_id: str):
    """Demo prediction history endpoint."""
    return {
        "patient_id": patient_id,
        "history": [
            {
                "id": "pred-001",
                "created_at": "2026-03-10T09:30:00Z",
                "top_disease": "Influenza",
                "risk_level": "medium",
                "top_probability": 0.62,
                "symptoms": ["fever", "cough", "fatigue"],
            },
            {
                "id": "pred-002",
                "created_at": "2026-03-01T14:15:00Z",
                "top_disease": "Common Cold",
                "risk_level": "low",
                "top_probability": 0.78,
                "symptoms": ["runny nose", "sneezing", "sore throat"],
            },
        ]
    }
