"""
Train the Random Forest disease prediction model for HealthAI.
Reads data/disease_symptom_dataset.csv and saves model artifacts to ../backend/models/
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib, json, os

DATA_PATH  = "data/disease_symptom_dataset.csv"
MODELS_DIR = os.path.join("..", "backend", "models")
os.makedirs(MODELS_DIR, exist_ok=True)

print("Loading dataset...")
df_raw = pd.read_csv(DATA_PATH)
symptom_cols = [c for c in df_raw.columns if c.lower().startswith("symptom")]

# Build symptom vocabulary
all_syms = sorted(set(
    v.strip().lower()
    for col in symptom_cols
    for v in df_raw[col].dropna()
    if str(v).strip()
))

print(f"Total unique symptoms: {len(all_syms)}")
print(f"Symptoms: {all_syms}")

# Encode rows as binary vectors
def encode_row(row):
    patient_syms = {
        str(row[c]).strip().lower()
        for c in symptom_cols if pd.notna(row[c]) and str(row[c]).strip()
    }
    return [1 if s in patient_syms else 0 for s in all_syms]

print("Encoding feature vectors...")
X = np.array([encode_row(row) for _, row in df_raw.iterrows()])
le = LabelEncoder()
y = le.fit_transform(df_raw["Disease"].values)

print(f"X shape: {X.shape}, Classes: {list(le.classes_)}")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print("Training Random Forest model...")
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced"
)
model.fit(X_train, y_train)

accuracy = accuracy_score(y_test, model.predict(X_test))
print(f"\nModel Accuracy: {accuracy * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, model.predict(X_test), target_names=le.classes_))

# Save artifacts
joblib.dump(model,    os.path.join(MODELS_DIR, "disease_model.pkl"))
joblib.dump(le,       os.path.join(MODELS_DIR, "label_encoder.pkl"))
joblib.dump(all_syms, os.path.join(MODELS_DIR, "symptoms_list.pkl"))

# Save symptoms list as JSON for frontend use
with open(os.path.join(MODELS_DIR, "symptoms_list.json"), "w") as f:
    json.dump(all_syms, f, indent=2)

print(f"\nModel artifacts saved to: {MODELS_DIR}")
print("Files: disease_model.pkl, label_encoder.pkl, symptoms_list.pkl, symptoms_list.json")
