"""
CBT (Cognitive Behavioral Therapy) Module for ShifaAI
Provides therapeutic exercises and mental health support
"""
import random
from typing import Dict, List, Optional, Any
import logging
from datetime import datetime
from enum import Enum

from .utils import logger, sanitize_text, ResponseFormatter

logger = logging.getLogger(__name__)

class CBTExerciseType(Enum):
    """Types of CBT exercises"""
    BREATHING = "breathing"
    GROUNDING = "grounding"
    THOUGHT_RECORD = "thought_record"
    BEHAVIORAL_ACTIVATION = "behavioral_activation"
    MINDFULNESS = "mindfulness"
    PROGRESSIVE_RELAXATION = "progressive_relaxation"
    COGNITIVE_RESTRUCTURING = "cognitive_restructuring"

class MoodLevel(Enum):
    """Mood levels for assessment"""
    VERY_LOW = 1
    LOW = 2
    NEUTRAL = 3
    GOOD = 4
    EXCELLENT = 5

class CognitiveDistortion(Enum):
    ALL_OR_NOTHING = "all_or_nothing"
    OVERGENERALIZATION = "overgeneralization"
    MENTAL_FILTER = "mental_filter"
    CATASTROPHIZING = "catastrophizing"
    MIND_READING = "mind_reading"
    FORTUNE_TELLING = "fortune_telling"
    EMOTIONAL_REASONING = "emotional_reasoning"
    SHOULD_STATEMENTS = "should_statements"
    LABELING = "labeling"
    PERSONALIZATION = "personalization"

