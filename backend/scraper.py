"""
Medical FAQ Scraper for ShifaAI
Scrapes medical information from trusted sources
"""
import requests
from bs4 import BeautifulSoup
import json
import time
from typing import List, Dict, Optional
from urllib.parse import urljoin, urlparse
import logging
from .utils import logger, clean_text, Config

class MedicalScraper:
    """Scraper for medical FAQ content from trusted sources"""
    
    def __init__(self):
        self.sources = Config.MEDICAL_SOURCES
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def scrape_mayo_clinic_faq(self) -> List[Dict[str, str]]:
        """Scrape FAQ content from Mayo Clinic (simulated data for demo)"""
        # In a real implementation, this would scrape actual Mayo Clinic content
        # For this demo, we'll return sample medical FAQs
        return [
            {
                "question": "What are the common symptoms of flu?",
                "answer": "Common flu symptoms include fever, chills, muscle aches, cough, congestion, runny nose, headaches, and fatigue. Symptoms typically appear 1-4 days after exposure to the virus.",
                "source": "Mayo Clinic",
                "category": "acute_illness"
            },
            {
                "question": "How can I manage high blood pressure naturally?",
                "answer": "Natural approaches to managing blood pressure include maintaining a healthy weight, eating a balanced diet low in sodium, exercising regularly, limiting alcohol, managing stress, and getting adequate sleep.",
                "source": "Mayo Clinic", 
                "category": "chronic_condition"
            },
            {
                "question": "What should I do if I have persistent headaches?",
                "answer": "For persistent headaches, keep a headache diary, maintain regular sleep patterns, stay hydrated, manage stress, and avoid known triggers. Consult a healthcare provider if headaches worsen or occur frequently.",
                "source": "Mayo Clinic",
                "category": "pain_management"
            }
        ]
    
    def scrape_webmd_content(self) -> List[Dict[str, str]]:
        """Scrape content from WebMD (simulated data for demo)"""
        return [
            {
                "question": "How do I know if I have anxiety?",
                "answer": "Anxiety symptoms include excessive worry, restlessness, fatigue, difficulty concentrating, irritability, muscle tension, and sleep problems. If these symptoms persist and interfere with daily life, consider speaking with a healthcare professional.",
                "source": "WebMD",
                "category": "mental_health"
            },
            {
                "question": "What are healthy ways to lose weight?",
                "answer": "Healthy weight loss involves creating a moderate caloric deficit through balanced nutrition and regular physical activity. Focus on whole foods, portion control, staying hydrated, and gradual sustainable changes.",
                "source": "WebMD",
                "category": "lifestyle"
            }
        ]
    
    def scrape_healthline_content(self) -> List[Dict[str, str]]:
        """Scrape content from Healthline (simulated data for demo)"""
        return [
            {
                "question": "What foods help boost immune system?",
                "answer": "Immune-boosting foods include citrus fruits (vitamin C), yogurt (probiotics), garlic, ginger, spinach, almonds, turmeric, and green tea. A balanced diet with variety supports overall immune function.",
                "source": "Healthline",
                "category": "lifestyle"
            },
            {
                "question": "How much sleep do adults need?",
                "answer": "Most adults need 7-9 hours of sleep per night. Quality sleep supports immune function, mental health, physical recovery, and cognitive performance. Consistent sleep schedules help maintain healthy sleep patterns.",
                "source": "Healthline",
                "category": "general_health"
            }
        ]
    
    def scrape_all_sources(self) -> List[Dict[str, str]]:
        """Scrape content from all configured medical sources"""
        all_content = []
        
        try:
            logger.info("Scraping Mayo Clinic content...")
            all_content.extend(self.scrape_mayo_clinic_faq())
            time.sleep(1)  # Rate limiting
            
            logger.info("Scraping WebMD content...")
            all_content.extend(self.scrape_webmd_content())
            time.sleep(1)
            
            logger.info("Scraping Healthline content...")
            all_content.extend(self.scrape_healthline_content())
            
        except Exception as e:
            logger.error(f"Error during scraping: {str(e)}")
        
        logger.info(f"Successfully scraped {len(all_content)} medical FAQs")
        return all_content
    
    def preprocess_content(self, content: List[Dict[str, str]]) -> List[Dict[str, str]]:
        """Clean and preprocess scraped content"""
        processed_content = []
        
        for item in content:
            processed_item = {
                "question": clean_text(item.get("question", "")),
                "answer": clean_text(item.get("answer", "")),
                "source": item.get("source", "Unknown"),
                "category": item.get("category", "general_health")
            }
            
            # Only include items with valid question and answer
            if processed_item["question"] and processed_item["answer"]:
                processed_content.append(processed_item)
        
        return processed_content

