"""
Main FastAPI Application for ShifaAI
Orchestrates all modules: Medical Q&A, CBT, Shifa guidance
"""
from fastapi import FastAPI, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
import asyncio
from datetime import datetime
import uvicorn

# Import our modules
from .utils import logger, settings, validate_input, ResponseFormatter, Config
from .scraper import initialize_knowledge_base, knowledge_base, medical_scraper
from .gpt_router import process_medical_query, gpt_router
from .cbt import cbt_engine
from .shifa import get_shifa_guidance, shifa_engine

# Pydantic models for API requests
class HealthQuery(BaseModel):
    question: str = Field(..., min_length=5, max_length=1000, description="User's health question")
    include_cbt: bool = Field(default=False, description="Include CBT recommendations")
    include_shifa: bool = Field(default=False, description="Include Islamic healing guidance")
    user_id: Optional[str] = Field(default=None, description="Optional user identifier")

class CBTRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=500, description="User's concern or query")
    mood_level: Optional[int] = Field(default=None, ge=1, le=5, description="Mood level (1-5)")

class ShifaRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=500, description="User's health concern")
    category: Optional[str] = Field(default=None, description="Specific guidance category")

class HealthResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    timestamp: str
    request_id: Optional[str] = None

# Initialize FastAPI app
app = FastAPI(
    title="ShifaAI - AI Health Companion",
    description="Comprehensive AI health companion providing medical information, CBT coaching, and Islamic healing guidance",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for web interface
try:
    app.mount("/static", StaticFiles(directory="static"), name="static")
except RuntimeError:
    # Directory doesn't exist yet, will be created later
    logger.info("Static directory not found, will serve without static files for now")

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    logger.info("Starting ShifaAI application...")
    
    # Initialize knowledge base
    try:
        initialize_knowledge_base()
        logger.info("Knowledge base initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize knowledge base: {str(e)}")
    
    # Verify OpenAI API key
    if not settings.openai_api_key:
        logger.warning("OpenAI API key not found. AI responses will use fallback mode.")
    else:
        logger.info("OpenAI API key configured successfully")
    
    logger.info("ShifaAI application startup complete")

# Health check endpoint
@app.get("/health", response_model=Dict[str, Any])
async def health_check():
    """Health check endpoint"""
    try:
        kb_stats = knowledge_base.get_stats()
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "version": "1.0.0",
            "services": {
                "knowledge_base": {
                    "status": "operational",
                    "total_faqs": kb_stats.get("total_faqs", 0),
                    "categories": kb_stats.get("categories", 0)
                },
                "cbt_engine": {
                    "status": "operational",
                    "available_exercises": len(cbt_engine.exercises)
                },
                "shifa_engine": {
                    "status": "operational", 
                    "available_duas": len(shifa_engine.duas),
                    "prophetic_medicines": len(shifa_engine.prophetic_remedies)
                },
                "openai_api": {
                    "status": "configured" if settings.openai_api_key else "not_configured"
                }
            }
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Service health check failed")

# Main medical query endpoint
@app.post("/ask", response_model=HealthResponse)
async def ask_health_question(query: HealthQuery, background_tasks: BackgroundTasks):
    """
    Main endpoint for health questions with optional CBT and Shifa guidance
    """
    try:
        # Validate input
        if not validate_input(query.question):
            raise HTTPException(status_code=400, detail="Invalid question format")
        
        logger.info(f"Processing health query: {query.question[:50]}...")
        
        # Process the medical query
        response_data = await process_medical_query(
            query=query.question,
            enable_cbt=query.include_cbt,
            enable_shifa=query.include_shifa
        )
        
        # Add request metadata
        response_data["request_metadata"] = {
            "include_cbt": query.include_cbt,
            "include_shifa": query.include_shifa,
            "user_id": query.user_id,
            "processed_at": datetime.now().isoformat()
        }
        
        return HealthResponse(
            success=True,
            data=response_data,
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing health query: {str(e)}")
        return HealthResponse(
            success=False,
            error="Unable to process your health question. Please try again later.",
            timestamp=datetime.now().isoformat()
        )

# CBT-specific endpoints
@app.post("/cbt/recommendation", response_model=HealthResponse)
async def get_cbt_recommendation_endpoint(request: CBTRequest):
    """Get CBT recommendation and exercises"""
    try:
        if not validate_input(request.query):
            raise HTTPException(status_code=400, detail="Invalid query format")
        
        # Extract symptoms from query and get recommendation
        from .utils import extract_keywords
        symptoms = extract_keywords(request.query)
        if not symptoms:
            symptoms = ["stress"]  # Default if no specific symptoms found
        
        cbt_response = cbt_engine.recommend_exercise(symptoms, request.mood_level)
        
        return HealthResponse(
            success=True,
            data=cbt_response,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error getting CBT recommendation: {str(e)}")
        return HealthResponse(
            success=False,
            error="Unable to provide CBT recommendation. Please try again later.",
            timestamp=datetime.now().isoformat()
        )

@app.get("/cbt/exercise", response_model=HealthResponse)
async def get_random_cbt_exercise(exercise_type: Optional[str] = None):
    """Get a random CBT exercise"""
    try:
        from .cbt import CBTExerciseType
        
        # Convert string to enum if provided
        exercise_enum = None
        if exercise_type:
            try:
                exercise_enum = CBTExerciseType(exercise_type.lower())
            except ValueError:
                raise HTTPException(status_code=400, detail=f"Invalid exercise type. Available types: {[e.value for e in CBTExerciseType]}")
        
        # Get a recommended exercise with default symptoms
        import random
        default_symptoms = ["stress", "anxiety", "worry", "tension"]
        random_symptoms = [random.choice(default_symptoms)]
        exercise = cbt_engine.recommend_exercise(random_symptoms)
        
        return HealthResponse(
            success=True,
            data=exercise,
            timestamp=datetime.now().isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting CBT exercise: {str(e)}")
        return HealthResponse(
            success=False,
            error="Unable to retrieve CBT exercise. Please try again later.",
            timestamp=datetime.now().isoformat()
        )

@app.get("/cbt/daily-tip", response_model=HealthResponse)
async def get_daily_cbt_tip():
    """Get daily mental health tip"""
    try:
        tip = cbt_engine.get_daily_cbt_tip()
        
        return HealthResponse(
            success=True,
            data={"daily_tip": tip, "category": "mental_health"},
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error getting daily CBT tip: {str(e)}")
        return HealthResponse(
            success=False,
            error="Unable to retrieve daily tip. Please try again later.",
            timestamp=datetime.now().isoformat()
        )

# Shifa-specific endpoints
@app.post("/shifa/guidance", response_model=HealthResponse)
async def get_shifa_guidance_endpoint(request: ShifaRequest):
    """Get Islamic healing guidance"""
    try:
        if not validate_input(request.query):
            raise HTTPException(status_code=400, detail="Invalid query format")
        
        shifa_response = await get_shifa_guidance(request.query)
        
        return HealthResponse(
            success=True,
            data=shifa_response,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error getting Shifa guidance: {str(e)}")
        return HealthResponse(
            success=False,
            error="Unable to provide Islamic healing guidance. Please try again later.",
            timestamp=datetime.now().isoformat()
        )

@app.get("/shifa/dua", response_model=HealthResponse)
async def get_healing_dua(category: Optional[str] = None):
    """Get healing du'a"""
    try:
        dua_data = shifa_engine.get_healing_dua(category or "general_healing")
        
        return HealthResponse(
            success=True,
            data=dua_data,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error getting healing du'a: {str(e)}")
        return HealthResponse(
            success=False,
            error="Unable to retrieve healing du'a. Please try again later.",
            timestamp=datetime.now().isoformat()
        )

@app.get("/shifa/prophetic-medicine", response_model=HealthResponse)
async def get_prophetic_medicine(condition: Optional[str] = None):
    """Get prophetic medicine recommendation"""
    try:
        medicine_data = shifa_engine.get_prophetic_remedy(condition or "general")
        
        return HealthResponse(
            success=True,
            data=medicine_data,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error getting prophetic medicine: {str(e)}")
        return HealthResponse(
            success=False,
            error="Unable to retrieve prophetic medicine recommendation. Please try again later.",
            timestamp=datetime.now().isoformat()
        )

# Knowledge base endpoints
@app.get("/knowledge/search", response_model=HealthResponse)
async def search_knowledge_base(q: str, category: Optional[str] = None, limit: int = 5):
    """Search the medical knowledge base"""
    try:
        if not validate_input(q):
            raise HTTPException(status_code=400, detail="Invalid search query")
        
        results = knowledge_base.search_faqs(q, category, limit)
        
        return HealthResponse(
            success=True,
            data={
                "query": q,
                "results": results,
                "total_found": len(results)
            },
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error searching knowledge base: {str(e)}")
        return HealthResponse(
            success=False,
            error="Unable to search knowledge base. Please try again later.",
            timestamp=datetime.now().isoformat()
        )

@app.get("/knowledge/categories", response_model=HealthResponse)
async def get_knowledge_categories():
    """Get available knowledge base categories"""
    try:
        categories = knowledge_base.get_categories()
        stats = knowledge_base.get_stats()
        
        return HealthResponse(
            success=True,
            data={
                "categories": categories,
                "statistics": stats
            },
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error getting categories: {str(e)}")
        return HealthResponse(
            success=False,
            error="Unable to retrieve categories. Please try again later.",
            timestamp=datetime.now().isoformat()
        )

# Web interface endpoint
@app.get("/", response_class=HTMLResponse)
async def get_web_interface():
    """Serve the web interface"""
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ShifaAI - Your AI Health Companion</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
        <div class="container mx-auto px-4 py-8">
            <!-- Header -->
            <div class="text-center mb-8">
                <h1 class="text-4xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-heart text-red-500"></i> ShifaAI
                </h1>
                <p class="text-xl text-gray-600">Your AI Health Companion</p>
                <p class="text-sm text-gray-500 mt-2">Medical guidance • CBT coaching • Islamic healing</p>
            </div>

            <!-- Main Interface -->
            <div class="max-w-4xl mx-auto">
                <!-- Question Input -->
                <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 class="text-2xl font-semibold text-gray-800 mb-4">Ask Your Health Question</h2>
                    
                    <div class="space-y-4">
                        <textarea 
                            id="healthQuestion" 
                            placeholder="Ask me anything about your health, symptoms, mental wellness, or seek Islamic healing guidance..."
                            class="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            rows="4"
                        ></textarea>
                        
                        <div class="flex flex-wrap gap-4 items-center">
                            <label class="flex items-center">
                                <input type="checkbox" id="includeCBT" class="mr-2">
                                <span class="text-sm">Include CBT coaching</span>
                            </label>
                            <label class="flex items-center">
                                <input type="checkbox" id="includeShifa" class="mr-2">
                                <span class="text-sm">Include Islamic healing guidance</span>
                            </label>
                        </div>
                        
                        <button 
                            onclick="askQuestion()" 
                            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
                        >
                            <i class="fas fa-paper-plane mr-2"></i>Get Guidance
                        </button>
                    </div>
                </div>

                <!-- Response Area -->
                <div id="responseArea" class="hidden bg-white rounded-lg shadow-lg p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-4">Your Personalized Guidance</h3>
                    <div id="responseContent" class="prose max-w-none"></div>
                </div>

                <!-- Loading Indicator -->
                <div id="loadingIndicator" class="hidden text-center py-8">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p class="mt-2 text-gray-600">Preparing your personalized guidance...</p>
                </div>

                <!-- Quick Actions -->
                <div class="grid md:grid-cols-3 gap-6 mt-8">
                    <div class="bg-white rounded-lg shadow p-6 text-center">
                        <i class="fas fa-brain text-3xl text-blue-600 mb-4"></i>
                        <h3 class="text-lg font-semibold mb-2">CBT Exercise</h3>
                        <p class="text-gray-600 text-sm mb-4">Get a mental health exercise</p>
                        <button onclick="getCBTExercise()" class="bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded-lg text-sm">
                            Get Exercise
                        </button>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow p-6 text-center">
                        <i class="fas fa-heart text-3xl text-green-600 mb-4"></i>
                        <h3 class="text-lg font-semibold mb-2">Healing Du'a</h3>
                        <p class="text-gray-600 text-sm mb-4">Receive Islamic healing prayer</p>
                        <button onclick="getHealingDua()" class="bg-green-100 hover:bg-green-200 text-green-800 py-2 px-4 rounded-lg text-sm">
                            Get Du'a
                        </button>
                    </div>
                    
                    <div class="bg-white rounded-lg shadow p-6 text-center">
                        <i class="fas fa-leaf text-3xl text-yellow-600 mb-4"></i>
                        <h3 class="text-lg font-semibold mb-2">Prophetic Medicine</h3>
                        <p class="text-gray-600 text-sm mb-4">Learn about natural remedies</p>
                        <button onclick="getPropheticMedicine()" class="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 py-2 px-4 rounded-lg text-sm">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <script>
            async function askQuestion() {
                const question = document.getElementById('healthQuestion').value.trim();
                const includeCBT = document.getElementById('includeCBT').checked;
                const includeShifa = document.getElementById('includeShifa').checked;
                
                if (!question) {
                    alert('Please enter a health question');
                    return;
                }
                
                showLoading(true);
                hideResponse();
                
                try {
                    const response = await fetch('/ask', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            question: question,
                            include_cbt: includeCBT,
                            include_shifa: includeShifa
                        })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        displayResponse(data.data);
                    } else {
                        displayError(data.error || 'An error occurred');
                    }
                } catch (error) {
                    displayError('Network error. Please try again.');
                }
                
                showLoading(false);
            }
            
            async function getCBTExercise() {
                showLoading(true);
                
                try {
                    const response = await fetch('/cbt/exercise');
                    const data = await response.json();
                    
                    if (data.success) {
                        displayResponse({medical_response: {response: data.data.formatted_instructions}});
                    } else {
                        displayError(data.error || 'Could not get CBT exercise');
                    }
                } catch (error) {
                    displayError('Network error. Please try again.');
                }
                
                showLoading(false);
            }
            
            async function getHealingDua() {
                showLoading(true);
                
                try {
                    const response = await fetch('/shifa/dua');
                    const data = await response.json();
                    
                    if (data.success) {
                        const dua = data.data.dua;
                        const content = `
                            <h4 class="font-semibold">Healing Du'a</h4>
                            <p><strong>Arabic:</strong> ${dua.arabic}</p>
                            <p><strong>Translation:</strong> ${dua.translation}</p>
                            <p><strong>Source:</strong> ${dua.source}</p>
                        `;
                        displayResponse({medical_response: {response: content}});
                    } else {
                        displayError(data.error || 'Could not get healing du\'a');
                    }
                } catch (error) {
                    displayError('Network error. Please try again.');
                }
                
                showLoading(false);
            }
            
            async function getPropheticMedicine() {
                showLoading(true);
                
                try {
                    const response = await fetch('/shifa/prophetic-medicine');
                    const data = await response.json();
                    
                    if (data.success) {
                        const medicine = data.data.medicine;
                        const content = `
                            <h4 class="font-semibold">${medicine.name}</h4>
                            <p>${medicine.description}</p>
                            <p><strong>Usage:</strong> ${medicine.usage}</p>
                            <p><strong>Benefits:</strong></p>
                            <ul>${medicine.benefits.map(b => `<li>${b}</li>`).join('')}</ul>
                        `;
                        displayResponse({medical_response: {response: content}});
                    } else {
                        displayError(data.error || 'Could not get prophetic medicine info');
                    }
                } catch (error) {
                    displayError('Network error. Please try again.');
                }
                
                showLoading(false);
            }
            
            function displayResponse(data) {
                const responseArea = document.getElementById('responseArea');
                const responseContent = document.getElementById('responseContent');
                
                let html = '';
                
                if (data.medical_response) {
                    html += `<div class="mb-6">${formatText(data.medical_response.response)}</div>`;
                }
                
                if (data.cbt_response) {
                    html += `<div class="mb-6 border-t pt-6">${formatText(data.cbt_response.cbt_response)}</div>`;
                }
                
                if (data.shifa_response) {
                    html += `<div class="mb-6 border-t pt-6">${formatText(data.shifa_response.shifa_response)}</div>`;
                }
                
                responseContent.innerHTML = html;
                responseArea.classList.remove('hidden');
                responseArea.scrollIntoView({ behavior: 'smooth' });
            }
            
            function formatText(text) {
                return text
                    .replace(/\\n\\n/g, '</p><p>')
                    .replace(/\\n/g, '<br>')
                    .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
                    .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
                    .replace(/^/, '<p>')
                    .replace(/$/, '</p>');
            }
            
            function displayError(message) {
                const responseArea = document.getElementById('responseArea');
                const responseContent = document.getElementById('responseContent');
                
                responseContent.innerHTML = `
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <i class="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                        <span class="text-red-800">${message}</span>
                    </div>
                `;
                responseArea.classList.remove('hidden');
            }
            
            function showLoading(show) {
                const loadingIndicator = document.getElementById('loadingIndicator');
                if (show) {
                    loadingIndicator.classList.remove('hidden');
                } else {
                    loadingIndicator.classList.add('hidden');
                }
            }
            
            function hideResponse() {
                const responseArea = document.getElementById('responseArea');
                responseArea.classList.add('hidden');
            }
        </script>
    </body>
    </html>
    """

# Admin endpoints (basic)
@app.get("/admin/stats", response_model=HealthResponse)
async def get_admin_stats():
    """Get application statistics"""
    try:
        stats = {
            "knowledge_base": knowledge_base.get_stats(),
            "cbt_exercises": len(cbt_engine.exercises),
            "shifa_duas": len(shifa_engine.duas),
            "prophetic_medicines": len(shifa_engine.prophetic_remedies)
        }
        
        return HealthResponse(
            success=True,
            data=stats,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        logger.error(f"Error getting admin stats: {str(e)}")
        return HealthResponse(
            success=False,
            error="Unable to retrieve statistics",
            timestamp=datetime.now().isoformat()
        )

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "error": "Endpoint not found",
            "timestamp": datetime.now().isoformat()
        }
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "timestamp": datetime.now().isoformat()
        }
    )

if __name__ == "__main__":
    uvicorn.run(
        "backend.app:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="info"
    ) 