// ===== Admin Dashboard =====
const API_BASE = '';
let adminToken = '';

// ===== DOM =====
const loginScreen = document.getElementById('loginScreen');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

// Stats
const statTotal = document.getElementById('statTotal');
const statUpcoming = document.getElementById('statUpcoming');
const statCancelled = document.getElementById('statCancelled');

// Tabs
const tabs = document.querySelectorAll('.tab');
const tabBookings = document.getElementById('tabBookings');
const tabSchedule = document.getElementById('tabSchedule');

// Bookings
const bookingList = document.getElementById('bookingList');
const filterStatus = document.getElementById('filterStatus');

// Schedule
const blockDate = document.getElementById('blockDate');
const blockReason = document.getElementById('blockReason');
const addBlockBtn = document.getElementById('addBlockBtn');
const blockedDatesList = document.getElementById('blockedDatesList');
const extraDate = document.getElementById('extraDate');
const extraTime = document.getElementById('extraTime');
const addExtraBtn = document.getElementById('addExtraBtn');
const extraDatesList = document.getElementById('extraDatesList');

// Modal
const bookingModal = document.getElementById('bookingModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');
const modalActions = document.getElementById('modalActions');

// ===== Data Store =====
let bookings = [];
let blockedDates = [];
let extraDates = [];

