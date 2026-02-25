// ===== MichiSpark Booking Worker =====
// Handles: POST /api/booking, POST /api/cancel
// Static assets served automatically via [assets] config

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }
            });
        }

        // API routes
        if (request.method === 'POST' && url.pathname === '/api/booking') {
            return handleBooking(request, env);
        }
        if (request.method === 'POST' && url.pathname === '/api/cancel') {
            return handleCancel(request, env);
        }

        // Non-API requests that reach here got no asset match → 404
        return new Response('Not Found', { status: 404 });
    }
};

// ========================================
//  Booking Handler
// ========================================
async function handleBooking(request, env) {
    try {
        const body = await request.json();
        const { date, time, name, email, company, message, rescheduleToken } = body;

        if (!date || !time || !name || !email) {
            return jsonResponse({ error: '必須項目が入力されていません' }, 400);
        }

        // 日程変更の場合、旧予約をキャンセル
        if (rescheduleToken) {
            try {
                const oldBooking = decodeToken(rescheduleToken);
                if (oldBooking && oldBooking.mid) {
                    await cancelZoomMeeting(env, oldBooking.mid);
                }
                if (oldBooking) {
                    await sendEmail(env, {
                        to: env.ADMIN_EMAIL,
                        subject: `【日程変更】${oldBooking.n}様 - ${oldBooking.d} → ${date}`,
                        html: buildAdminRescheduleEmail({ oldDate: oldBooking.d, oldTime: oldBooking.t, newDate: date, newTime: time, name: oldBooking.n, email: oldBooking.e })
                    });
                }
            } catch (e) {
                console.error('Reschedule cancel error:', e);
            }
        }

        // Zoom ミーティング作成
        let zoomLink = '';
        let meetingId = '';
        try {
            const meeting = await createZoomMeeting(env, date, time, name);
            zoomLink = meeting.join_url;
            meetingId = String(meeting.id);
        } catch (e) {
            console.error('Zoom API error:', e);
            zoomLink = '（Zoom URLは別途メールでお送りします）';
        }

        // トークン生成（キャンセル・日程変更用）
        const token = generateToken({ d: date, t: time, e: email, n: name, mid: meetingId });
        const cancelUrl = `https://michispark.app/booking?action=cancel&token=${token}`;
        const rescheduleUrl = `https://michispark.app/booking?action=reschedule&token=${token}`;

        // 確認メール送信（ユーザー宛）
        await sendEmail(env, {
            to: email,
            subject: '【MichiSpark】オンライン相談会のご予約確認',
            html: buildUserEmail({ date, time, name, company, message, zoomLink, cancelUrl, rescheduleUrl })
        });

        // 通知メール送信（運営宛）
        await sendEmail(env, {
            to: env.ADMIN_EMAIL,
            subject: `【新規予約】${name}様 - ${date} ${time}`,
            html: buildAdminEmail({ date, time, name, email, company, message, zoomLink })
        });

        // リマインドメール予約（24時間前 + 1時間前）
        await scheduleReminders(env, { date, time, name, email, zoomLink, cancelUrl, rescheduleUrl });

        return jsonResponse({ success: true, zoomLink });
    } catch (err) {
        console.error('Booking error:', err);
        return jsonResponse({ error: '予約処理に失敗しました: ' + err.message }, 500);
    }
}

// ========================================
//  Cancel Handler
// ========================================
async function handleCancel(request, env) {
    try {
        const { token } = await request.json();
        const booking = decodeToken(token);

        if (!booking) {
            return jsonResponse({ error: '無効なトークンです' }, 400);
        }

        // Zoom ミーティング削除
        if (booking.mid) {
            try {
                await cancelZoomMeeting(env, booking.mid);
            } catch (e) {
                console.error('Zoom cancel error:', e);
            }
        }

        // キャンセル確認メール（ユーザー宛）
        await sendEmail(env, {
            to: booking.e,
            subject: '【MichiSpark】オンライン相談会のキャンセル確認',
            html: buildCancelConfirmEmail(booking)
        });

        // キャンセル通知（運営宛）
        await sendEmail(env, {
            to: env.ADMIN_EMAIL,
            subject: `【キャンセル】${booking.n}様 - ${booking.d} ${booking.t}`,
            html: buildAdminCancelEmail(booking)
        });

        return jsonResponse({ success: true });
    } catch (err) {
        console.error('Cancel error:', err);
        return jsonResponse({ error: 'キャンセル処理に失敗しました' }, 500);
    }
}

