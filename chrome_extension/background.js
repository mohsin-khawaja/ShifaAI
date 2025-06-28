// ShifaAI Chrome Extension Background Service Worker

// Extension installation and updates
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // First time installation
        console.log('ShifaAI Extension installed');
        
        // Set default preferences
        chrome.storage.sync.set({
            shifaAIPreferences: {
                includeCBT: true,
                includeShifa: true,
                lastTab: 'ask',
                notificationsEnabled: true,
                dailyTipEnabled: true
            }
        });
        
        // Show welcome notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'Welcome to ShifaAI! 🌟',
            message: 'Your AI health companion is ready. Click the extension icon to get started.'
        });
        
    } else if (details.reason === 'update') {
        console.log('ShifaAI Extension updated');
        
        // Show update notification
        chrome.notifications.create({
            type: 'basic',
            iconUrl: 'icons/icon48.png',
            title: 'ShifaAI Updated ✨',
            message: 'New features and improvements are available!'
        });
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // This will open the popup automatically
    console.log('ShifaAI extension icon clicked');
});

// Handle notifications click
chrome.notifications.onClicked.addListener((notificationId) => {
    // Open the extension popup when notification is clicked
    chrome.action.openPopup();
    chrome.notifications.clear(notificationId);
});

// Daily tip notification (optional feature)
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'dailyTip') {
        showDailyTipNotification();
    }
});

// Set up daily tip alarm
chrome.runtime.onStartup.addListener(() => {
    setupDailyTipAlarm();
});

chrome.runtime.onInstalled.addListener(() => {
    setupDailyTipAlarm();
});

function setupDailyTipAlarm() {
    chrome.storage.sync.get(['shifaAIPreferences'], (result) => {
        const prefs = result.shifaAIPreferences || {};
        
        if (prefs.dailyTipEnabled !== false) {
            // Create daily alarm for 9 AM
            chrome.alarms.create('dailyTip', {
                when: getNextDailyTipTime(),
                periodInMinutes: 24 * 60 // 24 hours
            });
        }
    });
}

function getNextDailyTipTime() {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM
    return tomorrow.getTime();
}

async function showDailyTipNotification() {
    try {
        // Check if notifications are enabled
        chrome.storage.sync.get(['shifaAIPreferences'], (result) => {
            const prefs = result.shifaAIPreferences || {};
            
            if (prefs.notificationsEnabled !== false && prefs.dailyTipEnabled !== false) {
                // Get a daily tip
                const dailyTips = [
                    "💡 Take three deep breaths before responding to stressful situations",
                    "🤲 Start your day with morning adhkar for spiritual protection",
                    "💧 Remember to stay hydrated - drink water in three sips as taught by Prophet Muhammad ﷺ",
                    "🧠 Practice gratitude by noting three things you're thankful for today",
                    "🌿 The Prophet ﷺ recommended honey for healing - consider adding it to your diet",
                    "💙 Be kind to yourself - treat yourself with the same compassion you'd show a friend",
                    "🚶 Take a short walk after meals to aid digestion and boost mood",
                    "📿 Remember: 'And whoever relies upon Allah - then He is sufficient for him' (Quran 65:3)",
                    "🧘 Take breaks from screens every 20 minutes to rest your eyes and mind",
                    "🌙 Aim for 7-8 hours of quality sleep each night for optimal health"
                ];
                
                const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
                
                chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icons/icon48.png',
                    title: 'Daily ShifaAI Tip 🌟',
                    message: randomTip
                });
            }
        });
    } catch (error) {
        console.log('Error showing daily tip notification:', error);
    }
}

// Handle messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'trackUsage') {
        // Track usage statistics
        trackUsage(request.data);
        sendResponse({ success: true });
        
    } else if (request.action === 'getDailyTip') {
        // Get daily tip
        sendResponse({ tip: getDailyHealthTip() });
        
    } else if (request.action === 'checkAPIStatus') {
        // Check if backend API is accessible
        checkAPIStatus().then(status => {
            sendResponse({ status });
        });
        return true; // Will respond asynchronously
        
    } else if (request.action === 'savePreferences') {
        // Save user preferences
        chrome.storage.sync.set({ shifaAIPreferences: request.preferences });
        sendResponse({ success: true });
    }
});

async function trackUsage(data) {
    try {
        const stats = await chrome.storage.local.get(['usageStats']) || {};
        const usageStats = stats.usageStats || {};
        
        const today = new Date().toDateString();
        if (!usageStats[today]) {
            usageStats[today] = {};
        }
        
        usageStats[today][data.action] = (usageStats[today][data.action] || 0) + 1;
        usageStats[today].totalQueries = (usageStats[today].totalQueries || 0) + 1;
        
        await chrome.storage.local.set({ usageStats });
        
        // Show encouragement for milestones
        const totalToday = usageStats[today].totalQueries;
        if (totalToday === 1) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'Great start! 🌟',
                message: 'You\'ve taken the first step toward better health today.'
            });
        } else if (totalToday === 5) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'icons/icon48.png',
                title: 'You\'re doing great! 💪',
                message: 'You\'ve been actively caring for your health today.'
            });
        }
        
    } catch (error) {
        console.log('Failed to track usage:', error);
    }
}

function getDailyHealthTip() {
    const tips = [
        "Stay hydrated throughout the day",
        "Take regular breaks from screen time",
        "Practice deep breathing when stressed",
        "Get some fresh air and sunlight",
        "Eat mindfully and in moderation",
        "Connect with loved ones",
        "Practice gratitude daily",
        "Move your body regularly",
        "Get adequate sleep",
        "Seek help when needed"
    ];
    
    return tips[Math.floor(Math.random() * tips.length)];
}

async function checkAPIStatus() {
    try {
        const response = await fetch('http://localhost:8000/health');
        return response.ok ? 'connected' : 'error';
    } catch (error) {
        return 'offline';
    }
}

// Context menu integration (for future enhancement)
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "shifaAIHelp",
        title: "Ask ShifaAI about this",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "shifaAIHelp" && info.selectionText) {
        // Store the selected text and open popup
        chrome.storage.local.set({ selectedText: info.selectionText });
        chrome.action.openPopup();
    }
});

// Handle storage changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.shifaAIPreferences) {
        const newPrefs = changes.shifaAIPreferences.newValue;
        
        // Update daily tip alarm based on preferences
        if (newPrefs.dailyTipEnabled === false) {
            chrome.alarms.clear('dailyTip');
        } else if (newPrefs.dailyTipEnabled === true) {
            setupDailyTipAlarm();
        }
    }
});

// Error handling
chrome.runtime.onSuspend.addListener(() => {
    console.log('ShifaAI Extension suspending');
});

chrome.runtime.onStartup.addListener(() => {
    console.log('ShifaAI Extension starting up');
});

// Service worker keep-alive (Chrome extension best practice)
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive(); 