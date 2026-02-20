// Calendar Component Logic
(function () {
    const CalendarWidget = {
        state: {
            isOpen: false,
            isMinimized: false,
            currentDate: new Date(),
            selectedDate: null,
            selectedTimeSlot: null,
            selectedTimeSlotFullISO: null,
            bookedSlots: [],
            currentLang: localStorage.getItem('language') || 'en'
        },

        WEBHOOK_URL: '',
        BOOKING_URL: '',

        translations: {
            en: {
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                weekdaysShort: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                scheduler: "Scheduler",
                selectDate: "Select a Date",
                toView: "to view availability",
                pleaseSelect: "Please select a date from the calendar.",
                noSlots: "No slots available.",
                confirmBooking: "Confirm Booking",
                selectTime: "Select Time",
                acceptTerms: "Accept Terms",
                processing: "Processing...",
                termsText: "I agree to the <a href='terms-of-service.html' target='_blank'>Terms of Service</a>",
                privacyText: "I agree to the <a href='privacy-policy.html' target='_blank'>Privacy Policy</a>",
                alertTerms: "Please accept the Terms of Service and Privacy Policy.",
                alertSuccess: "Booking confirmed for {date} at {time}",
                alertFail: "Failed to confirm booking. Please try again."
            },
            sk: {
                months: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"],
                monthsShort: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"],
                weekdaysShort: ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"],
                scheduler: "Plánovač",
                selectDate: "Vyberte dátum",
                toView: "pre zobrazenie dostupnosti",
                pleaseSelect: "Prosím, vyberte dátum z kalendára.",
                noSlots: "Žiadne voľné termíny.",
                confirmBooking: "Potvrdiť rezerváciu",
                selectTime: "Vyberte čas",
                acceptTerms: "Súhlasiť s podmienkami",
                processing: "Spracováva sa...",
                termsText: "Súhlasím s <a href='terms-of-service.html' target='_blank'>Obchodnými podmienkami</a>",
                privacyText: "Súhlasím so <a href='privacy-policy.html' target='_blank'>Zásadami ochrany súkromia</a>",
                alertTerms: "Prosím, akceptujte Obchodné podmienky a Zásady ochrany súkromia.",
                alertSuccess: "Rezervácia potvrdená na {date} o {time}",
                alertFail: "Nepodarilo sa potvrdiť rezerváciu. Skúste to prosím znova."
            }
        },

        init: function () {
            const DEFAULT_BACKEND_URL = 'https://my-website-backend-production-c000.up.railway.app';
            const BACKEND_URL = window.ARCIGY_BACKEND_URL || DEFAULT_BACKEND_URL;
            this.WEBHOOK_URL = `${BACKEND_URL}/webhook/calendar-availability-check`;
            this.BOOKING_URL = `${BACKEND_URL}/webhook/calendar-initiate-book`;
            console.log('📅 Calendar Widget initialized with backend:', BACKEND_URL);

            this.injectHTML();
            this.cacheDOM();
            this.bindEvents();
            this.updateLanguage(this.state.currentLang); // Initial render happens here

            // Check session storage for state
            const savedState = sessionStorage.getItem('calendarState');
            if (savedState) {
                const parsed = JSON.parse(savedState);
                if (parsed.isOpen) {
                    this.open();
                    if (parsed.isMinimized) this.minimize();
                }
            }
        },

        injectHTML: function () {
            const container = document.createElement('div');
            container.id = 'calendar-root';
            // Inner HTML structure is injected initially, text content updated via updateLanguage
            container.innerHTML = `
                <!-- Main Widget -->
                <div id="calendar-widget-container">
                    <div class="minimized-content">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        <span>Scheduler</span>
                    </div>

                    <div class="calendar-widget-header">
                        <div class="calendar-widget-title">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span id="cal-title">Scheduler</span>
                        </div>
                        <div class="calendar-widget-controls">
                            <button class="widget-control-btn minimize-btn" aria-label="Minimize">
                                _
                            </button>
                            <button class="widget-control-btn close-btn" aria-label="Close">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="calendar-content-wrapper">
                        <!-- Left: Calendar Grid -->
                        <div class="calendar-main-area">
                            <div class="calendar-top-controls">
                                <div class="year-nav">
                                    <button class="prev-year"><</button>
                                    <span class="current-year-display">2025</span>
                                    <button class="next-year">></button>
                                </div>
                            </div>

                            <div class="month-scroll-container">
                                <div class="month-list" id="month-list">
                                    <!-- Months injected via JS -->
                                </div>
                            </div>

                            <div class="calendar-days-header" id="calendar-days-header">
                                <!-- Weekdays injected via JS -->
                            </div>
                            <div class="calendar-grid" id="calendar-grid">
                                <!-- Days injected via JS -->
                            </div>
                        </div>

                        <!-- Right: Time Slots -->
                        <div class="calendar-sidebar-area">
                            <div class="selected-date-info">
                                <h3 id="selected-date-display">Select a Date</h3>
                                <p id="selected-day-display">to view availability</p>
                            </div>
                            
                            <div class="time-slots-list" id="time-slots-list">
                                <!-- Slots injected via JS -->
                            </div>
                            
                            <!-- Checkboxes -->
                            <div class="terms-container">
                                <div class="checkbox-group">
                                    <input type="checkbox" id="cal-terms-check">
                                    <label for="cal-terms-check" id="label-terms">I agree to the <a href="terms-of-service.html" target="_blank">Terms of Service</a></label>
                                </div>
                                <div class="checkbox-group">
                                    <input type="checkbox" id="cal-privacy-check">
                                    <label for="cal-privacy-check" id="label-privacy">I agree to the <a href="privacy-policy.html" target="_blank">Privacy Policy</a></label>
                                </div>
                            </div>

                            <button class="confirm-btn" id="confirm-booking-btn" disabled>Confirm Booking</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(container);
        },

        cacheDOM: function () {
            this.dom = {
                container: document.getElementById('calendar-widget-container'),
                minimizedContent: document.querySelector('.minimized-content'),
                minimizeBtn: document.querySelector('.minimize-btn'),
                closeBtn: document.querySelector('.close-btn'),
                prevYear: document.querySelector('.prev-year'),
                nextYear: document.querySelector('.next-year'),
                yearDisplay: document.querySelector('.current-year-display'),
                monthList: document.getElementById('month-list'),
                daysHeader: document.getElementById('calendar-days-header'),
                grid: document.getElementById('calendar-grid'),
                dateDisplay: document.getElementById('selected-date-display'),
                dayDisplay: document.getElementById('selected-day-display'),
                slotsList: document.getElementById('time-slots-list'),
                confirmBtn: document.getElementById('confirm-booking-btn'),
                termsCheck: document.getElementById('cal-terms-check'),
                privacyCheck: document.getElementById('cal-privacy-check'),
                labelTerms: document.getElementById('label-terms'),
                labelPrivacy: document.getElementById('label-privacy'),
                calTitle: document.getElementById('cal-title')
            };
        },

        bindEvents: function () {
            this.dom.closeBtn.addEventListener('click', () => this.close());
            this.dom.minimizeBtn.addEventListener('click', () => this.minimize());
            this.dom.minimizedContent.addEventListener('click', () => this.maximize());

            this.dom.prevYear.addEventListener('click', () => {
                this.state.currentDate.setFullYear(this.state.currentDate.getFullYear() - 1);
                this.render();
            });

            this.dom.nextYear.addEventListener('click', () => {
                this.state.currentDate.setFullYear(this.state.currentDate.getFullYear() + 1);
                this.render();
            });

            this.dom.termsCheck.addEventListener('change', () => this.updateConfirmBtn());
            this.dom.privacyCheck.addEventListener('change', () => this.updateConfirmBtn());

            this.dom.confirmBtn.addEventListener('click', async () => {
                if (!this.state.selectedDate || !this.state.selectedTimeSlot) return;

                const t = this.translations[this.state.currentLang];

                if (!this.dom.termsCheck.checked || !this.dom.privacyCheck.checked) {
                    alert(t.alertTerms);
                    return;
                }

                const conversationId = sessionStorage.getItem('conversationId');

                // Get current user state (name, email, phone)
                const userState = window.UserState ? window.UserState.get() : {};
                const userName = userState.fullName || sessionStorage.getItem('userName') || localStorage.getItem('userName') || "Client";
                const userEmail = userState.email || sessionStorage.getItem('userEmail') || localStorage.getItem('userEmail') || "null";
                const userPhone = userState.phone || sessionStorage.getItem('userPhone') || localStorage.getItem('userPhone') || "null";

                this.dom.confirmBtn.disabled = true;
                this.dom.confirmBtn.textContent = t.processing;

                try {
                    const response = await fetch(this.BOOKING_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            bookingTime: this.state.selectedTimeSlotFullISO,
                            email: userEmail || "null",
                            name: userName || "Client",
                            phone: userPhone || "null",
                            lang: this.state.currentLang,
                            conversationID: conversationId
                        })
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.status === "error") {
                            alert(this.state.currentLang === 'sk' ? "Chyba pri odosielaní emailu. Skontrolujte nastavenia." : "Error sending email. Please check settings.");
                            this.updateConfirmBtn();
                            return;
                        }

                        // Notify chatbot to post confirmation message
                        window.dispatchEvent(new CustomEvent('calendar-book-initiated', {
                            detail: {
                                name: userName || "Client",
                                time: this.state.selectedTimeSlot,
                                date: this.state.selectedDate
                            }
                        }));
                    } else {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || 'Booking failed');
                    }
                } catch (e) {
                    console.error('❌ Calendar Booking Error:', e);
                    alert(`${t.alertFail} (${e.message})`);
                    this.updateConfirmBtn();
                }
            });
        },

        updateLanguage: function (lang) {
            // Safety check: if dom elements aren't cached yet, don't try to update them
            if (!this.dom || !this.dom.calTitle) return;

            this.state.currentLang = lang || 'en';
            const t = this.translations[this.state.currentLang];

            // Update static texts
            this.dom.calTitle.textContent = t.scheduler;
            this.dom.labelTerms.innerHTML = t.termsText;
            this.dom.labelPrivacy.innerHTML = t.privacyText;

            // Re-render components dependent on language
            this.render();
            this.updateConfirmBtn();

            // If nothing selected, reset prompt
            if (!this.state.selectedDate) {
                this.dom.dateDisplay.textContent = t.selectDate;
                this.dom.dayDisplay.textContent = t.toView;
                this.dom.slotsList.innerHTML = `<div style="text-align: center; color: var(--cal-text-muted); font-size: 0.85rem; padding: 20px;">${t.pleaseSelect}</div>`;
            } else {
                // Refresh date display in new language
                const [y, m, d] = this.state.selectedDate.split('-').map(Number);
                const dateObj = new Date(y, m - 1, d);
                // Use built-in locale logic for full dates, or manual if preferred. 
                // Using browser's toLocaleDateString with explicit locale code
                const localeCode = this.state.currentLang === 'sk' ? 'sk-SK' : 'en-US';

                this.dom.dateDisplay.textContent = dateObj.toLocaleDateString(localeCode, { month: 'short', day: 'numeric' });
                this.dom.dayDisplay.textContent = dateObj.toLocaleDateString(localeCode, { weekday: 'long' });
            }
        },

        open: function () {
            this.state.isOpen = true;
            this.state.isMinimized = false;
            this.dom.container.classList.add('active');
            this.dom.container.classList.remove('minimized');
            this.saveState();
            this.fetchBookings();
        },

        close: function () {
            this.state.isOpen = false;
            this.state.isMinimized = false;
            this.dom.container.classList.remove('active');
            this.saveState();
        },

        minimize: function () {
            this.state.isMinimized = true;
            this.dom.container.classList.add('minimized');
            this.saveState();
        },

        maximize: function () {
            this.state.isMinimized = false;
            this.dom.container.classList.remove('minimized');
            this.saveState();
        },

        saveState: function () {
            sessionStorage.setItem('calendarState', JSON.stringify({
                isOpen: this.state.isOpen,
                isMinimized: this.state.isMinimized
            }));
        },

        fetchBookings: async function () {
            try {
                const response = await fetch(this.WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({})
                });
                if (!response.ok) throw new Error('Failed to fetch availability');
                const data = await response.json();
                if (data && data.length > 0 && data[0].bookings_summary) {
                    this.state.bookedSlots = this.parseBookingSummary(data[0].bookings_summary);
                    this.renderDays();
                    if (this.state.selectedDate) {
                        const [y, m, d] = this.state.selectedDate.split('-').map(Number);
                        const dateObj = new Date(y, m - 1, d);
                        this.renderTimeSlots(dateObj);
                    }
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
                this.state.bookedSlots = [];
            }
        },

        parseBookingSummary: function (summary) {
            const regex = /\(([^)]+)\), \(([^)]+)\)/;
            if (!Array.isArray(summary)) return [];
            return summary.map(item => {
                const match = item.match(regex);
                if (match) {
                    return {
                        start: new Date(match[1]),
                        end: new Date(match[2])
                    };
                }
                return null;
            }).filter(item => item !== null);
        },

        render: function () {
            const t = this.translations[this.state.currentLang];
            this.dom.yearDisplay.textContent = this.state.currentDate.getFullYear();

            // Render Months
            this.dom.monthList.innerHTML = '';
            t.monthsShort.forEach((month, index) => {
                const pill = document.createElement('button');
                pill.className = `month-pill ${index === this.state.currentDate.getMonth() ? 'active' : ''}`;
                pill.textContent = month;
                pill.onclick = () => {
                    this.state.currentDate.setMonth(index);
                    this.render();
                };
                this.dom.monthList.appendChild(pill);
            });

            // Render Weekday Header
            this.dom.daysHeader.innerHTML = '';
            t.weekdaysShort.forEach(day => {
                const el = document.createElement('span');
                el.textContent = day;
                this.dom.daysHeader.appendChild(el);
            });

            this.renderDays();
        },

        renderDays: function () {
            this.dom.grid.innerHTML = '';
            const year = this.state.currentDate.getFullYear();
            const month = this.state.currentDate.getMonth();

            // Adjust start day based on locale if needed, but standardizing on Mon-Sun for now to match header array
            // JS getDay(): 0=Sun, 1=Mon. We want Mon=0 for our grid if header starts with Mon.
            // Header is Mon...Sun.
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startOffset = (firstDay === 0 ? 6 : firstDay - 1);

            for (let i = 0; i < startOffset; i++) {
                const cell = document.createElement('div');
                cell.className = 'cal-day empty';
                this.dom.grid.appendChild(cell);
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let day = 1; day <= daysInMonth; day++) {
                const dateObj = new Date(year, month, day);
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayOfWeek = dateObj.getDay();

                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const isSelected = this.state.selectedDate === dateStr;
                const isPast = dateObj < today;
                const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

                const isDisabled = isPast || isWeekend;

                const cell = document.createElement('div');
                cell.className = `cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`;
                cell.innerHTML = `<span>${day}</span>`;

                if (!isDisabled) {
                    cell.onclick = () => this.selectDate(dateStr, day, month, year);
                }
                this.dom.grid.appendChild(cell);
            }
        },

        selectDate: function (dateStr, day, month, year) {
            this.state.selectedDate = dateStr;
            this.state.selectedTimeSlot = null;
            this.render(); // Re-render highlights

            const dateObj = new Date(year, month, day);
            const localeCode = this.state.currentLang === 'sk' ? 'sk-SK' : 'en-US';
            this.dom.dateDisplay.textContent = dateObj.toLocaleDateString(localeCode, { month: 'short', day: 'numeric' });
            this.dom.dayDisplay.textContent = dateObj.toLocaleDateString(localeCode, { weekday: 'long' });

            this.renderTimeSlots(dateObj);
            this.updateConfirmBtn();
        },

        renderTimeSlots: function (dateObj) {
            this.dom.slotsList.innerHTML = '';
            const t = this.translations[this.state.currentLang];

            const slots = [];
            // 9-11
            for (let h = 9; h < 11; h++) { slots.push({ h, m: 0 }); slots.push({ h, m: 30 }); }
            // 14-16
            for (let h = 14; h < 16; h++) { slots.push({ h, m: 0 }); slots.push({ h, m: 30 }); }

            let hasAvailable = false;

            slots.forEach(slot => {
                const timeStr = `${String(slot.h).padStart(2, '0')}:${String(slot.m).padStart(2, '0')}`;
                const slotDate = new Date(dateObj);
                slotDate.setHours(slot.h, slot.m, 0, 0);

                const isBooked = this.state.bookedSlots.some(booked =>
                    slotDate >= booked.start && slotDate < booked.end
                );

                const el = document.createElement('div');
                el.className = `time-slot-item ${isBooked ? 'booked' : ''}`;

                if (isBooked) {
                    el.textContent = timeStr;
                    el.title = "Booked";
                } else {
                    el.textContent = timeStr;
                    hasAvailable = true;
                    el.onclick = () => {
                        this.dom.slotsList.querySelectorAll('.time-slot-item').forEach(i => i.classList.remove('selected'));
                        el.classList.add('selected');
                        this.state.selectedTimeSlot = timeStr;
                        this.state.selectedTimeSlotFullISO = slotDate.toISOString();
                        this.updateConfirmBtn();
                    };
                }
                this.dom.slotsList.appendChild(el);
            });

            if (!hasAvailable) {
                this.dom.slotsList.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--cal-text-muted); font-size: 0.8rem;">${t.noSlots}</div>`;
            }
        },

        updateConfirmBtn: function () {
            const t = this.translations[this.state.currentLang];
            const termsAccepted = this.dom.termsCheck.checked && this.dom.privacyCheck.checked;

            if (this.state.selectedDate && this.state.selectedTimeSlot && termsAccepted) {
                this.dom.confirmBtn.disabled = false;
                this.dom.confirmBtn.textContent = `${t.confirmBooking} (${this.state.selectedTimeSlot})`;
            } else {
                this.dom.confirmBtn.disabled = true;
                if (!this.state.selectedTimeSlot) {
                    this.dom.confirmBtn.textContent = t.selectTime;
                } else if (!termsAccepted) {
                    this.dom.confirmBtn.textContent = t.acceptTerms;
                } else {
                    this.dom.confirmBtn.textContent = t.confirmBooking;
                }
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => CalendarWidget.init());
    } else {
        CalendarWidget.init();
    }

    window.arcigyCalendar = CalendarWidget;

})();