// ========================================
//  Zoom API
// ========================================
async function getZoomAccessToken(env) {
    const credentials = btoa(`${env.ZOOM_CLIENT_ID}:${env.ZOOM_CLIENT_SECRET}`);
    const res = await fetch(
        `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${env.ZOOM_ACCOUNT_ID}`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
    if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Zoom OAuth failed: ${res.status} - ${errBody}`);
    }
    const data = await res.json();
    return data.access_token;
}

async function createZoomMeeting(env, date, time, userName) {
    if (!env.ZOOM_CLIENT_ID || !env.ZOOM_CLIENT_SECRET || !env.ZOOM_ACCOUNT_ID) {
        throw new Error('Zoom credentials not configured');
    }
    const token = await getZoomAccessToken(env);
    const startHour = time.split(':')[0].padStart(2, '0');
    const startTime = `${date}T${startHour}:00:00`;

    const res = await fetch('https://api.zoom.us/v2/users/me/meetings', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            topic: `MichiSpark オンライン相談会 - ${userName}様`,
            type: 2,
            start_time: startTime,
            duration: 60,
            timezone: 'Asia/Tokyo',
            settings: {
                join_before_host: false,
                waiting_room: true,
                auto_recording: 'none'
            }
        })
    });

    if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Zoom meeting creation failed: ${res.status} - ${errBody}`);
    }
    return await res.json();
}

async function cancelZoomMeeting(env, meetingId) {
    if (!env.ZOOM_CLIENT_ID || !meetingId) return;
    try {
        const token = await getZoomAccessToken(env);
        await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch (e) {
        console.error('cancelZoomMeeting error:', e);
    }
}

// ========================================
//  Email (Resend API)
// ========================================
async function sendEmail(env, { to, subject, html, scheduledAt }) {
    if (!env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not set, skipping email');
        return null;
    }
    const payload = {
        from: 'MichiSpark <noreply@michispark.app>',
        to: [to],
        subject,
        html
    };
    if (scheduledAt) {
        payload.scheduled_at = scheduledAt;
    }
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) {
        const err = await res.text();
        console.error('Email send failed:', err);
        return null;
    }
    const data = await res.json();
    return data.id;
}

async function scheduleReminders(env, { date, time, name, email, zoomLink, cancelUrl, rescheduleUrl }) {
    const startHour = time.split(':')[0].padStart(2, '0');
    const meetingTime = new Date(`${date}T${startHour}:00:00+09:00`);
    const now = Date.now();

    // 24時間前リマインド
    const reminder24h = new Date(meetingTime.getTime() - 24 * 60 * 60 * 1000);
    if (reminder24h.getTime() > now + 3600000) {
        try {
            await sendEmail(env, {
                to: email,
                subject: '【MichiSpark】明日のオンライン相談会のリマインド',
                html: buildReminderEmail({ date, time, name, zoomLink, cancelUrl, rescheduleUrl, isOneHour: false }),
                scheduledAt: reminder24h.toISOString()
            });
        } catch (e) {
            console.error('24h reminder failed:', e);
        }
    }

    // 1時間前リマインド
    const reminder1h = new Date(meetingTime.getTime() - 60 * 60 * 1000);
    if (reminder1h.getTime() > now + 600000) {
        try {
            await sendEmail(env, {
                to: email,
                subject: '【MichiSpark】まもなくオンライン相談会が始まります',
                html: buildReminderEmail({ date, time, name, zoomLink, cancelUrl, rescheduleUrl, isOneHour: true }),
                scheduledAt: reminder1h.toISOString()
            });
        } catch (e) {
            console.error('1h reminder failed:', e);
        }
    }
}

