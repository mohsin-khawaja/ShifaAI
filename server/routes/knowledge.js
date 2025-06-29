const express = require('express');
const router = express.Router();

// Medical knowledge base
const medicalKnowledgeBase = [
  {
    id: 1,
    question: "What are the symptoms of diabetes?",
    answer: "Common symptoms of diabetes include: increased thirst and frequent urination, unexplained weight loss, fatigue and weakness, blurred vision, slow-healing cuts and bruises, frequent infections, and tingling or numbness in hands and feet. If you experience these symptoms, consult a healthcare professional for proper testing and diagnosis.",
    category: "diabetes",
    keywords: ["diabetes", "symptoms", "blood sugar", "thirst", "urination", "weight loss"],
    source: "Mayo Clinic",
    last_updated: "2024-01-01"
  },
  {
    id: 2,
    question: "How can I prevent heart disease?",
    answer: "Heart disease prevention includes: maintaining a healthy diet rich in fruits, vegetables, and whole grains; exercising regularly (at least 150 minutes of moderate activity per week); avoiding smoking and limiting alcohol consumption; managing stress through relaxation techniques; maintaining a healthy weight; controlling blood pressure and cholesterol levels; and getting regular health checkups.",
    category: "cardiology",
    keywords: ["heart disease", "prevention", "diet", "exercise", "smoking", "cholesterol"],
    source: "American Heart Association",
    last_updated: "2024-01-01"
  },
  {
    id: 3,
    question: "What is high blood pressure and how is it treated?",
    answer: "High blood pressure (hypertension) occurs when blood pressure readings are consistently 140/90 mmHg or higher. Treatment includes lifestyle changes (healthy diet, regular exercise, weight management, stress reduction) and medications if needed. The DASH diet, reducing sodium intake, and regular monitoring are important management strategies.",
    category: "cardiology",
    keywords: ["blood pressure", "hypertension", "treatment", "DASH diet", "medication"],
    source: "WebMD",
    last_updated: "2024-01-01"
  },
  {
    id: 4,
    question: "What are the signs of depression?",
    answer: "Signs of depression include: persistent sadness or empty mood, loss of interest in activities, significant weight changes, sleep disturbances, fatigue, feelings of worthlessness or guilt, difficulty concentrating, and thoughts of death or suicide. Depression is treatable - seek professional help if you experience these symptoms for more than two weeks.",
    category: "mental_health",
    keywords: ["depression", "sadness", "mood", "sleep", "fatigue", "mental health"],
    source: "National Institute of Mental Health",
    last_updated: "2024-01-01"
  },
  {
    id: 5,
    question: "How can I manage anxiety naturally?",
    answer: "Natural anxiety management techniques include: deep breathing exercises, regular physical activity, meditation and mindfulness, adequate sleep, limiting caffeine and alcohol, maintaining social connections, practicing progressive muscle relaxation, and engaging in hobbies. While these can be helpful, severe anxiety may require professional treatment.",
    category: "mental_health",
    keywords: ["anxiety", "natural", "breathing", "meditation", "exercise", "stress"],
    source: "Healthline",
    last_updated: "2024-01-01"
  },
  {
    id: 6,
    question: "What foods boost immune system?",
    answer: "Immune-boosting foods include: citrus fruits (vitamin C), garlic and ginger (antimicrobial properties), yogurt and kefir (probiotics), leafy greens (vitamins A, C, E), nuts and seeds (vitamin E, zinc), fatty fish (omega-3s), and colorful vegetables (antioxidants). A balanced diet with variety is key to supporting immune function.",
    category: "nutrition",
    keywords: ["immune system", "foods", "vitamin C", "antioxidants", "nutrition", "healthy eating"],
    source: "Harvard Health",
    last_updated: "2024-01-01"
  },
  {
    id: 7,
    question: "How much sleep do adults need?",
    answer: "Most adults need 7-9 hours of quality sleep per night. Good sleep hygiene includes: maintaining a consistent sleep schedule, creating a comfortable sleep environment, avoiding screens before bedtime, limiting caffeine late in the day, and establishing a relaxing bedtime routine. Poor sleep affects physical and mental health significantly.",
    category: "general_health",
    keywords: ["sleep", "adults", "hours", "sleep hygiene", "bedtime", "health"],
    source: "Sleep Foundation",
    last_updated: "2024-01-01"
  }
];

// Search knowledge base
router.get('/search', (req, res) => {
  try {
    const { q, category, limit = 5 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters long'
      });
    }
    
    const searchTerm = q.toLowerCase().trim();
    let results = medicalKnowledgeBase;
    
    // Filter by category if provided
    if (category) {
      results = results.filter(item => item.category === category);
    }
    
    // Search in questions, answers, and keywords
    results = results.filter(item => {
      const questionMatch = item.question.toLowerCase().includes(searchTerm);
      const answerMatch = item.answer.toLowerCase().includes(searchTerm);
      const keywordMatch = item.keywords.some(keyword => 
        keyword.toLowerCase().includes(searchTerm) || 
        searchTerm.includes(keyword.toLowerCase())
      );
      
      return questionMatch || answerMatch || keywordMatch;
    });
    
    // Score results based on relevance
    results = results.map(item => {
      let score = 0;
      
      // Higher score for question title matches
      if (item.question.toLowerCase().includes(searchTerm)) {
        score += 10;
      }
      
      // Medium score for keyword matches
      item.keywords.forEach(keyword => {
        if (keyword.toLowerCase().includes(searchTerm)) {
          score += 5;
        }
      });
      
      // Lower score for answer content matches
      if (item.answer.toLowerCase().includes(searchTerm)) {
        score += 2;
      }
      
      return { ...item, relevance_score: score };
    });
    
    // Sort by relevance score
    results.sort((a, b) => b.relevance_score - a.relevance_score);
    
    // Limit results
    const limitedResults = results.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: {
        query: q,
        total_results: results.length,
        faqs: limitedResults,
        categories_found: [...new Set(results.map(item => item.category))]
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error searching knowledge base:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to search knowledge base',
      timestamp: new Date().toISOString()
    });
  }
});

// Get all categories
router.get('/categories', (req, res) => {
  try {
    const categories = [...new Set(medicalKnowledgeBase.map(item => item.category))];
    const categoriesWithCounts = categories.map(category => ({
      name: category,
      count: medicalKnowledgeBase.filter(item => item.category === category).length,
      display_name: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
    
    res.json({
      success: true,
      data: {
        categories: categoriesWithCounts,
        total_categories: categories.length,
        total_faqs: medicalKnowledgeBase.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve categories',
      timestamp: new Date().toISOString()
    });
  }
});

// Get FAQ by ID
router.get('/faq/:id', (req, res) => {
  try {
    const { id } = req.params;
    const faq = medicalKnowledgeBase.find(item => item.id === parseInt(id));
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: faq,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve FAQ',
      timestamp: new Date().toISOString()
    });
  }
});

// Get random FAQs
router.get('/random', (req, res) => {
  try {
    const { count = 3, category } = req.query;
    
    let availableFaqs = medicalKnowledgeBase;
    
    if (category) {
      availableFaqs = medicalKnowledgeBase.filter(item => item.category === category);
    }
    
    // Shuffle and take random FAQs
    const shuffled = availableFaqs.sort(() => 0.5 - Math.random());
    const randomFaqs = shuffled.slice(0, parseInt(count));
    
    res.json({
      success: true,
      data: {
        faqs: randomFaqs,
        total_available: availableFaqs.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting random FAQs:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve random FAQs',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 