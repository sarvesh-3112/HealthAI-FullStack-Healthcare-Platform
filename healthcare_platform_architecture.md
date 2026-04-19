# 🏥 HealthAI — Healthcare Platform Architecture & Development Guide

> **Full-Stack Medical AI Platform** | Next.js · FastAPI · Supabase · Random Forest ML  
> Built for hospital deployment on local networks. Antigravity Hackathon Edition.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Security Requirements](#5-security-requirements)
6. [Database Design (Supabase PostgreSQL)](#6-database-design)
7. [Supabase Setup & Integration](#7-supabase-setup--integration)
8. [AI Prediction System](#8-ai-prediction-system)
9. [Project Folder Structure](#9-project-folder-structure)
10. [Role-Based Routing](#10-role-based-routing)
11. [Backend API (FastAPI)](#11-backend-api)
12. [Frontend (Next.js)](#12-frontend-nextjs)
13. [Dashboard Components](#13-dashboard-components)
14. [Local Network Deployment](#14-local-network-deployment)
15. [Security Measures](#15-security-measures)
16. [Implementation Roadmap](#16-implementation-roadmap)
17. [Deployment Checklist](#17-deployment-checklist)
18. [Future Scalability](#18-future-scalability)

---

## 1. Project Overview

**HealthAI** is a production-grade, AI-powered web platform for hospitals and medical organizations. It provides:

- A patient-facing application for symptom input and AI disease prediction
- A hospital staff dashboard for managing patients and prediction records
- A secure admin panel for system-wide management
- A Python-based Random Forest AI model for real-time disease prediction

The system is designed to run on **local hospital networks** without requiring a public domain or internet access after initial setup.

### Architecture Summary

```
┌─────────────────────────────────────────────────────────┐
│                    HOSPITAL LOCAL NETWORK                │
│                                                         │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Patient    │  │  Hospital    │  │  Admin Panel  │  │
│  │  App        │  │  Dashboard   │  │  (Protected)  │  │
│  │ :3000       │  │  :3001       │  │  :3002        │  │
│  └──────┬──────┘  └──────┬───────┘  └──────┬────────┘  │
│         │                │                  │           │
│         └────────────────┼──────────────────┘           │
│                          │                              │
│              ┌───────────▼───────────┐                  │
│              │   FastAPI Backend     │                   │
│              │   :8000               │                   │
│              │   + ML Prediction     │                   │
│              └───────────┬───────────┘                  │
│                          │                              │
│              ┌───────────▼───────────┐                  │
│              │   Supabase            │                   │
│              │   PostgreSQL + Auth   │                   │
│              └───────────────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14+ | React framework with SSR/SSG |
| Tailwind CSS | 3.x | Utility-first styling |
| Recharts | Latest | Analytics & data visualization |
| TensorFlow.js | Latest | Client-side facial symptom detection |
| Web Speech API | Browser | Multilingual voice assistant |
| Supabase JS | 2.x | Database + Auth client |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Core backend language |
| FastAPI | 0.100+ | REST API framework |
| Scikit-learn | Latest | ML model (Random Forest) |
| Pandas / NumPy | Latest | Data preprocessing |
| Joblib | Latest | Model serialization |
| Uvicorn | Latest | ASGI production server |
| PyJWT | Latest | JWT token validation |

### Database & Auth

| Technology | Purpose |
|------------|---------|
| Supabase | Managed PostgreSQL + Auth |
| Supabase Auth | JWT-based role authentication |
| Row Level Security | Per-row data access policies |

---

## 3. System Architecture

### Deployment Separation (Security-Critical)

```
Patient App          Hospital Dashboard      Admin Panel
app.healthai.local   hospital.healthai.local  admin.healthai.local
     :3000                  :3001                   :3002
       │                      │                       │
       │                      │                       │
       └──────────────────────┴───────────────────────┘
                              │
                    FastAPI Backend :8000
                              │
                    Supabase PostgreSQL
```

> **CRITICAL:** The admin panel is never embedded in patient or hospital frontends. It runs as a completely separate Next.js application on a separate port.

### Request Flow

```
[Browser] → [Next.js Frontend] → [FastAPI /api/*] → [Supabase DB]
                                        │
                                  [ML Model .pkl]
                                        │
                                 [Prediction Result]
                                        │
                               [Stored in Supabase]
```

---

## 4. User Roles & Permissions

### Role Matrix

| Feature | Patient | Organization | Admin |
|---------|---------|--------------|-------|
| Register / Login | ✅ | ✅ | ✅ |
| Create patient profile | ✅ | ❌ | ❌ |
| Enter symptoms | ✅ | ❌ | ❌ |
| View own AI predictions | ✅ | ❌ | ❌ |
| View medical history | ✅ | ✅ | ✅ |
| View all patients | ❌ | ✅ | ✅ |
| Add doctor notes | ❌ | ✅ | ❌ |
| View org analytics | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Manage hospitals | ❌ | ❌ | ✅ |
| View system logs | ❌ | ❌ | ✅ |
| Access admin panel URL | ❌ | ❌ | ✅ |

### Role Definitions

**Patient**
- Register with email/password
- Complete medical profile (age, gender, blood type)
- Select symptoms from interactive UI or voice input
- View AI-predicted conditions with risk levels
- Access personal medical history

**Organization (Hospital Staff)**
- Login to hospital dashboard only
- View all patients under their organization
- Access patient prediction history
- Add clinical notes and doctor observations
- Monitor department-level analytics

**Admin**
- System-wide user management
- Create / disable hospital organizations
- View platform-wide analytics
- Access system audit logs
- Manage role assignments

---

## 5. Security Requirements

### CRITICAL: Admin Panel Isolation

The admin interface MUST be completely separated from patient and hospital frontends.

```javascript
// middleware.ts — Patient App
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Block any admin routes from patient app entirely
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/404", request.url));
  }
}
```

### Role Enforcement at Every Layer

```
1. Supabase RLS   — Database row-level policies
2. FastAPI        — JWT role validation middleware
3. Next.js        — Route guard middleware
4. UI             — Conditional rendering (defense-in-depth)
```

### Admin Route Protection (Next.js)

```typescript
// apps/admin/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Fetch user role from metadata
  const role = session.user.user_metadata?.role;

  if (role !== "admin") {
    // Non-admins cannot reach this app at all
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!login|_next/static|_next/image|favicon.ico).*)"],
};
```

---

## 6. Database Design

### Entity Relationship Diagram

```
users (Supabase Auth)
  │
  ├──< patients (1:1 with user)
  │       │
  │       ├──< patient_records
  │       │       │
  │       │       └──< ai_predictions
  │       │
  │       └──< doctor_notes
  │
  └──< organization_members
          │
          └──> organizations
```

### Table: users

> Managed by Supabase Auth. Extended via `profiles` table.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID (PK) | Supabase Auth user ID |
| email | TEXT | Unique email |
| role | TEXT | 'patient' / 'organization' / 'admin' |
| created_at | TIMESTAMPTZ | Account creation time |

### Table: profiles

```sql
CREATE TABLE public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role         TEXT NOT NULL CHECK (role IN ('patient', 'organization', 'admin')),
  full_name    TEXT,
  phone        TEXT,
  org_id       UUID REFERENCES organizations(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: organizations

```sql
CREATE TABLE public.organizations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  address      TEXT,
  city         TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_active    BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: patients

```sql
CREATE TABLE public.patients (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id       UUID REFERENCES organizations(id),
  full_name    TEXT NOT NULL,
  date_of_birth DATE,
  gender       TEXT CHECK (gender IN ('male', 'female', 'other')),
  blood_type   TEXT,
  allergies    TEXT[],
  medical_history TEXT,
  emergency_contact TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: patient_records

```sql
CREATE TABLE public.patient_records (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id   UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  org_id       UUID REFERENCES organizations(id),
  symptoms     TEXT[] NOT NULL,
  created_by   UUID REFERENCES auth.users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: ai_predictions

```sql
CREATE TABLE public.ai_predictions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id        UUID NOT NULL REFERENCES patient_records(id) ON DELETE CASCADE,
  patient_id       UUID NOT NULL REFERENCES patients(id),
  predictions      JSONB NOT NULL,
  risk_level       TEXT CHECK (risk_level IN ('low', 'medium', 'high')),
  top_disease      TEXT,
  top_probability  FLOAT,
  recommendation   TEXT,
  symptoms_input   TEXT[],
  model_version    TEXT DEFAULT '1.0',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);
```

**predictions JSONB format:**
```json
[
  { "disease": "Influenza", "probability": 0.62 },
  { "disease": "Common Cold", "probability": 0.25 }
]
```

### Table: doctor_notes

```sql
CREATE TABLE public.doctor_notes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id   UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  record_id    UUID REFERENCES patient_records(id),
  author_id    UUID NOT NULL REFERENCES auth.users(id),
  org_id       UUID REFERENCES organizations(id),
  note_text    TEXT NOT NULL,
  is_private   BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE patients         ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctor_notes     ENABLE ROW LEVEL SECURITY;

-- Patients can only see their own data
CREATE POLICY "patient_select_own"
  ON patients FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "patient_update_own"
  ON patients FOR UPDATE
  USING (user_id = auth.uid());

-- Organization staff can see patients in their org
CREATE POLICY "org_select_patients"
  ON patients FOR SELECT
  USING (
    org_id IN (
      SELECT org_id FROM profiles
      WHERE id = auth.uid() AND role = 'organization'
    )
  );

-- Admins can select all
CREATE POLICY "admin_select_all_patients"
  ON patients FOR ALL
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Predictions: patients see own, org sees their patients
CREATE POLICY "patient_select_own_predictions"
  ON ai_predictions FOR SELECT
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "org_select_predictions"
  ON ai_predictions FOR SELECT
  USING (
    patient_id IN (
      SELECT id FROM patients
      WHERE org_id IN (
        SELECT org_id FROM profiles
        WHERE id = auth.uid() AND role = 'organization'
      )
    )
  );
```

---

## 7. Supabase Setup & Integration

### Project Setup

1. Go to [https://supabase.com](https://supabase.com) → New Project
2. Choose region closest to hospital (or self-host for air-gapped networks)
3. Copy: `Project URL` and `anon key` from Settings → API

### Environment Variables

```env
# .env.local (Patient App)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# .env.local (Backend)
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...   # Service role key (never expose to frontend!)
```

### Supabase Client (Next.js)

```typescript
// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### Authentication Flow

```typescript
// Register
const { data, error } = await supabase.auth.signUp({
  email: "patient@example.com",
  password: "SecurePass123",
  options: {
    data: { role: "patient", full_name: "John Doe" }
  }
});

// After signup, insert into profiles table
await supabase.from("profiles").insert({
  id: data.user!.id,
  role: "patient",
  full_name: "John Doe"
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: "patient@example.com",
  password: "SecurePass123"
});

// Get current session
const { data: { session } } = await supabase.auth.getSession();
const role = session?.user.user_metadata?.role;

// Logout
await supabase.auth.signOut();
```

### Table Query Examples

```typescript
// Fetch patient profile
const { data: patient } = await supabase
  .from("patients")
  .select("*")
  .eq("user_id", session.user.id)
  .single();

// Fetch prediction history
const { data: predictions } = await supabase
  .from("ai_predictions")
  .select(`
    *,
    patient_records (symptoms, created_at)
  `)
  .eq("patient_id", patient.id)
  .order("created_at", { ascending: false })
  .limit(20);

// Organization: fetch all patients
const { data: patients } = await supabase
  .from("patients")
  .select("id, full_name, date_of_birth, gender, created_at")
  .eq("org_id", orgId);
```

---

## 8. AI Prediction System

### Workflow

```
Patient selects symptoms (UI)
         ↓
POST /predict  →  FastAPI endpoint
         ↓
Input encoded to symptom vector [0,1,0,1,...]
         ↓
Random Forest model processes vector
         ↓
Top 5 predictions returned with probabilities
         ↓
Risk level calculated (Low / Medium / High)
         ↓
Prediction stored in ai_predictions table
         ↓
Results displayed on patient dashboard
```

### Training the ML Model

```python
# ml/train_model.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib, json, os

DATA_PATH  = "data/disease_symptom_dataset.csv"
MODELS_DIR = "../backend/models"
os.makedirs(MODELS_DIR, exist_ok=True)

# Load dataset (Kaggle Disease Symptom Dataset)
df_raw = pd.read_csv(DATA_PATH)
symptom_cols = [c for c in df_raw.columns if c.lower().startswith("symptom")]

# Build symptom vocabulary
all_syms = sorted(set(
    v.strip().lower()
    for col in symptom_cols
    for v in df_raw[col].dropna()
))

# Encode rows as binary vectors
def encode_row(row):
    patient_syms = {
        str(row[c]).strip().lower()
        for c in symptom_cols if pd.notna(row[c])
    }
    return [1 if s in patient_syms else 0 for s in all_syms]

X = np.array([encode_row(row) for _, row in df_raw.iterrows()])
le = LabelEncoder()
y = le.fit_transform(df_raw["Disease"].values)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced"
)
model.fit(X_train, y_train)

accuracy = accuracy_score(y_test, model.predict(X_test))
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save artifacts
joblib.dump(model,    f"{MODELS_DIR}/disease_model.pkl")
joblib.dump(le,       f"{MODELS_DIR}/label_encoder.pkl")
joblib.dump(all_syms, f"{MODELS_DIR}/symptoms_list.pkl")
print("Model artifacts saved.")
```

### FastAPI Predict Endpoint

```python
# backend/routers/predict.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List
import numpy as np
import joblib

router = APIRouter(prefix="/predict", tags=["AI Prediction"])

model       = joblib.load("models/disease_model.pkl")
le          = joblib.load("models/label_encoder.pkl")
symptom_list = joblib.load("models/symptoms_list.pkl")

class SymptomRequest(BaseModel):
    symptoms: List[str]
    patient_id: str | None = None

def get_risk_level(top_prob: float) -> str:
    if top_prob >= 0.75: return "high"
    if top_prob >= 0.45: return "medium"
    return "low"

@router.post("/")
async def predict_disease(request: SymptomRequest):
    if not request.symptoms:
        raise HTTPException(status_code=400, detail="No symptoms provided")

    norm_syms = [s.strip().lower() for s in request.symptoms]

    vector = np.array([
        1 if s in norm_syms else 0
        for s in symptom_list
    ]).reshape(1, -1)

    probs = model.predict_proba(vector)[0]
    top_idx = np.argsort(probs)[::-1][:5]

    predictions = [
        {
            "disease": le.inverse_transform([i])[0],
            "probability": round(float(probs[i]), 4)
        }
        for i in top_idx if probs[i] > 0.01
    ]

    risk = get_risk_level(predictions[0]["probability"] if predictions else 0)

    return {
        "predictions": predictions,
        "risk_level": risk,
        "recommendation": {
            "high":   "Seek immediate medical attention.",
            "medium": "Monitor symptoms. Consult a doctor soon.",
            "low":    "Rest and stay hydrated. Monitor for changes."
        }[risk],
        "symptoms_analyzed": request.symptoms,
        "top_disease": predictions[0]["disease"] if predictions else None,
        "top_probability": predictions[0]["probability"] if predictions else 0
    }
```

### Sample API Request & Response

**Request:**
```json
POST /predict
{
  "symptoms": ["fever", "cough", "fatigue", "headache"],
  "patient_id": "uuid-here"
}
```

**Response:**
```json
{
  "predictions": [
    { "disease": "Influenza",       "probability": 0.6200 },
    { "disease": "Common Cold",     "probability": 0.2500 },
    { "disease": "Viral Infection", "probability": 0.1300 }
  ],
  "risk_level": "medium",
  "recommendation": "Monitor symptoms. Consult a doctor soon.",
  "symptoms_analyzed": ["fever", "cough", "fatigue", "headache"],
  "top_disease": "Influenza",
  "top_probability": 0.62
}
```

---

## 9. Project Folder Structure

```
healthai/
│
├── apps/
│   ├── patient/                    # Patient Next.js app (:3000)
│   │   ├── app/
│   │   │   ├── page.tsx            # Landing / login page
│   │   │   ├── register/page.tsx   # Patient registration
│   │   │   ├── dashboard/page.tsx  # Patient home
│   │   │   ├── checker/page.tsx    # Symptom checker (AI)
│   │   │   ├── results/page.tsx    # Prediction results
│   │   │   ├── history/page.tsx    # Medical history
│   │   │   └── profile/page.tsx    # Patient profile
│   │   ├── components/
│   │   │   ├── SymptomCard.tsx
│   │   │   ├── PredictionResult.tsx
│   │   │   ├── RiskIndicator.tsx
│   │   │   ├── FaceScan.tsx
│   │   │   ├── VoiceAssistant.tsx
│   │   │   ├── EmergencyAlert.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── hooks/
│   │   │   ├── usePredict.ts
│   │   │   ├── useAuth.ts
│   │   │   └── useVoiceAssistant.ts
│   │   ├── lib/
│   │   │   ├── supabase.ts
│   │   │   └── api.ts
│   │   ├── middleware.ts            # Route protection
│   │   └── .env.local
│   │
│   ├── hospital/                   # Hospital Dashboard (:3001)
│   │   ├── app/
│   │   │   ├── page.tsx            # Org login
│   │   │   ├── dashboard/page.tsx  # Hospital home
│   │   │   ├── patients/page.tsx   # Patient list
│   │   │   ├── patients/[id]/page.tsx  # Patient detail
│   │   │   ├── analytics/page.tsx  # Charts & metrics
│   │   │   └── notes/page.tsx      # Doctor notes
│   │   ├── components/
│   │   │   ├── PatientTable.tsx
│   │   │   ├── PredictionHistory.tsx
│   │   │   ├── DoctorNoteForm.tsx
│   │   │   ├── AnalyticsChart.tsx
│   │   │   └── RiskBadge.tsx
│   │   ├── middleware.ts            # Blocks non-org users
│   │   └── .env.local
│   │
│   └── admin/                      # Admin Panel (:3002)
│       ├── app/
│       │   ├── login/page.tsx      # Admin-only login
│       │   ├── dashboard/page.tsx  # System overview
│       │   ├── users/page.tsx      # User management
│       │   ├── hospitals/page.tsx  # Org management
│       │   ├── logs/page.tsx       # System audit logs
│       │   └── analytics/page.tsx  # Platform analytics
│       ├── components/
│       │   ├── UserTable.tsx
│       │   ├── HospitalCard.tsx
│       │   ├── SystemMetrics.tsx
│       │   └── AuditLog.tsx
│       ├── middleware.ts            # Admin-only guard (strict)
│       └── .env.local
│
├── backend/                        # FastAPI server
│   ├── main.py                     # App entry point
│   ├── routers/
│   │   ├── auth.py                 # Auth endpoints
│   │   ├── predict.py              # AI prediction
│   │   ├── patients.py             # Patient CRUD
│   │   ├── organizations.py        # Org management
│   │   └── admin.py                # Admin endpoints
│   ├── models/
│   │   ├── disease_model.pkl       # Trained RF model
│   │   ├── label_encoder.pkl
│   │   └── symptoms_list.pkl
│   ├── schemas/
│   │   ├── patient.py              # Pydantic models
│   │   ├── prediction.py
│   │   └── user.py
│   ├── services/
│   │   ├── prediction_service.py   # ML inference logic
│   │   ├── supabase_service.py     # DB operations
│   │   └── auth_service.py         # JWT validation
│   ├── auth/
│   │   ├── dependencies.py         # FastAPI Depends()
│   │   └── jwt_handler.py
│   ├── database/
│   │   └── client.py               # Supabase client init
│   ├── requirements.txt
│   └── .env
│
└── ml/                             # Machine Learning Pipeline
    ├── train_model.py
    ├── evaluate_model.py
    ├── generate_synthetic_data.py
    └── data/
        └── disease_symptom_dataset.csv
```

---

## 10. Role-Based Routing

### Frontend Route Guards

```typescript
// middleware.ts (Patient App)
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  const publicPaths = ["/", "/login", "/register"];
  const isPublic = publicPaths.includes(req.nextUrl.pathname);

  if (!session && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session) {
    const role = session.user.user_metadata?.role;

    // Role-to-app routing
    if (role === "patient" && req.nextUrl.pathname.startsWith("/org")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (role === "organization" && req.nextUrl.pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/org/dashboard", req.url));
    }
    if (role === "admin") {
      // Admin should use admin app at :3002
      return NextResponse.redirect(new URL("http://localhost:3002/dashboard", req.url));
    }
  }

  return res;
}
```

### Post-Login Redirect Logic

```typescript
// hooks/useAuth.ts
export function useAuthRedirect(role: string, router: NextRouter) {
  useEffect(() => {
    switch (role) {
      case "patient":
        router.push("/dashboard");
        break;
      case "organization":
        router.push("/org/dashboard");
        break;
      case "admin":
        // Redirect to separate admin app
        window.location.href = "http://admin.healthai.local:3002/dashboard";
        break;
      default:
        router.push("/login");
    }
  }, [role]);
}
```

### Backend Role Middleware (FastAPI)

```python
# auth/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    try:
        payload = jwt.decode(
            token,
            options={"verify_signature": False}  # Supabase validates via RLS
        )
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

def require_role(*roles: str):
    async def role_checker(user = Depends(get_current_user)):
        user_role = user.get("user_metadata", {}).get("role", "")
        if user_role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires role: {', '.join(roles)}"
            )
        return user
    return role_checker

# Usage in routes:
@router.get("/admin/users")
async def list_users(user = Depends(require_role("admin"))):
    ...

@router.get("/org/patients")
async def list_patients(user = Depends(require_role("organization", "admin"))):
    ...
```

---

## 11. Backend API

### FastAPI Main Entry Point

```python
# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict, patients, organizations, admin, auth

app = FastAPI(
    title="HealthAI API",
    description="Medical AI platform for hospitals",
    version="1.0.0",
    docs_url="/docs",        # Disable in production: docs_url=None
    redoc_url=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # Patient app
        "http://localhost:3001",   # Hospital app
        "http://localhost:3002",   # Admin app
        "http://192.168.1.50:3000", # LAN access
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(predict.router)
app.include_router(patients.router)
app.include_router(organizations.router)
app.include_router(admin.router)

@app.get("/health")
async def health_check():
    return {"status": "ok", "model": "loaded", "version": "1.0.0"}
```

### Complete API Routes

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Create patient account |
| POST | `/auth/login` | Public | Get JWT token |
| POST | `/predict` | Patient | Run AI prediction |
| GET | `/predict/history/{patient_id}` | Patient/Org | Prediction history |
| GET | `/patients/profile` | Patient | Own profile |
| PUT | `/patients/profile` | Patient | Update profile |
| GET | `/org/patients` | Organization | List org patients |
| GET | `/org/patients/{id}` | Organization | Patient detail |
| POST | `/org/notes` | Organization | Add doctor note |
| GET | `/org/analytics` | Organization | Dashboard metrics |
| GET | `/admin/users` | Admin | All users |
| PUT | `/admin/users/{id}/role` | Admin | Change user role |
| GET | `/admin/organizations` | Admin | All organizations |
| POST | `/admin/organizations` | Admin | Create organization |
| GET | `/admin/logs` | Admin | System audit logs |
| GET | `/admin/analytics` | Admin | Platform metrics |

---

## 12. Frontend (Next.js)

### Supabase Auth Provider

```typescript
// providers/AuthProvider.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const role = user?.user_metadata?.role ?? null;

  return (
    <AuthContext.Provider
      value={{ user, role, loading, signOut: () => supabase.auth.signOut() }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

### Prediction Hook

```typescript
// hooks/usePredict.ts
import { useState } from "react";

export interface Prediction {
  disease: string;
  probability: number;
}

export interface PredictResult {
  predictions: Prediction[];
  risk_level: "low" | "medium" | "high";
  recommendation: string;
  top_disease: string;
  top_probability: number;
}

export function usePredict() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const predict = async (symptoms: string[], patientId?: string) => {
    if (!symptoms.length) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms, patient_id: patientId }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setResult(null); setError(null); };

  return { predict, loading, result, error, reset };
}
```

---

## 13. Dashboard Components

### Patient Dashboard

**Key Components:**
- `SymptomChecker` — multi-select symptom cards with search + voice input
- `PredictionResult` — disease list with probability bars
- `RiskLevelBadge` — color-coded risk display (green/amber/red)
- `EmergencyAlert` — animated banner for high-risk symptom combos
- `PredictionHistory` — past assessments with timestamps
- `FaceScan` — webcam-based symptom detection (TensorFlow.js)

### Hospital Dashboard

**Key Components:**
- `PatientTable` — sortable, searchable patient list
- `PatientDetailModal` — full patient record overlay
- `DoctorNoteEditor` — rich-text doctor note creation
- `RiskDistributionChart` — pie chart of patient risk levels
- `RecentPredictions` — feed of latest AI assessments
- `Analytics Cards` — total patients, high-risk count, predictions today

### Admin Dashboard

**Key Components:**
- `SystemMetrics` — total users, orgs, predictions (live stats)
- `UserManagementTable` — CRUD with role assignment
- `OrganizationManager` — enable/disable hospitals
- `AuditLogViewer` — time-stamped system event log
- `PlatformAnalytics` — weekly/monthly prediction trends

### Risk Level Color System

```typescript
export const riskConfig = {
  low:    { color: "#10b981", bg: "#d1fae5", label: "Low Risk",    icon: "✅" },
  medium: { color: "#f59e0b", bg: "#fef3c7", label: "Medium Risk", icon: "⚠️" },
  high:   { color: "#ef4444", bg: "#fee2e2", label: "High Risk",   icon: "🚨" },
};
```

---

## 14. Local Network Deployment

### Development (localhost)

```bash
# Terminal 1 — Patient Frontend
cd apps/patient
npm run dev
# → http://localhost:3000

# Terminal 2 — Hospital Frontend
cd apps/hospital
npm run dev -- --port 3001
# → http://localhost:3001

# Terminal 3 — Admin Frontend
cd apps/admin
npm run dev -- --port 3002
# → http://localhost:3002

# Terminal 4 — FastAPI Backend
cd backend
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

### Hospital LAN Deployment

```bash
# Backend — bind to all network interfaces
uvicorn main:app --host 0.0.0.0 --port 8000

# Next.js — bind to all network interfaces
next dev -H 0.0.0.0 -p 3000
next dev -H 0.0.0.0 -p 3001
next dev -H 0.0.0.0 -p 3002

# Production Next.js builds
npm run build
next start -H 0.0.0.0 -p 3000
```

### .env.local for LAN

```env
# Replace 192.168.1.50 with your server's LAN IP
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_API_URL=http://192.168.1.50:8000
```

### CORS Configuration for LAN

```python
# backend/main.py — update CORS for LAN IPs
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://192.168.1.50:3000",
        "http://192.168.1.50:3001",
        "http://192.168.1.50:3002",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Network Access Guide

```
Server IP: 192.168.1.50

From any device on the hospital WiFi/LAN:

Patients:       http://192.168.1.50:3000
Hospital staff: http://192.168.1.50:3001
Admin only:     http://192.168.1.50:3002
API:            http://192.168.1.50:8000/docs
```

> **Tip:** Use Windows Defender / UFW firewall to restrict port 3002 to admin workstations only (by IP allowlist).

---

## 15. Security Measures

### JWT Authentication

Supabase Auth issues JWTs on login. Backend validates the token on every request using the Supabase service role key or public JWT secret.

```python
# Validate Supabase JWT in FastAPI
import jwt

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")  # From Supabase project settings

def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(
            token,
            SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### Password Security

Supabase Auth handles password hashing (bcrypt). Never store raw passwords. Minimum password policy:

```sql
-- Supabase Dashboard → Auth → Policies
-- Enable: Minimum password length = 8
-- Enable: At least one uppercase, one number
```

### API Rate Limiting

```python
# backend/middleware/rate_limit.py
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/predict")
@limiter.limit("10/minute")
async def predict_disease(request: SymptomRequest):
    ...
```

### Input Validation

```python
# Pydantic enforces strict input validation
class SymptomRequest(BaseModel):
    symptoms: List[str] = Field(..., min_items=1, max_items=50)
    patient_id: str | None = Field(None, regex=r"^[0-9a-f-]{36}$")  # UUID format

    @validator("symptoms", each_item=True)
    def sanitize_symptom(cls, v):
        return v.strip().lower()[:100]  # Truncate to prevent injection
```

### Admin Panel Network Restriction (Optional)

To restrict admin port to specific IP addresses only, add this to your server firewall:

```bash
# UFW (Ubuntu/Debian)
ufw allow from 192.168.1.100 to any port 3002  # Admin workstation only
ufw deny 3002  # Block all other IPs
```

---

## 16. Implementation Roadmap

### Phase 1 — Foundation (Week 1–2)

- [ ] Supabase project creation and database schema migration
- [ ] Row Level Security policies on all tables
- [ ] FastAPI backend with health check and CORS
- [ ] Next.js patient app with Supabase Auth (login/register)
- [ ] Basic route protection middleware
- [ ] ML model training pipeline

### Phase 2 — Core Features (Week 3–4)

- [ ] Symptom checker UI (cards + search + voice)
- [ ] AI prediction endpoint integration
- [ ] Prediction results dashboard (charts + risk levels)
- [ ] Emergency alert system
- [ ] Patient profile creation and management
- [ ] Prediction history storage in Supabase

### Phase 3 — Hospital Dashboard (Week 5–6)

- [ ] Organization login and route separation
- [ ] Patient list and search
- [ ] Patient detail view with prediction history
- [ ] Doctor notes feature
- [ ] Analytics and risk distribution charts

### Phase 4 — Admin Panel (Week 7)

- [ ] Separate admin Next.js app
- [ ] User management (list, role change, disable)
- [ ] Organization management (create, enable/disable)
- [ ] System audit log viewer
- [ ] Platform-wide analytics

### Phase 5 — Advanced Features (Week 8–9)

- [ ] Camera-based facial symptom detection (TensorFlow.js)
- [ ] Multilingual voice assistant (EN/TA/HI)
- [ ] Dark mode / light mode toggle
- [ ] Mobile-responsive design improvements
- [ ] Offline-ready symptom checker (PWA)

### Phase 6 — Hardening & Deployment (Week 10)

- [ ] Security audit and penetration testing
- [ ] Rate limiting on all API endpoints
- [ ] Production Next.js builds
- [ ] LAN deployment testing on hospital hardware
- [ ] Staff training documentation

---

## 17. Deployment Checklist

### Backend

- [ ] `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in `.env`
- [ ] `SUPABASE_JWT_SECRET` configured
- [ ] CORS updated with actual LAN IP addresses
- [ ] `/docs` endpoint disabled in production
- [ ] Rate limiting enabled
- [ ] ML models present in `backend/models/`
- [ ] `uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4`

### Frontend

- [ ] `NEXT_PUBLIC_API_URL` set to `http://<LAN_IP>:8000`
- [ ] Supabase keys in `.env.local`
- [ ] `npm run build` passes without errors
- [ ] Admin app on separate port with strict middleware
- [ ] No admin routes accessible from patient or hospital apps

### Database

- [ ] All tables created and migrated
- [ ] RLS enabled on all sensitive tables
- [ ] At least one admin user created manually via Supabase Auth
- [ ] Backup schedule configured

### Network

- [ ] Server firewall blocks external internet on admin port
- [ ] LAN IP is static (not DHCP)
- [ ] All frontend apps tested from remote device on LAN

---

## 18. Future Scalability

### Short-Term (3–6 months)

- **Doctor appointment booking** — calendar integration for follow-ups
- **Medical report PDF export** — generate downloadable prediction summaries
- **Push notifications** — alert patients for high-risk predictions
- **Two-factor authentication** — TOTP for admin accounts

### Medium-Term (6–12 months)

- **Better ML model** — upgrade from Random Forest to a fine-tuned transformer (MedBERT)
- **Telemetry dashboard** — track model accuracy over real-world predictions
- **Multi-language UI** — Tamil and Hindi patient interface
- **Hospital API integration** — connect to existing Hospital Information Systems (HIS)

### Long-Term (12+ months)

- **Cloud migration path** — Docker Compose → Kubernetes for multi-hospital scaling
- **Federated learning** — improve model without sharing patient data across hospitals
- **HIPAA / DISHA compliance** — full audit trail and data residency controls
- **Mobile app** — React Native patient app with offline prediction cache

### Infrastructure Scaling

```
Current:      Single server, LAN only
Phase 2:      Docker Compose with nginx reverse proxy
Phase 3:      Multi-hospital with VPN interconnect
Phase 4:      Cloud (AWS/GCP) with data residency in India
```

---

*Generated by HealthAI Architecture Team | March 2026*  
*Platform: Next.js + FastAPI + Supabase + Random Forest ML*  
*Designed for Antigravity Hackathon & Hospital-Grade Deployment*