// ========================================
//  Token
// ========================================
function generateToken(data) {
    const json = JSON.stringify(data);
    // Unicode-safe base64
    const encoded = btoa(unescape(encodeURIComponent(json)));
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
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

// ========================================
//  Helpers
// ========================================
function jsonResponse(data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}

function btn(href, bgColor, label) {
    return `<a href="${href}" style="display:inline-block;padding:12px 28px;background:${bgColor};color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;text-align:center;margin:0 6px;">${label}</a>`;
}

function emailHeader() {
    return `<div style="text-align:center;padding:24px 0 16px;border-bottom:2px solid #c4956a;">
        <div style="font-size:24px;font-weight:700;color:#6b5344;letter-spacing:0.05em;">Michi<span style="color:#c4956a;">Spark</span></div>
    </div>`;
}

function emailFooter() {
    return `<div style="text-align:center;padding:16px 0;border-top:1px solid #e8e0dc;font-size:12px;color:#8c8584;">
        MichiSpark — michispark.app
    </div>`;
}

// ========================================
//  Email Templates
// ========================================

// ユーザー宛 予約確認メール
function buildUserEmail({ date, time, name, company, message, zoomLink, cancelUrl, rescheduleUrl }) {
    return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#3d3331;">
        ${emailHeader()}
        <div style="padding:24px 0;">
            <p style="font-size:15px;margin-bottom:16px;">${name} 様</p>
            <p style="font-size:14px;color:#6b5f5d;line-height:1.8;margin-bottom:20px;">
                オンライン相談会のご予約ありがとうございます。<br>以下の内容で承りました。
            </p>
            <div style="background:#f7f4f2;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
                <table style="font-size:14px;width:100%;">
                    <tr><td style="color:#8c8584;padding:4px 12px 4px 0;vertical-align:top;">日時</td><td style="font-weight:600;padding:4px 0;">${date} ${time}</td></tr>
                    <tr><td style="color:#8c8584;padding:4px 12px 4px 0;vertical-align:top;">形式</td><td style="padding:4px 0;">Zoomオンライン</td></tr>
                    ${company ? `<tr><td style="color:#8c8584;padding:4px 12px 4px 0;vertical-align:top;">会社名</td><td style="padding:4px 0;">${company}</td></tr>` : ''}
                    ${message ? `<tr><td style="color:#8c8584;padding:4px 12px 4px 0;vertical-align:top;">ご相談内容</td><td style="padding:4px 0;">${message}</td></tr>` : ''}
                </table>
            </div>
            <div style="background:#f0faf2;border:1px solid #c5e8cc;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
                <p style="font-size:13px;color:#4a8a4a;font-weight:600;margin-bottom:8px;">Zoom会議URL</p>
                <a href="${zoomLink}" style="font-size:14px;color:#2d6a2d;word-break:break-all;">${zoomLink}</a>
            </div>
            <div style="text-align:center;margin:24px 0;">
                ${btn(rescheduleUrl, '#c4956a', '日程を変更する')}
                ${btn(cancelUrl, '#9b3a3a', 'キャンセルする')}
            </div>
            <p style="font-size:12px;color:#8c8584;line-height:1.7;">
                ※ 当日は上記URLよりご参加ください。<br>
                ※ 日程変更・キャンセルは上記ボタンよりお手続きください。
            </p>
        </div>
        ${emailFooter()}
    </div>`;
}

// 運営宛 新規予約通知
function buildAdminEmail({ date, time, name, email, company, message, zoomLink }) {
    return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#3d3331;">
        <div style="background:#6b5344;color:white;padding:16px 20px;border-radius:8px 8px 0 0;">
            <div style="font-size:16px;font-weight:700;">新規予約通知</div>
        </div>
        <div style="border:1px solid #e8e0dc;border-top:none;border-radius:0 0 8px 8px;padding:20px;">
            <table style="font-size:14px;width:100%;line-height:1.8;">
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;white-space:nowrap;">日時</td><td style="font-weight:600;">${date} ${time}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">お名前</td><td>${name}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">メール</td><td><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">会社名</td><td>${company || '—'}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">相談内容</td><td>${message || '—'}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">Zoom</td><td><a href="${zoomLink}">${zoomLink}</a></td></tr>
            </table>
        </div>
    </div>`;
}

// リマインドメール
function buildReminderEmail({ date, time, name, zoomLink, cancelUrl, rescheduleUrl, isOneHour }) {
    const title = isOneHour ? 'まもなくオンライン相談会が始まります' : '明日のオンライン相談会のリマインド';
    const subtitle = isOneHour
        ? '相談会の開始1時間前です。下記URLよりご参加ください。'
        : '明日の相談会について、リマインドのご連絡です。';

    return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#3d3331;">
        ${emailHeader()}
        <div style="padding:24px 0;">
            <p style="font-size:15px;margin-bottom:16px;">${name} 様</p>
            <p style="font-size:16px;font-weight:700;color:#6b5344;margin-bottom:8px;">${title}</p>
            <p style="font-size:14px;color:#6b5f5d;line-height:1.8;margin-bottom:20px;">${subtitle}</p>
            <div style="background:#f7f4f2;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
                <table style="font-size:14px;width:100%;">
                    <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">日時</td><td style="font-weight:600;">${date} ${time}</td></tr>
                    <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">形式</td><td>Zoomオンライン</td></tr>
                </table>
            </div>
            <div style="background:#f0faf2;border:1px solid #c5e8cc;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
                <p style="font-size:13px;color:#4a8a4a;font-weight:600;margin-bottom:8px;">Zoom会議URL</p>
                <a href="${zoomLink}" style="font-size:14px;color:#2d6a2d;word-break:break-all;">${zoomLink}</a>
            </div>
            <div style="text-align:center;margin:24px 0;">
                ${btn(rescheduleUrl, '#c4956a', '日程を変更する')}
                ${btn(cancelUrl, '#9b3a3a', 'キャンセルする')}
            </div>
        </div>
        ${emailFooter()}
    </div>`;
}

// キャンセル確認メール（ユーザー宛）
function buildCancelConfirmEmail(booking) {
    return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#3d3331;">
        ${emailHeader()}
        <div style="padding:24px 0;">
            <p style="font-size:15px;margin-bottom:16px;">${booking.n} 様</p>
            <p style="font-size:14px;color:#6b5f5d;line-height:1.8;margin-bottom:20px;">
                以下のオンライン相談会のご予約をキャンセルいたしました。
            </p>
            <div style="background:#fef2f2;border:1px solid #e8c5c5;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
                <table style="font-size:14px;width:100%;">
                    <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">日時</td><td style="font-weight:600;">${booking.d} ${booking.t}</td></tr>
                    <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">ステータス</td><td style="color:#9b3a3a;font-weight:600;">キャンセル済み</td></tr>
                </table>
            </div>
            <div style="text-align:center;margin:24px 0;">
                ${btn('https://michispark.app/booking', '#6b5344', '新しい日程で予約する')}
            </div>
        </div>
        ${emailFooter()}
    </div>`;
}

// キャンセル通知（運営宛）
function buildAdminCancelEmail(booking) {
    return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#3d3331;">
        <div style="background:#9b3a3a;color:white;padding:16px 20px;border-radius:8px 8px 0 0;">
            <div style="font-size:16px;font-weight:700;">予約キャンセル通知</div>
        </div>
        <div style="border:1px solid #e8e0dc;border-top:none;border-radius:0 0 8px 8px;padding:20px;">
            <table style="font-size:14px;width:100%;line-height:1.8;">
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">日時</td><td style="font-weight:600;">${booking.d} ${booking.t}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">お名前</td><td>${booking.n}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">メール</td><td>${booking.e}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">ステータス</td><td style="color:#9b3a3a;font-weight:600;">キャンセル</td></tr>
            </table>
        </div>
    </div>`;
}

// 日程変更通知（運営宛）
function buildAdminRescheduleEmail({ oldDate, oldTime, newDate, newTime, name, email }) {
    return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#3d3331;">
        <div style="background:#c4956a;color:white;padding:16px 20px;border-radius:8px 8px 0 0;">
            <div style="font-size:16px;font-weight:700;">日程変更通知</div>
        </div>
        <div style="border:1px solid #e8e0dc;border-top:none;border-radius:0 0 8px 8px;padding:20px;">
            <table style="font-size:14px;width:100%;line-height:1.8;">
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">お名前</td><td>${name}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">メール</td><td>${email}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">旧日時</td><td style="text-decoration:line-through;">${oldDate} ${oldTime}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;">新日時</td><td style="font-weight:600;color:#4a8a4a;">${newDate} ${newTime}</td></tr>
            </table>
        </div>
    </div>`;
}
