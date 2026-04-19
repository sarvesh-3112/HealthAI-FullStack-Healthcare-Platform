from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import uuid, hashlib, os

router = APIRouter()

# Demo users store (in production, use Supabase Auth)
DEMO_USERS = {
    "patient@healthai.demo": {"id": "user-001", "role": "patient",       "full_name": "Priya Sharma",    "password_hash": hashlib.sha256(b"Patient123!").hexdigest()},
    "doctor@healthai.demo":  {"id": "user-002", "role": "organization",  "full_name": "Dr. Arjun Mehta", "password_hash": hashlib.sha256(b"Doctor123!").hexdigest()},
    "admin@healthai.demo":   {"id": "user-003", "role": "admin",         "full_name": "Admin User",      "password_hash": hashlib.sha256(b"Admin123!").hexdigest()},
}


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "patient"


class LoginRequest(BaseModel):
    email: str
    password: str


def make_token(user_id: str, role: str) -> str:
    import json, base64
    payload = json.dumps({"sub": user_id, "role": role, "user_metadata": {"role": role}})
    return base64.b64encode(payload.encode()).decode()


@router.post("/register")
async def register(request: RegisterRequest):
    if request.email in DEMO_USERS:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    DEMO_USERS[request.email] = {
        "id": user_id,
        "role": request.role,
        "full_name": request.full_name,
        "password_hash": hashlib.sha256(request.password.encode()).hexdigest(),
    }
    return {
        "user": {"id": user_id, "email": request.email, "role": request.role},
        "access_token": make_token(user_id, request.role),
        "message": "Registration successful",
    }


@router.post("/login")
async def login(request: LoginRequest):
    user = DEMO_USERS.get(request.email)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user["password_hash"] != hashlib.sha256(request.password.encode()).hexdigest():
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "user": {"id": user["id"], "email": request.email, "role": user["role"], "full_name": user["full_name"]},
        "access_token": make_token(user["id"], user["role"]),
        "message": "Login successful",
    }


@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}


@router.get("/demo-credentials")
async def demo_credentials():
    """Return demo credentials for testing."""
    return {
        "message": "Use these credentials for demo access",
        "accounts": [
            {"role": "Patient",      "email": "patient@healthai.demo", "password": "Patient123!"},
            {"role": "Doctor/Org",   "email": "doctor@healthai.demo",  "password": "Doctor123!"},
            {"role": "Admin",        "email": "admin@healthai.demo",   "password": "Admin123!"},
        ]
    }
