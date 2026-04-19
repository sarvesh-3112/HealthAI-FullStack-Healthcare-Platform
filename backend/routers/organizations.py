from fastapi import APIRouter

router = APIRouter()

DEMO_ORG = {"id": "org-001", "name": "Apollo General Hospital", "city": "Chennai", "is_active": True}
DEMO_PATIENTS = [
    {"id": "pat-001", "full_name": "Priya Sharma",   "gender": "female", "risk_level": "low",    "last_visit": "2026-03-10"},
    {"id": "pat-002", "full_name": "Rahul Verma",    "gender": "male",   "risk_level": "high",   "last_visit": "2026-03-09"},
    {"id": "pat-003", "full_name": "Anita Krishnan", "gender": "female", "risk_level": "medium", "last_visit": "2026-03-08"},
    {"id": "pat-004", "full_name": "Karan Patel",    "gender": "male",   "risk_level": "low",    "last_visit": "2026-03-07"},
    {"id": "pat-005", "full_name": "Meera Nair",     "gender": "female", "risk_level": "high",   "last_visit": "2026-03-06"},
]

@router.get("/patients")
async def list_patients():
    return {"patients": DEMO_PATIENTS, "total": len(DEMO_PATIENTS), "organization": DEMO_ORG}

@router.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    for p in DEMO_PATIENTS:
        if p["id"] == patient_id:
            return {**p, "predictions": [], "notes": []}
    return {"error": "Patient not found"}

@router.post("/notes")
async def add_note(data: dict):
    return {"id": "note-001", "message": "Note added successfully", **data}

@router.get("/analytics")
async def get_analytics():
    return {
        "total_patients": 124,
        "high_risk": 18,
        "medium_risk": 42,
        "low_risk": 64,
        "predictions_today": 37,
        "predictions_this_week": 201,
        "top_conditions": [
            {"disease": "Influenza", "count": 28},
            {"disease": "Hypertension", "count": 22},
            {"disease": "Diabetes", "count": 19},
            {"disease": "Common Cold", "count": 17},
            {"disease": "Asthma", "count": 14},
        ],
        "risk_trend": [
            {"date": "2026-03-08", "high": 3, "medium": 8, "low": 12},
            {"date": "2026-03-09", "high": 5, "medium": 6, "low": 9},
            {"date": "2026-03-10", "high": 2, "medium": 9, "low": 14},
            {"date": "2026-03-11", "high": 4, "medium": 7, "low": 11},
            {"date": "2026-03-12", "high": 6, "medium": 5, "low": 8},
            {"date": "2026-03-13", "high": 3, "medium": 8, "low": 10},
            {"date": "2026-03-14", "high": 2, "medium": 6, "low": 13},
        ],
    }
