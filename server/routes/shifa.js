const express = require('express');
const router = express.Router();

// Islamic healing du'as database
const healingDuas = [
  {
    id: 1,
    category: "general_healing",
    arabic: "اللَّهُمَّ رَبَّ النَّاسِ أَذْهِبِ البَاسَ، اشْفِهِ وَأَنتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا",
    transliteration: "Allahumma Rabb an-naas, adhhib al-ba's, washfihi wa anta ash-shaafi, laa shifaa'a illa shifaa'uka, shifaa'an laa yughaadiru saqaman",
    translation: "O Allah, Lord of mankind, remove the disease and heal, for You are the Healer. There is no healing except Your healing, a healing that leaves no disease behind.",
    source: "Sahih Bukhari (5743)",
    recitation_notes: "Place your hand on the area of pain while reciting"
  },
  {
    id: 2,
    category: "anxiety_stress",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ",
    transliteration: "Allahumma innee a'oodhu bika min al-hammi wal-hazan, wa a'oodhu bika min al-'ajzi wal-kasal",
    translation: "O Allah, I seek refuge in You from worry and grief, and I seek refuge in You from incapacity and laziness.",
    source: "Sahih Bukhari (6369)",
    recitation_notes: "Recite morning and evening for anxiety relief"
  },
  {
    id: 3,
    category: "protection",
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'oodhu bi kalimaati Allaahi at-tammaati min sharri maa khalaq",
    translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
    source: "Sahih Muslim (2708)",
    recitation_notes: "Recite 3 times for protection from harm"
  },
  {
    id: 4,
    category: "sleep_peace",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amootu wa ahyaa",
    translation: "In Your name, O Allah, I die and I live.",
    source: "Sahih Bukhari (6312)",
    recitation_notes: "Recite before sleep for peaceful rest"
  },
  {
    id: 5,
    category: "forgiveness",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ",
    transliteration: "Allahumma anta rabbee laa ilaaha illa ant, khalaqtanee wa ana 'abduka, wa ana 'alaa 'ahdika wa wa'dika ma astata't",
    translation: "O Allah, You are my Lord, there is no god except You. You created me and I am Your servant, and I am keeping my covenant and promise to You as much as I can.",
    source: "Sahih Bukhari (6306)",
    recitation_notes: "The master of seeking forgiveness - recite daily"
  },
  {
    id: 6,
    category: "gratitude",
    arabic: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    transliteration: "Allahumma a'innee 'alaa dhikrika wa shukrika wa husni 'ibaadatika",
    translation: "O Allah, help me to remember You, thank You, and worship You in the best manner.",
    source: "Sunan Abu Dawud (1522)",
    recitation_notes: "Recite after each prayer for spiritual strength"
  }
];

// Prophetic medicine database
const propheticRemedies = [
  {
    id: 1,
    name: "Honey",
    arabic_name: "عسل",
    condition: "general_healing",
    description: "Raw honey has antibacterial and healing properties",
    usage: "Take 1-2 tablespoons daily on empty stomach",
    hadith: "The Prophet (ﷺ) said: 'Honey is a remedy for every illness and the Qur'an is a remedy for all illness of the mind.'",
    source: "Sahih Bukhari (5684)",
    precautions: ["Not suitable for infants under 1 year", "Diabetics should consult healthcare provider"]
  },
  {
    id: 2,
    name: "Black Seed (Nigella Sativa)",
    arabic_name: "حبة البركة",
    condition: "immune_system",
    description: "Black seed oil boosts immunity and has anti-inflammatory properties",
    usage: "1 teaspoon of black seed oil daily, or 1/2 teaspoon of ground black seeds with honey",
    hadith: "The Prophet (ﷺ) said: 'In the black seed there is healing for every disease except death.'",
    source: "Sahih Bukhari (5688)",
    precautions: ["May interact with blood pressure medications", "Consult healthcare provider if pregnant"]
  },
  {
    id: 3,
    name: "Dates",
    arabic_name: "تمر",
    condition: "nutrition_energy",
    description: "Dates provide natural energy and essential nutrients",
    usage: "Eat 3-7 dates daily, preferably Ajwa dates",
    hadith: "The Prophet (ﷺ) said: 'Whoever eats seven Ajwa dates every morning, will not be affected by poison or magic on the day he eats them.'",
    source: "Sahih Bukhari (5445)",
    precautions: ["High in natural sugars - diabetics should monitor intake"]
  },
  {
    id: 4,
    name: "Zamzam Water",
    arabic_name: "ماء زمزم",
    condition: "spiritual_physical_healing",
    description: "Sacred water from the well in Makkah, blessed for healing",
    usage: "Drink with intention of healing and make du'a",
    hadith: "The Prophet (ﷺ) said: 'Zamzam water is for whatever it is drunk for.'",
    source: "Sunan Ibn Majah (3062)",
    precautions: ["Ensure authenticity of Zamzam water source"]
  },
  {
    id: 5,
    name: "Olive Oil",
    arabic_name: "زيت الزيتون",
    condition: "skin_digestive",
    description: "Extra virgin olive oil for internal and external use",
    usage: "1-2 tablespoons daily, or apply topically for skin conditions",
    hadith: "The Prophet (ﷺ) said: 'Eat olive oil and massage it over your bodies since it is a holy tree.'",
    source: "Sunan At-Tirmidhi (1851)",
    precautions: ["Use cold-pressed, extra virgin olive oil for best benefits"]
  }
];

