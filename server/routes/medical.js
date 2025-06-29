const express = require('express');
const OpenAI = require('openai');
const router = express.Router();

// Initialize OpenAI client
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Medical knowledge base (simplified)
const medicalFAQs = [
  {
    id: 1,
    question: "What are the symptoms of diabetes?",
    answer: "Common symptoms include increased thirst, frequent urination, unexplained weight loss, fatigue, and blurred vision.",
    category: "diabetes",
    keywords: ["diabetes", "symptoms", "blood sugar"]
  },
  {
    id: 2,
    question: "How can I prevent heart disease?",
    answer: "Maintain a healthy diet, exercise regularly, avoid smoking, limit alcohol, and manage stress.",
    category: "cardiology",
    keywords: ["heart", "prevention", "cardiovascular"]
  },
  {
    id: 3,
    question: "What is high blood pressure?",
    answer: "High blood pressure (hypertension) is when blood pressure readings are consistently 140/90 mmHg or higher.",
    category: "cardiology",
    keywords: ["blood pressure", "hypertension", "heart"]
  }
];

// Main medical query endpoint
router.post('/ask', async (req, res) => {
  try {
    const { question, include_cbt = false, include_shifa = false } = req.body;

    if (!question || question.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: 'Question must be at least 5 characters long'
      });
    }

    console.log(`Processing medical query: ${question.substring(0, 50)}...`);

    let medicalResponse = {
      response: "I apologize, but I'm currently unable to process your question. Please consult with a healthcare professional for medical advice.",
      category: "general",
      keywords: [],
      confidence: "low"
    };

    // Try to get AI response if OpenAI is configured
    if (openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: process.env.OPENAI_MODEL || "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a helpful medical AI assistant. Provide accurate, empathetic medical information while always recommending users consult healthcare professionals for serious concerns. Be supportive and encouraging. Keep responses concise but informative.`
            },
            {
              role: "user",
              content: question
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        });

        medicalResponse = {
          response: completion.choices[0].message.content,
          category: categorizeQuestion(question),
          keywords: extractKeywords(question),
          confidence: "high"
        };
      } catch (aiError) {
        console.error('OpenAI API error:', aiError.message);
        // Fallback to knowledge base search
        const kbResult = searchKnowledgeBase(question);
        if (kbResult) {
          medicalResponse = {
            response: kbResult.answer,
            category: kbResult.category,
            keywords: kbResult.keywords,
            confidence: "medium"
          };
        }
      }
    } else {
      // Search knowledge base as fallback
      const kbResult = searchKnowledgeBase(question);
      if (kbResult) {
        medicalResponse = {
          response: kbResult.answer,
          category: kbResult.category,
          keywords: kbResult.keywords,
          confidence: "medium"
        };
      }
    }

    const responseData = {
      medical_response: medicalResponse,
      query: question,
      timestamp: new Date().toISOString()
    };

    // Add CBT recommendation if requested
    if (include_cbt) {
      responseData.cbt_recommendation = {
        name: "Breathing Exercise",
        description: "A simple breathing technique to help manage stress and anxiety",
        steps: [
          "Sit comfortably with your back straight",
          "Breathe in slowly through your nose for 4 counts",
          "Hold your breath for 4 counts",
          "Exhale slowly through your mouth for 6 counts",
          "Repeat 5-10 times"
        ],
        duration: "5-10 minutes"
      };
    }

    // Add Shifa guidance if requested
    if (include_shifa) {
      responseData.shifa_guidance = {
        dua: {
          arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ البَاسَ، اشْفِهِ وَأَنتَ الشَّافِي",
          transliteration: "Allahumma Rabb an-naas, adhhib al-ba's, washfihi wa anta ash-shaafi",
          translation: "O Allah, Lord of mankind, remove the disease and heal, for You are the Healer"
        },
        source: "Sahih Bukhari"
      };
    }

    res.json({
      success: true,
      data: responseData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing medical query:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to process your health question. Please try again later.',
      timestamp: new Date().toISOString()
    });
  }
});

// Helper functions
function categorizeQuestion(question) {
  const q = question.toLowerCase();
  if (q.includes('diabetes') || q.includes('blood sugar')) return 'diabetes';
  if (q.includes('heart') || q.includes('blood pressure')) return 'cardiology';
  if (q.includes('mental') || q.includes('anxiety') || q.includes('depression')) return 'mental_health';
  return 'general';
}

function extractKeywords(question) {
  const commonWords = ['what', 'how', 'when', 'where', 'why', 'is', 'are', 'can', 'do', 'does', 'the', 'a', 'an'];
  return question.toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 3 && !commonWords.includes(word))
    .slice(0, 5);
}

function searchKnowledgeBase(question) {
  const q = question.toLowerCase();
  return medicalFAQs.find(faq => 
    faq.keywords.some(keyword => q.includes(keyword.toLowerCase())) ||
    q.includes(faq.question.toLowerCase())
  );
}

module.exports = router; 