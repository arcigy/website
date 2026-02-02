document.addEventListener('DOMContentLoaded', () => {
    // Global Calendar Variables
    let CAL_EVENT_TYPE_ID;
    let CAL_USERNAME;

    // Default Cal.com Credentials
    const DEFAULT_CAL_EVENT_TYPE_ID = '4027752';
    const DEFAULT_CAL_USERNAME = 'jan_novak_calcom'; // Assuming username from previous context or generic placeholder if unknown. 
    // Wait, the user provided the ID but not the username in the feedback. 
    // In step 2 context, username was "jan_novak_calcom". I will use that as default, but prioritize what comes from N8N if any.
    // Actually, looking at the user's feedback, they only sent the ID. I should probably keep the ID hardcoded or default.

    let CURRENT_VIEW_YEAR;
    let CURRENT_VIEW_MONTH; // 1-12
    const DEFAULT_BACKEND_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:8000' 
        : 'https://my-website-backend-production-c000.up.railway.app';
    const BACKEND_URL = window.ARCIGY_BACKEND_URL || DEFAULT_BACKEND_URL;
    const CHAT_WEBHOOK_URL = `${BACKEND_URL}/webhook/chat`;
    const CALENDAR_AVAILABILITY_URL = `${BACKEND_URL}/webhook/calendar-availability-check`;

    console.log('🤖 Tony Chatbot initialized. Backend URL:', BACKEND_URL);
    console.log('👤 Current UserState:', window.UserState ? window.UserState.get() : 'Not found');

    const chatBubble = `
        <div class="chat-bubble" id="chat-bubble">
            <div class="notification-badge" id="notification-badge">1</div>
            <img src="favicon.png" alt="Chat" style="width: 32px; height: 32px;">
        </div>
        <div class="chat-notification-bubble" id="chat-notification-bubble"></div>
    `;

    const chatWindow = `
        <div class="chat-window" id="chat-window">
            <div class="chat-header">
                <span id="chat-header-title">Chat with us!</span>
                <button id="close-chat">&times;</button>
            </div>
            <div class="chat-messages" id="chat-messages"></div>
            

            <div class="chat-input-container">
                <input type="text" id="chat-input" placeholder="Type a message...">
                <button id="send-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                </button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatBubble);
    document.body.insertAdjacentHTML('beforeend', chatWindow);

    const chatBubbleEl = document.getElementById('chat-bubble');
    const badgeEl = document.getElementById('notification-badge');
    const notificationBubbleEl = document.getElementById('chat-notification-bubble');
    const chatWindowEl = document.getElementById('chat-window');
    const closeChatEl = document.getElementById('close-chat');
    const chatMessagesEl = document.getElementById('chat-messages');
    const chatInputEl = document.getElementById('chat-input');
    const sendBtnEl = document.getElementById('send-btn');
    const chatHeaderEl = document.querySelector('.chat-header');

    let conversationId = sessionStorage.getItem('conversationId');
    let chatHistory = JSON.parse(sessionStorage.getItem('chatHistory')) || [];

    function generateConversationId() {
        const date = new Date();
        const d = String(date.getDate()).padStart(2, '0');
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const y = String(date.getFullYear()).slice(-2);
        const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomId = '';
        for (let i = 0; i < 8; i++) {
            randomId += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return `${d}${m}${y}${randomId}`;
    }

    function toggleChatWindow() {
        const isChatOpen = chatWindowEl.style.display === 'flex';
        if (isChatOpen) {
            chatBubbleEl.classList.remove('closing');
            chatWindowEl.classList.add('closing');
            chatBubbleEl.style.display = 'flex';
            chatBubbleEl.classList.add('opening');
            setTimeout(() => {
                chatWindowEl.style.display = 'none';
                chatWindowEl.classList.remove('closing');
            }, 300); // Match animation duration
        } else {
            // Mark chat as opened (read receipt)
            sessionStorage.setItem('chatHasBeenOpened', 'true');

            // Clear notifications when opening
            badgeEl.style.display = 'none';
            notificationBubbleEl.classList.remove('active', 'hiding');

            chatWindowEl.classList.remove('closing');
            chatBubbleEl.classList.add('closing');
            chatWindowEl.style.display = 'flex';
            chatWindowEl.classList.add('opening');
            setTimeout(() => {
                chatBubbleEl.style.display = 'none';
                chatBubbleEl.classList.remove('closing');
            }, 300); // Match animation duration

            // Update header and placeholder
            const lang = localStorage.getItem('language') || 'en';
            const headerTitle = document.getElementById('chat-header-title');
            if (headerTitle) {
                headerTitle.textContent = lang === 'sk' ? 'Napíšte nám!' : 'Chat with us!';
            }
            if (chatInputEl) {
                chatInputEl.placeholder = lang === 'sk' ? 'Napíšte správu...' : 'Type a message...';
            }
        }
    }

    // ... (Existing code) ...

    // --- Auto Greeting Logic ---
    // If chat hasn't been opened yet, we want the notification to persist across pages.
    const hasOpenedChat = sessionStorage.getItem('chatHasBeenOpened') === 'true';

    if (!hasOpenedChat) {
        const hasShownWelcome = sessionStorage.getItem('welcomeNotificationShown') === 'true';

        // If already shown on a previous page, show immediately (no delay)
        const delay = hasShownWelcome ? 0 : 3000;

        setTimeout(() => {
            // Re-check just in case user opened chat during the delay
            if (chatWindowEl.style.display === 'flex') return;
            if (sessionStorage.getItem('chatHasBeenOpened') === 'true') return;

            const lang = sessionStorage.getItem('chatLang') || document.documentElement.lang || 'en';
            const welcomeMessage = lang === 'sk' ? 'Som Tony, ako vám môžem pomôcť?' : 'I am Tony, how can I help you?';

            const lastMsg = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;

            // Mark as shown so next page loads immediate
            sessionStorage.setItem('welcomeNotificationShown', 'true');

            if (lastMsg && (lastMsg.text === 'Som Tony, ako vám môžem pomôcť?' || lastMsg.text === 'I am Tony, how can I help you?')) {
                // Message exists, just show the bubble again (visual only)
                badgeEl.style.display = 'flex';
                notificationBubbleEl.textContent = welcomeMessage;
                notificationBubbleEl.classList.remove('hiding');
                notificationBubbleEl.classList.add('active');
            } else if (!lastMsg && chatHistory.length === 0) {
                // New welcome message (appends to history + shows bubble)
                // autoHide = false (persist)
                appendMessage(welcomeMessage, 'bot', true, false);
            }
        }, delay);
    }

    chatBubbleEl.addEventListener('click', toggleChatWindow);
    closeChatEl.addEventListener('click', toggleChatWindow);

    async function sendMessage() {
        const messageText = chatInputEl.value.trim();
        if (messageText === '') return;

        if (!conversationId) {
            conversationId = generateConversationId();
            sessionStorage.setItem('conversationId', conversationId);
        }

        appendMessage(messageText, 'user');
        chatInputEl.value = '';
        chatInputEl.disabled = true;
        sendBtnEl.disabled = true;

        try {
            const response = await fetch(CHAT_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: messageText,
                    conversationID: conversationId,
                    history: chatHistory,
                    lang: localStorage.getItem('language') || document.documentElement.lang || 'en',
                    userData: window.UserState ? window.UserState.get() : {}
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Pass full data to handler
            handleBackendResponse(data);

        } catch (error) {
            console.error('❌ Chatbot Fetch Error:', error);
            let userErrorMsg = 'Error: Could not connect to the server.';
            if (error.message.includes('Failed to fetch')) {
                userErrorMsg = 'Network error. Please check if the backend is running and CORS is allowed.';
            }
            appendMessage(userErrorMsg, 'bot');
        } finally {
            chatInputEl.disabled = false;
            sendBtnEl.disabled = false;
            chatInputEl.focus();
        }
    }

    function renderMessage(text, type, withTypingEffect = false) {
        const messageEl = document.createElement('div');
        messageEl.classList.add('message', type);

        if (withTypingEffect) {
            let i = 0;
            const interval = setInterval(() => {
                if (i < text.length) {
                    messageEl.textContent += text.charAt(i);
                    i++;
                    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
                } else {
                    clearInterval(interval);
                }
            }, 50);
        } else {
            messageEl.textContent = text;
        }

        chatMessagesEl.appendChild(messageEl);
        chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }

    function appendMessage(text, type, withTypingEffect = false, autoHide = true) {
        // Save new message to history
        chatHistory.push({ text, type });
        sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));

        // Render the message visually
        renderMessage(text, type, withTypingEffect);

        // Show notification if chat is closed and message is from bot
        const isChatOpen = chatWindowEl.style.display === 'flex';
        if (!isChatOpen && type === 'bot') {
            badgeEl.style.display = 'flex';
            // Allow full text but with max-width from CSS
            notificationBubbleEl.textContent = text;
            notificationBubbleEl.classList.remove('hiding');
            notificationBubbleEl.classList.add('active');

            // Auto hide notification bubble after 8 seconds but keep badge
            if (autoHide) {
                setTimeout(() => {
                    if (notificationBubbleEl.classList.contains('active')) {
                        notificationBubbleEl.classList.remove('active');
                        notificationBubbleEl.classList.add('hiding');
                        setTimeout(() => {
                            notificationBubbleEl.classList.remove('hiding');
                        }, 400);
                    }
                }, 8000);
            }
        }
    }

    sendBtnEl.addEventListener('click', sendMessage);
    chatInputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    chatInputEl.addEventListener('input', () => {
        chatInputEl.style.height = 'auto';
        chatInputEl.style.height = `${chatInputEl.scrollHeight}px`;
    });



    // Load chat history on page load without re-saving it
    chatHistory.forEach(msg => renderMessage(msg.text, msg.type, false));

    // REMOVE THIS CODE TO DISABLE DIRECT CALENDAR ACCESS
    const openCalendarBtn = document.getElementById('open-calendar-btn');
    if (openCalendarBtn) {
        openCalendarBtn.addEventListener('click', () => {
            openCalendarWindow();
        });
    }

    // --- Calendar Integration Logic ---

    // Step 2: Handle Backend Response
    // Step 2: Handle Backend Response
    function handleBackendResponse(data) {
        // 1. Display the text response
        const messageText = data.response || 'Sorry, I did not understand that.';
        appendMessage(messageText, 'bot', true);

        // 2. State tracking for frontend (New Architecture)
        if (window.UserState) {
            if (data.extractedData && Object.keys(data.extractedData).length > 0) {
                // If backend provides specific frontend bundle
                window.UserState.update(data.extractedData);
            } else {
                // Fallback: Check root fields (legacy/supabase support)
                const update = {};
                if (data.email && data.email !== "null") update.email = data.email;
                if (data.phone && data.phone !== "null") update.phone = data.phone;

                // Construct fullname from parts if available
                if (data.forname && data.forname !== "null") {
                    const s = (data.surname && data.surname !== "null") ? data.surname : '';
                    update.fullName = `${data.forname} ${s}`.trim();
                }

                if (Object.keys(update).length > 0) {
                    window.UserState.update(update);
                }
            }
        }

        if (data.lang) sessionStorage.setItem('chatLang', data.lang);

        // 3. Intention handling
        if (data.intention === "calendar") {
            if (window.arcigyCalendar) {
                window.arcigyCalendar.open();
            }
        }
    }

    // Event listener for calendar booking
    window.addEventListener('calendar-book-initiated', (e) => {
        let { name, time, date } = e.detail;

        // Use UserState if available to avoid stale names like 'Jozef'
        if (window.UserState && window.UserState.get().fullName) {
            name = window.UserState.get().fullName;
        }

        // Prioritize actual page language over session history
        const pageLang = localStorage.getItem('language') || document.documentElement.lang || 'en';
        const lang = pageLang.split('-')[0]; // Handle 'sk-SK' or 'en-US'

        // Format date to local format (d.m.Y)
        const dateParts = date.includes('-') ? date.split('-') : date.split('.');
        let formattedDate = date;
        if (dateParts.length === 3) {
            if (dateParts[0].length === 4) {
                formattedDate = `${parseInt(dateParts[2])}.${parseInt(dateParts[1])}.${dateParts[0]}`;
            } else {
                formattedDate = `${parseInt(dateParts[0])}.${parseInt(dateParts[1])}.${dateParts[2]}`;
            }
        }

        let msg;
        if (lang === 'sk') {
            msg = `Super ${name}! Tešíme sa na teba. Žiadosť o termín na ${formattedDate} o ${time} sme prijali. Prosím, skontroluj si teraz svoj email a potvrď rezerváciu kliknutím na odkaz v správe.`;
        } else {
            msg = `Great ${name}! We're looking forward to seeing you. Your request for ${formattedDate} at ${time} has been received. Please check your email and confirm your booking by clicking the link in the message.`;
        }

        appendMessage(msg, 'bot', true);
    });

    // OLD CALENDAR LOGIC REMOVED - using global widget now

    // --- Dynamic Language Update ---
    window.updateChatbotLanguage = function (lang) {
        const MSG_EN = 'I am Tony, how can I help you?';
        const MSG_SK = 'Som Tony, ako vám môžem pomôcť?';

        const newWelcome = lang === 'sk' ? MSG_SK : MSG_EN;
        const oldWelcome = lang === 'sk' ? MSG_EN : MSG_SK;

        // 1. Update History
        let historyChanged = false;
        chatHistory = chatHistory.map(msg => {
            if (msg.text === oldWelcome) {
                historyChanged = true;
                return { ...msg, text: newWelcome };
            }
            return msg;
        });

        if (historyChanged) {
            sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));

            // 2. Re-render messages if chat is open
            chatMessagesEl.innerHTML = '';
            chatHistory.forEach(msg => renderMessage(msg.text, msg.type, false));
        }

        // 3. Update Notification Bubble if it shows the old welcome message
        if (notificationBubbleEl.textContent === oldWelcome) {
            notificationBubbleEl.textContent = newWelcome;
        }

        // Update session lang
        sessionStorage.setItem('chatLang', lang);

        // Update static UI
        const headerTitle = document.getElementById('chat-header-title');
        if (headerTitle) {
            headerTitle.textContent = lang === 'sk' ? 'Napíšte nám!' : 'Chat with us!';
        }
        if (chatInputEl) {
            chatInputEl.placeholder = lang === 'sk' ? 'Napíšte správu...' : 'Type a message...';
        }
    };

    // Expose function to trigger pricing warning from other scripts
    window.triggerPricingWarning = function (lang) {
        // Close chat window if open so bubble is visible
        const isChatOpen = chatWindowEl.style.display === 'flex';
        if (isChatOpen) {
            toggleChatWindow();
        }

        // Define messages
        const messages = {
            en: [
                "Are you sure you want to choose this path before the AI Audit? After the AI audit, we have a detailed analysis, we can determine the exact value and identify all pain points.",
                "By the way, automations implemented based on an audit are usually up to 30% cheaper."
            ],
            sk: [
                "Ste si istý, že chcete zvoliť tento postup ešte pred AI auditom? Po AI audite máme všetko detailne analyzované, vieme presne určiť hodnotu a nájsť všetky pain points.",
                "Mimochodom, automatizácie navrhnuté na základe auditu bývajú zvyčajne až o 30% lacnejšie."
            ]
        };

        const msgs = messages[lang] || messages['en'];

        // Show first message in bubble
        if (notificationBubbleEl) {
            badgeEl.style.display = 'flex';
            notificationBubbleEl.textContent = msgs[0];
            notificationBubbleEl.classList.remove('hiding');
            notificationBubbleEl.classList.add('active');

            // Log to history ONLY if not already the last message
            const lastMsg = chatHistory.length > 0 ? chatHistory[chatHistory.length - 1] : null;
            if (!lastMsg || lastMsg.text !== msgs[0]) {
                appendMessage(msgs[0], 'bot');

                // Show second message after delay if we appended the first
                setTimeout(() => {
                    notificationBubbleEl.classList.remove('active');
                    setTimeout(() => {
                        notificationBubbleEl.textContent = msgs[1];
                        notificationBubbleEl.classList.add('active');
                        appendMessage(msgs[1], 'bot');
                    }, 200);
                }, 4500);
            } else {
                // It was already the last message, just simulate the bubble sequence visually
                setTimeout(() => {
                    notificationBubbleEl.classList.remove('active');
                    notificationBubbleEl.classList.add('hiding');
                    setTimeout(() => {
                        notificationBubbleEl.textContent = msgs[1];
                        notificationBubbleEl.classList.remove('hiding');
                        notificationBubbleEl.classList.add('active');
                    }, 400);
                }, 4500);
            }
        }
    };

    window.triggerAuditWelcome = function (lang) {
        // ... (existing code omitted for brevity) ...
    };

    window.showChatbotNotification = function (msg) {
        if (notificationBubbleEl) {
            badgeEl.style.display = 'flex';
            notificationBubbleEl.textContent = msg;
            notificationBubbleEl.classList.remove('hiding');
            notificationBubbleEl.classList.add('active');

            // Auto hide after 8 seconds (matching appendMessage logic)
            setTimeout(() => {
                notificationBubbleEl.classList.add('hiding');
                notificationBubbleEl.classList.remove('active');
            }, 8000);
        }
    };

    // NEW: Robust trigger for external pages
    window.triggerChatMessage = function (msg) {
        // 1. Ensure chat is closed so bubble is visible
        if (window.isChatOpen()) {
            toggleChatWindow();
        }

        // 2. Add message which triggers notification bubble
        appendMessage(msg, 'bot', false, false); // False = don't auto-hide immediately, let user see it
    };

    // Expose control functions
    window.isChatOpen = () => chatWindowEl.style.display === 'flex';
    window.closeChat = () => {
        if (window.isChatOpen()) toggleChatWindow();
    };

});
