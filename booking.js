// ===== 予約可能設定 =====
const AVAILABLE_DAYS = [2, 3, 4]; // 火(2), 水(3), 木(4)  ※0=日,1=月,...
const TIME_SLOTS = ['8:00 - 9:00'];
const API_ENDPOINT = '/api/booking';

// ===== State =====
let currentYear, currentMonth;
let selectedDate = null;
let selectedTime = null;

// ===== DOM =====
const calendarTitle = document.getElementById('calendarTitle');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');
const timeSection = document.getElementById('timeSection');
const selectedDateLabel = document.getElementById('selectedDateLabel');
const timeSlotsEl = document.getElementById('timeSlots');
const toStep2Btn = document.getElementById('toStep2');

const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');
const stepDone = document.getElementById('stepDone');

const summaryDateTime = document.getElementById('summaryDateTime');
const bookingForm = document.getElementById('bookingForm');
const backToStep1Btn = document.getElementById('backToStep1');
const backToStep2Btn = document.getElementById('backToStep2');
const submitBtn = document.getElementById('submitBooking');
const loadingOverlay = document.getElementById('loadingOverlay');

// ===== カレンダー初期化 =====
function initCalendar() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();
    renderCalendar();
}

function renderCalendar() {
    const year = currentYear;
    const month = currentMonth;

    calendarTitle.textContent = `${year}年 ${month + 1}月`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDow = (firstDay.getDay() + 6) % 7; // 月曜始まり
    const daysInMonth = lastDay.getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    calendarGrid.innerHTML = '';

    // 前月の空白
    for (let i = 0; i < startDow; i++) {
        const el = document.createElement('span');
        el.className = 'cal-day';
        calendarGrid.appendChild(el);
    }

    // 当月の日付
    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(year, month, d);
        const dow = date.getDay();
        const isAvailable = AVAILABLE_DAYS.includes(dow) && date >= today;
        const isToday = date.getTime() === today.getTime();

        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'cal-day';
        el.textContent = d;

        if (isToday) el.classList.add('today');
        if (isAvailable) {
            el.classList.add('available');
            el.addEventListener('click', () => selectDate(date, el));
        }

        if (selectedDate && date.getTime() === selectedDate.getTime()) {
            el.classList.add('selected');
        }

        calendarGrid.appendChild(el);
    }
}

function selectDate(date, el) {
    selectedDate = date;

    // すべての選択を解除
    calendarGrid.querySelectorAll('.cal-day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');

    // 時間帯表示
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const dow = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
    selectedDateLabel.textContent = `${m}月${d}日（${dow}）`;

    renderTimeSlots();
    timeSection.classList.remove('hidden');
    selectedTime = null;
    toStep2Btn.classList.add('hidden');
    toStep2Btn.disabled = true;
}

function renderTimeSlots() {
    timeSlotsEl.innerHTML = '';
    TIME_SLOTS.forEach(slot => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'time-slot';
        btn.textContent = slot;
        btn.addEventListener('click', () => selectTimeSlot(slot, btn));
        timeSlotsEl.appendChild(btn);
    });
}

function selectTimeSlot(slot, el) {
    selectedTime = slot;
    timeSlotsEl.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    el.classList.add('selected');
    toStep2Btn.classList.remove('hidden');
    toStep2Btn.disabled = false;
}

// ===== ナビゲーション =====
prevMonthBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
});

nextMonthBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
});

// ===== ステップ遷移 =====
function goToStep(n) {
    [step1, step2, step3, stepDone].forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active', 'done'));

    if (n === 1) step1.classList.add('active');
    if (n === 2) step2.classList.add('active');
    if (n === 3) step3.classList.add('active');
    if (n === 4) stepDone.classList.add('active');

    document.querySelectorAll('.step').forEach(s => {
        const stepNum = parseInt(s.dataset.step);
        if (stepNum < n) s.classList.add('done');
        if (stepNum === n || (n === 4 && stepNum === 3)) s.classList.add('active');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function formatSelectedDateTime() {
    if (!selectedDate || !selectedTime) return '';
    const y = selectedDate.getFullYear();
    const m = selectedDate.getMonth() + 1;
    const d = selectedDate.getDate();
    const dow = ['日', '月', '火', '水', '木', '金', '土'][selectedDate.getDay()];
    return `${y}年${m}月${d}日（${dow}） ${selectedTime}`;
}

// Step 1 → Step 2
toStep2Btn.addEventListener('click', () => {
    summaryDateTime.textContent = formatSelectedDateTime();
    goToStep(2);
});

// Step 2 → Step 1
backToStep1Btn.addEventListener('click', () => goToStep(1));

// Step 2 → Step 3
bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('confirmDateTime').textContent = formatSelectedDateTime();
    document.getElementById('confirmName').textContent = document.getElementById('userName').value;
    document.getElementById('confirmEmail').textContent = document.getElementById('userEmail').value;
    document.getElementById('confirmCompany').textContent = document.getElementById('userCompany').value || '—';
    document.getElementById('confirmMessage').textContent = document.getElementById('userMessage').value || '—';
    goToStep(3);
});

// Step 3 → Step 2
backToStep2Btn.addEventListener('click', () => goToStep(2));

// ===== 予約送信 =====
submitBtn.addEventListener('click', async () => {
    loadingOverlay.classList.remove('hidden');

    const payload = {
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTime,
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        company: document.getElementById('userCompany').value,
        message: document.getElementById('userMessage').value
    };

    try {
        const res = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('予約に失敗しました');

        document.getElementById('doneDateTime').textContent = formatSelectedDateTime();
        goToStep(4);
    } catch (err) {
        alert('予約の送信に失敗しました。しばらくしてからもう一度お試しください。');
        console.error(err);
    } finally {
        loadingOverlay.classList.add('hidden');
    }
});

// ===== 初期化 =====
initCalendar();
