"""
Generate a synthetic disease-symptom dataset for HealthAI ML training.
Creates data/disease_symptom_dataset.csv with realistic symptom combinations.
"""
import pandas as pd
import numpy as np
import os, random

random.seed(42)
np.random.seed(42)

DISEASE_SYMPTOMS = {
    "Influenza": ["fever", "cough", "fatigue", "body aches", "headache", "chills", "sore throat", "runny nose"],
    "Common Cold": ["runny nose", "sore throat", "cough", "sneezing", "congestion", "mild fever", "fatigue"],
    "COVID-19": ["fever", "cough", "fatigue", "shortness of breath", "loss of taste", "loss of smell", "headache", "body aches"],
    "Pneumonia": ["fever", "cough", "shortness of breath", "chest pain", "fatigue", "chills", "rapid breathing"],
    "Dengue Fever": ["high fever", "severe headache", "joint pain", "muscle pain", "rash", "fatigue", "nausea", "vomiting"],
    "Malaria": ["fever", "chills", "sweating", "headache", "nausea", "vomiting", "muscle pain", "fatigue"],
    "Typhoid": ["high fever", "weakness", "stomach pain", "headache", "diarrhea", "constipation", "rash", "loss of appetite"],
    "Diabetes": ["frequent urination", "excessive thirst", "fatigue", "blurred vision", "slow healing wounds", "weight loss", "numbness in feet"],
    "Hypertension": ["headache", "dizziness", "chest pain", "blurred vision", "nosebleed", "fatigue", "shortness of breath"],
    "Asthma": ["shortness of breath", "wheezing", "chest tightness", "coughing", "fatigue"],
    "Gastroenteritis": ["nausea", "vomiting", "diarrhea", "stomach cramps", "fever", "fatigue", "loss of appetite"],
    "Urinary Tract Infection": ["burning urination", "frequent urination", "cloudy urine", "pelvic pain", "fever", "chills"],
    "Migraine": ["severe headache", "nausea", "vomiting", "sensitivity to light", "sensitivity to sound", "blurred vision", "fatigue"],
    "Anemia": ["fatigue", "weakness", "pale skin", "shortness of breath", "dizziness", "cold hands", "chest pain"],
    "Appendicitis": ["severe abdominal pain", "nausea", "vomiting", "fever", "loss of appetite", "bloating"],
    "Chicken Pox": ["rash", "itchiness", "blisters", "fever", "fatigue", "headache", "loss of appetite"],
    "Measles": ["fever", "rash", "cough", "runny nose", "red eyes", "sensitivity to light", "fatigue"],
    "Hepatitis B": ["fatigue", "nausea", "vomiting", "jaundice", "abdominal pain", "dark urine", "joint pain"],
    "Tuberculosis": ["persistent cough", "coughing up blood", "chest pain", "fatigue", "fever", "night sweats", "weight loss"],
    "Arthritis": ["joint pain", "stiffness", "swelling", "reduced range of motion", "fatigue", "warmth in joints"],
}

all_symptoms = sorted(set(s for syms in DISEASE_SYMPTOMS.values() for s in syms))
MAX_SYMPTOMS = 7

def generate_record(disease, symptoms, n_symptoms=None):
    if n_symptoms is None:
        n_symptoms = random.randint(3, min(len(symptoms), MAX_SYMPTOMS))
    chosen = random.sample(symptoms, min(n_symptoms, len(symptoms)))
    record = {"Disease": disease}
    for i, sym in enumerate(chosen, 1):
        record[f"Symptom_{i}"] = sym
    for i in range(len(chosen) + 1, MAX_SYMPTOMS + 1):
        record[f"Symptom_{i}"] = None
    return record

records = []
for disease, symptoms in DISEASE_SYMPTOMS.items():
    for _ in range(200):
        records.append(generate_record(disease, symptoms))

random.shuffle(records)
df = pd.DataFrame(records)

os.makedirs("data", exist_ok=True)
df.to_csv("data/disease_symptom_dataset.csv", index=False)
print(f"Generated {len(df)} records for {len(DISEASE_SYMPTOMS)} diseases.")
print(f"Symptom columns: {[c for c in df.columns if c.startswith('Symptom')]}")
print(f"Sample:\n{df.head(3).to_string()}")
