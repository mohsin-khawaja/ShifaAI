// ShifaAI Web Interface
class ShifaAIWebApp {
    constructor() {
        this.apiUrl = window.location.origin;
        this.currentTab = 'medical';
        this.init();
    }

    init() {
        this.bindEvents();
        this.showWelcomeMessage();
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showSection(link.getAttribute('href').substring(1));
            });
        });

        // Send message
        document.getElementById('sendButton').addEventListener('click', () => this.sendMessage());
        
        // Enter key to send
        document.getElementById('messageInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.sendMessage();
            }
        });

        // Quick actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleQuickAction(btn.dataset.action));
        });
    }

    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        document.getElementById(sectionId).classList.add('active');

        // Update nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
    }

    showWelcomeMessage() {
        const welcomeMessage = `Welcome to ShifaAI! 🌟

I'm your AI health companion, here to provide:
🩺 Evidence-based medical information
🧠 CBT coaching and mental health support  
🌙 Islamic healing guidance (Shifa)

Feel free to ask any health question, or try one of the quick actions below.

⚠️ Important: This is for general information only. For medical emergencies, contact emergency services immediately.`;

        this.addMessage('assistant', welcomeMessage);
    }

    async sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage('user', message);
        input.value = '';

        // Show loading
        this.setLoading(true);

        try {
            const payload = {
                question: message,
                include_cbt: document.getElementById('includeCBT').checked,
                include_shifa: document.getElementById('includeShifa').checked,
                mood: document.getElementById('moodSelect').value
            };

            const response = await fetch(`${this.apiUrl}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            this.displayResponse(data);

        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('assistant', `❌ Sorry, I encountered an error: ${error.message}\n\nPlease try again or contact support if the problem persists.`);
        } finally {
            this.setLoading(false);
        }
    }

    displayResponse(data) {
        const responseData = {
            medical: data.medical_response,
            cbt: data.cbt_guidance,
            shifa: data.shifa_guidance
        };

        this.addMessage('assistant', '', responseData);
    }

    addMessage(type, content, tabData = null) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;

        if (tabData) {
            // Multi-tab response
            const tabsHtml = Object.keys(tabData)
                .filter(key => tabData[key])
                .map(key => {
                    const icons = { medical: '🩺', cbt: '🧠', shifa: '🌙' };
                    const labels = { medical: 'Medical', cbt: 'CBT', shifa: 'Shifa' };
                    return `<button class="tab-button ${key === 'medical' ? 'active' : ''}" data-tab="${key}">
                        ${icons[key]} ${labels[key]}
                    </button>`;
                }).join('');

            const contentHtml = Object.keys(tabData)
                .filter(key => tabData[key])
                .map(key => 
                    `<div class="tab-content" data-tab="${key}" ${key !== 'medical' ? 'style="display: none;"' : ''}>
                        ${this.formatContent(tabData[key])}
                    </div>`
                ).join('');

            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-tabs">
                        ${tabsHtml}
                    </div>
                    ${contentHtml}
                </div>
            `;

            // Bind tab switching
            messageDiv.querySelectorAll('.tab-button').forEach(btn => {
                btn.addEventListener('click', () => this.switchMessageTab(messageDiv, btn.dataset.tab));
            });

        } else {
            // Simple message
            messageDiv.innerHTML = `
                <div class="message-content">
                    ${this.formatContent(content)}
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    switchMessageTab(messageDiv, tabName) {
        // Update tab buttons
        messageDiv.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        messageDiv.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        messageDiv.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
        });
        messageDiv.querySelector(`.tab-content[data-tab="${tabName}"]`).style.display = 'block';
    }

    formatContent(content) {
        if (!content) return '';
        
        // Convert line breaks and format the content
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    async handleQuickAction(action) {
        this.setLoading(true);

        try {
            let message, endpoint;

            switch (action) {
                case 'cbt':
                    message = 'Getting a CBT exercise for you...';
                    this.addMessage('user', message);
                    
                    const mood = document.getElementById('moodSelect').value;
                    endpoint = `/cbt/exercise?mood=${mood}&severity=5`;
                    const cbtData = await this.fetchData(endpoint);
                    
                    this.addMessage('assistant', this.formatCBTResponse(cbtData));
                    break;

                case 'dua':
                    message = 'Getting a healing du\'a for you...';
                    this.addMessage('user', message);
                    
                    const duaData = await this.fetchData('/shifa/dua?condition=general');
                    this.addMessage('assistant', this.formatDuaResponse(duaData));
                    break;

                case 'tips':
                    message = 'Getting daily health tips...';
                    this.addMessage('user', message);
                    
                    const [cbtTips, shifaTips] = await Promise.all([
                        this.fetchData('/cbt/exercise?mood=general'),
                        this.fetchData('/shifa/dua?condition=general')
                    ]);
                    
                    const tipsContent = `💡 **Daily Health Tips**

🧠 **CBT Tip:**
${cbtTips.daily_tip}

🌙 **Islamic Health Tip:**
${shifaTips.daily_tip}

Have a blessed and healthy day! ✨`;
                    
                    this.addMessage('assistant', tipsContent);
                    break;

                case 'emergency':
                    message = 'Emergency information';
                    this.addMessage('user', message);
                    
                    const emergencyInfo = `🚨 **Emergency Information**

**When to seek immediate medical attention:**
• Chest pain or difficulty breathing
• Severe bleeding or injuries
• Loss of consciousness
• Severe allergic reactions
• Signs of stroke (FAST: Face drooping, Arm weakness, Speech difficulty, Time to call emergency)
• Thoughts of self-harm

**Emergency Numbers:**
• US: 911
• UK: 999
• EU: 112

**Mental Health Crisis:**
• US: 988 (Suicide & Crisis Lifeline)
• Crisis Text Line: Text HOME to 741741

⚠️ **Remember:** ShifaAI is for general information only. In emergencies, always contact professional emergency services immediately.`;

                    this.addMessage('assistant', emergencyInfo);
                    break;
            }

        } catch (error) {
            console.error('Error in quick action:', error);
            this.addMessage('assistant', `❌ Error getting ${action} information: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    async fetchData(endpoint) {
        const response = await fetch(`${this.apiUrl}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        return await response.json();
    }

    formatCBTResponse(data) {
        const exercise = data.exercise;
        let content = `🧠 **CBT Exercise: ${exercise.name}**

${exercise.description}

**Duration:** ${exercise.duration}
**Benefits:** ${exercise.benefits}

**Steps:**
`;
        
        exercise.steps.forEach((step, index) => {
            content += `${index + 1}. ${step}\n`;
        });

        content += `\n💡 **Daily Tip:** ${data.daily_tip}`;
        return content;
    }

    formatDuaResponse(data) {
        const dua = data.dua;
        return `🌙 **Healing Du'a**

**${dua.usage}**

**Translation:**
*${dua.translation}*

**Source:** ${dua.source}

**Transliteration:**
${dua.transliteration}

**Arabic:**
${dua.arabic}

💡 **Daily Islamic Health Tip:** ${data.daily_tip}`;
    }

    setLoading(loading) {
        const button = document.getElementById('sendButton');
        const sendText = document.getElementById('sendText');
        const spinner = document.getElementById('sendSpinner');

        button.disabled = loading;
        sendText.style.display = loading ? 'none' : 'inline';
        spinner.style.display = loading ? 'inline' : 'none';
    }
}

// Initialize the web app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShifaAIWebApp();
}); 