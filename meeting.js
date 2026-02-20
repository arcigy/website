(function () {
    const MeetingScheduler = {
        state: {
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
                selectDate: "Select a Date",
                toView: "to view availability",
                pleaseSelect: "Please select a date from the calendar.",
                noSlots: "No slots available.",
                scheduleEvent: "Schedule Event",
                processing: "Processing...",
                alertSuccess: "Booking confirmed for {date} at {time}",
                alertFail: "Failed to confirm booking. Please try again."
            },
            sk: {
                months: ["Január", "Február", "Marec", "Apríl", "Máj", "Jún", "Júl", "August", "September", "Október", "November", "December"],
                monthsShort: ["Jan", "Feb", "Mar", "Apr", "Máj", "Jún", "Júl", "Aug", "Sep", "Okt", "Nov", "Dec"],
                weekdaysShort: ["Po", "Ut", "St", "Št", "Pi", "So", "Ne"],
                selectDate: "Vyberte dátum",
                toView: "pre zobrazenie dostupnosti",
                pleaseSelect: "Prosím, vyberte dátum z kalendára.",
                noSlots: "Žiadne voľné termíny.",
                scheduleEvent: "Naplánovať udalosť",
                processing: "Spracováva sa...",
                alertSuccess: "Rezervácia potvrdená na {date} o {time}",
                alertFail: "Nepodarilo sa potvrdiť rezerváciu. Skúste to prosím znova."
            }
        },

        init: function () {
            const DEFAULT_BACKEND_URL = 'https://my-website-backend-production-c000.up.railway.app';
            const BACKEND_URL = window.ARCIGY_BACKEND_URL || DEFAULT_BACKEND_URL;
            this.WEBHOOK_URL = `${BACKEND_URL}/webhook/calendar-availability-check`;
            this.BOOKING_URL = `${BACKEND_URL}/webhook/calendar-initiate-book`;
            
            this.cacheDOM();
            this.bindEvents();
            this.updateLanguage(this.state.currentLang);
            this.fetchBookings();
        },

        cacheDOM: function () {
            this.dom = {
                prevYear: document.querySelector('.prev-year'),
                nextYear: document.querySelector('.next-year'),
                yearDisplay: document.querySelector('.current-year-display'),
                monthList: document.getElementById('month-list'),
                daysHeader: document.getElementById('calendar-days-header'),
                grid: document.getElementById('calendar-grid'),
                dateDisplay: document.getElementById('selected-date-display'),
                dayDisplay: document.getElementById('selected-day-display'),
                slotsList: document.getElementById('time-slots-list'),
                scheduler: document.querySelector('.meeting-scheduler'),
                detailsForm: document.querySelector('.meeting-details-form'),
                scheduleEventBtn: document.getElementById('schedule-event-btn'),
                nameInput: document.getElementById('name'),
                emailInput: document.getElementById('email'),
                notesInput: document.getElementById('notes'),
            };
        },

        bindEvents: function () {
            this.dom.prevYear.addEventListener('click', () => {
                this.state.currentDate.setFullYear(this.state.currentDate.getFullYear() - 1);
                this.render();
            });

            this.dom.nextYear.addEventListener('click', () => {
                this.state.currentDate.setFullYear(this.state.currentDate.getFullYear() + 1);
                this.render();
            });

            this.dom.scheduleEventBtn.addEventListener('click', () => this.handleBooking());
        },

        updateLanguage: function (lang) {
            this.state.currentLang = lang || 'en';
            this.render();
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
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
            }
        },

        parseBookingSummary: function (summary) {
            const regex = /\(([^)]+)\), \(([^)]+)\)/;
            if (!Array.isArray(summary)) return [];
            return summary.map(item => {
                const match = item.match(regex);
                if (match) {
                    return { start: new Date(match[1]), end: new Date(match[2]) };
                }
                return null;
            }).filter(item => item !== null);
        },

        render: function () {
            const t = this.translations[this.state.currentLang];
            this.dom.yearDisplay.textContent = this.state.currentDate.getFullYear();

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
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const startOffset = (firstDay === 0 ? 6 : firstDay - 1);

            for (let i = 0; i < startOffset; i++) {
                this.dom.grid.appendChild(document.createElement('div')).className = 'cal-day empty';
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            for (let day = 1; day <= daysInMonth; day++) {
                const dateObj = new Date(year, month, day);
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isPast = dateObj < today;
                const isWeekend = [0, 6].includes(dateObj.getDay());

                const cell = document.createElement('div');
                cell.className = `cal-day ${isPast || isWeekend ? 'disabled' : ''} ${this.state.selectedDate === dateStr ? 'selected' : ''}`;
                cell.textContent = day;
                
                if (!isPast && !isWeekend) {
                    cell.onclick = () => this.selectDate(dateStr, day, month, year);
                }
                this.dom.grid.appendChild(cell);
            }
        },

        selectDate: function (dateStr, day, month, year) {
            this.state.selectedDate = dateStr;
            this.state.selectedTimeSlot = null;
            this.renderDays();

            const dateObj = new Date(year, month, day);
            const localeCode = this.state.currentLang === 'sk' ? 'sk-SK' : 'en-US';
            this.dom.dateDisplay.textContent = dateObj.toLocaleDateString(localeCode, { month: 'long', day: 'numeric' });
            this.dom.dayDisplay.textContent = dateObj.toLocaleDateString(localeCode, { weekday: 'long' });

            this.renderTimeSlots(dateObj);
        },

        renderTimeSlots: function (dateObj) {
            this.dom.slotsList.innerHTML = '';
            const slots = [];
            for (let h = 9; h < 18; h++) {
                if (h < 12 || h >= 14) { // excluding 12-14
                    slots.push({ h, m: 0 });
                    slots.push({ h, m: 30 });
                }
            }

            let hasAvailable = false;
            slots.forEach(slot => {
                const timeStr = `${String(slot.h).padStart(2, '0')}:${String(slot.m).padStart(2, '0')}`;
                const slotDate = new Date(dateObj);
                slotDate.setHours(slot.h, slot.m, 0, 0);

                const isBooked = this.state.bookedSlots.some(b => slotDate >= b.start && slotDate < b.end);

                if (!isBooked) {
                    hasAvailable = true;
                    const el = document.createElement('div');
                    el.className = 'time-slot-item';
                    el.textContent = timeStr;
                    el.onclick = () => {
                        this.dom.slotsList.querySelectorAll('.time-slot-item').forEach(i => i.classList.remove('selected'));
                        el.classList.add('selected');
                        this.state.selectedTimeSlot = timeStr;
                        this.state.selectedTimeSlotFullISO = slotDate.toISOString();
                        this.showDetailsForm();
                    };
                    this.dom.slotsList.appendChild(el);
                }
            });

            if (!hasAvailable) {
                this.dom.slotsList.textContent = this.translations[this.state.currentLang].noSlots;
            }
        },

        showDetailsForm: function() {
            this.dom.scheduler.style.display = 'none';
            this.dom.detailsForm.style.display = 'block';
        },

        handleBooking: async function () {
            const t = this.translations[this.state.currentLang];
            const name = this.dom.nameInput.value;
            const email = this.dom.emailInput.value;
            const notes = this.dom.notesInput.value;

            if (!name || !email) {
                alert('Name and Email are required.');
                return;
            }

            this.dom.scheduleEventBtn.disabled = true;
            this.dom.scheduleEventBtn.textContent = t.processing;

            try {
                const response = await fetch(this.BOOKING_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        bookingTime: this.state.selectedTimeSlotFullISO,
                        email: email,
                        name: name,
                        notes: notes,
                        lang: this.state.currentLang
                    })
                });

                if (response.ok) {
                    alert(t.alertSuccess.replace('{date}', this.state.selectedDate).replace('{time}', this.state.selectedTimeSlot));
                    window.location.href = 'confirmation.html';
                } else {
                    throw new Error('Booking failed');
                }
            } catch (e) {
                alert(t.alertFail);
                this.dom.scheduleEventBtn.disabled = false;
                this.dom.scheduleEventBtn.textContent = t.scheduleEvent;
            }
        }
    };

    document.addEventListener('DOMContentLoaded', () => MeetingScheduler.init());
})();
