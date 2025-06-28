"""
Utility functions and configurations for ShifaAI
"""
import os
import logging
import re
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load environment variables
load_dotenv()

class Config:
    """Configuration management for ShifaAI"""
    
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    MAX_RESPONSE_LENGTH = int(os.getenv("MAX_RESPONSE_LENGTH", "2000"))
    
    # Medical sources for scraping
    MEDICAL_SOURCES = [
        "https://www.mayoclinic.org",
        "https://www.webmd.com", 
        "https://www.healthline.com"
    ]

class Settings(BaseSettings):
    """Application settings"""
    openai_api_key: str = Config.OPENAI_API_KEY
    openai_model: str = "gpt-4o"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"
    log_level: str = Config.LOG_LEVEL
    host: str = os.getenv("HOST", "0.0.0.0")
    port: int = int(os.getenv("PORT", "8000"))
    redis_url: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./shifa.db")
    
    class Config:
        env_file = ".env"
        extra = "allow"  # Allow extra fields from .env

settings = Settings()

def setup_logging():
    """Configure logging for the application"""
    logging.basicConfig(
        level=getattr(logging, Config.LOG_LEVEL.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('shifa_ai.log'),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger(__name__)

logger = setup_logging()

def clean_text(text: str) -> str:
    """Clean and normalize text input"""
    if not text:
        return ""
    
    # Remove extra whitespace and normalize
    text = re.sub(r'\s+', ' ', text.strip())
    
    # Remove special characters that might interfere with processing
    text = re.sub(r'[^\w\s\-.,!?;:()\'"\/]', '', text)
    
    return text

def extract_keywords(text: str) -> List[str]:
    """Extract medical keywords from text"""
    medical_keywords = [
        'pain', 'ache', 'fever', 'headache', 'nausea', 'vomiting', 'diarrhea',
        'constipation', 'fatigue', 'tired', 'dizzy', 'breath', 'cough', 'cold',
        'flu', 'infection', 'diabetes', 'blood pressure', 'heart', 'chest',
        'stomach', 'back', 'joint', 'muscle', 'skin', 'rash', 'allergy',
        'anxiety', 'depression', 'stress', 'sleep', 'insomnia'
    ]
    
    text_lower = text.lower()
    found_keywords = [keyword for keyword in medical_keywords if keyword in text_lower]
    
    return found_keywords

def format_medical_response(content: str, confidence: float = 0.8) -> Dict[str, Any]:
    """Format medical response with metadata"""
    return {
        "content": content,
        "confidence": confidence,
        "disclaimer": "This information is for educational purposes only and should not replace professional medical advice.",
        "timestamp": "2024-01-01T00:00:00Z",
        "source": "ShifaAI"
    }

def validate_input(text: str, max_length: int = Config.MAX_RESPONSE_LENGTH) -> bool:
    """Validate user input"""
    if not text or not text.strip():
        return False
    if len(text) > max_length:
        return False
    return True

def get_medical_disclaimer() -> str:
    """Get standard medical disclaimer"""
    return ("⚠️ **Medical Disclaimer**: This AI provides general information only. "
            "Always consult qualified healthcare professionals for medical advice, "
            "diagnosis, or treatment. In emergencies, contact emergency services immediately.")

def get_islamic_greeting() -> str:
    """Get Islamic greeting for Shifa responses"""
    return "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم (Bismillah Ar-Rahman Ar-Raheem) - In the name of Allah, the Most Gracious, the Most Merciful"

class ResponseFormatter:
    """Format responses with appropriate styling"""
    
    @staticmethod
    def medical_response(content: str) -> str:
        return f"🏥 **Medical Information**\n\n{content}\n\n{get_medical_disclaimer()}"
    
    @staticmethod
    def cbt_response(content: str) -> str:
        return f"🧠 **CBT Guidance**\n\n{content}\n\n💡 Remember: Healing is a journey, and every small step matters."
    
    @staticmethod
    def shifa_response(content: str) -> str:
        return f"🌟 **Shifa (Healing) Guidance**\n\n{get_islamic_greeting()}\n\n{content}\n\n🤲 May Allah grant you complete healing and wellness."

# Common medical categories for routing
MEDICAL_CATEGORIES = {
    "symptoms": ["pain", "fever", "headache", "nausea", "fatigue", "cough", "shortness of breath"],
    "conditions": ["diabetes", "hypertension", "anxiety", "depression", "arthritis", "asthma"],
    "treatments": ["medication", "therapy", "surgery", "exercise", "diet", "lifestyle"],
    "prevention": ["vaccination", "screening", "diet", "exercise", "hygiene", "safety"],
    "emergency": ["chest pain", "difficulty breathing", "severe bleeding", "unconscious", "stroke"]
}

def categorize_medical_query(query: str) -> str:
    """Categorize medical query for appropriate routing"""
    query_lower = query.lower()
    
    for category, keywords in MEDICAL_CATEGORIES.items():
        if any(keyword in query_lower for keyword in keywords):
            return category
    
    return "general"

def categorize_question(text: str) -> str:
    """Categorize medical question type"""
    text_lower = text.lower()
    
    if any(word in text_lower for word in ['anxious', 'anxiety', 'stress', 'worried', 'depression', 'mood', 'mental']):
        return 'mental_health'
    elif any(word in text_lower for word in ['pain', 'ache', 'hurt', 'sore']):
        return 'pain_management'
    elif any(word in text_lower for word in ['fever', 'cold', 'flu', 'cough', 'infection']):
        return 'acute_illness'
    elif any(word in text_lower for word in ['diabetes', 'blood pressure', 'heart', 'chronic']):
        return 'chronic_condition'
    elif any(word in text_lower for word in ['diet', 'nutrition', 'exercise', 'weight', 'healthy']):
        return 'lifestyle'
    else:
        return 'general_health' 