class CBTEngine:
    """Cognitive Behavioral Therapy exercise and coaching module"""
    
    def __init__(self):
        self.exercises = self._load_cbt_exercises()
        self.cognitive_distortions = self._load_cognitive_distortions()
        
    def _load_cbt_exercises(self) -> Dict[str, Dict[str, Any]]:
        """Load CBT exercises database"""
        return {
            "breathing": {
                "name": "4-7-8 Breathing Technique",
                "description": "A calming breathing exercise to reduce anxiety and stress",
                "steps": [
                    "Sit or lie down in a comfortable position",
                    "Place one hand on your chest, one on your belly",
                    "Breathe in through your nose for 4 counts",
                    "Hold your breath for 7 counts", 
                    "Exhale slowly through your mouth for 8 counts",
                    "Repeat this cycle 3-4 times"
                ],
                "duration": "3-5 minutes",
                "best_for": ["anxiety", "stress", "sleep", "panic"]
            },
            "grounding": {
                "name": "5-4-3-2-1 Grounding Technique",
                "description": "A mindfulness exercise to anchor yourself in the present moment",
                "steps": [
                    "Notice 5 things you can see around you",
                    "Notice 4 things you can touch or feel",
                    "Notice 3 things you can hear",
                    "Notice 2 things you can smell",
                    "Notice 1 thing you can taste"
                ],
                "duration": "2-3 minutes",
                "best_for": ["anxiety", "panic", "dissociation", "overwhelm"]
            },
            "thought_record": {
                "name": "Simple Thought Record",
                "description": "Examine and challenge negative thought patterns",
                "steps": [
                    "Identify the situation that triggered your distress",
                    "Write down your automatic thoughts",
                    "Rate your emotion intensity (1-10)",
                    "Identify any thinking errors or distortions",
                    "Generate a more balanced, realistic thought",
                    "Re-rate your emotion intensity"
                ],
                "duration": "10-15 minutes",
                "best_for": ["depression", "anxiety", "negative_thinking", "worry"]
            },
            "progressive_relaxation": {
                "name": "Progressive Muscle Relaxation",
                "description": "Systematically tense and relax muscle groups to reduce physical tension",
                "steps": [
                    "Find a quiet, comfortable place to sit or lie down",
                    "Start with your toes - tense for 5 seconds, then relax",
                    "Move up to your calves - tense and relax",
                    "Continue with thighs, buttocks, abdomen, hands, arms, shoulders",
                    "Finish with facial muscles and scalp",
                    "Notice the difference between tension and relaxation"
                ],
                "duration": "15-20 minutes",
                "best_for": ["stress", "muscle_tension", "sleep", "anxiety"]
            },
            "behavioral_activation": {
                "name": "Pleasant Activity Scheduling",
                "description": "Plan enjoyable activities to improve mood and motivation",
                "steps": [
                    "List activities you used to enjoy or think you might enjoy",
                    "Rate each activity for pleasure (1-10) and mastery (1-10)",
                    "Choose 1-2 activities for this week",
                    "Schedule specific times for these activities",
                    "After completing, rate your actual pleasure and sense of achievement",
                    "Plan the next week based on what worked"
                ],
                "duration": "20-30 minutes planning",
                "best_for": ["depression", "low_motivation", "isolation", "anhedonia"]
            }
        }
    
    def _load_cognitive_distortions(self) -> Dict[str, str]:
        """Load cognitive distortions reference"""
        return {
            "all_or_nothing": "Seeing things in black and white, with no middle ground",
            "overgeneralization": "Drawing broad conclusions from single events",
            "mental_filter": "Focusing only on negative details while ignoring positives",
            "disqualifying_positive": "Dismissing positive experiences as 'not counting'",
            "jumping_to_conclusions": "Making negative assumptions without evidence",
            "magnification": "Exaggerating the importance of problems or minimizing positives",
            "emotional_reasoning": "Believing that negative emotions reflect reality",
            "should_statements": "Using 'should', 'must', or 'have to' statements that create pressure",
            "labeling": "Putting negative labels on yourself or others",
            "personalization": "Blaming yourself for things outside your control"
        }
    
    def recommend_exercise(self, symptoms: List[str], mood_rating: int = None) -> Dict[str, Any]:
        """Recommend CBT exercise based on symptoms and mood"""
        try:
            # Convert symptoms to lowercase for matching
            symptoms_lower = [s.lower() for s in symptoms]
            
            # Score exercises based on symptom match
            exercise_scores = {}
            for exercise_id, exercise in self.exercises.items():
                score = 0
                for symptom in symptoms_lower:
                    if symptom in exercise["best_for"]:
                        score += 2
                    # Partial matches
                    for condition in exercise["best_for"]:
                        if symptom in condition or condition in symptom:
                            score += 1
                exercise_scores[exercise_id] = score
            
            # Get best matching exercise
            if exercise_scores:
                best_exercise_id = max(exercise_scores, key=exercise_scores.get)
                recommended_exercise = self.exercises[best_exercise_id].copy()
                recommended_exercise["id"] = best_exercise_id
                recommended_exercise["match_score"] = exercise_scores[best_exercise_id]
            else:
                # Default to breathing exercise
                recommended_exercise = self.exercises["breathing"].copy()
                recommended_exercise["id"] = "breathing"
                recommended_exercise["match_score"] = 1
            
            # Add personalized encouragement
            recommended_exercise["encouragement"] = self._get_encouragement(symptoms_lower, mood_rating)
            
            return recommended_exercise
            
        except Exception as e:
            logger.error(f"Error recommending CBT exercise: {str(e)}")
            return self._get_default_exercise()
    
    def _get_encouragement(self, symptoms: List[str], mood_rating: int = None) -> str:
        """Generate personalized encouragement message"""
        encouragements = [
            "Remember, healing is a journey, and every small step counts. You're taking care of yourself by trying this exercise.",
            "It's natural to feel this way, and you're not alone. This exercise can help you feel more grounded and peaceful.",
            "Your willingness to try coping strategies shows real strength. Be patient and gentle with yourself.",
            "Small actions can lead to big changes in how you feel. You're doing something positive for your wellbeing.",
            "Every time you practice these techniques, you're building resilience. Trust in your ability to heal and grow."
        ]
        
        if mood_rating and mood_rating <= 3:
            encouragements.extend([
                "I know things feel difficult right now. This exercise can help provide some relief and comfort.",
                "When we're struggling, even small steps toward feeling better are meaningful victories."
            ])
        
        return random.choice(encouragements)
    
    def _get_default_exercise(self) -> Dict[str, Any]:
        """Return default exercise when recommendation fails"""
        exercise = self.exercises["breathing"].copy()
        exercise["id"] = "breathing"
        exercise["encouragement"] = "Take a moment to breathe and center yourself. You deserve care and compassion."
        return exercise
    
    def get_daily_cbt_tip(self) -> str:
        """Get a daily CBT tip or insight"""
        tips = [
            "Notice your thoughts without judgment. Observe them like clouds passing in the sky.",
            "Challenge negative thoughts by asking: 'Is this thought helpful? Is it completely true?'",
            "Practice gratitude by naming three things you're thankful for today.",
            "Remember: feelings are temporary visitors, not permanent residents.",
            "Your thoughts don't define you. You have the power to choose which ones to believe.",
            "Small consistent actions create lasting change. What's one tiny step you can take today?",
            "Self-compassion is not self-indulgence. Treat yourself with the kindness you'd show a good friend.",
            "Progress isn't always linear. Setbacks are part of the healing journey.",
            "You can't control what happens to you, but you can control how you respond.",
            "Every time you use a coping skill, you're strengthening your emotional resilience."
        ]
        
        return random.choice(tips)
    
    def identify_cognitive_distortion(self, thought: str) -> List[Dict[str, str]]:
        """Identify potential cognitive distortions in a thought"""
        thought_lower = thought.lower()
        identified_distortions = []
        
        # Pattern matching for common distortions
        distortion_patterns = {
            "all_or_nothing": ["always", "never", "completely", "totally", "everything", "nothing"],
            "overgeneralization": ["everyone", "no one", "all the time", "every time"],
            "mental_filter": ["only", "just", "nothing but"],
            "jumping_to_conclusions": ["probably", "must be", "certainly", "obviously"],
            "should_statements": ["should", "must", "have to", "need to", "supposed to"],
            "emotional_reasoning": ["feel like", "feels", "seems like"],
            "labeling": ["i am", "they are", "he is", "she is"] + ["stupid", "failure", "loser", "terrible"],
            "magnification": ["huge", "enormous", "disaster", "catastrophe", "awful", "terrible"]
        }
        
        for distortion, patterns in distortion_patterns.items():
            for pattern in patterns:
                if pattern in thought_lower:
                    identified_distortions.append({
                        "type": distortion,
                        "description": self.cognitive_distortions[distortion],
                        "pattern_found": pattern
                    })
                    break  # Only add each distortion type once
        
        return identified_distortions
    
    def generate_balanced_thought(self, original_thought: str, distortions: List[Dict[str, str]]) -> str:
        """Generate a more balanced version of a negative thought"""
        if not distortions:
            return "Try looking at this situation from different perspectives. What would you tell a friend in this situation?"
        
        balanced_suggestions = {
            "all_or_nothing": "What's a more nuanced way to view this? Are there any exceptions or middle ground?",
            "overgeneralization": "Is this always true, or are there times when it's different?",
            "mental_filter": "What positives or neutrals am I overlooking in this situation?",
            "jumping_to_conclusions": "What evidence do I have for this? What other explanations are possible?",
            "should_statements": "What would be more realistic or compassionate expectations?",
            "emotional_reasoning": "What would I think about this if I were feeling differently?",
            "labeling": "What specific behaviors or situations am I dealing with, rather than labels?",
            "magnification": "How might this look in a week, month, or year? What's the realistic impact?"
        }
        
        # Get suggestion for the first identified distortion
        primary_distortion = distortions[0]["type"]
        return balanced_suggestions.get(primary_distortion, 
            "Try to find a more balanced perspective. What evidence supports and contradicts this thought?")

# Global instance
cbt_engine = CBTEngine()

def main():
    """Test the CBT engine"""
    cbt = CBTEngine()
    
    # Test exercise recommendation
    exercise = cbt.recommend_exercise(["anxiety", "stress"], mood_rating=3)
    print(f"Recommended exercise: {exercise['name']}")
    print(f"Description: {exercise['description']}")
    
    # Test CBT response generation
    response = cbt.generate_balanced_thought("I'm a complete failure", cbt.identify_cognitive_distortion("I'm a complete failure"))
    print(f"\nBalanced Thought: {response}")
    
    # Test daily tip
    tip = cbt.get_daily_cbt_tip()
    print(f"\nDaily CBT Tip: {tip}")

if __name__ == "__main__":
    main() 