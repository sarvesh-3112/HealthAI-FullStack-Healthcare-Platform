from fastapi import APIRouter
from typing import Optional

router = APIRouter()

DEMO_PATIENTS = [
    {
        "id": "pat-001", "user_id": "user-001", "full_name": "Priya Sharma",
        "date_of_birth": "1990-05-15", "gender": "female", "blood_type": "O+",
        "allergies": ["Penicillin"], "medical_history": "Asthma since childhood",
        "emergency_contact": "+91-9876543210", "created_at": "2026-01-10T10:00:00Z"
    },
    {
        "id": "pat-002", "user_id": "user-010", "full_name": "Rahul Verma",
        "date_of_birth": "1985-08-22", "gender": "male", "blood_type": "A+",
        "allergies": [], "medical_history": "Hypertension",
        "emergency_contact": "+91-9876543211", "created_at": "2026-01-15T09:00:00Z"
    },
    {
        "id": "pat-003", "user_id": "user-011", "full_name": "Anita Krishnan",
        "date_of_birth": "1995-03-10", "gender": "female", "blood_type": "B+",
        "allergies": ["Sulfa drugs"], "medical_history": "Diabetes Type 2",
        "emergency_contact": "+91-9876543212", "created_at": "2026-02-01T11:00:00Z"
    },
]


@router.get("/profile")
async def get_profile():
    """Get current patient profile (demo: returns first patient)."""
    return DEMO_PATIENTS[0]

@router.put("/profile")
async def update_profile(data: dict):
    return {**DEMO_PATIENTS[0], **data, "message": "Profile updated"}

@router.get("/list")
async def list_patients():
    return {"patients": DEMO_PATIENTS, "total": len(DEMO_PATIENTS)}
