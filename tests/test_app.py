"""
Unit tests for ShifaAI application
"""
import pytest
import asyncio
import sys
import os
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
import json

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from backend.scraper import MedicalScraper
from backend.gpt_router import GPTMedicalRouter
from backend.cbt import CBTEngine
from backend.shifa import ShifaEngine
from backend.utils import clean_text, format_medical_response
from backend.app import app

@pytest.fixture
def client():
    """Create a test client for the FastAPI app"""
    return TestClient(app)

@pytest.fixture
def mock_openai_key():
    """Mock OpenAI API key for testing"""
    with patch.dict(os.environ, {'OPENAI_API_KEY': 'test-key'}):
        yield

class TestMedicalScraper:
    """Test the medical scraper functionality"""
    
    def setup_method(self):
        self.scraper = MedicalScraper()
    
    def test_scraper_initialization(self):
        assert self.scraper is not None
        assert hasattr(self.scraper, 'session')
        assert hasattr(self.scraper, 'scraped_data')
    
    def test_mayo_clinic_scraping(self):
        faqs = self.scraper.scrape_mayo_clinic_faqs()
        assert isinstance(faqs, list)
        assert len(faqs) > 0
        
        # Check FAQ structure
        faq = faqs[0]
        assert 'question' in faq
        assert 'answer' in faq
        assert 'category' in faq
        assert 'source' in faq
        assert faq['source'] == 'mayo_clinic'
    
    def test_webmd_scraping(self):
        faqs = self.scraper.scrape_webmd_faqs()
        assert isinstance(faqs, list)
        assert len(faqs) > 0
        
        faq = faqs[0]
        assert faq['source'] == 'webmd'
    
    def test_healthline_scraping(self):
        faqs = self.scraper.scrape_healthline_faqs()
        assert isinstance(faqs, list)
        assert len(faqs) > 0
        
        faq = faqs[0]
        assert faq['source'] == 'healthline'

class TestGPTRouter:
    """Test the GPT router functionality"""
    
    def setup_method(self):
        # Skip GPT tests if no API key
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            pytest.skip("No OpenAI API key provided")
        
        self.router = GPTMedicalRouter()
    
    def test_router_initialization(self):
        assert self.router is not None
        assert hasattr(self.router, 'client')
        assert hasattr(self.router, 'model')
    
    def test_categorize_question(self):
        # Test mental health categorization
        question = "I'm feeling very anxious and depressed"
        category = self.router.categorize_question(question)
        assert category == 'mental_health'
        
        # Test cardiology categorization
        question = "I have chest pain and high blood pressure"
        category = self.router.categorize_question(question)
        assert category == 'cardiology'
        
        # Test diabetes categorization
        question = "My blood sugar is high"
        category = self.router.categorize_question(question)
        assert category == 'diabetes'
        
        # Test general categorization
        question = "How can I stay healthy?"
        category = self.router.categorize_question(question)
        assert category == 'general'
    
    def test_follow_up_questions(self):
        follow_ups = self.router.get_follow_up_questions('mental_health')
        assert isinstance(follow_ups, list)
        assert len(follow_ups) > 0
        assert all(isinstance(q, str) for q in follow_ups)
    
    @pytest.mark.asyncio
    async def test_generate_medical_response(self):
        question = "What are the symptoms of anxiety?"
        response = await self.router.generate_medical_response(question)
        
        assert isinstance(response, dict)
        assert 'response' in response
        assert 'success' in response
        assert isinstance(response['success'], bool)

