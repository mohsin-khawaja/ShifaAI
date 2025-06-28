#!/usr/bin/env python3
"""
ShifaAI CLI Demo - Interactive command-line interface for testing all functionality
"""

import asyncio
import os
import sys
from datetime import datetime
from typing import Dict, Any

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.gpt_router import gpt_router
from backend.cbt import cbt_engine
from backend.shifa import shifa_engine
from backend.scraper import medical_scraper
from backend.utils import logger, Config

class ShifaAICLI:
    """Interactive CLI for ShifaAI demonstration"""
    
    def __init__(self):
        self.session_history = []
        self.user_context = {"mood_rating": None, "previous_responses": []}
    
    def display_banner(self):
        """Display welcome banner"""
        print("\n" + "="*70)
        print("🌟 WELCOME TO SHIFA AI - YOUR AI HEALTH COMPANION 🌟")
        print("="*70)
        print("✅ Medical Q&A with GPT-4")
        print("🧠 CBT Coaching & Exercises") 
        print("🕌 Islamic Healing (Du'as & Prophetic Medicine)")
        print("📚 Medical Knowledge Base")
        print("="*70 + "\n")
    
    def display_menu(self):
        """Display main menu options"""
        print("\n📋 MAIN MENU - Choose an option:")
        print("1. 🩺 Ask Medical Question (with AI response)")
        print("2. 🧠 Get CBT Exercise Recommendation")
        print("3. 🕌 Get Healing Du'a")
        print("4. 🌿 Check Prophetic Medicine")
        print("5. ✅ Verify Halal Compliance")
        print("6. 📚 Browse Medical Knowledge Base")
        print("7. 💡 Get Daily Tips")
        print("8. 📊 View Session Summary")
        print("9. 🚪 Exit")
        print("-" * 50)
    
    async def handle_medical_question(self):
        """Handle medical question with full AI response"""
        print("\n🩺 MEDICAL Q&A SESSION")
        print("-" * 30)
        
        question = input("💬 Enter your health question: ").strip()
        if not question:
            print("❌ Please enter a valid question.")
            return
        
        include_cbt = input("🧠 Include CBT coaching? (y/n): ").lower().startswith('y')
        include_shifa = input("🕌 Include Islamic healing? (y/n): ").lower().startswith('y')
        
        print("\n🔄 Processing your question...")
        
        try:
            # Get medical response
            medical_response = await gpt_router.generate_medical_response(question, self.user_context)
            
            print(f"\n🩺 MEDICAL RESPONSE:")
            print("-" * 40)
            print(f"📝 {medical_response['response']}")
            print(f"\n📂 Category: {medical_response['category']}")
            print(f"🔍 Keywords: {', '.join(medical_response['keywords'])}")
            print(f"🎯 Confidence: {medical_response['confidence']}")
            
            if medical_response['follow_up_questions']:
                print(f"\n❓ Follow-up Questions:")
                for i, q in enumerate(medical_response['follow_up_questions'], 1):
                    print(f"   {i}. {q}")
            
            # Add CBT if requested
            if include_cbt:
                print(f"\n🧠 CBT COACHING:")
                print("-" * 25)
                exercise = cbt_engine.recommend_exercise(medical_response['keywords'])
                print(f"📋 Exercise: {exercise['name']}")
                print(f"📖 Description: {exercise['description']}")
                print(f"⏱️  Duration: {exercise['duration']}")
                print(f"💪 Best for: {', '.join(exercise['best_for'])}")
                
                if exercise.get('encouragement'):
                    print(f"💙 Encouragement: {exercise['encouragement']}")
                
                print(f"\n📝 Steps:")
                for i, step in enumerate(exercise['steps'], 1):
                    print(f"   {i}. {step}")
            
            # Add Shifa if requested
            if include_shifa:
                print(f"\n🕌 ISLAMIC HEALING (SHIFA):")
                print("-" * 35)
                dua_response = shifa_engine.get_healing_dua(
                    category=medical_response['category'],
                    specific_condition=question
                )
                
                dua = dua_response['dua']
                print(f"🤲 Du'a: {dua['arabic']}")
                print(f"🔤 Transliteration: {dua['transliteration']}")
                print(f"🌍 Translation: {dua['translation']}")
                print(f"📚 Source: {dua['source']}")
                print(f"📝 Recitation Notes: {dua['recitation_notes']}")
                print(f"💙 Encouragement: {dua_response['encouragement']}")
            
            # Store in session history
            self.session_history.append({
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "type": "medical_question",
                "question": question,
                "category": medical_response['category'],
                "included_cbt": include_cbt,
                "included_shifa": include_shifa
            })
            
            self.user_context["previous_responses"].append(medical_response['response'][:200])
            
        except Exception as e:
            print(f"❌ Error: {str(e)}")
            print("Please ensure your OpenAI API key is configured and try again.")
    
    def handle_cbt_exercise(self):
        """Handle CBT exercise recommendation"""
        print("\n🧠 CBT EXERCISE RECOMMENDATION")
        print("-" * 35)
        
        symptoms_input = input("📝 Enter your symptoms/concerns (comma-separated): ").strip()
        if not symptoms_input:
            symptoms = ["stress"]  # Default
        else:
            symptoms = [s.strip() for s in symptoms_input.split(",")]
        
        mood_input = input("📊 Rate your mood (1-10, optional): ").strip()
        mood_rating = None
        if mood_input.isdigit():
            mood_rating = max(1, min(10, int(mood_input)))
        
        try:
            exercise = cbt_engine.recommend_exercise(symptoms, mood_rating)
            
            print(f"\n📋 RECOMMENDED EXERCISE:")
            print("-" * 30)
            print(f"🎯 Exercise: {exercise['name']}")
            print(f"📖 Description: {exercise['description']}")
            print(f"⏱️  Duration: {exercise['duration']}")
            print(f"💪 Best for: {', '.join(exercise['best_for'])}")
            
            if exercise.get('encouragement'):
                print(f"\n💙 Encouragement:")
                print(f"   {exercise['encouragement']}")
            
            print(f"\n📝 Steps to follow:")
            for i, step in enumerate(exercise['steps'], 1):
                print(f"   {i}. {step}")
            
            # Get daily tip
            daily_tip = cbt_engine.get_daily_cbt_tip()
            print(f"\n💡 Daily CBT Tip:")
            print(f"   {daily_tip}")
            
            self.session_history.append({
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "type": "cbt_exercise", 
                "symptoms": symptoms,
                "exercise": exercise['name']
            })
            
        except Exception as e:
            print(f"❌ Error getting CBT exercise: {str(e)}")
    
    def handle_healing_dua(self):
        """Handle healing du'a request"""
        print("\n🕌 HEALING DU'A")
        print("-" * 20)
        
        print("📂 Available categories:")
        print("   1. General healing")
        print("   2. Mental health/anxiety")
        print("   3. Pain relief")
        print("   4. Fever/illness")
        print("   5. Protection")
        
        category_input = input("\n📝 Select category (1-5) or enter specific condition: ").strip()
        
        category_map = {
            "1": "general",
            "2": "mental_health", 
            "3": "pain_management",
            "4": "acute_illness",
            "5": "protection"
        }
        
        if category_input in category_map:
            category = category_map[category_input]
            condition = None
        else:
            category = None
            condition = category_input if category_input else "general healing"
        
        try:
            dua_response = shifa_engine.get_healing_dua(category=category, specific_condition=condition)
            dua = dua_response['dua']
            
            print(f"\n🤲 HEALING DU'A:")
            print("-" * 25)
            print(f"🌟 Arabic: {dua['arabic']}")
            print(f"\n🔤 Transliteration:")
            print(f"   {dua['transliteration']}")
            print(f"\n🌍 Translation:")
            print(f"   {dua['translation']}")
            print(f"\n📚 Source: {dua['source']}")
            print(f"📝 How to recite: {dua['recitation_notes']}")
            
            print(f"\n💙 Encouragement:")
            print(f"   {dua_response['encouragement']}")
            
            if dua_response.get('additional_guidance'):
                print(f"\n📋 Additional Guidance:")
                for guidance in dua_response['additional_guidance'][:3]:
                    print(f"   • {guidance}")
            
            self.session_history.append({
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "type": "healing_dua",
                "category": category or "custom",
                "condition": condition
            })
            
        except Exception as e:
            print(f"❌ Error getting healing du'a: {str(e)}")
    
    def handle_prophetic_medicine(self):
        """Handle prophetic medicine inquiry"""
        print("\n🌿 PROPHETIC MEDICINE")
        print("-" * 25)
        
        condition = input("📝 Enter your condition or health concern: ").strip()
        if not condition:
            print("❌ Please enter a valid condition.")
            return
        
        try:
            remedy = shifa_engine.get_prophetic_remedy(condition)
            remedy_info = remedy['remedy']
            
            print(f"\n🌿 RECOMMENDED REMEDY:")
            print("-" * 30)
            print(f"🎯 Remedy: {remedy_info.get('arabic_name', 'Natural Remedy')}")
            print(f"📖 Description: {remedy_info['description']}")
            
            if 'prophetic_saying' in remedy_info:
                print(f"\n📜 Prophetic Saying:")
                print(f"   {remedy_info['prophetic_saying']}")
            
            if 'quran_reference' in remedy_info:
                print(f"\n📖 Quranic Reference:")
                print(f"   {remedy_info['quran_reference']}")
            
            print(f"\n💊 Usage: {remedy_info['usage']}")
            print(f"✅ Halal Status: {remedy_info['halal_status']}")
            
            print(f"\n🔬 Modern Benefits:")
            for benefit in remedy_info['modern_benefits']:
                print(f"   • {benefit}")
            
            if remedy_info.get('precautions'):
                print(f"\n⚠️  Precautions: {remedy_info['precautions']}")
            
            print(f"\n💡 Islamic Guidance:")
            print(f"   {remedy['Islamic_guidance']}")
            
            self.session_history.append({
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "type": "prophetic_medicine",
                "condition": condition,
                "remedy": remedy_info.get('arabic_name', 'Natural Remedy')
            })
            
        except Exception as e:
            print(f"❌ Error getting prophetic medicine: {str(e)}")
    
    def handle_halal_verification(self):
        """Handle halal compliance verification"""
        print("\n✅ HALAL COMPLIANCE VERIFICATION")
        print("-" * 40)
        
        ingredient = input("📝 Enter ingredient/treatment to verify: ").strip()
        if not ingredient:
            print("❌ Please enter a valid ingredient or treatment.")
            return
        
        try:
            verification = shifa_engine.verify_halal_compliance(ingredient)
            
            print(f"\n✅ HALAL VERIFICATION RESULT:")
            print("-" * 35)
            print(f"🏷️  Item: {ingredient}")
            print(f"📋 Status: {verification['status']}")
            print(f"💬 Reason: {verification['reason']}")
            
            if 'alternative' in verification:
                print(f"🔄 Alternative: {verification['alternative']}")
            
            print(f"\n📚 Islamic Guidance:")
            print(f"   {verification['guidance']}")
            
            if 'principle' in verification:
                print(f"\n⚖️  Islamic Principle:")
                print(f"   {verification['principle']}")
            
            self.session_history.append({
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "type": "halal_verification",
                "ingredient": ingredient,
                "status": verification['status']
            })
            
        except Exception as e:
            print(f"❌ Error verifying halal compliance: {str(e)}")
    
    def handle_medical_knowledge(self):
        """Browse medical knowledge base"""
        print("\n📚 MEDICAL KNOWLEDGE BASE")
        print("-" * 30)
        
        try:
            content = medical_scraper.scrape_all_sources()
            processed_content = medical_scraper.preprocess_content(content)
            
            search_query = input("🔍 Enter search term (optional): ").strip()
            
            if search_query:
                # Filter content based on search
                filtered_content = [
                    item for item in processed_content
                    if search_query.lower() in item['question'].lower() or 
                       search_query.lower() in item['answer'].lower()
                ]
                content_to_show = filtered_content[:5]
                print(f"\n🔍 Found {len(filtered_content)} results for '{search_query}':")
            else:
                content_to_show = processed_content[:5]
                print(f"\n📚 Showing first 5 of {len(processed_content)} available FAQs:")
            
            for i, item in enumerate(content_to_show, 1):
                print(f"\n{i}. ❓ Question: {item['question']}")
                print(f"   ✅ Answer: {item['answer'][:200]}...")
                print(f"   📚 Source: {item['source']}")
                print(f"   📂 Category: {item['category']}")
                print("-" * 50)
            
            if not content_to_show:
                print("❌ No results found.")
            
            self.session_history.append({
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "type": "knowledge_browse",
                "search_query": search_query,
                "results_found": len(content_to_show)
            })
            
        except Exception as e:
            print(f"❌ Error browsing medical knowledge: {str(e)}")
    
    def handle_daily_tips(self):
        """Show daily tips from all modules"""
        print("\n💡 DAILY HEALTH & WELLNESS TIPS")
        print("-" * 40)
        
        try:
            # CBT tip
            cbt_tip = cbt_engine.get_daily_cbt_tip()
            print(f"🧠 CBT Wisdom:")
            print(f"   {cbt_tip}")
            
            # Islamic health tip
            islamic_tip = shifa_engine.get_daily_islamic_health_tip()
            print(f"\n🕌 Islamic Health Wisdom:")
            print(f"   {islamic_tip}")
            
            # General health reminder
            general_tips = [
                "Stay hydrated - drink at least 8 glasses of water daily",
                "Take breaks from screen time every 20 minutes", 
                "Practice gratitude by noting 3 things you're thankful for",
                "Get at least 7-8 hours of quality sleep each night",
                "Take a 10-minute walk after meals to aid digestion"
            ]
            
            import random
            general_tip = random.choice(general_tips)
            print(f"\n💊 General Health Tip:")
            print(f"   {general_tip}")
            
            self.session_history.append({
                "timestamp": datetime.now().strftime("%H:%M:%S"),
                "type": "daily_tips"
            })
            
        except Exception as e:
            print(f"❌ Error getting daily tips: {str(e)}")
    
    def display_session_summary(self):
        """Display session summary"""
        print("\n📊 SESSION SUMMARY")
        print("-" * 25)
        
        if not self.session_history:
            print("🤷 No activities in this session yet.")
            return
        
        activity_counts = {}
        for activity in self.session_history:
            activity_type = activity['type']
            activity_counts[activity_type] = activity_counts.get(activity_type, 0) + 1
        
        print(f"📈 Total Activities: {len(self.session_history)}")
        print(f"📅 Session Start: {self.session_history[0]['timestamp']}")
        print(f"🕐 Current Time: {datetime.now().strftime('%H:%M:%S')}")
        
        print(f"\n📋 Activity Breakdown:")
        activity_names = {
            "medical_question": "🩺 Medical Questions",
            "cbt_exercise": "🧠 CBT Exercises", 
            "healing_dua": "🕌 Healing Du'as",
            "prophetic_medicine": "🌿 Prophetic Medicine",
            "halal_verification": "✅ Halal Verifications",
            "knowledge_browse": "📚 Knowledge Browsing",
            "daily_tips": "💡 Daily Tips"
        }
        
        for activity_type, count in activity_counts.items():
            activity_name = activity_names.get(activity_type, activity_type)
            print(f"   {activity_name}: {count}")
        
        # Show recent activities
        print(f"\n🕐 Recent Activities:")
        for activity in self.session_history[-3:]:
            timestamp = activity['timestamp']
            activity_type = activity['type']
            activity_name = activity_names.get(activity_type, activity_type)
            print(f"   {timestamp} - {activity_name}")
    
    async def run(self):
        """Main CLI loop"""
        self.display_banner()
        
        # Check configuration
        if not Config.OPENAI_API_KEY:
            print("⚠️  WARNING: OpenAI API key not configured.")
            print("   Some features (medical Q&A) will be limited.")
            print("   Please set OPENAI_API_KEY environment variable.\n")
        
        while True:
            try:
                self.display_menu()
                choice = input("👉 Enter your choice (1-9): ").strip()
                
                if choice == "1":
                    await self.handle_medical_question()
                elif choice == "2":
                    self.handle_cbt_exercise()
                elif choice == "3":
                    self.handle_healing_dua()
                elif choice == "4":
                    self.handle_prophetic_medicine()
                elif choice == "5":
                    self.handle_halal_verification()
                elif choice == "6":
                    self.handle_medical_knowledge()
                elif choice == "7":
                    self.handle_daily_tips()
                elif choice == "8":
                    self.display_session_summary()
                elif choice == "9":
                    print("\n🌟 Thank you for using ShifaAI!")
                    print("💙 May Allah grant you good health and healing.")
                    print("👋 Goodbye!\n")
                    break
                else:
                    print("❌ Invalid choice. Please enter a number between 1-9.")
                
                input("\n⏸️  Press Enter to continue...")
                
            except KeyboardInterrupt:
                print("\n\n👋 Goodbye! May Allah grant you good health.")
                break
            except Exception as e:
                print(f"\n❌ Error: {str(e)}")
                input("⏸️  Press Enter to continue...")

def main():
    """Main entry point"""
    cli = ShifaAICLI()
    asyncio.run(cli.run())

if __name__ == "__main__":
    main() 