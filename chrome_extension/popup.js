// ShifaAI Chrome Extension Popup JavaScript

class ShifaAIExtension {
    constructor() {
        this.apiUrl = 'http://localhost:8000';
        this.currentTab = 'ask';
        this.init();
    }

    init() {
        // Initialize event listeners
        this.setupTabNavigation();
        this.setupEventListeners();
        this.loadDailyTip();
        this.setupMoodSlider();
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                
                // Remove active class from all tabs and buttons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                button.classList.add('active');
                document.getElementById(`${tabName}-tab`).classList.add('active');
                
                this.currentTab = tabName;
            });
        });
    }

    setupEventListeners() {
        // Ask tab
        document.getElementById('ask-button').addEventListener('click', () => this.handleAskQuestion());
        document.getElementById('question-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.handleAskQuestion();
            }
        });

        // CBT tab
        document.getElementById('cbt-button').addEventListener('click', () => this.handleCBTExercise());

        // Shifa tab
        document.getElementById('dua-button').addEventListener('click', () => this.handleDuaRequest());
        document.getElementById('medicine-button').addEventListener('click', () => this.handleMedicineRequest());
        document.getElementById('halal-button').addEventListener('click', () => this.handleHalalCheck());
    }

    setupMoodSlider() {
        const moodSlider = document.getElementById('mood-slider');
        const moodValue = document.getElementById('mood-value');

        moodSlider.addEventListener('input', (e) => {
            moodValue.textContent = e.target.value;
        });
    }

    async loadDailyTip() {
        try {
            const response = await fetch(`${this.apiUrl}/cbt/daily-tip`);
            if (response.ok) {
                const data = await response.json();
                document.getElementById('tip-content').textContent = data.daily_tip;
            } else {
                document.getElementById('tip-content').textContent = 'Take a moment to breathe and be kind to yourself today.';
            }
        } catch (error) {
            console.error('Error loading daily tip:', error);
            document.getElementById('tip-content').textContent = 'Remember: small steps lead to big changes.';
        }
    }

    async handleAskQuestion() {
        const questionInput = document.getElementById('question-input');
        const question = questionInput.value.trim();
        
        if (!question) {
            this.showError('Please enter a question');
            return;
        }

        const includeCBT = document.getElementById('include-cbt').checked;
        const includeShifa = document.getElementById('include-shifa').checked;
        
        const askButton = document.getElementById('ask-button');
        const askButtonText = document.getElementById('ask-button-text');
        const askLoading = document.getElementById('ask-loading');
        
        // Show loading state
        askButton.disabled = true;
        askButtonText.style.display = 'none';
        askLoading.style.display = 'inline';

        try {
            const response = await fetch(`${this.apiUrl}/ask`, {
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

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.displayAskResponse(data);
            
            // Clear input
            questionInput.value = '';

        } catch (error) {
            console.error('Error asking question:', error);
            this.showError('Unable to get response. Please check your connection and try again.');
        } finally {
            // Reset button state
            askButton.disabled = false;
            askButtonText.style.display = 'inline';
            askLoading.style.display = 'none';
        }
    }

    displayAskResponse(data) {
        const responseSection = document.getElementById('response-section');
        const responseContent = document.getElementById('response-content');
        
        let html = '';

        // Medical response
        if (data.medical_response) {
            const medical = data.medical_response;
            html += `
                <h4>🩺 Medical Guidance</h4>
                <p>${medical.response}</p>
                
                <h5>📂 Category: ${medical.category}</h5>
                <h5>🔍 Keywords: ${medical.keywords.join(', ')}</h5>
                
                ${medical.follow_up_questions && medical.follow_up_questions.length > 0 ? 
                    `<h5>❓ Follow-up Questions:</h5>
                     <ul>${medical.follow_up_questions.map(q => `<li>${q}</li>`).join('')}</ul>` 
                    : ''
                }
            `;
        }

        // CBT response
        if (data.cbt_response && data.cbt_response.exercise) {
            const cbt = data.cbt_response.exercise;
            html += `
                <h4>🧠 CBT Exercise</h4>
                <h5>${cbt.name}</h5>
                <p><strong>Description:</strong> ${cbt.description}</p>
                <p><strong>Duration:</strong> ${cbt.duration}</p>
                <p><strong>Best for:</strong> ${cbt.best_for.join(', ')}</p>
                
                ${cbt.encouragement ? `<p><em>💙 ${cbt.encouragement}</em></p>` : ''}
                
                <h5>📝 Steps:</h5>
                <ul>${cbt.steps.map((step, i) => `<li>${step}</li>`).join('')}</ul>
                
                ${data.cbt_response.daily_tip ? 
                    `<p><strong>💡 CBT Tip:</strong> ${data.cbt_response.daily_tip}</p>` 
                    : ''
                }
            `;
        }

        // Shifa response
        if (data.shifa_response && data.shifa_response.healing_dua) {
            const shifa = data.shifa_response.healing_dua;
            const dua = shifa.dua;
            
            html += `
                <h4>🕌 Islamic Healing (Shifa)</h4>
                <h5>🤲 Healing Du'a</h5>
                
                <div class="arabic-text">${dua.arabic}</div>
                <p class="transliteration"><strong>Transliteration:</strong> ${dua.transliteration}</p>
                <p><strong>Translation:</strong> ${dua.translation}</p>
                <p><strong>Source:</strong> ${dua.source}</p>
                <p><strong>How to recite:</strong> ${dua.recitation_notes}</p>
                
                ${shifa.encouragement ? `<p><em>💙 ${shifa.encouragement}</em></p>` : ''}
                
                ${data.shifa_response.prophetic_remedy ? 
                    `<h5>🌿 Prophetic Remedy</h5>
                     <p><strong>${data.shifa_response.prophetic_remedy.remedy.arabic_name || 'Natural Remedy'}:</strong> 
                        ${data.shifa_response.prophetic_remedy.remedy.description}</p>
                     <p><strong>Usage:</strong> ${data.shifa_response.prophetic_remedy.remedy.usage}</p>`
                    : ''
                }
            `;
        }

        responseContent.innerHTML = html;
        responseSection.style.display = 'block';
        responseSection.scrollTop = 0;
    }

    async handleCBTExercise() {
        const symptomsInput = document.getElementById('symptoms-input');
        const symptoms = symptomsInput.value.trim().split(',').map(s => s.trim()).filter(s => s);
        const moodRating = parseInt(document.getElementById('mood-slider').value);
        
        if (symptoms.length === 0) {
            symptoms.push('stress'); // Default
        }

        const cbtButton = document.getElementById('cbt-button');
        cbtButton.disabled = true;
        cbtButton.textContent = 'Getting exercise...';

        try {
            const response = await fetch(`${this.apiUrl}/cbt/exercise`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symptoms: symptoms,
                    mood_rating: moodRating
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.displayCBTResponse(data);

        } catch (error) {
            console.error('Error getting CBT exercise:', error);
            this.showError('Unable to get CBT exercise. Please try again.');
        } finally {
            cbtButton.disabled = false;
            cbtButton.textContent = 'Get CBT Exercise';
        }
    }

    displayCBTResponse(data) {
        const responseSection = document.getElementById('cbt-response');
        const exercise = data.exercise;
        
        const html = `
            <h4>🧠 ${exercise.name}</h4>
            <p><strong>Description:</strong> ${exercise.description}</p>
            <p><strong>Duration:</strong> ${exercise.duration}</p>
            <p><strong>Best for:</strong> ${exercise.best_for.join(', ')}</p>
            
            ${exercise.encouragement ? `<p><em>💙 ${exercise.encouragement}</em></p>` : ''}
            
            <h5>📝 Steps to follow:</h5>
            <ul>${exercise.steps.map(step => `<li>${step}</li>`).join('')}</ul>
            
            ${data.daily_tip ? `<p><strong>💡 Daily Tip:</strong> ${data.daily_tip}</p>` : ''}
        `;
        
        responseSection.innerHTML = html;
        responseSection.style.display = 'block';
        responseSection.scrollTop = 0;
    }

    async handleDuaRequest() {
        const categorySelect = document.getElementById('dua-category');
        const category = categorySelect.value;
        
        const duaButton = document.getElementById('dua-button');
        duaButton.disabled = true;
        duaButton.textContent = 'Getting du\'a...';

        try {
            const response = await fetch(`${this.apiUrl}/shifa/dua`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    category: category || null
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.displayShifaResponse(data, 'dua');

        } catch (error) {
            console.error('Error getting du\'a:', error);
            this.showError('Unable to get healing du\'a. Please try again.');
        } finally {
            duaButton.disabled = false;
            duaButton.textContent = 'Get Du\'a';
        }
    }

    async handleMedicineRequest() {
        const conditionInput = document.getElementById('condition-input');
        const condition = conditionInput.value.trim();
        
        if (!condition) {
            this.showError('Please enter a condition');
            return;
        }

        const medicineButton = document.getElementById('medicine-button');
        medicineButton.disabled = true;
        medicineButton.textContent = 'Getting remedy...';

        try {
            // Simulate prophetic medicine API call (you'd implement this endpoint)
            const response = await fetch(`${this.apiUrl}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: `What prophetic medicine helps with ${condition}?`,
                    include_cbt: false,
                    include_shifa: true
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data.shifa_response && data.shifa_response.prophetic_remedy) {
                this.displayShifaResponse(data.shifa_response, 'medicine');
            } else {
                this.showError('No specific remedy found for this condition.');
            }

        } catch (error) {
            console.error('Error getting prophetic medicine:', error);
            this.showError('Unable to get prophetic medicine. Please try again.');
        } finally {
            medicineButton.disabled = false;
            medicineButton.textContent = 'Get Remedy';
            conditionInput.value = '';
        }
    }

    async handleHalalCheck() {
        const halalInput = document.getElementById('halal-input');
        const ingredient = halalInput.value.trim();
        
        if (!ingredient) {
            this.showError('Please enter an ingredient or treatment');
            return;
        }

        const halalButton = document.getElementById('halal-button');
        halalButton.disabled = true;
        halalButton.textContent = 'Checking...';

        try {
            const response = await fetch(`${this.apiUrl}/shifa/halal-check`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ingredient_or_treatment: ingredient
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.displayShifaResponse(data, 'halal');

        } catch (error) {
            console.error('Error checking halal status:', error);
            this.showError('Unable to verify halal status. Please try again.');
        } finally {
            halalButton.disabled = false;
            halalButton.textContent = 'Check Halal';
            halalInput.value = '';
        }
    }

    displayShifaResponse(data, type) {
        const responseSection = document.getElementById('shifa-response');
        let html = '';

        if (type === 'dua' && data.dua_response) {
            const dua = data.dua_response.dua;
            html = `
                <h4>🤲 Healing Du'a</h4>
                <div class="arabic-text">${dua.arabic}</div>
                <p class="transliteration"><strong>Transliteration:</strong> ${dua.transliteration}</p>
                <p><strong>Translation:</strong> ${dua.translation}</p>
                <p><strong>Source:</strong> ${dua.source}</p>
                <p><strong>How to recite:</strong> ${dua.recitation_notes}</p>
                
                ${data.dua_response.encouragement ? 
                    `<p><em>💙 ${data.dua_response.encouragement}</em></p>` : ''
                }
            `;
        } else if (type === 'medicine' && data.prophetic_remedy) {
            const remedy = data.prophetic_remedy.remedy;
            html = `
                <h4>🌿 Prophetic Medicine</h4>
                <h5>${remedy.arabic_name || 'Natural Remedy'}</h5>
                <p><strong>Description:</strong> ${remedy.description}</p>
                
                ${remedy.prophetic_saying ? 
                    `<p><strong>📜 Prophetic Saying:</strong> ${remedy.prophetic_saying}</p>` : ''
                }
                
                ${remedy.quran_reference ? 
                    `<p><strong>📖 Quranic Reference:</strong> ${remedy.quran_reference}</p>` : ''
                }
                
                <p><strong>💊 Usage:</strong> ${remedy.usage}</p>
                <p><strong>✅ Halal Status:</strong> ${remedy.halal_status}</p>
                
                <h5>🔬 Modern Benefits:</h5>
                <ul>${remedy.modern_benefits.map(benefit => `<li>${benefit}</li>`).join('')}</ul>
                
                ${remedy.precautions ? 
                    `<p><strong>⚠️ Precautions:</strong> ${remedy.precautions}</p>` : ''
                }
            `;
        } else if (type === 'halal' && data.verification) {
            const verification = data.verification;
            const statusColor = verification.status === 'Halal' ? '#28a745' : 
                               verification.status === 'Haram' ? '#dc3545' : '#ffc107';
            
            html = `
                <h4>✅ Halal Verification</h4>
                <p><strong>Item:</strong> ${data.ingredient_or_treatment}</p>
                <p><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${verification.status}</span></p>
                <p><strong>Reason:</strong> ${verification.reason}</p>
                
                ${verification.alternative ? 
                    `<p><strong>🔄 Alternative:</strong> ${verification.alternative}</p>` : ''
                }
                
                <p><strong>📚 Islamic Guidance:</strong> ${verification.guidance}</p>
                
                ${verification.principle ? 
                    `<p><strong>⚖️ Islamic Principle:</strong> ${verification.principle}</p>` : ''
                }
            `;
        }

        responseSection.innerHTML = html;
        responseSection.style.display = 'block';
        responseSection.scrollTop = 0;
    }

    showError(message) {
        // Create and show temporary error message
        const responseSection = document.getElementById(`${this.currentTab}-response`) || 
                              document.getElementById('response-section');
        
        responseSection.innerHTML = `<div class="error">${message}</div>`;
        responseSection.style.display = 'block';
        
        // Hide error after 3 seconds
        setTimeout(() => {
            if (responseSection.innerHTML.includes('error')) {
                responseSection.style.display = 'none';
            }
        }, 3000);
    }

    showSuccess(message) {
        // Create and show temporary success message
        const responseSection = document.getElementById(`${this.currentTab}-response`) || 
                              document.getElementById('response-section');
        
        responseSection.innerHTML = `<div class="success">${message}</div>`;
        responseSection.style.display = 'block';
        
        // Hide success after 2 seconds
        setTimeout(() => {
            if (responseSection.innerHTML.includes('success')) {
                responseSection.style.display = 'none';
            }
        }, 2000);
    }
}

// Initialize the extension when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ShifaAIExtension();
});

// Handle any chrome extension specific functionality
if (typeof chrome !== 'undefined' && chrome.storage) {
    // Save user preferences
    function savePreferences() {
        const preferences = {
            includeCBT: document.getElementById('include-cbt').checked,
            includeShifa: document.getElementById('include-shifa').checked,
            lastTab: document.querySelector('.tab-button.active').getAttribute('data-tab')
        };
        
        chrome.storage.sync.set({ shifaAIPreferences: preferences });
    }

    // Load user preferences
    function loadPreferences() {
        chrome.storage.sync.get(['shifaAIPreferences'], (result) => {
            if (result.shifaAIPreferences) {
                const prefs = result.shifaAIPreferences;
                
                document.getElementById('include-cbt').checked = prefs.includeCBT !== false;
                document.getElementById('include-shifa').checked = prefs.includeShifa !== false;
                
                // Switch to last used tab
                if (prefs.lastTab && prefs.lastTab !== 'ask') {
                    const targetButton = document.querySelector(`[data-tab="${prefs.lastTab}"]`);
                    if (targetButton) {
                        targetButton.click();
                    }
                }
            }
        });
    }

    // Save preferences when checkboxes change
    document.addEventListener('change', (e) => {
        if (e.target.type === 'checkbox') {
            savePreferences();
        }
    });

    // Save preferences when tab changes
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('tab-button')) {
            setTimeout(savePreferences, 100);
        }
    });

    // Load preferences on startup
    document.addEventListener('DOMContentLoaded', loadPreferences);
}

// Handle any clicks on external links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href && e.target.href.startsWith('http')) {
        e.preventDefault();
        chrome.tabs.create({ url: e.target.href });
    }
}); 