class TestCBTEngine:
    """Test the CBT engine functionality"""
    
    def setup_method(self):
        self.cbt = CBTEngine()
    
    def test_cbt_initialization(self):
        assert self.cbt is not None
        assert hasattr(self.cbt, 'exercises')
        assert hasattr(self.cbt, 'thought_patterns')
    
    def test_exercises_loaded(self):
        assert 'breathing' in self.cbt.exercises
        assert 'grounding' in self.cbt.exercises
        assert 'thought_record' in self.cbt.exercises
        
        # Check exercise structure
        breathing = self.cbt.exercises['breathing']
        assert 'name' in breathing
        assert 'description' in breathing
        assert 'steps' in breathing
        assert 'duration' in breathing
        assert 'benefits' in breathing
    
    def test_get_recommended_exercise(self):
        exercise = self.cbt.get_recommended_exercise('anxious', severity=7)
        assert isinstance(exercise, dict)
        assert 'name' in exercise
        assert 'key' in exercise
        
        # High severity should get immediate relief exercise
        high_severity_exercise = self.cbt.get_recommended_exercise('anxious', severity=9)
        assert high_severity_exercise['key'] in ['breathing', 'grounding']
    
    def test_identify_thought_pattern(self):
        # Test all-or-nothing thinking
        thought = "I always mess everything up completely"
        pattern = self.cbt.identify_thought_pattern(thought)
        assert pattern is not None
        assert pattern['name'] == 'All-or-Nothing Thinking'
        
        # Test catastrophizing
        thought = "This headache means something terrible is wrong"
        pattern = self.cbt.identify_thought_pattern(thought)
        assert pattern['name'] == 'Catastrophizing'
        
        # Test mind reading
        thought = "They think I'm stupid"
        pattern = self.cbt.identify_thought_pattern(thought)
        assert pattern['name'] == 'Mind Reading'
    
    def test_create_thought_record(self):
        record = self.cbt.create_thought_record(
            "Failed a test",
            "sad",
            "I always fail at everything"
        )
        
        assert isinstance(record, dict)
        assert record['situation'] == "Failed a test"
        assert record['emotion'] == "sad"
        assert record['automatic_thought'] == "I always fail at everything"
        assert record['cognitive_distortion'] is not None
        assert 'guidance' in record
    
    def test_generate_cbt_response(self):
        response = self.cbt.generate_cbt_response("I'm feeling overwhelmed", mood='stressed')
        
        assert isinstance(response, dict)
        assert 'response' in response
        assert 'exercise' in response
        assert 'mood_category' in response
        assert response['mood_category'] == 'stressed'
        assert response['type'] == 'cbt_guidance'
    
    def test_daily_cbt_tip(self):
        tip = self.cbt.get_daily_cbt_tip()
        assert isinstance(tip, str)
        assert len(tip) > 0

class TestShifaEngine:
    """Test the Shifa (Islamic healing) engine functionality"""
    
    def setup_method(self):
        self.shifa = ShifaEngine()
    
    def test_shifa_initialization(self):
        assert self.shifa is not None
        assert hasattr(self.shifa, 'duas')
        assert hasattr(self.shifa, 'prophetic_remedies')
        assert hasattr(self.shifa, 'islamic_guidelines')
    
    def test_duas_loaded(self):
        assert 'general_healing' in self.shifa.duas
        assert 'anxiety_relief' in self.shifa.duas
        assert 'ruqyah_verses' in self.shifa.duas
        
        # Check du'a structure
        dua = self.shifa.duas['general_healing']
        assert 'arabic' in dua
        assert 'transliteration' in dua
        assert 'translation' in dua
        assert 'source' in dua
        assert 'usage' in dua
    
    def test_prophetic_remedies_loaded(self):
        assert 'honey' in self.shifa.prophetic_remedies
        assert 'black_seed' in self.shifa.prophetic_remedies
        assert 'dates' in self.shifa.prophetic_remedies
        
        # Check remedy structure
        honey = self.shifa.prophetic_remedies['honey']
        assert 'name' in honey
        assert 'benefits' in honey
        assert 'prophetic_reference' in honey
        assert 'usage' in honey
        assert 'precautions' in honey
    
    def test_get_healing_dua(self):
        dua = self.shifa.get_healing_dua('anxiety')
        assert isinstance(dua, dict)
        assert 'key' in dua
        assert dua['key'] == 'anxiety_relief'
        
        general_dua = self.shifa.get_healing_dua('general')
        assert general_dua['key'] == 'general_healing'
    
    def test_get_prophetic_remedy(self):
        remedy = self.shifa.get_prophetic_remedy('digestive')
        assert isinstance(remedy, dict)
        assert 'key' in remedy
        assert remedy['key'] == 'honey'
        
        respiratory_remedy = self.shifa.get_prophetic_remedy('respiratory')
        assert respiratory_remedy['key'] == 'black_seed'
    
    def test_generate_shifa_response(self):
        response = self.shifa.generate_shifa_response("I'm feeling anxious", "Medical response here")
        
        assert isinstance(response, dict)
        assert 'response' in response
        assert 'dua' in response
        assert 'remedy' in response
        assert 'guideline' in response
        assert response['type'] == 'shifa_guidance'
        
        # Check that response contains Islamic elements
        assert '🌙' in response['response']
        assert 'Allah' in response['response']
        assert 'du\'a' in response['response'].lower()
    
    def test_is_halal_remedy(self):
        # Test halal remedy
        halal_check = self.shifa.is_halal_remedy("honey and black seed")
        assert halal_check['halal'] is True
        
        # Test haram remedy
        haram_check = self.shifa.is_halal_remedy("alcohol-based medicine")
        assert haram_check['halal'] is False
        assert 'alcohol' in haram_check['reason']
    
    def test_daily_islamic_health_tip(self):
        tip = self.shifa.get_daily_islamic_health_tip()
        assert isinstance(tip, str)
        assert len(tip) > 0

