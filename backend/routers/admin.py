from fastapi import APIRouter

router = APIRouter()

DEMO_USERS = [
    {"id": "user-001", "email": "patient@healthai.demo",  "role": "patient",       "full_name": "Priya Sharma",    "created_at": "2026-01-10", "is_active": True},
    {"id": "user-002", "email": "doctor@healthai.demo",   "role": "organization",  "full_name": "Dr. Arjun Mehta", "created_at": "2026-01-05", "is_active": True},
    {"id": "user-003", "email": "admin@healthai.demo",    "role": "admin",         "full_name": "Admin User",      "created_at": "2026-01-01", "is_active": True},
    {"id": "user-004", "email": "rahul@example.com",      "role": "patient",       "full_name": "Rahul Verma",     "created_at": "2026-01-15", "is_active": True},
    {"id": "user-005", "email": "dr.sinha@hospital.com",  "role": "organization",  "full_name": "Dr. Sinha",       "created_at": "2026-01-20", "is_active": False},
]

DEMO_ORGS = [
    {"id": "org-001", "name": "Apollo General Hospital",    "city": "Chennai",    "is_active": True,  "patients": 124, "created_at": "2026-01-01"},
    {"id": "org-002", "name": "AIIMS Medical Center",       "city": "Delhi",      "is_active": True,  "patients": 289, "created_at": "2026-01-03"},
    {"id": "org-003", "name": "Fortis Healthcare",          "city": "Mumbai",     "is_active": False, "patients": 0,   "created_at": "2026-01-10"},
]

@router.get("/users")
async def list_users():
    return {"users": DEMO_USERS, "total": len(DEMO_USERS)}

@router.put("/users/{user_id}/role")
async def update_role(user_id: str, data: dict):
    return {"message": f"Role updated for {user_id}", "new_role": data.get("role")}

@router.get("/organizations")
async def list_organizations():
    return {"organizations": DEMO_ORGS, "total": len(DEMO_ORGS)}

@router.post("/organizations")
async def create_organization(data: dict):
    return {"id": "org-new", "message": "Organization created", **data}

@router.get("/logs")
async def get_logs():
    return {"logs": [
        {"id": 1, "action": "LOGIN",        "user": "admin@healthai.demo",   "timestamp": "2026-03-14T10:15:00Z", "ip": "192.168.1.100"},
        {"id": 2, "action": "PREDICTION",   "user": "patient@healthai.demo", "timestamp": "2026-03-14T09:45:00Z", "ip": "192.168.1.101"},
        {"id": 3, "action": "ROLE_CHANGE",  "user": "admin@healthai.demo",   "timestamp": "2026-03-13T16:30:00Z", "ip": "192.168.1.100"},
        {"id": 4, "action": "REGISTER",     "user": "newuser@example.com",   "timestamp": "2026-03-13T14:00:00Z", "ip": "192.168.1.105"},
        {"id": 5, "action": "LOGIN_FAILED", "user": "unknown@example.com",   "timestamp": "2026-03-13T12:00:00Z", "ip": "10.0.0.1"},
    ]}

@router.get("/analytics")
async def get_platform_analytics():
    return {
        "total_users": 1247,
        "total_patients": 1089,
        "total_organizations": 12,
        "total_predictions": 8432,
        "predictions_today": 127,
        "high_risk_today": 18,
        "model_accuracy": 94.7,
        "weekly_trend": [
            {"week": "Week 1", "predictions": 1200},
            {"week": "Week 2", "predictions": 1450},
            {"week": "Week 3", "predictions": 1380},
            {"week": "Week 4", "predictions": 1690},
            {"week": "Week 5", "predictions": 1920},
            {"week": "Week 6", "predictions": 1792},
        ],
    }