// Get healing du'a
router.get('/dua', (req, res) => {
  try {
    const { category } = req.query;
    
    let availableDuas = healingDuas;
    
    if (category) {
      availableDuas = healingDuas.filter(dua => dua.category === category);
    }
    
    if (availableDuas.length === 0) {
      availableDuas = healingDuas;
    }
    
    const randomDua = availableDuas[Math.floor(Math.random() * availableDuas.length)];
    
    res.json({
      success: true,
      data: randomDua,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting healing du\'a:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve healing du\'a',
      timestamp: new Date().toISOString()
    });
  }
});

// Get prophetic medicine
router.get('/prophetic-medicine', (req, res) => {
  try {
    const { condition } = req.query;
    
    let availableRemedies = propheticRemedies;
    
    if (condition) {
      availableRemedies = propheticRemedies.filter(remedy => 
        remedy.condition === condition || remedy.condition.includes(condition)
      );
    }
    
    if (availableRemedies.length === 0) {
      availableRemedies = propheticRemedies;
    }
    
    const randomRemedy = availableRemedies[Math.floor(Math.random() * availableRemedies.length)];
    
    res.json({
      success: true,
      data: randomRemedy,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting prophetic medicine:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve prophetic medicine',
      timestamp: new Date().toISOString()
    });
  }
});

// Get Shifa guidance based on query
router.post('/guidance', (req, res) => {
  try {
    const { query, category } = req.body;
    
    if (!query || query.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Query must be at least 3 characters long'
      });
    }
    
    const queryLower = query.toLowerCase();
    let recommendedDua;
    let recommendedRemedy;
    
    // Determine appropriate du'a based on query
    if (queryLower.includes('anxious') || queryLower.includes('worry') || queryLower.includes('stress')) {
      recommendedDua = healingDuas.find(dua => dua.category === 'anxiety_stress');
    } else if (queryLower.includes('sleep') || queryLower.includes('insomnia')) {
      recommendedDua = healingDuas.find(dua => dua.category === 'sleep_peace');
    } else if (queryLower.includes('forgive') || queryLower.includes('sin')) {
      recommendedDua = healingDuas.find(dua => dua.category === 'forgiveness');
    } else if (queryLower.includes('protect') || queryLower.includes('safe')) {
      recommendedDua = healingDuas.find(dua => dua.category === 'protection');
    } else {
      recommendedDua = healingDuas.find(dua => dua.category === 'general_healing');
    }
    
    // Determine appropriate remedy
    if (queryLower.includes('immune') || queryLower.includes('sick')) {
      recommendedRemedy = propheticRemedies.find(remedy => remedy.condition === 'immune_system');
    } else if (queryLower.includes('energy') || queryLower.includes('tired')) {
      recommendedRemedy = propheticRemedies.find(remedy => remedy.condition === 'nutrition_energy');
    } else {
      recommendedRemedy = propheticRemedies[0]; // Default to honey
    }
    
    const guidance = {
      dua: recommendedDua,
      remedy: recommendedRemedy,
      general_advice: "Remember that healing comes from Allah (SWT). Use these as means while placing your trust in Him. Combine with medical treatment when needed.",
      disclaimer: "This guidance is for spiritual wellness. Always consult healthcare professionals for medical conditions."
    };
    
    res.json({
      success: true,
      data: guidance,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error getting Shifa guidance:', error);
    res.status(500).json({
      success: false,
      error: 'Unable to provide Shifa guidance',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 