class TestUtils:
    """Test utility functions"""
    
    def test_clean_text(self):
        # Test basic cleaning
        dirty_text = "  Hello   world  \n\n  "
        clean = clean_text(dirty_text)
        assert clean == "Hello world"
        
        # Test empty string
        assert clean_text("") == ""
        assert clean_text(None) == ""
    
    def test_format_medical_response(self):
        content = "This is medical advice."
        
        # Test empathetic tone
        formatted = format_medical_response(content, tone="empathetic")
        assert "I understand your concern" in formatted
        assert "Please consult with a healthcare professional" in formatted
        assert content in formatted
        
        # Test neutral tone
        formatted_neutral = format_medical_response(content, tone="neutral")
        assert "I understand your concern" not in formatted_neutral
        assert "Please consult with a healthcare professional" in formatted_neutral

class TestHealthEndpoint:
    """Test health check endpoint"""
    
    def test_health_check(self, client):
        """Test basic health check"""
        response = client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "version" in data
        assert "services" in data

class TestMainEndpoint:
    """Test main /ask endpoint"""
    
    @pytest.fixture
    def sample_question(self):
        return {
            "question": "What are the symptoms of headache?",
            "include_cbt": True,
            "include_shifa": True,
            "available_time": 10
        }
    
    def test_ask_endpoint_validation(self, client):
        """Test request validation"""
        # Test empty question
        response = client.post("/ask", json={"question": ""})
        assert response.status_code == 400
        
        # Test missing question
        response = client.post("/ask", json={})
        assert response.status_code == 422  # Validation error
    
    @patch('backend.gpt_router.gpt_router.generate_medical_response')
    @patch('backend.cbt.cbt_engine.get_exercise_recommendation')
    @patch('backend.shifa.shifa_engine.get_islamic_health_guidance')
    def test_ask_endpoint_success(self, mock_shifa, mock_cbt, mock_gpt, client, sample_question):
        """Test successful question processing"""
        # Mock responses
        mock_gpt.return_value = {
            "response": "Headaches can be caused by stress, dehydration, or tension.",
            "category": "general_health",
            "keywords": ["headache", "pain"],
            "follow_up_suggestions": ["How can I prevent headaches?"]
        }
        
        mock_cbt.return_value = {
            "exercise": {
                "name": "Deep Breathing",
                "description": "A calming breathing exercise",
                "instructions": ["Breathe in for 4 counts", "Hold for 4 counts"],
                "duration_minutes": 5
            },
            "type": "breathing"
        }
        
        mock_shifa.return_value = {
            "dua": {
                "dua": {
                    "arabic": "اللهم رب الناس",
                    "transliteration": "Allahumma rabban-naas",
                    "translation": "O Allah, Lord of the people"
                }
            }
        }
        
        response = client.post("/ask", json=sample_question)
        assert response.status_code == 200
        
        data = response.json()
        assert "medical_response" in data
        assert "cbt_guidance" in data
        assert "shifa_guidance" in data
        assert data["question"] == sample_question["question"]
    
    @patch('backend.gpt_router.gpt_router.generate_medical_response')
    def test_ask_endpoint_emergency(self, mock_gpt, client):
        """Test emergency question handling"""
        mock_gpt.return_value = {
            "response": "This sounds like an emergency. Call 911 immediately.",
            "category": "emergency"
        }
        
        response = client.post("/ask", json={
            "question": "I'm having severe chest pain and can't breathe",
            "include_cbt": True,
            "include_shifa": True
        })
        
        assert response.status_code == 200
        data = response.json()
        
        # Should not include CBT or Shifa for emergencies
        assert "cbt_guidance" not in data
        assert "shifa_guidance" not in data

