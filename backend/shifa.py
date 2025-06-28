"""
Shifa (Islamic Healing) Module for ShifaAI
Provides Islamic healing guidance based on authentic sources
"""
import random
from typing import Dict, List, Optional, Any
from enum import Enum
from .utils import logger, ResponseFormatter, get_islamic_greeting

class HealingType(Enum):
    """Types of Islamic healing approaches"""
    DUA = "dua"
    PROPHETIC_MEDICINE = "prophetic_medicine"
    LIFESTYLE = "lifestyle"
    SPIRITUAL = "spiritual"
    DIETARY = "dietary"

class ShifaEngine:
    """Islamic healing module with du'as, prophetic medicine, and halal compliance"""
    
    def __init__(self):
        self.duas = self._load_healing_duas()
        self.prophetic_remedies = self._load_prophetic_remedies()
        self.general_guidance = self._load_general_guidance()
        
    def _load_healing_duas(self) -> Dict[str, Dict[str, Any]]:
        """Load authentic healing du'as from Quran and Sunnah"""
        return {
            "general_healing": {
                "arabic": "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ وَاشْفِ أَنْتَ الشَّافِي لاَ شِفَاءَ إِلاَّ شِفَاؤُكَ شِفَاءً لاَ يُغَادِرُ سَقَمًا",
                "transliteration": "Allahumma rabbannāsi adhhibil-ba'sa washfi anta ash-shāfī lā shifā'a illā shifā'uka shifā'an lā yughādiru saqamā",
                "translation": "O Allah, Lord of mankind, remove the illness and heal, You are the Healer, there is no healing except Your healing, a healing that leaves no illness behind",
                "source": "Sahih Bukhari and Muslim",
                "category": "general",
                "benefits": ["Physical healing", "Spiritual comfort", "Trust in Allah"],
                "recitation_notes": "Place hand on the area of pain while reciting"
            },
            "ruqyah_protection": {
                "arabic": "قُلْ هُوَ اللَّهُ أَحَدٌ * اللَّهُ الصَّمَدُ * لَمْ يَلِدْ وَلَمْ يُولَدْ * وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
                "transliteration": "Qul huwallāhu ahad, Allāhus-samad, lam yalid wa lam yūlad, wa lam yakun lahu kufuwan ahad",
                "translation": "Say: He is Allah, the One! Allah, the Eternal, Absolute; He begets not, nor is He begotten; And there is none like unto Him",
                "source": "Quran - Surah Al-Ikhlas (112)",
                "category": "protection",
                "benefits": ["Spiritual protection", "Healing", "Peace of mind"],
                "recitation_notes": "Recite 3 times, blow on hands, wipe over body"
            },
            "anxiety_relief": {
                "arabic": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ",
                "transliteration": "Allāhumma innī a'ūdhu bika minal-hammi wal-hazan, wa a'ūdhu bika minal-'ajzi wal-kasal",
                "translation": "O Allah, I seek refuge in You from worry and grief, and I seek refuge in You from incapacity and laziness",
                "source": "Sahih Bukhari",
                "category": "mental_health",
                "benefits": ["Anxiety relief", "Mental peace", "Strength and motivation"],
                "recitation_notes": "Best recited in morning and evening"
            },
            "morning_protection": {
                "arabic": "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
                "transliteration": "A'ūdhu bi kalimātillāhit-tāmmāti min sharri mā khalaq",
                "translation": "I seek refuge in the perfect words of Allah from the evil of what He has created",
                "source": "Sahih Muslim",
                "category": "protection",
                "benefits": ["Daily protection", "General wellness", "Spiritual strength"],
                "recitation_notes": "Recite 3 times in morning and evening"
            },
            "fever_relief": {
                "arabic": "اللَّهُمَّ أَذْهِبْ عَنِّي حَرَّ السَّخْنَةِ وَبَرْدَ الْقُرَّةِ",
                "transliteration": "Allāhumma adhhib 'annī harras-sakhnati wa bard al-qurrah",
                "translation": "O Allah, remove from me the heat of fever and the coldness of chill",
                "source": "Abu Dawud",
                "category": "acute_illness",
                "benefits": ["Fever relief", "Comfort during illness"],
                "recitation_notes": "Recite while placing cool cloth on forehead"
            },
            "pain_relief": {
                "arabic": "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ",
                "transliteration": "As'alullāhal-'azīma rabbal-'arshil-'azīmi an yashfīyak",
                "translation": "I ask Allah the Mighty, Lord of the Mighty Throne, to heal you",
                "source": "Tirmidhi",
                "category": "pain_management",
                "benefits": ["Pain relief", "Healing", "Comfort"],
                "recitation_notes": "Recite 7 times while placing hand on area of pain"
            }
        }
    
    def _load_prophetic_remedies(self) -> Dict[str, Dict[str, Any]]:
        """Load authentic prophetic medical remedies"""
        return {
            "honey": {
                "arabic_name": "عَسَل",
                "description": "Honey is mentioned in the Quran as having healing properties",
                "quran_reference": "And from their bellies comes a drink of varying colors, in which there is healing for people (16:69)",
                "prophetic_usage": "The Prophet (ﷺ) recommended honey for various ailments",
                "modern_benefits": [
                    "Antibacterial properties",
                    "Wound healing",
                    "Cough suppression",
                    "Digestive health",
                    "Antioxidant effects"
                ],
                "recommended_for": ["cough", "sore_throat", "digestive_issues", "wound_healing", "general_wellness"],
                "usage": "Take 1-2 tablespoons daily, preferably on empty stomach",
                "halal_status": "Halal",
                "precautions": "Not recommended for infants under 1 year"
            },
            "black_seed": {
                "arabic_name": "حَبَّة البَرَكَة",
                "description": "Black seed (Nigella sativa) is highly praised in Islamic medicine",
                "prophetic_saying": "In black seed there is healing for every disease except death (Sahih Bukhari)",
                "modern_benefits": [
                    "Immune system support",
                    "Anti-inflammatory properties",
                    "Blood sugar regulation",
                    "Respiratory health",
                    "Digestive support"
                ],
                "recommended_for": ["immune_support", "inflammation", "diabetes", "asthma", "allergies"],
                "usage": "1 teaspoon of oil daily or half teaspoon of ground seeds with honey",
                "halal_status": "Halal",
                "precautions": "Consult healthcare provider if pregnant or on medications"
            },
            "dates": {
                "arabic_name": "تَمْر",
                "description": "Dates were a staple food of the Prophet (ﷺ) and have many health benefits",
                "prophetic_saying": "Whoever eats seven dates in the morning will not be harmed by poison or magic that day (Sahih Bukhari)",
                "modern_benefits": [
                    "Natural energy source",
                    "Rich in fiber and potassium",
                    "Heart health support",
                    "Bone health",
                    "Natural antioxidants"
                ],
                "recommended_for": ["fatigue", "constipation", "heart_health", "bone_health", "general_nutrition"],
                "usage": "7 dates daily, preferably Ajwa dates in the morning",
                "halal_status": "Halal",
                "precautions": "Moderate consumption for diabetics due to natural sugars"
            },
            "olive_oil": {
                "arabic_name": "زَيْت الزَّيْتُون",
                "description": "Olive oil is blessed and mentioned in Islamic sources",
                "quran_reference": "Allah is the light of the heavens and earth... lit from a blessed tree, an olive (24:35)",
                "modern_benefits": [
                    "Heart health",
                    "Anti-inflammatory",
                    "Skin health",
                    "Brain function",
                    "Antioxidant properties"
                ],
                "recommended_for": ["heart_health", "skin_conditions", "inflammation", "cognitive_health"],
                "usage": "1-2 tablespoons daily in food or applied topically for skin",
                "halal_status": "Halal",
                "precautions": "Use extra virgin, cold-pressed oil for maximum benefits"
            },
            "zamzam_water": {
                "arabic_name": "مَاء زَمْزَم",
                "description": "Sacred water from the well of Zamzam in Mecca",
                "prophetic_saying": "Zamzam water is for whatever purpose it is drunk for (Ibn Majah)",
                "spiritual_benefits": [
                    "Blessed water",
                    "Spiritual healing",
                    "Fulfillment of intentions",
                    "Barakah (blessings)"
                ],
                "recommended_for": ["spiritual_healing", "general_wellness", "intention_fulfillment"],
                "usage": "Drink with intention (dua) for healing",
                "halal_status": "Halal",
                "precautions": "Ensure authenticity of source"
            }
        }
    
    def _load_general_guidance(self) -> Dict[str, List[str]]:
        """Load general Islamic health guidance"""
        return {
            "lifestyle_principles": [
                "Eat in moderation - 'The son of Adam fills no vessel worse than his stomach' (Tirmidhi)",
                "Maintain cleanliness - 'Cleanliness is half of faith' (Sahih Muslim)",
                "Exercise regularly - 'Your body has a right over you' (Sahih Bukhari)",
                "Get adequate rest - Balance between worship, work, and rest",
                "Avoid harmful substances - 'Do not harm yourselves or others' (Islamic principle)"
            ],
            "mental_health_guidance": [
                "Turn to Allah in times of distress through du'a and dhikr",
                "Maintain trust in Allah's wisdom and decree (Tawakkul)",
                "Seek beneficial knowledge and righteous companionship",
                "Practice gratitude (Shukr) for Allah's blessings",
                "Remember that trials are a test and purification"
            ],
            "family_health": [
                "Maintain family bonds and support each other",
                "Teach children healthy Islamic habits",
                "Care for elderly parents with kindness",
                "Support community members in illness",
                "Share beneficial health knowledge with others"
            ]
        }
    
    def get_healing_dua(self, category: str = None, specific_condition: str = None) -> Dict[str, Any]:
        """Get appropriate healing du'a based on category or condition"""
        try:
            # Map conditions to du'a categories
            condition_mapping = {
                "anxiety": "anxiety_relief",
                "stress": "anxiety_relief", 
                "mental_health": "anxiety_relief",
                "fever": "fever_relief",
                "acute_illness": "fever_relief",
                "pain": "pain_relief",
                "pain_management": "pain_relief",
                "chronic_condition": "general_healing",
                "protection": "morning_protection"
            }
            
            # Determine which du'a to return
            if specific_condition and specific_condition.lower() in condition_mapping:
                dua_key = condition_mapping[specific_condition.lower()]
            elif category and category in condition_mapping:
                dua_key = condition_mapping[category]
            else:
                dua_key = "general_healing"  # Default
            
            selected_dua = self.duas.get(dua_key, self.duas["general_healing"])
            
            # Add encouragement and guidance
            encouragement = self._get_healing_encouragement(category, specific_condition)
            
            return {
                "dua": selected_dua,
                "encouragement": encouragement,
                "category": category or "general",
                "additional_guidance": self._get_additional_guidance(category)
            }
            
        except Exception as e:
            logger.error(f"Error getting healing du'a: {str(e)}")
            return self._get_default_dua()
    
    def get_prophetic_remedy(self, condition: str) -> Dict[str, Any]:
        """Get relevant prophetic medicine recommendation"""
        try:
            condition_lower = condition.lower()
            
            # Map conditions to remedies
            remedy_mapping = {
                "cough": "honey",
                "sore_throat": "honey",
                "digestive": "honey",
                "immune": "black_seed",
                "inflammation": "black_seed",
                "diabetes": "black_seed",
                "fatigue": "dates",
                "energy": "dates",
                "heart": "olive_oil",
                "skin": "olive_oil",
                "spiritual": "zamzam_water"
            }
            
            # Find best matching remedy
            selected_remedy_key = None
            for condition_key, remedy_key in remedy_mapping.items():
                if condition_key in condition_lower:
                    selected_remedy_key = remedy_key
                    break
            
            if not selected_remedy_key:
                selected_remedy_key = "honey"  # Default to honey
            
            remedy = self.prophetic_remedies[selected_remedy_key]
            
            return {
                "remedy": remedy,
                "Islamic_guidance": f"Following the Sunnah of Prophet Muhammad (ﷺ) in using {remedy['arabic_name']}",
                "halal_verification": remedy["halal_status"],
                "modern_validation": "This remedy aligns with both Islamic teachings and modern nutritional science"
            }
            
        except Exception as e:
            logger.error(f"Error getting prophetic remedy: {str(e)}")
            return self._get_default_remedy()
    
    def _get_healing_encouragement(self, category: str = None, condition: str = None) -> str:
        """Generate appropriate Islamic encouragement for healing"""
        encouragements = [
            "Allah is Ash-Shafi (The Healer). Place your trust in Him while taking beneficial means.",
            "Every du'a is answered by Allah in the way that is best for you. Have hope and keep making du'a.",
            "Illness can be a means of purification and drawing closer to Allah. Seek His mercy and healing.",
            "The Prophet (ﷺ) said: 'No fatigue, illness, anxiety, sorrow, or harm befalls a Muslim - not even a thorn prick - without Allah removing some of his sins because of it.'",
            "Healing comes from Allah alone. The medicine and treatment are merely means that He has provided for us."
        ]
        
        if category == "mental_health":
            encouragements.extend([
                "Allah knows your struggles and He is always near. Turn to Him in du'a and dhikr for peace of mind.",
                "Remember: 'And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose.' (65:3)"
            ])
        
        return random.choice(encouragements)
    
    def _get_additional_guidance(self, category: str) -> List[str]:
        """Get additional Islamic health guidance based on category"""
        if category == "mental_health":
            return self.general_guidance["mental_health_guidance"]
        elif category in ["lifestyle", "general_health"]:
            return self.general_guidance["lifestyle_principles"]
        else:
            return [
                "Combine spiritual healing (du'a, dhikr) with beneficial medical treatment",
                "Maintain regular prayers and remembrance of Allah",
                "Eat halal, wholesome foods as recommended in Islam",
                "Keep good company and avoid harmful environments"
            ]
    
    def _get_default_dua(self) -> Dict[str, Any]:
        """Return default du'a when recommendation fails"""
        return {
            "dua": self.duas["general_healing"],
            "encouragement": "May Allah grant you complete healing and recovery. Trust in His wisdom and mercy.",
            "category": "general",
            "additional_guidance": ["Keep making du'a", "Maintain hope in Allah's mercy", "Seek beneficial treatment"]
        }
    
    def _get_default_remedy(self) -> Dict[str, Any]:
        """Return default remedy when recommendation fails"""
        return {
            "remedy": self.prophetic_remedies["honey"],
            "Islamic_guidance": "Honey is mentioned in the Quran as having healing properties",
            "halal_verification": "Halal",
            "modern_validation": "Honey has scientifically proven health benefits"
        }
    
    def verify_halal_compliance(self, ingredient_or_treatment: str) -> Dict[str, Any]:
        """Verify if a treatment or ingredient is halal"""
        try:
            ingredient_lower = ingredient_or_treatment.lower()
            
            # Common halal ingredients/treatments
            halal_items = [
                "honey", "black seed", "dates", "olive oil", "water", "herbs",
                "fruits", "vegetables", "nuts", "seeds", "grains", "legumes"
            ]
            
            # Common haram ingredients to avoid
            haram_items = [
                "alcohol", "wine", "beer", "pork", "gelatin", "vanilla extract"
            ]
            
            # Check for clear haram items
            for haram_item in haram_items:
                if haram_item in ingredient_lower:
                    return {
                        "status": "Haram",
                        "reason": f"Contains {haram_item} which is prohibited in Islam",
                        "alternative": "Seek halal alternatives or consult Islamic scholar",
                        "guidance": "Islam encourages seeking beneficial treatment through halal means"
                    }
            
            # Check for clear halal items
            for halal_item in halal_items:
                if halal_item in ingredient_lower:
                    return {
                        "status": "Halal",
                        "reason": f"{halal_item.title()} is permissible and beneficial",
                        "guidance": "This aligns with Islamic principles of seeking beneficial treatment"
                    }
            
            # For unclear items
            return {
                "status": "Requires Investigation",
                "reason": "Unable to determine halal status without more information",
                "guidance": "Consult with knowledgeable Islamic scholars or halal certification authorities",
                "principle": "When in doubt, it's better to avoid until clarity is obtained"
            }
            
        except Exception as e:
            logger.error(f"Error verifying halal compliance: {str(e)}")
            return {
                "status": "Error",
                "guidance": "Consult with Islamic scholars for guidance on halal compliance"
            }
    
    def get_daily_islamic_health_tip(self) -> str:
        """Get daily Islamic health wisdom"""
        tips = [
            "Start your day with Bismillah and the morning adhkar for protection and blessings",
            "Eat with your right hand and say Bismillah before eating, as taught by the Prophet (ﷺ)",
            "The Prophet (ﷺ) said: 'Eat together and mention Allah's name, and you will be blessed in your food'",
            "Maintain wudu (ablution) regularly - it's both spiritual and physical cleanliness",
            "The Prophet (ﷺ) recommended eating dates in odd numbers, especially 7 in the morning",
            "Practice moderation in eating: 'One third for food, one third for drink, one third for breath'",
            "Seek healing through both du'a and beneficial medicine - both are means Allah has provided",
            "The best drink is water - remember to say Bismillah and drink in three sips",
            "Regular movement and walking is sunnah - the Prophet (ﷺ) walked briskly",
            "End your day with evening adhkar and seek Allah's forgiveness for complete spiritual wellness"
        ]
        
        return random.choice(tips)