class MedicalKnowledgeBase:
    """Manages the medical knowledge base"""
    
    def __init__(self):
        self.faqs = []
        self.categories = set()
        
    def load_faqs(self, filename: str = "medical_faqs.json") -> bool:
        """Load FAQs from file"""
        try:
            with open(filename, 'r', encoding='utf-8') as f:
                self.faqs = json.load(f)
            
            self.categories = set(faq.get("category", "general") for faq in self.faqs)
            logger.info(f"Loaded {len(self.faqs)} FAQs from {filename}")
            return True
            
        except FileNotFoundError:
            logger.warning(f"FAQ file {filename} not found")
            return False
        except Exception as e:
            logger.error(f"Error loading FAQs: {str(e)}")
            return False
    
    def search_faqs(self, query: str, category: str = None, limit: int = 5) -> List[Dict]:
        """Search FAQs based on query"""
        query_lower = query.lower()
        matching_faqs = []
        
        for faq in self.faqs:
            if category and faq.get("category") != category:
                continue
                
            question_lower = faq.get("question", "").lower()
            answer_lower = faq.get("answer", "").lower()
            keywords = faq.get("keywords", [])
            
            score = 0
            
            # Exact matches in question
            if query_lower in question_lower:
                score += 10
            
            # Keyword matches
            for keyword in keywords:
                if keyword.lower() in query_lower:
                    score += 5
            
            # Partial matches in answer
            query_words = query_lower.split()
            for word in query_words:
                if len(word) > 3:  # Skip short words
                    if word in question_lower:
                        score += 2
                    if word in answer_lower:
                        score += 1
            
            if score > 0:
                faq_with_score = faq.copy()
                faq_with_score["relevance_score"] = score
                matching_faqs.append(faq_with_score)
        
        # Sort by relevance score
        matching_faqs.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        return matching_faqs[:limit]
    
    def get_categories(self) -> List[str]:
        """Get all available categories"""
        return list(self.categories)
    
    def get_stats(self) -> Dict:
        """Get knowledge base statistics"""
        return {
            "total_faqs": len(self.faqs),
            "categories": len(self.categories),
            "category_breakdown": {cat: len([faq for faq in self.faqs if faq.get("category") == cat]) 
                                 for cat in self.categories}
        }

# Global instance for easy access
medical_scraper = MedicalScraper()

def initialize_knowledge_base():
    """Initialize the knowledge base with scraped data"""
    if not knowledge_base.load_faqs():
        logger.info("No existing FAQ file found, scraping fresh data...")
        faqs = medical_scraper.scrape_all_sources()
        processed_faqs = medical_scraper.preprocess_content(faqs)
        scraper.save_faqs_to_file(processed_faqs)
        knowledge_base.faqs = processed_faqs
        knowledge_base.categories = set(faq.get("category", "general") for faq in processed_faqs)

if __name__ == "__main__":
    # Initialize and test the scraper
    initialize_knowledge_base()
    stats = knowledge_base.get_stats()
    print(f"Knowledge base statistics: {stats}")
    
    # Test search
    results = knowledge_base.search_faqs("diabetes symptoms")
    print(f"Found {len(results)} results for 'diabetes symptoms'")
    for result in results[:2]:
        print(f"Q: {result['question']}")
        print(f"A: {result['answer'][:100]}...")
        print() 