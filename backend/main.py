"""
FastAPI backend for NeuroMind AI mental health assessment.
"""

import pickle
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Create FastAPI app
app = FastAPI(
    title="NeuroMind AI Backend",
    description="Mental health assessment API with FAIR ethics",
    version="0.1.0",
)

# Add CORS middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set to specific domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and vectorizer
MODEL_DIR = Path(__file__).parent / "models"
MODEL_FILE = MODEL_DIR / "model.pkl"
VECTORIZER_FILE = MODEL_DIR / "vectorizer.pkl"

try:
    with open(MODEL_FILE, "rb") as f:
        model = pickle.load(f)
    with open(VECTORIZER_FILE, "rb") as f:
        vectorizer = pickle.load(f)
    print("[v0] Model and vectorizer loaded successfully")
except FileNotFoundError:
    print("[v0] ERROR: Model files not found. Run train_model.py first.")
    model = None
    vectorizer = None


class AssessmentRequest(BaseModel):
    """Request model for mental health assessment."""
    text: str


class AssessmentResponse(BaseModel):
    """Response model for assessment results."""
    prediction: Literal["low", "moderate", "high"]
    confidence: float
    class_probabilities: dict[str, float]
    risk_score: float


def calculate_risk_score(probabilities: dict[str, float]) -> float:
    """
    Calculate a normalized risk score from class probabilities.
    Range: 0 (low risk) to 1 (high risk)
    """
    risk_mapping = {"low": 0.0, "moderate": 0.5, "high": 1.0}
    risk_score = sum(
        probabilities.get(risk_class, 0.0) * risk_mapping[risk_class]
        for risk_class in ["low", "moderate", "high"]
    )
    return risk_score


@app.get("/")
async def root():
    """Health check endpoint."""
    if model is None or vectorizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {
        "status": "ok",
        "message": "NeuroMind AI backend is running",
        "version": "0.1.0",
    }


@app.post("/predict", response_model=AssessmentResponse)
async def predict_mental_health(request: AssessmentRequest):
    """
    Predict mental health risk level based on provided text.
    This is the primary endpoint for assessment predictions.
    
    Parameters:
    - text: User input text describing their mental state (min 20 characters)
    
    Returns:
    - prediction: Risk level (low, moderate, high)
    - confidence: Model confidence in the prediction (0-1)
    - class_probabilities: Probability for each risk class
    - risk_score: Normalized risk score (0-1)
    """
    if model is None or vectorizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Validate input
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(text) < 20:
        raise HTTPException(status_code=400, detail="Text must be at least 20 characters")
    
    if len(text) > 5000:
        raise HTTPException(status_code=400, detail="Text cannot exceed 5000 characters")
    
    try:
        # Vectorize text
        text_vec = vectorizer.transform([text])
        
        # Make prediction
        prediction = model.predict(text_vec)[0]
        confidence = float(model.predict_proba(text_vec).max())
        
        # Get probability distribution
        probabilities = model.predict_proba(text_vec)[0]
        class_probabilities = {
            class_name: float(prob)
            for class_name, prob in zip(model.classes_, probabilities)
        }
        
        # Calculate risk score
        risk_score = calculate_risk_score(class_probabilities)
        
        return AssessmentResponse(
            prediction=prediction,
            confidence=confidence,
            class_probabilities=class_probabilities,
            risk_score=risk_score,
        )
    except Exception as e:
        print(f"[v0] Error during assessment: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during assessment")


@app.post("/assess", response_model=AssessmentResponse)
async def assess_mental_health(request: AssessmentRequest):
    """
    Assess mental health based on provided text.
    
    Parameters:
    - text: User input text describing their mental state (min 20 characters)
    
    Returns:
    - prediction: Risk level (low, moderate, high)
    - confidence: Model confidence in the prediction (0-1)
    - class_probabilities: Probability for each risk class
    - risk_score: Normalized risk score (0-1)
    """
    if model is None or vectorizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Validate input
    text = request.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    if len(text) < 20:
        raise HTTPException(status_code=400, detail="Text must be at least 20 characters")
    
    if len(text) > 5000:
        raise HTTPException(status_code=400, detail="Text cannot exceed 5000 characters")
    
    try:
        # Vectorize text
        text_vec = vectorizer.transform([text])
        
        # Make prediction
        prediction = model.predict(text_vec)[0]
        confidence = float(model.predict_proba(text_vec).max())
        
        # Get probability distribution
        probabilities = model.predict_proba(text_vec)[0]
        class_probabilities = {
            class_name: float(prob)
            for class_name, prob in zip(model.classes_, probabilities)
        }
        
        # Calculate risk score
        risk_score = calculate_risk_score(class_probabilities)
        
        return AssessmentResponse(
            prediction=prediction,
            confidence=confidence,
            class_probabilities=class_probabilities,
            risk_score=risk_score,
        )
    except Exception as e:
        print(f"[v0] Error during assessment: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during assessment")


@app.get("/model-info")
async def model_info():
    """Get information about the trained model."""
    if model is None or vectorizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    return {
        "model_type": type(model).__name__,
        "classes": list(model.classes_),
        "n_features": model.n_features_in_,
        "vectorizer_type": type(vectorizer).__name__,
        "max_features": vectorizer.max_features,
    }


@app.get("/disclaimer")
async def disclaimer():
    """Get important disclaimer about the tool."""
    return {
        "disclaimer": "NeuroMind AI is a research and educational tool, not a substitute for professional medical or mental health advice. This assessment should not be used for diagnosis. Always consult qualified healthcare professionals for proper evaluation and treatment.",
        "resources": {
            "suicide_prevention": {
                "name": "National Suicide Prevention Lifeline",
                "number": "988",
                "url": "https://suicidepreventionlifeline.org/",
            },
            "crisis_text": {
                "name": "Crisis Text Line",
                "instructions": "Text HOME to 741741",
                "url": "https://www.crisistextline.org/",
            },
            "samhsa": {
                "name": "SAMHSA National Helpline",
                "number": "1-800-662-4357",
                "url": "https://www.samhsa.gov/find-help/national-helpline",
            },
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
