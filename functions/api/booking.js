// Cloudflare Pages Function: /api/booking
// 環境変数（Cloudflare Pagesダッシュボードで設定）:
//   ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET
//   RESEND_API_KEY
//   ADMIN_EMAIL (= tsurugasaki@conete.net)

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { date, time, name, email, company, message } = body;

        // バリデーション
        if (!date || !time || !name || !email) {
            return new Response(JSON.stringify({ error: '必須項目が入力されていません' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 1. Zoom ミーティング作成
        let zoomLink = '';
        try {
            zoomLink = await createZoomMeeting(env, date, time, name);
        } catch (e) {
            console.error('Zoom API error:', e);
            zoomLink = '（Zoom URLは別途メールでお送りします）';
        }

        // 2. 確認メール送信（ユーザー宛）
        await sendEmail(env, {
            to: email,
            subject: '【MichiSpark】オンライン相談会のご予約確認',
            html: buildUserEmail({ date, time, name, company, message, zoomLink })
        });

        // 3. 通知メール送信（運営宛）
        await sendEmail(env, {
            to: env.ADMIN_EMAIL || 'tsurugasaki@conete.net',
            subject: `【新規予約】${name}様 - ${date} ${time}`,
            html: buildAdminEmail({ date, time, name, email, company, message, zoomLink })
        });

        return new Response(JSON.stringify({ success: true, zoomLink }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Booking error:', err);
        return new Response(JSON.stringify({ error: '予約処理に失敗しました' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// ===== Zoom API: Server-to-Server OAuth =====
async function getZoomAccessToken(env) {
    const credentials = btoa(`${env.ZOOM_CLIENT_ID}:${env.ZOOM_CLIENT_SECRET}`);
    const res = await fetch(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${env.ZOOM_ACCOUNT_ID}`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    if (!res.ok) throw new Error(`Zoom OAuth failed: ${res.status}`);
    const data = await res.json();
    return data.access_token;
}

async function createZoomMeeting(env, date, time, userName) {
    if (!env.ZOOM_CLIENT_ID || !env.ZOOM_CLIENT_SECRET || !env.ZOOM_ACCOUNT_ID) {
        throw new Error('Zoom credentials not configured');
    }

    const token = await getZoomAccessToken(env);

    // 日時を ISO 形式に変換（例: 2026-03-03T08:00:00）
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
            type: 2, // Scheduled meeting
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

    if (!res.ok) throw new Error(`Zoom meeting creation failed: ${res.status}`);
    const meeting = await res.json();
    return meeting.join_url;
}

// ===== メール送信 (Resend API) =====
async function sendEmail(env, { to, subject, html }) {
    if (!env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY not set, skipping email');
        return;
    }

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'MichiSpark <noreply@michispark.app>',
            to: [to],
            subject,
            html
        })
    });

    if (!res.ok) {
        const err = await res.text();
        console.error('Email send failed:', err);
    }
}

// ===== メールテンプレート =====
function buildUserEmail({ date, time, name, company, message, zoomLink }) {
    return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#3d3331;">
        <div style="text-align:center;padding:24px 0 16px;border-bottom:2px solid #c4956a;">
            <div style="font-size:24px;font-weight:700;color:#6b5344;letter-spacing:0.05em;">Michi<span style="color:#c4956a;">Spark</span></div>
        </div>
        <div style="padding:24px 0;">
            <p style="font-size:15px;margin-bottom:16px;">${name} 様</p>
            <p style="font-size:14px;color:#6b5f5d;line-height:1.8;margin-bottom:20px;">
                オンライン相談会のご予約ありがとうございます。<br>
                以下の内容で承りました。
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
            <p style="font-size:12px;color:#8c8584;line-height:1.7;">
                ※ 当日は上記URLよりご参加ください。<br>
                ※ ご都合が悪くなった場合はお早めにご連絡ください。
            </p>
        </div>
        <div style="text-align:center;padding:16px 0;border-top:1px solid #e8e0dc;font-size:12px;color:#8c8584;">
            MichiSpark — michispark.app
        </div>
    </div>`;
}

function buildAdminEmail({ date, time, name, email, company, message, zoomLink }) {
    return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:560px;margin:0 auto;color:#3d3331;">
        <div style="background:#6b5344;color:white;padding:16px 20px;border-radius:8px 8px 0 0;">
            <div style="font-size:16px;font-weight:700;">新規予約通知</div>
        </div>
        <div style="border:1px solid #e8e0dc;border-top:none;border-radius:0 0 8px 8px;padding:20px;">
            <table style="font-size:14px;width:100%;line-height:1.8;">
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;vertical-align:top;white-space:nowrap;">日時</td><td style="font-weight:600;">${date} ${time}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;vertical-align:top;">お名前</td><td>${name}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;vertical-align:top;">メール</td><td><a href="mailto:${email}">${email}</a></td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;vertical-align:top;">会社名</td><td>${company || '—'}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;vertical-align:top;">相談内容</td><td>${message || '—'}</td></tr>
                <tr><td style="color:#8c8584;padding:4px 12px 4px 0;vertical-align:top;">Zoom</td><td><a href="${zoomLink}">${zoomLink}</a></td></tr>
            </table>
        </div>
    </div>`;
}