# Global instance
shifa_engine = ShifaEngine()

async def get_shifa_guidance(query: str, query_type: str = "general") -> Dict[str, Any]:
    """
    Get Islamic healing guidance based on user query
    
    Args:
        query: User's question or concern
        query_type: Type of medical query (from GPT router)
    
    Returns:
        Comprehensive Shifa guidance with du'as, prophetic medicine, and lifestyle advice
    """
    
    try:
        # Get comprehensive guidance
        guidance = shifa_engine.get_comprehensive_shifa_guidance(query, query_type)
        
        # Format the response
        shifa_response = f"""{get_islamic_greeting()}

**Healing Du'a for You:**

**Arabic:** {guidance['healing_dua']['dua']['arabic']}

**Transliteration:** {guidance['healing_dua']['dua']['transliteration']}

**Translation:** {guidance['healing_dua']['dua']['translation']}

**Source:** {guidance['healing_dua']['dua']['source']}

{guidance['healing_dua']['recitation_guide']}

**Prophetic Medicine Recommendation:**

**{guidance['prophetic_medicine']['medicine']['name']}**

{guidance['prophetic_medicine']['medicine']['description']}

**Benefits:**
{chr(10).join(f"• {benefit}" for benefit in guidance['prophetic_medicine']['medicine']['benefits'])}

**Usage:** {guidance['prophetic_medicine']['medicine']['usage']}

{guidance['prophetic_medicine']['disclaimer']}

**Islamic Lifestyle Guidance - {guidance['lifestyle_guidance']['focus_area']}:**

{chr(10).join(f"• {item}" for item in guidance['lifestyle_guidance']['guidance'][:3])}

**Spiritual Principle:** {guidance['lifestyle_guidance']['spiritual_principle']}

**Halal Compliance:** {guidance['halal_verification']['guidance']}

**Remember:** Islam teaches us that Allah is Ash-Shaafi (The Healer). We use the means He has provided while placing our complete trust in His wisdom and mercy. May Allah grant you complete healing and wellness - Ameen."""
        
        return {
            "shifa_response": ResponseFormatter.shifa_response(shifa_response),
            "dua_category": guidance['healing_dua']['category'],
            "prophetic_medicine": guidance['prophetic_medicine']['medicine']['name'],
            "lifestyle_focus": guidance['lifestyle_guidance']['focus_area'],
            "halal_compliant": guidance['halal_verification']['compliant'],
            "confidence": 0.9
        }
        
    except Exception as e:
        logger.error(f"Error in Shifa guidance: {str(e)}")
        
        # Fallback Shifa response
        return {
            "shifa_response": ResponseFormatter.shifa_response(
                f"{get_islamic_greeting()}\n\n"
                f"I seek Allah's forgiveness for any shortcomings in providing guidance. "
                f"Please remember that Allah is Ash-Shaafi (The Healer). "
                f"Turn to Him in du'a, seek His mercy, and use the blessed means He has provided.\n\n"
                f"Recite: 'Allahumma rabban-naasi, adhhibil-ba'sa, washfi anta ash-shaafi, "
                f"laa shifaa'a illa shifaa'uka shifaa'an laa yughaadiru saqaman'\n\n"
                f"May Allah grant you complete healing and wellness - Ameen."
            ),
            "dua_category": "general_healing",
            "confidence": 0.7
        }

if __name__ == "__main__":
    # Test Shifa functionality
    import asyncio
    
    async def test_shifa():
        test_queries = [
            "I have a headache and need Islamic healing guidance",
            "I'm feeling very anxious and stressed",
            "What Islamic foods can help with my health?"
        ]
        
        for query in test_queries:
            print(f"\nQuery: {query}")
            response = await get_shifa_guidance(query)
            print(f"Du'a category: {response['dua_category']}")
            print(f"Prophetic medicine: {response['prophetic_medicine']}")
            print("---")
    
    asyncio.run(test_shifa()) 