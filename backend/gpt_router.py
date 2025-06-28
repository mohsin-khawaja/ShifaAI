"""
GPT-4 Router for ShifaAI
Handles OpenAI API integration and intelligent query routing
"""
import openai
from typing import Dict, List, Optional, Any
from enum import Enum
import json
import asyncio
from .utils import logger, settings, categorize_medical_query, ResponseFormatter, Config, categorize_question, extract_keywords
from .scraper import knowledge_base

# Initialize OpenAI client
openai.api_key = settings.openai_api_key

class QueryType(Enum):
    """Types of medical queries"""
    MEDICAL_INFO = "medical_info"
    SYMPTOM_CHECK = "symptom_check"
    MEDICATION = "medication"
    EMERGENCY = "emergency"
    MENTAL_HEALTH = "mental_health"
    LIFESTYLE = "lifestyle"
    PREVENTION = "prevention"
    GENERAL = "general"

class GPTRouter:
    """GPT-4 orchestration for medical Q&A with empathetic responses"""
    
    def __init__(self):
        openai.api_key = Config.OPENAI_API_KEY
        self.client = openai.OpenAI(api_key=Config.OPENAI_API_KEY)
        
    def get_medical_system_prompt(self, category: str = "general_health") -> str:
        """Get system prompt based on question category"""
        base_prompt = """You are Dr. Shifa, a compassionate AI medical assistant. Your role is to:

1. Provide accurate, evidence-based medical information
2. Use an empathetic, hopeful, and supportive tone
3. Always encourage seeking professional medical care when appropriate
4. Never provide definitive diagnoses or replace professional medical advice
5. Focus on general health education and guidance

Guidelines:
- Be warm and understanding in your responses
- Acknowledge the person's concerns with empathy
- Provide practical, actionable advice when appropriate
- Always emphasize the importance of consulting healthcare professionals
- Use accessible language that's easy to understand
- Maintain a hopeful and encouraging tone

Remember: You are providing health education and support, not medical diagnosis or treatment."""

        category_specific = {
            "mental_health": " Pay special attention to mental wellness and emotional support. Be extra compassionate and consider suggesting professional mental health resources.",
            "pain_management": " Focus on safe, evidence-based pain management strategies. Emphasize the importance of proper medical evaluation for persistent pain.",
            "acute_illness": " Provide guidance on when to seek immediate medical care. Focus on symptom management and recovery support.",
            "chronic_condition": " Emphasize lifestyle management and the importance of working with healthcare providers for ongoing care.",
            "lifestyle": " Focus on evidence-based lifestyle recommendations and sustainable health habits."
        }
        
        return base_prompt + category_specific.get(category, "")
    
    async def generate_medical_response(self, question: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Generate empathetic medical response using GPT-4"""
        try:
            # Categorize the question
            category = categorize_question(question)
            keywords = extract_keywords(question)
            
            # Get appropriate system prompt
            system_prompt = self.get_medical_system_prompt(category)
            
            # Prepare the conversation
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question}
            ]
            
            # Add context if provided
            if context and context.get("previous_responses"):
                context_msg = f"Previous conversation context: {context['previous_responses'][-1]}"
                messages.insert(-1, {"role": "assistant", "content": context_msg})
            
            # Generate response
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                max_tokens=800,
                temperature=0.7,
                presence_penalty=0.1,
                frequency_penalty=0.1
            )
            
            medical_response = response.choices[0].message.content
            
            # Generate follow-up questions
            follow_up_questions = self.generate_follow_up_questions(category, keywords)
            
            return {
                "response": medical_response,
                "category": category,
                "keywords": keywords,
                "follow_up_questions": follow_up_questions,
                "confidence": "high",  # In a real system, this would be calculated
                "sources_recommended": self.get_recommended_sources(category)
            }
            
        except Exception as e:
            logger.error(f"Error generating medical response: {str(e)}")
            return {
                "response": "I apologize, but I'm currently unable to process your question. Please consult with a healthcare professional for medical advice. Your health and well-being are important, and a qualified medical provider can give you the personalized care you deserve.",
                "category": "error",
                "keywords": [],
                "follow_up_questions": [],
                "confidence": "low",
                "sources_recommended": []
            }
    
    def generate_follow_up_questions(self, category: str, keywords: List[str]) -> List[str]:
        """Generate relevant follow-up questions based on category and keywords"""
        follow_ups = {
            "mental_health": [
                "Would you like some breathing exercises to help with anxiety?",
                "Have you considered speaking with a mental health professional?",
                "Are you interested in learning about stress management techniques?"
            ],
            "pain_management": [
                "How long have you been experiencing this pain?",
                "Would you like to learn about gentle exercises that might help?",
                "Have you tried any pain management techniques before?"
            ],
            "acute_illness": [
                "Are your symptoms getting worse or staying the same?",
                "Do you have any other concerning symptoms?",
                "Would you like guidance on when to seek medical care?"
            ],
            "chronic_condition": [
                "How are you managing your condition day-to-day?",
                "Would you like tips for lifestyle modifications?",
                "Are you working with a healthcare team?"
            ],
            "lifestyle": [
                "Would you like a personalized wellness plan?",
                "Are you interested in specific dietary recommendations?",
                "Do you need help setting realistic health goals?"
            ]
        }
        
        return follow_ups.get(category, [
            "Is there anything specific about your symptoms you'd like to discuss?",
            "Would you like some general wellness tips?",
            "Do you have other health concerns you'd like to explore?"
        ])
    
    def get_recommended_sources(self, category: str) -> List[str]:
        """Get recommended medical sources based on category"""
        sources = {
            "mental_health": [
                "National Institute of Mental Health (NIMH)",
                "American Psychological Association (APA)",
                "Mental Health America"
            ],
            "pain_management": [
                "American Pain Society",
                "International Association for the Study of Pain",
                "CDC Pain Management Guidelines"
            ],
            "chronic_condition": [
                "American Heart Association",
                "American Diabetes Association",
                "Centers for Disease Control and Prevention"
            ]
        }
        
        return sources.get(category, [
            "Mayo Clinic",
            "WebMD",
            "Healthline",
            "Your healthcare provider"
        ])

# Global instance
gpt_router = GPTRouter()

async def process_medical_query(query: str, enable_cbt: bool = False, 
                              enable_shifa: bool = False) -> Dict[str, Any]:
    """
    Main function to process medical queries
    
    Args:
        query: User's medical question
        enable_cbt: Whether to include CBT recommendations
        enable_shifa: Whether to include Islamic healing guidance
    
    Returns:
        Complete response with medical info, CBT, and/or Shifa guidance
    """
    
    try:
        # Get primary medical response
        medical_response = await gpt_router.generate_medical_response(query)
        
        result = {
            "medical_response": medical_response,
            "query": query,
            "timestamp": "2024-01-01T00:00:00Z"
        }
        
        # Add CBT component if requested
        if enable_cbt:
            from .cbt import get_cbt_recommendation
            cbt_response = await get_cbt_recommendation(query, medical_response["category"])
            result["cbt_response"] = cbt_response
        
        # Add Shifa component if requested
        if enable_shifa:
            from .shifa import get_shifa_guidance
            shifa_response = await get_shifa_guidance(query, medical_response["category"])
            result["shifa_response"] = shifa_response
        
        return result
        
    except Exception as e:
        logger.error(f"Error in process_medical_query: {str(e)}")
        return {
            "error": "Unable to process medical query",
            "query": query,
            "timestamp": "2024-01-01T00:00:00Z"
        }

if __name__ == "__main__":
    # Test the router
    async def test_router():
        test_queries = [
            "What are the symptoms of diabetes?",
            "I have chest pain and can't breathe",
            "I'm feeling very anxious lately",
            "What medication should I take for headaches?"
        ]
        
        for query in test_queries:
            print(f"\nQuery: {query}")
            response = await process_medical_query(query, enable_cbt=True, enable_shifa=True)
            print(f"Response type: {response.get('medical_response', {}).get('category')}")
            print("---")
    
    # Run test
    asyncio.run(test_router()) 