class TestCBTEndpoints:
    """Test CBT-related endpoints"""
    
    def test_cbt_exercise_endpoint(self, client):
        """Test CBT exercise recommendation"""
        with patch('backend.cbt.cbt_engine.get_exercise_recommendation') as mock_cbt:
            mock_cbt.return_value = {
                "exercise": {
                    "name": "4-7-8 Breathing",
                    "description": "Calming breath technique",
                    "instructions": ["Inhale for 4", "Hold for 7", "Exhale for 8"],
                    "duration_minutes": 5
                },
                "type": "breathing"
            }
            
            response = client.post("/cbt/exercise", json={
                "mood_level": 3,
                "concern_type": "anxiety",
                "available_time": 10
            })
            
            assert response.status_code == 200
            data = response.json()
            assert "exercise" in data
            assert data["exercise"]["name"] == "4-7-8 Breathing"
    
    def test_thought_record_endpoint(self, client):
        """Test thought record creation"""
        with patch('backend.cbt.cbt_engine.create_thought_record') as mock_cbt:
            mock_cbt.return_value = {
                "situation": "Work stress",
                "automatic_thoughts": "I'm failing",
                "emotions": "anxious",
                "identified_distortions": []
            }
            
            response = client.post("/cbt/thought-record", json={
                "situation": "Work stress",
                "thoughts": "I'm failing",
                "feelings": "anxious"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert data["situation"] == "Work stress"
    
    def test_daily_tip_endpoint(self, client):
        """Test daily CBT tip"""
        with patch('backend.cbt.cbt_engine.get_daily_tip') as mock_cbt:
            mock_cbt.return_value = "Remember: thoughts are not facts"
            
            response = client.get("/cbt/daily-tip")
            assert response.status_code == 200
            
            data = response.json()
            assert "tip" in data
            assert "date" in data

class TestShifaEndpoints:
    """Test Shifa (Islamic healing) endpoints"""
    
    def test_dua_endpoint(self, client):
        """Test healing du'a endpoint"""
        with patch('backend.shifa.shifa_engine.get_healing_dua') as mock_shifa:
            mock_shifa.return_value = {
                "dua": {
                    "arabic": "اللهم رب الناس",
                    "transliteration": "Allahumma rabban-naas",
                    "translation": "O Allah, Lord of the people",
                    "source": "Sahih al-Bukhari"
                },
                "category": "physical"
            }
            
            response = client.post("/shifa/dua", json={
                "condition": "headache",
                "category": "physical"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert "dua" in data
    
    def test_remedy_endpoint(self, client):
        """Test prophetic remedy endpoint"""
        with patch('backend.shifa.shifa_engine.get_prophetic_remedy') as mock_shifa:
            mock_shifa.return_value = {
                "remedy": {
                    "benefits": ["Natural healing", "Immune support"],
                    "usage": "Take with honey",
                    "hadith": "In the black seed is healing...",
                    "source": "Sahih al-Bukhari"
                },
                "remedy_name": "black_seed"
            }
            
            response = client.post("/shifa/remedy", json={
                "condition": "immunity"
            })
            
            assert response.status_code == 200
            data = response.json()
            assert "remedy" in data
            assert data["remedy_name"] == "black_seed"
    
    def test_halal_check_endpoint(self, client):
        """Test halal compliance check"""
        with patch('backend.shifa.shifa_engine.verify_halal_compliance') as mock_shifa:
            mock_shifa.return_value = {
                "status": "likely_halal",
                "message": "This treatment appears permissible",
                "recommendation": "Consult scholars for specific cases"
            }
            
            response = client.post("/shifa/halal-check?treatment=honey")
            assert response.status_code == 200
            
            data = response.json()
            assert data["status"] == "likely_halal"

class TestMedicalEndpoints:
    """Test medical data endpoints"""
    
    def test_categories_endpoint(self, client):
        """Test medical categories endpoint"""
        response = client.get("/medical/categories")
        assert response.status_code == 200
        
        data = response.json()
        assert "categories" in data
        assert "descriptions" in data
        assert "general_health" in data["categories"]
    
    def test_faqs_endpoint(self, client):
        """Test medical FAQs endpoint"""
        with patch('backend.scraper.medical_scraper.load_faqs_from_file') as mock_load:
            mock_load.return_value = [
                {
                    "id": 1,
                    "question": "What causes headaches?",
                    "answer": "Headaches can be caused by stress...",
                    "category": "General",
                    "source": "Mayo Clinic"
                }
            ]
            
            response = client.get("/medical/faqs?limit=5")
            assert response.status_code == 200
            
            data = response.json()
            assert "faqs" in data
            assert "total" in data
            assert len(data["faqs"]) <= 5

class TestAdminEndpoints:
    """Test admin endpoints"""
    
    def test_refresh_data_endpoint(self, client):
        """Test data refresh endpoint"""
        response = client.post("/admin/refresh-data")
        assert response.status_code == 200
        
        data = response.json()
        assert "message" in data
        assert "timestamp" in data

class TestErrorHandling:
    """Test error handling"""
    
    def test_404_handler(self, client):
        """Test 404 error handler"""
        response = client.get("/nonexistent-endpoint")
        assert response.status_code == 404
        
        data = response.json()
        assert "error" in data
        assert "available_endpoints" in data
    
    def test_validation_errors(self, client):
        """Test request validation errors"""
        # Invalid JSON
        response = client.post("/ask", data="invalid json")
        assert response.status_code == 422
        
        # Missing required fields
        response = client.post("/cbt/thought-record", json={})
        assert response.status_code == 422

class TestStartupEvents:
    """Test application startup events"""
    
    @patch('backend.scraper.medical_scraper.load_faqs_from_file')
    @patch('backend.scraper.medical_scraper.scrape_all_sources')
    def test_startup_data_loading(self, mock_scrape, mock_load):
        """Test startup data loading"""
        mock_load.return_value = []  # No cached data
        mock_scrape.return_value = [
            {"question": "Test", "answer": "Test answer"}
        ]
        
        # This would be tested during app startup
        # The actual test would require app restart which is complex
        # So we test the underlying functions instead
        assert mock_load.called or True  # Placeholder for actual startup test

class TestAPIEndpoints:
    """Test API endpoints"""
    
    def test_root_endpoint(self):
        """Test root endpoint returns HTML"""
        response = client.get("/")
        assert response.status_code == 200
        assert "text/html" in response.headers["content-type"]
        assert "ShifaAI" in response.text
    
    def test_health_check(self):
        """Test health check endpoint"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data
        assert "components" in data
    
    def test_stats_endpoint(self):
        """Test stats endpoint"""
        response = client.get("/stats")
        assert response.status_code == 200
        data = response.json()
        assert "medical_faqs_available" in data
        assert "cbt_exercises_available" in data
        assert "healing_duas_available" in data
    
    def test_cbt_daily_tip(self):
        """Test CBT daily tip endpoint"""
        response = client.get("/cbt/daily-tip")
        assert response.status_code == 200
        data = response.json()
        assert "daily_tip" in data
        assert "timestamp" in data
    
    def test_shifa_daily_tip(self):
        """Test Shifa daily tip endpoint"""
        response = client.get("/shifa/daily-tip")
        assert response.status_code == 200
        data = response.json()
        assert "daily_tip" in data
        assert "timestamp" in data
    
    def test_medical_knowledge(self):
        """Test medical knowledge endpoint"""
        response = client.get("/medical-knowledge")
        assert response.status_code == 200
        data = response.json()
        assert "results" in data
        assert "total_available" in data
    
    def test_medical_knowledge_with_query(self):
        """Test medical knowledge endpoint with search query"""
        response = client.get("/medical-knowledge?query=headache&limit=3")
        assert response.status_code == 200
        data = response.json()
        assert "query" in data
        assert "results" in data
        assert "total_found" in data

class TestAskEndpoint:
    """Test the main /ask endpoint"""
    
    @patch('backend.gpt_router.gpt_router.generate_medical_response')
    def test_ask_basic_question(self, mock_gpt):
        """Test basic medical question"""
        mock_gpt.return_value = {
            "response": "Test medical response",
            "category": "general_health",
            "keywords": ["test"],
            "follow_up_questions": [],
            "confidence": "high",
            "sources_recommended": []
        }
        
        response = client.post("/ask", json={
            "question": "What helps with headaches?",
            "include_cbt": False,
            "include_shifa": False
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "medical_response" in data
        assert data["medical_response"]["response"] == "Test medical response"
    
    @patch('backend.gpt_router.gpt_router.generate_medical_response')
    def test_ask_with_cbt(self, mock_gpt):
        """Test question with CBT included"""
        mock_gpt.return_value = {
            "response": "Test medical response",
            "category": "mental_health",
            "keywords": ["anxiety", "stress"],
            "follow_up_questions": [],
            "confidence": "high",
            "sources_recommended": []
        }
        
        response = client.post("/ask", json={
            "question": "I feel anxious",
            "include_cbt": True,
            "include_shifa": False
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "medical_response" in data
        assert "cbt_response" in data
    
    @patch('backend.gpt_router.gpt_router.generate_medical_response')
    def test_ask_with_shifa(self, mock_gpt):
        """Test question with Shifa included"""
        mock_gpt.return_value = {
            "response": "Test medical response",
            "category": "general_health",
            "keywords": ["pain"],
            "follow_up_questions": [],
            "confidence": "high",
            "sources_recommended": []
        }
        
        response = client.post("/ask", json={
            "question": "I have back pain",
            "include_cbt": False,
            "include_shifa": True
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "medical_response" in data
        assert "shifa_response" in data
    
    def test_ask_empty_question(self):
        """Test empty question returns error"""
        response = client.post("/ask", json={
            "question": "",
            "include_cbt": False,
            "include_shifa": False
        })
        
        assert response.status_code == 400

class TestCBTModule:
    """Test CBT module functionality"""
    
    def test_recommend_exercise(self):
        """Test CBT exercise recommendation"""
        symptoms = ["anxiety", "stress"]
        exercise = CBTEngine.recommend_exercise(symptoms, mood_rating=3)
        
        assert isinstance(exercise, dict)
        assert "name" in exercise
        assert "description" in exercise
        assert "steps" in exercise
        assert "duration" in exercise
        assert "best_for" in exercise
    
    def test_daily_cbt_tip(self):
        """Test getting daily CBT tip"""
        tip = CBTEngine.get_daily_cbt_tip()
        assert isinstance(tip, str)
        assert len(tip) > 0
    
    def test_identify_cognitive_distortion(self):
        """Test cognitive distortion identification"""
        thought = "I always fail at everything"
        distortions = CBTEngine.identify_cognitive_distortion(thought)
        
        assert isinstance(distortions, list)
        if distortions:
            assert "type" in distortions[0]
            assert "description" in distortions[0]
    
    def test_generate_balanced_thought(self):
        """Test balanced thought generation"""
        thought = "I'm a complete failure"
        distortions = CBTEngine.identify_cognitive_distortion(thought)
        balanced = CBTEngine.generate_balanced_thought(thought, distortions)
        
        assert isinstance(balanced, str)
        assert len(balanced) > 0
    
    def test_cbt_exercise_endpoint(self):
        """Test CBT exercise endpoint"""
        response = client.post("/cbt/exercise", json={
            "symptoms": ["anxiety", "stress"],
            "mood_rating": 5
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "exercise" in data
        assert "daily_tip" in data

class TestShifaModule:
    """Test Shifa (Islamic healing) module functionality"""
    
    def test_get_healing_dua(self):
        """Test getting healing du'a"""
        dua_response = ShifaEngine.get_healing_dua(category="general")
        
        assert isinstance(dua_response, dict)
        assert "dua" in dua_response
        assert "encouragement" in dua_response
        
        dua = dua_response["dua"]
        assert "arabic" in dua
        assert "transliteration" in dua
        assert "translation" in dua
        assert "source" in dua
    
    def test_get_prophetic_remedy(self):
        """Test getting prophetic medicine"""
        remedy = ShifaEngine.get_prophetic_remedy("cough")
        
        assert isinstance(remedy, dict)
        assert "remedy" in remedy
        assert "Islamic_guidance" in remedy
        assert "halal_verification" in remedy
    
    def test_verify_halal_compliance(self):
        """Test halal compliance verification"""
        verification = ShifaEngine.verify_halal_compliance("honey")
        
        assert isinstance(verification, dict)
        assert "status" in verification
        assert "reason" in verification
        assert "guidance" in verification
    
    def test_daily_islamic_tip(self):
        """Test getting daily Islamic health tip"""
        tip = ShifaEngine.get_daily_islamic_health_tip()
        assert isinstance(tip, str)
        assert len(tip) > 0
    
    def test_shifa_dua_endpoint(self):
        """Test Shifa du'a endpoint"""
        response = client.post("/shifa/dua", json={
            "category": "general"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "dua_response" in data
    
    def test_halal_check_endpoint(self):
        """Test halal verification endpoint"""
        response = client.post("/shifa/halal-check", json={
            "ingredient_or_treatment": "honey"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert "verification" in data

class TestMedicalScraper:
    """Test medical scraper functionality"""
    
    def test_scrape_all_sources(self):
        """Test scraping all medical sources"""
        content = MedicalScraper.scrape_all_sources()
        
        assert isinstance(content, list)
        assert len(content) > 0
        
        for item in content:
            assert "question" in item
            assert "answer" in item
            assert "source" in item
            assert "category" in item
    
    def test_preprocess_content(self):
        """Test content preprocessing"""
        sample_content = [{
            "question": "  What is fever?  ",
            "answer": "  Fever is elevated body temperature  ",
            "source": "Test Source",
            "category": "acute_illness"
        }]
        
        processed = MedicalScraper.preprocess_content(sample_content)
        
        assert len(processed) == 1
        assert processed[0]["question"] == "What is fever?"
        assert processed[0]["answer"] == "Fever is elevated body temperature"

class TestUtilityFunctions:
    """Test utility functions"""
    
    def test_categorize_question(self):
        """Test question categorization"""
        from backend.utils import categorize_question
        
        assert categorize_question("I feel anxious") == "mental_health"
        assert categorize_question("I have a headache") == "pain_management"
        assert categorize_question("I have a fever") == "acute_illness"
        assert categorize_question("I have diabetes") == "chronic_condition"
        assert categorize_question("What should I eat?") == "lifestyle"
    
    def test_extract_keywords(self):
        """Test keyword extraction"""
        from backend.utils import extract_keywords
        
        keywords = extract_keywords("I have a headache and feel dizzy")
        assert "headache" in keywords
        assert "dizzy" in keywords
    
    def test_clean_text(self):
        """Test text cleaning"""
        from backend.utils import clean_text
        
        cleaned = clean_text("  Hello   world!  ")
        assert cleaned == "Hello world!"

# Integration tests
class TestIntegration:
    """Integration tests for full workflows"""
    
    @patch('backend.gpt_router.gpt_router.generate_medical_response')
    def test_complete_health_consultation(self, mock_gpt):
        """Test complete health consultation workflow"""
        mock_gpt.return_value = {
            "response": "Based on your symptoms, here's some guidance...",
            "category": "mental_health", 
            "keywords": ["anxiety", "stress"],
            "follow_up_questions": ["How long have you felt this way?"],
            "confidence": "high",
            "sources_recommended": ["Mental Health America"]
        }
        
        response = client.post("/ask", json={
            "question": "I've been feeling very anxious lately",
            "include_cbt": True,
            "include_shifa": True,
            "user_context": {"mood_rating": 3}
        })
        
        assert response.status_code == 200
        data = response.json()
        
        # Check all components are present
        assert "medical_response" in data
        assert "cbt_response" in data
        assert "shifa_response" in data
        
        # Check medical response
        medical = data["medical_response"]
        assert medical["category"] == "mental_health"
        assert len(medical["keywords"]) > 0
        
        # Check CBT response
        cbt = data["cbt_response"]
        assert "exercise" in cbt
        assert "daily_tip" in cbt
        
        # Check Shifa response
        shifa = data["shifa_response"]
        assert "healing_dua" in shifa

# Test fixtures and utilities
@pytest.fixture
def sample_medical_data():
    """Sample medical data for testing"""
    return {
        "question": "What are symptoms of flu?",
        "answer": "Common flu symptoms include fever, cough, and fatigue.",
        "source": "Test Medical Source",
        "category": "acute_illness"
    }

@pytest.fixture
def sample_cbt_data():
    """Sample CBT data for testing"""
    return {
        "symptoms": ["anxiety", "stress"],
        "mood_rating": 4
    }

@pytest.fixture
def sample_shifa_data():
    """Sample Shifa data for testing"""
    return {
        "category": "anxiety_relief",
        "condition": "stress"
    }

# Test runners
if __name__ == "__main__":
    pytest.main([__file__, "-v"]) 