// ===== Login =====
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const password = document.getElementById('adminPassword').value;
    loginError.classList.add('hidden');

    try {
        const res = await fetch(`${API_BASE}/api/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        if (!res.ok) {
            loginError.classList.remove('hidden');
            return;
        }
        const data = await res.json();
        adminToken = data.token;
        sessionStorage.setItem('adminToken', adminToken);
        showDashboard();
    } catch (err) {
        loginError.classList.remove('hidden');
    }
});

logoutBtn.addEventListener('click', () => {
    adminToken = '';
    sessionStorage.removeItem('adminToken');
    dashboard.classList.add('hidden');
    loginScreen.classList.remove('hidden');
    document.getElementById('adminPassword').value = '';
});

// ===== Auto-login =====
(function checkSession() {
    const saved = sessionStorage.getItem('adminToken');
    if (saved) {
        adminToken = saved;
        showDashboard();
    }
})();

async function showDashboard() {
    loginScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    await Promise.all([loadBookings(), loadSchedule()]);
}

// ===== API Helpers =====
async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.status === 401) { logoutBtn.click(); throw new Error('Unauthorized'); }
    return res.json();
}

async function apiPost(path, data) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(data)
    });
    if (res.status === 401) { logoutBtn.click(); throw new Error('Unauthorized'); }
    return res.json();
}

async function apiDelete(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    if (res.status === 401) { logoutBtn.click(); throw new Error('Unauthorized'); }
    return res.json();
}

// ===== Tabs =====
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        const target = tab.dataset.tab === 'bookings' ? tabBookings : tabSchedule;
        target.classList.add('active');
    });
});

// ===== Bookings =====
async function loadBookings() {
    try {
        const data = await apiGet('/api/admin/bookings');
        bookings = data.bookings || [];
        renderBookings();
        updateStats();
    } catch (e) {
        console.error('Load bookings error:', e);
    }
}

function renderBookings() {
    const filter = filterStatus.value;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    let filtered = bookings;
    if (filter === 'active') filtered = bookings.filter(b => !b.cancelled);
    if (filter === 'cancelled') filtered = bookings.filter(b => b.cancelled);

    // 日付でソート（新しい順）
    filtered.sort((a, b) => b.date.localeCompare(a.date));

    if (filtered.length === 0) {
        bookingList.innerHTML = '<p class="empty-msg">予約はありません</p>';
        return;
    }

    bookingList.innerHTML = filtered.map((b, i) => {
        const bDate = new Date(b.date + 'T00:00:00');
        const isPast = bDate < now && !b.cancelled;
        const statusClass = b.cancelled ? 'status-cancelled' : isPast ? 'status-past' : 'status-active';
        const statusText = b.cancelled ? 'キャンセル' : isPast ? '完了' : '予約中';
        const itemClass = b.cancelled ? 'cancelled' : '';

        return `<div class="booking-item ${itemClass}" data-idx="${i}" onclick="showBookingDetail(${bookings.indexOf(b)})">
            <div class="booking-info">
                <div class="booking-date">${b.date} ${b.time}</div>
                <div class="booking-name">${b.name}${b.company ? ' / ' + b.company : ''}</div>
                <div class="booking-email">${b.email}</div>
            </div>
            <span class="booking-status ${statusClass}">${statusText}</span>
        </div>`;
    }).join('');
}

filterStatus.addEventListener('change', renderBookings);

function updateStats() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    statTotal.textContent = bookings.length;
    statUpcoming.textContent = bookings.filter(b => !b.cancelled && new Date(b.date + 'T00:00:00') >= now).length;
    statCancelled.textContent = bookings.filter(b => b.cancelled).length;
}

// ===== Booking Detail Modal =====
window.showBookingDetail = function(idx) {
    const b = bookings[idx];
    if (!b) return;

    const bDate = new Date(b.date + 'T00:00:00');
    const now = new Date(); now.setHours(0, 0, 0, 0);
    const isPast = bDate < now;

    modalBody.innerHTML = `<table>
        <tr><td>日時</td><td>${b.date} ${b.time}</td></tr>
        <tr><td>お名前</td><td>${b.name}</td></tr>
        <tr><td>メール</td><td><a href="mailto:${b.email}">${b.email}</a></td></tr>
        <tr><td>会社名</td><td>${b.company || '—'}</td></tr>
        <tr><td>相談内容</td><td>${b.message || '—'}</td></tr>
        <tr><td>Zoom</td><td>${b.zoomLink ? `<a href="${b.zoomLink}" target="_blank" style="word-break:break-all;">${b.zoomLink}</a>` : '—'}</td></tr>
        <tr><td>状態</td><td>${b.cancelled ? '<span style="color:#9b3a3a;font-weight:600;">キャンセル済み</span>' : isPast ? '完了' : '<span style="color:#2e7d32;font-weight:600;">予約中</span>'}</td></tr>
    </table>`;

    if (!b.cancelled && !isPast) {
        modalActions.innerHTML = `
            <button class="modal-btn modal-btn-close" onclick="closeBookingModal()">閉じる</button>
            <button class="modal-btn modal-btn-cancel" onclick="adminCancelBooking(${idx})">キャンセルする</button>`;
    } else {
        modalActions.innerHTML = `<button class="modal-btn modal-btn-close" onclick="closeBookingModal()">閉じる</button>`;
    }

    bookingModal.classList.remove('hidden');
};

window.closeBookingModal = function() {
    bookingModal.classList.add('hidden');
};

closeModal.addEventListener('click', closeBookingModal);
document.querySelector('.modal-backdrop')?.addEventListener('click', closeBookingModal);

window.adminCancelBooking = async function(idx) {
    const b = bookings[idx];
    if (!b || !confirm(`${b.name}様の予約（${b.date} ${b.time}）をキャンセルしますか？`)) return;

    try {
        await apiPost('/api/admin/cancel', { bookingId: b.id });
        closeBookingModal();
        await loadBookings();
    } catch (e) {
        alert('キャンセルに失敗しました');
    }
};

// ===== Schedule =====
async function loadSchedule() {
    try {
        const data = await apiGet('/api/admin/schedule');
        blockedDates = data.blocked || [];
        extraDates = data.extra || [];
        renderBlockedDates();
        renderExtraDates();
    } catch (e) {
        console.error('Load schedule error:', e);
    }
}

function renderBlockedDates() {
    if (blockedDates.length === 0) {
        blockedDatesList.innerHTML = '<p class="empty-msg">ブロックされた日はありません</p>';
        return;
    }
    blockedDates.sort((a, b) => a.date.localeCompare(b.date));
    blockedDatesList.innerHTML = blockedDates.map(d => `
        <div class="blocked-item">
            <div class="blocked-item-info">
                <span class="blocked-item-date">${d.date}</span>
                <span class="blocked-item-reason">${d.reason || ''}</span>
            </div>
            <button class="blocked-remove" onclick="removeBlocked('${d.date}')" title="削除">✕</button>
        </div>
    `).join('');
}

function renderExtraDates() {
    if (extraDates.length === 0) {
        extraDatesList.innerHTML = '<p class="empty-msg">臨時枠はありません</p>';
        return;
    }
    extraDates.sort((a, b) => a.date.localeCompare(b.date));
    extraDatesList.innerHTML = extraDates.map(d => `
        <div class="blocked-item">
            <div class="blocked-item-info">
                <span class="blocked-item-date">${d.date}</span>
                <span class="blocked-item-time">${d.time}</span>
            </div>
            <button class="blocked-remove" onclick="removeExtra('${d.date}')" title="削除">✕</button>
        </div>
    `).join('');
}

addBlockBtn.addEventListener('click', async () => {
    const date = blockDate.value;
    if (!date) { alert('日付を選択してください'); return; }
    try {
        await apiPost('/api/admin/schedule/block', { date, reason: blockReason.value });
        blockDate.value = '';
        blockReason.value = '';
        await loadSchedule();
    } catch (e) {
        alert('追加に失敗しました');
    }
});

addExtraBtn.addEventListener('click', async () => {
    const date = extraDate.value;
    const time = extraTime.value;
    if (!date || !time) { alert('日付と時間帯を入力してください'); return; }
    try {
        await apiPost('/api/admin/schedule/extra', { date, time });
        extraDate.value = '';
        await loadSchedule();
    } catch (e) {
        alert('追加に失敗しました');
    }
});

window.removeBlocked = async function(date) {
    if (!confirm(`${date} のブロックを解除しますか？`)) return;
    try {
        await apiDelete(`/api/admin/schedule/block?date=${date}`);
        await loadSchedule();
    } catch (e) {
        alert('削除に失敗しました');
    }
};

window.removeExtra = async function(date) {
    if (!confirm(`${date} の臨時枠を削除しますか？`)) return;
    try {
        await apiDelete(`/api/admin/schedule/extra?date=${date}`);
        await loadSchedule();
    } catch (e) {
        alert('削除に失敗しました');
    }
};
