const express = require('express');
const router = express.Router();

// CBT exercises database
const cbtExercises = [
  {
    id: 1,
    name: "Deep Breathing Exercise",
    description: "A fundamental technique to manage anxiety and stress through controlled breathing",
    type: "breathing",
    duration: "5-10 minutes",
    steps: [
      "Find a comfortable seated position with your back straight",
      "Place one hand on your chest and one on your stomach",
      "Breathe in slowly through your nose for 4 counts",
      "Hold your breath for 4 counts",
      "Exhale slowly through your mouth for 6 counts",
      "Focus on the hand on your stomach rising and falling",
      "Repeat for 5-10 cycles"
    ],
    bestFor: ["anxiety", "stress", "panic"],
    difficulty: "beginner"
  },
  {
    id: 2,
    name: "5-4-3-2-1 Grounding Technique",
    description: "A mindfulness exercise to help you stay present and manage overwhelming emotions",
    type: "grounding",
    duration: "5-15 minutes",
    steps: [
      "Look around and name 5 things you can see",
      "Notice 4 things you can touch or feel",
      "Listen for 3 things you can hear",
      "Identify 2 things you can smell",
      "Name 1 thing you can taste",
      "Take deep breaths between each step",
      "Focus fully on each sensation"
    ],
    bestFor: ["anxiety", "panic", "overwhelm"],
    difficulty: "beginner"
  },
  {
    id: 3,
    name: "Thought Record",
    description: "Identify and challenge negative thought patterns",
    type: "cognitive",
    duration: "10-20 minutes",
    steps: [
      "Write down the situation that triggered negative thoughts",
      "Identify the emotions you're feeling (rate 1-10)",
      "Write down the automatic thoughts that came up",
      "Look for thinking errors (all-or-nothing, catastrophizing, etc.)",
      "Challenge these thoughts with evidence",
      "Create a more balanced, realistic thought",
      "Notice how your emotions change"
    ],
    bestFor: ["depression", "anxiety", "negative_thinking"],
    difficulty: "intermediate"
  },
  {
    id: 4,
    name: "Progressive Muscle Relaxation",
    description: "Systematically tense and relax muscle groups to reduce physical tension",
    type: "relaxation",
    duration: "15-20 minutes",
    steps: [
      "Lie down or sit comfortably",
      "Start with your toes - tense for 5 seconds, then relax",
      "Move to your calves - tense and relax",
      "Continue with thighs, abdomen, hands, arms, shoulders",
      "Tense your face muscles, then relax",
      "Notice the difference between tension and relaxation",
      "End with 5 deep breaths"
    ],
    bestFor: ["stress", "insomnia", "muscle_tension"],
    difficulty: "beginner"
  },
  {
    id: 5,
    name: "Behavioral Activation",
    description: "Schedule pleasant activities to improve mood and motivation",
    type: "behavioral",
    duration: "Ongoing",
    steps: [
      "List activities that used to bring you joy",
      "Rate each activity for pleasure and accomplishment (1-10)",
      "Choose 2-3 activities for this week",
      "Schedule specific times for these activities",
      "Start with small, achievable goals",
      "Track your mood before and after each activity",
      "Gradually increase frequency and duration"
    ],
    bestFor: ["depression", "low_motivation", "isolation"],
    difficulty: "intermediate"
  }
];

// Get random CBT exercise
router.get('/exercise', (req, res) => {
  try {
    const { exercise_type } = req.query;
    
    let availableExercises = cbtExercises;
    
    if (exercise_type) {
      availableExercises = cbtExercises.filter(ex => 
        ex.type === exercise_type || ex.bestFor.includes(exercise_type)
      );
    }
    
    if (availableExercises.length === 0) {
      availableExercises = cbtExercises;
    }
    
    const randomExercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
    
    res.json({
      success: true,
      data: randomExercise,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting CBT exercise:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve CBT exercise',
      timestamp: new Date().toISOString()
    });
  }
});

// Get CBT recommendation based on query
router.post('/recommendation', (req, res) => {
  try {
    const { query, mood_level = 5 } = req.body;
    
    if (!query || query.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Query must be at least 3 characters long'
      });
    }
    
    // Analyze query for keywords
    const queryLower = query.toLowerCase();
    let recommendedExercise;
    
    if (queryLower.includes('anxious') || queryLower.includes('worry') || queryLower.includes('panic')) {
      recommendedExercise = cbtExercises.find(ex => ex.bestFor.includes('anxiety')) || cbtExercises[0];
    } else if (queryLower.includes('sad') || queryLower.includes('depressed') || queryLower.includes('down')) {
      recommendedExercise = cbtExercises.find(ex => ex.bestFor.includes('depression')) || cbtExercises[4];
    } else if (queryLower.includes('stress') || queryLower.includes('overwhelm')) {
      recommendedExercise = cbtExercises.find(ex => ex.bestFor.includes('stress')) || cbtExercises[0];
    } else if (queryLower.includes('sleep') || queryLower.includes('insomnia')) {
      recommendedExercise = cbtExercises.find(ex => ex.bestFor.includes('insomnia')) || cbtExercises[3];
    } else {
      // Default based on mood level
      if (mood_level <= 3) {
        recommendedExercise = cbtExercises[4]; // Behavioral activation for low mood
      } else if (mood_level >= 7) {
        recommendedExercise = cbtExercises[0]; // Breathing for high stress/anxiety
      } else {
        recommendedExercise = cbtExercises[1]; // Grounding for moderate distress
      }
    }
    
    const response = {
      ...recommendedExercise,
      recommendation_reason: `Based on your query and mood level (${mood_level}/10), this exercise is recommended to help you feel better.`,
      mood_level: mood_level
    };
    
    res.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error getting CBT recommendation:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to provide CBT recommendation',
      timestamp: new Date().toISOString()
    });
  }
});

// Get daily CBT tip
router.get('/daily-tip', (req, res) => {
  try {
    const tips = [
      "Remember: Thoughts are not facts. Question negative thoughts before accepting them as truth.",
      "Practice gratitude daily. Write down 3 things you're grateful for each morning.",
      "Use the STOP technique: Stop, Take a breath, Observe your thoughts, Proceed mindfully.",
      "Challenge all-or-nothing thinking. Look for the middle ground in situations.",
      "Set small, achievable goals. Success builds momentum for larger changes.",
      "Practice self-compassion. Treat yourself with the same kindness you'd show a good friend.",
      "Notice your thinking patterns. Are you catastrophizing or fortune-telling?",
      "Use behavioral experiments to test your anxious predictions.",
      "Remember that feelings are temporary. This too shall pass.",
      "Focus on what you can control, and let go of what you cannot."
    ];
    
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const tipIndex = dayOfYear % tips.length;
    
    res.json({
      success: true,
      data: {
        tip: tips[tipIndex],
        date: today.toISOString().split('T')[0],
        category: "daily_wisdom"
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting daily tip:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve daily tip',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 