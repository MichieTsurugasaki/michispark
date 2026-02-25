// ===== 予約可能設定 =====
const AVAILABLE_DAYS = [2, 3, 4]; // 火(2), 水(3), 木(4)  ※0=日,1=月,...
const TIME_SLOTS = ['8:00 - 9:00'];
const API_ENDPOINT = '/api/booking';
const CANCEL_ENDPOINT = '/api/cancel';

// ===== State =====
let currentYear, currentMonth;
let selectedDate = null;
let selectedTime = null;
let rescheduleToken = null; // 日程変更時に旧予約トークンを保持
let blockedDates = []; // 管理者がブロックした日
let extraDates = [];   // 管理者が追加した臨時枠

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
async function initCalendar() {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();

    // スケジュールデータ取得
    try {
        const res = await fetch('/api/schedule');
        if (res.ok) {
            const data = await res.json();
            blockedDates = data.blockedDates || [];
            extraDates = data.extraDates || [];
        }
    } catch (e) {
        console.warn('Schedule fetch failed:', e);
    }

    renderCalendar();
}

function isDateAvailable(date) {
    const dateStr = date.toISOString().split('T')[0];
    const dow = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return false;
    if (blockedDates.includes(dateStr)) return false;
    if (extraDates.find(e => e.date === dateStr)) return true;
    return AVAILABLE_DAYS.includes(dow);
}

function getTimeSlotsForDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    const extra = extraDates.find(e => e.date === dateStr);
    if (extra) return [extra.time];
    return TIME_SLOTS;
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
        const isAvailable = isDateAvailable(date);
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
    const slots = selectedDate ? getTimeSlotsForDate(selectedDate) : TIME_SLOTS;
    slots.forEach(slot => {
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
    document.getElementById('confirmReferrer').textContent = document.getElementById('userReferrer').value || '—';
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
        referrer: document.getElementById('userReferrer').value,
        message: document.getElementById('userMessage').value
    };

    // 日程変更の場合、旧予約トークンを含める
    if (rescheduleToken) {
        payload.rescheduleToken = rescheduleToken;
    }

    try {
        const res = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('予約に失敗しました');

        document.getElementById('doneDateTime').textContent = formatSelectedDateTime();
        rescheduleToken = null; // リセット
        goToStep(4);
    } catch (err) {
        alert('予約の送信に失敗しました。しばらくしてからもう一度お試しください。');
        console.error(err);
    } finally {
        loadingOverlay.classList.add('hidden');
    }
});

// ===== キャンセル・日程変更ハンドリング =====
function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const token = params.get('token');

    if (!action || !token) return;

    if (action === 'cancel') {
        showCancelConfirmation(token);
    } else if (action === 'reschedule') {
        startReschedule(token);
    }
}

function decodeToken(tokenStr) {
    try {
        let base64 = tokenStr.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        const json = decodeURIComponent(escape(atob(base64)));
        return JSON.parse(json);
    } catch {
        return null;
    }
}

function showCancelConfirmation(token) {
    const booking = decodeToken(token);
    if (!booking) {
        alert('無効なリンクです。');
        return;
    }

    // ステップを全部非表示
    [step1, step2, step3, stepDone].forEach(s => s.classList.remove('active'));
    document.querySelector('.steps').style.display = 'none';
    document.querySelector('.subtitle').style.display = 'none';

    // キャンセル画面を表示
    const stepCancel = document.getElementById('stepCancel');
    const cancelDateTime = document.getElementById('cancelDateTime');
    cancelDateTime.textContent = `${booking.d} ${booking.t}`;
    stepCancel.classList.add('active');

    // キャンセル実行ボタン
    document.getElementById('confirmCancel').addEventListener('click', async () => {
        loadingOverlay.classList.remove('hidden');
        try {
            const res = await fetch(CANCEL_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            if (!res.ok) throw new Error('キャンセルに失敗');

            stepCancel.classList.remove('active');
            document.getElementById('stepCancelDone').classList.add('active');
        } catch (err) {
            alert('キャンセルに失敗しました。もう一度お試しください。');
            console.error(err);
        } finally {
            loadingOverlay.classList.add('hidden');
        }
    });
}

function startReschedule(token) {
    rescheduleToken = token;
    const banner = document.getElementById('rescheduleBanner');
    if (banner) banner.classList.remove('hidden');
}

// ===== 初期化 =====
initCalendar();
handleUrlParams();
