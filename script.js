// ===== PDF.js ワーカー設定 =====
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ===== 機能マスタ（全機能にID・アイコン付き） =====
const featureMaster = {
    requirements: { id: "requirements", name: "要件定義・基本設計",       price: 30,  icon: "📋", keywords: ["要件定義", "基本設計", "仕様書", "設計書", "要件", "ヒアリング"] },
    login:       { id: "login",       name: "ログイン・会員管理",       price: 40,  icon: "🔐", keywords: ["ログイン", "会員", "マイページ", "ユーザー登録", "認証", "サインイン", "アカウント", "パスワード"] },
    payment:     { id: "payment",     name: "決済・カート機能",         price: 60,  icon: "💳", keywords: ["決済", "支払い", "購入", "クレジットカード", "カート", "課金", "Stripe", "注文"] },
    admin:       { id: "admin",       name: "管理画面(CMS)",           price: 50,  icon: "⚙️",  keywords: ["管理画面", "更新", "お知らせ投稿", "CMS", "ダッシュボード", "管理者", "バックエンド"] },
    search:      { id: "search",      name: "検索・フィルター",         price: 35,  icon: "🔍", keywords: ["検索", "フィルター", "絞り込み", "ソート", "全文検索"] },
    notify:      { id: "notify",      name: "通知・メール配信",         price: 30,  icon: "🔔", keywords: ["通知", "プッシュ通知", "メール配信", "お知らせ", "アラート", "リマインダー"] },
    chat:        { id: "chat",        name: "チャット・メッセージ",     price: 60,  icon: "💬", keywords: ["チャット", "メッセージ", "DM", "リアルタイム", "WebSocket"] },
    map:         { id: "map",         name: "地図・位置情報",           price: 40,  icon: "📍", keywords: ["地図", "マップ", "位置情報", "GPS", "Googleマップ"] },
    api:         { id: "api",         name: "API連携・外部サービス",    price: 40,  icon: "🔗", keywords: ["API", "外部連携", "連携", "インテグレーション", "REST", "webhook"] },
    media:       { id: "media",       name: "画像・ファイル管理",       price: 25,  icon: "🖼️",  keywords: ["画像", "アップロード", "ファイル", "ストレージ", "写真", "添付"] },
    report:      { id: "report",      name: "レポート・帳票出力",       price: 35,  icon: "📊", keywords: ["レポート", "帳票", "CSV", "エクスポート", "PDF出力", "集計", "統計"] },
    booking:     { id: "booking",     name: "予約・スケジュール",       price: 45,  icon: "📅", keywords: ["予約", "カレンダー", "スケジュール", "日程", "空き状況"] },
    social:      { id: "social",      name: "SNS・ソーシャル機能",     price: 40,  icon: "👥", keywords: ["SNS", "いいね", "コメント", "フォロー", "シェア", "タイムライン"] },
    ai:          { id: "ai",          name: "AI・機械学習",            price: 100, icon: "🤖", keywords: ["AI", "機械学習", "自動化", "レコメンド", "チャットボット", "自然言語", "GPT"] },
    security:    { id: "security",    name: "セキュリティ強化",         price: 35,  icon: "🛡️",  keywords: ["セキュリティ", "暗号化", "二段階認証", "SSL", "権限管理", "ロール"] },
    responsive:  { id: "responsive",  name: "レスポンシブ対応",         price: 20,  icon: "📱", keywords: ["レスポンシブ", "スマホ対応", "モバイル対応", "タブレット"] },
    design:      { id: "design",      name: "デザイン・UI/UX",         price: 50,  icon: "🎨", keywords: ["デザイン", "UI", "UX", "ワイヤーフレーム", "プロトタイプ", "Figma"] },
    inventory:   { id: "inventory",   name: "在庫・商品管理",          price: 40,  icon: "📦", keywords: ["在庫", "商品管理", "ECサイト", "ネットショップ", "通販", "オンラインショップ"] },
    video:       { id: "video",       name: "動画・配信機能",          price: 70,  icon: "🎬", keywords: ["動画", "ストリーミング", "配信", "ライブ", "再生"] },
    multilang:   { id: "multilang",   name: "多言語対応",              price: 30,  icon: "🌐", keywords: ["英語", "翻訳", "多言語", "海外", "国際化", "i18n"] },
    review:      { id: "review",      name: "レビュー・評価機能",       price: 25,  icon: "⭐", keywords: ["レビュー", "評価", "口コミ", "星", "レーティング"] },
    coupon:      { id: "coupon",      name: "クーポン・ポイント",       price: 35,  icon: "🎫", keywords: ["クーポン", "ポイント", "割引", "特典", "キャンペーン"] },
    timeline:    { id: "timeline",    name: "タイムライン・フィード",   price: 35,  icon: "📰", keywords: ["タイムライン", "フィード", "投稿", "ストーリー"] },
    profile:     { id: "profile",     name: "プロフィール管理",         price: 20,  icon: "👤", keywords: ["プロフィール", "自己紹介", "アバター"] },
    matching:    { id: "matching",    name: "マッチング機能",           price: 60,  icon: "🤝", keywords: ["マッチング", "マッチ", "相性", "おすすめ"] },
    shipping:    { id: "shipping",    name: "配送・物流管理",           price: 40,  icon: "🚚", keywords: ["配送", "送料", "物流", "発送", "追跡"] },
    attendance:  { id: "attendance",  name: "勤怠・出退勤管理",         price: 40,  icon: "⏰", keywords: ["勤怠", "出退勤", "打刻", "出勤", "退勤", "シフト"] },
    approval:    { id: "approval",    name: "ワークフロー・承認",       price: 45,  icon: "✅", keywords: ["承認", "ワークフロー", "申請", "稟議", "決裁"] },
    crm:         { id: "crm",         name: "CRM・顧客管理",           price: 50,  icon: "🗂️",  keywords: ["顧客管理", "CRM", "顧客", "クライアント", "リード"] },
    nativeApp:   { id: "nativeApp",  name: "ネイティブアプリ化",       price: 200, icon: "📲", keywords: ["ネイティブ", "ネイティブアプリ", "App Store", "Google Play", "ストア公開"] },
    pwa:         { id: "pwa",        name: "PWA対応",                  price: 60,  icon: "⚡", keywords: ["PWA", "プログレッシブ", "ホーム画面", "オフライン対応", "インストール"] },
};

// ===== モデルケース定義 =====
const modelCases = [
    {
        name: "ECサイト / ネットショップ",
        keywords: ["EC", "ネットショップ", "通販", "オンラインショップ", "eコマース", "ECサイト", "ショップ", "物販", "販売サイト"],
        baseName: "ECサイト構築",
        basePrice: 150,
        required: ["requirements", "login", "payment", "inventory", "search", "admin", "responsive", "design"],
        optional: ["review", "coupon", "shipping", "notify", "report", "media", "multilang", "ai", "security", "nativeApp", "pwa"]
    },
    {
        name: "SNSアプリ",
        keywords: ["SNS", "ソーシャル", "コミュニティ", "交流", "つながり"],
        baseName: "SNSプラットフォーム構築",
        basePrice: 200,
        required: ["requirements", "login", "profile", "timeline", "social", "notify", "responsive", "design"],
        optional: ["chat", "media", "search", "video", "map", "matching", "ai", "security", "multilang", "nativeApp", "pwa"]
    },
    {
        name: "マッチングアプリ",
        keywords: ["マッチング", "出会い", "婚活", "恋活", "ペアリング"],
        baseName: "マッチングアプリ構築",
        basePrice: 250,
        required: ["requirements", "login", "profile", "matching", "chat", "notify", "payment", "responsive", "design"],
        optional: ["map", "search", "media", "ai", "security", "report", "multilang", "nativeApp", "pwa"]
    },
    {
        name: "予約システム",
        keywords: ["予約", "予約サイト", "予約システム", "予約管理", "サロン", "美容院", "病院", "クリニック", "レストラン"],
        baseName: "予約システム構築",
        basePrice: 120,
        required: ["requirements", "login", "booking", "admin", "notify", "responsive", "design"],
        optional: ["payment", "search", "review", "map", "report", "multilang", "api", "nativeApp", "pwa"]
    },
    {
        name: "業務管理システム",
        keywords: ["業務管理", "業務システム", "基幹", "社内システム", "バックオフィス", "ERP", "業務効率"],
        baseName: "業務管理システム構築",
        basePrice: 180,
        required: ["requirements", "login", "admin", "search", "report", "security", "design"],
        optional: ["approval", "attendance", "crm", "notify", "api", "media", "responsive", "multilang", "nativeApp", "pwa"]
    },
    {
        name: "動画配信サービス",
        keywords: ["動画配信", "ストリーミング", "ライブ配信", "VOD", "映像", "動画サイト", "配信プラットフォーム"],
        baseName: "動画配信プラットフォーム構築",
        basePrice: 250,
        required: ["requirements", "login", "video", "payment", "search", "responsive", "design"],
        optional: ["social", "notify", "admin", "ai", "report", "multilang", "security", "nativeApp", "pwa"]
    },
    {
        name: "チャット・メッセージアプリ",
        keywords: ["チャットアプリ", "メッセージアプリ", "メッセンジャー", "LINE風", "トーク"],
        baseName: "チャットアプリ構築",
        basePrice: 200,
        required: ["requirements", "login", "chat", "notify", "profile", "responsive", "design"],
        optional: ["media", "video", "social", "search", "security", "api", "multilang", "nativeApp", "pwa"]
    },
    {
        name: "CRM・顧客管理",
        keywords: ["CRM", "顧客管理", "営業管理", "SFA", "顧客", "リード管理"],
        baseName: "CRM・顧客管理システム構築",
        basePrice: 180,
        required: ["requirements", "login", "crm", "search", "admin", "report", "security", "design"],
        optional: ["notify", "api", "media", "approval", "responsive", "multilang", "nativeApp", "pwa"]
    },
    {
        name: "Webメディア / ブログ",
        keywords: ["メディア", "ブログ", "オウンドメディア", "記事", "ニュース", "情報サイト", "ポータル"],
        baseName: "Webメディア構築",
        basePrice: 80,
        required: ["requirements", "admin", "search", "responsive", "design"],
        optional: ["login", "social", "notify", "media", "report", "multilang", "ai", "review", "pwa"]
    },
    {
        name: "iOSアプリ",
        keywords: ["iPhone", "iOS", "iOSアプリ", "iPhoneアプリ", "Apple", "Swift", "App Store"],
        baseName: "iOSネイティブアプリ開発",
        basePrice: 250,
        required: ["requirements", "login", "responsive", "design"],
        optional: ["payment", "chat", "notify", "map", "media", "search", "social", "ai", "api", "security", "pwa"]
    },
    {
        name: "Androidアプリ",
        keywords: ["Android", "アンドロイド", "Google Play", "Kotlin"],
        baseName: "Androidネイティブアプリ開発",
        basePrice: 250,
        required: ["requirements", "login", "responsive", "design"],
        optional: ["payment", "chat", "notify", "map", "media", "search", "social", "ai", "api", "security", "pwa"]
    },
    {
        name: "スマホゲーム",
        keywords: ["ゲーム", "スマホゲーム", "モバイルゲーム", "ゲームアプリ", "ソシャゲ", "パズル", "RPG", "アクション", "ガチャ"],
        baseName: "スマホゲーム開発",
        basePrice: 500,
        required: ["requirements", "login", "responsive", "design"],
        optional: ["payment", "chat", "notify", "social", "media", "ai", "api", "security", "review", "nativeApp", "pwa"]
    },
    {
        name: "Webアプリ",
        keywords: ["Webアプリ", "ウェブアプリ", "ブラウザアプリ", "SaaS", "クラウド"],
        baseName: "Webアプリケーション構築",
        basePrice: 120,
        required: ["requirements", "login", "admin", "responsive", "design"],
        optional: ["payment", "search", "notify", "chat", "api", "media", "report", "security", "multilang", "nativeApp", "pwa"]
    },
    {
        name: "コーポレートサイト / LP",
        keywords: ["ホームページ", "HP", "コーポレート", "ランディングページ", "LP", "会社サイト", "企業サイト"],
        baseName: "コーポレートサイト / LP制作",
        basePrice: 30,
        required: ["requirements", "responsive", "design"],
        optional: ["admin", "login", "search", "multilang", "media", "notify", "api", "nativeApp", "pwa"]
    },
    {
        name: "AIコンシェルジュ",
        keywords: ["AIコンシェルジュ", "コンシェルジュ", "AIアシスタント", "AI接客", "自動応答", "AIチャット", "チャットボット", "GPT", "生成AI"],
        baseName: "AIコンシェルジュシステム構築",
        basePrice: 200,
        required: ["requirements", "ai", "login", "admin", "responsive", "design"],
        optional: ["chat", "notify", "api", "search", "report", "media", "security", "multilang", "payment", "nativeApp", "pwa"]
    },
    {
        name: "業務効率化アプリ",
        keywords: ["業務効率化", "業務改善", "自動化", "DX", "デジタル化", "ペーパーレス", "作業効率", "省力化", "効率化"],
        baseName: "業務効率化アプリ構築",
        basePrice: 150,
        required: ["requirements", "login", "admin", "search", "report", "security", "responsive", "design"],
        optional: ["approval", "attendance", "notify", "api", "media", "crm", "ai", "multilang", "nativeApp", "pwa"]
    },
    {
        name: "簡易診断アプリ",
        keywords: ["簡易診断", "診断", "チェック", "セルフチェック", "簡単診断", "アンケート", "質問", "判定"],
        baseName: "簡易診断アプリ開発",
        basePrice: 60,
        required: ["requirements", "responsive", "design"],
        optional: ["login", "admin", "social", "media", "report", "notify", "api", "multilang", "nativeApp", "pwa"]
    },
    {
        name: "商用診断アプリ",
        keywords: ["商用診断", "本格診断", "診断サービス", "診断ビジネス", "有料診断", "診断コンテンツ"],
        baseName: "商用診断アプリ開発",
        basePrice: 150,
        required: ["requirements", "login", "payment", "admin", "report", "responsive", "design"],
        optional: ["ai", "social", "media", "notify", "search", "api", "security", "multilang", "review", "nativeApp", "pwa"]
    },
    {
        name: "汎用アプリ / その他",
        keywords: [],
        baseName: "アプリケーション企画・設計・開発",
        basePrice: 100,
        required: ["requirements", "login", "admin", "responsive", "design"],
        optional: ["payment", "search", "notify", "chat", "map", "api", "media", "report", "booking", "social", "ai", "security", "video", "multilang", "review", "coupon", "nativeApp", "pwa"]
    },
];

// ===== ボタン用アイコンマップ =====
const modelIcons = {
    "ECサイト / ネットショップ": "🛒",
    "SNSアプリ": "💬",
    "マッチングアプリ": "🤝",
    "予約システム": "📅",
    "業務管理システム": "📋",
    "動画配信サービス": "🎬",
    "チャット・メッセージアプリ": "✉️",
    "CRM・顧客管理": "🗂️",
    "Webメディア / ブログ": "📰",
    "iOSアプリ": "🍎",
    "Androidアプリ": "🤖",
    "スマホゲーム": "🎮",
    "Webアプリ": "🌐",
    "コーポレートサイト / LP": "🏢",
    "AIコンシェルジュ": "✨",
    "業務効率化アプリ": "🚀",
    "簡易診断アプリ": "📊",
    "商用診断アプリ": "📈",
};

// ===== モデルケースボタンを生成 =====
function initModelButtons() {
    const container = document.getElementById('modelButtons');
    const hideFromButtons = ["汎用アプリ / その他", "iOSアプリ", "Androidアプリ", "Webアプリ"];
    for (const mc of modelCases) {
        if (hideFromButtons.includes(mc.name)) continue;
        const btn = document.createElement('button');
        btn.className = 'model-btn';
        const icon = modelIcons[mc.name] || '📦';
        btn.innerHTML = `<span class="btn-icon">${icon}</span>${mc.name}`;
        btn.addEventListener('click', () => {
            userInput.value = mc.name + "を作りたい";
            calculateWithModelCase(mc);
        });
        container.appendChild(btn);
    }
}

// ===== DOM要素 =====
const voiceBtn     = document.getElementById('voiceBtn');
const userInput    = document.getElementById('userInput');
const calcBtn      = document.getElementById('calcBtn');
const dropZone     = document.getElementById('dropZone');
const pdfFile      = document.getElementById('pdfFile');
const browseLink   = document.getElementById('browseLink');
const pdfStatus    = document.getElementById('pdfStatus');
const pdfFilename  = document.getElementById('pdfFilename');
const pdfClearBtn  = document.getElementById('pdfClearBtn');
const pdfProgress  = document.getElementById('pdfProgress');
const pdfProgressBar = document.getElementById('pdfProgressBar');
const pdfCalcHint  = document.getElementById('pdfCalcHint');
const resultCard   = document.getElementById('resultCard');
const totalPriceEl = document.getElementById('totalPrice');

let extractedPdfText = "";
let currentResult = null; // 現在の結果（トグル用に保持）
let isDiscountApplied = false; // 2割引適用状態

// 紹介者限定割引（期限なし）

// PDFヒントクリックで見積もり計算を実行
pdfCalcHint.addEventListener('click', () => {
    calcBtn.click();
});

// ===== 初期化：モデルケースボタン生成 =====
initModelButtons();

// ===== PDF アップロード =====
browseLink.addEventListener('click', (e) => { e.stopPropagation(); pdfFile.click(); });
dropZone.addEventListener('click', () => pdfFile.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
        handlePdf(file);
    } else {
        alert('PDFファイルのみ対応しています。');
    }
});

pdfFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handlePdf(file);
});

pdfClearBtn.addEventListener('click', () => {
    extractedPdfText = "";
    pdfStatus.classList.add('hidden');
    pdfCalcHint.classList.add('hidden');
    pdfFile.value = "";
    dropZone.style.display = "";
    userInput.value = "";
    resultCard.classList.add('hidden');
    currentResult = null;
});

// ===== PDF読み込み処理 =====
async function handlePdf(file) {
    pdfFilename.textContent = file.name;
    pdfStatus.classList.remove('hidden');
    pdfProgress.classList.remove('hidden');
    pdfProgressBar.style.width = '0%';
    dropZone.style.display = 'none';

    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const totalPages = pdf.numPages;
        let fullText = "";

        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(" ");
            fullText += pageText + "\n";
            pdfProgressBar.style.width = Math.round((i / totalPages) * 100) + '%';
        }

        pdfProgress.classList.add('hidden');
        extractedPdfText = fullText;
        // テキストエリアには表示しない
        pdfFilename.textContent = file.name + "（アップロード完了）";
        // 見積もり計算を促すメッセージを表示
        pdfCalcHint.classList.remove('hidden');
        calcBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (err) {
        console.error("PDF読み込みエラー:", err);
        alert("PDFの読み込みに失敗しました。別のファイルをお試しください。");
        pdfProgress.classList.add('hidden');
        pdfStatus.classList.add('hidden');
        dropZone.style.display = "";
    }
}

// ===== 音声認識 =====
let recognition = null;
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.onresult = (e) => {
        userInput.value = e.results[0][0].transcript;
        voiceBtn.classList.remove('active');
        voiceBtn.innerText = "\uD83C\uDF99 音声で入力";
        showLoading();
        setTimeout(() => {
            calculate();
            hideLoading();
        }, 1500);
    };
    recognition.onend = () => {
        voiceBtn.classList.remove('active');
        voiceBtn.innerText = "\uD83C\uDF99 音声で入力";
    };
}

voiceBtn.onclick = () => {
    if (!recognition) {
        alert('お使いのブラウザは音声入力に対応していません。Chromeをお使いください。');
        return;
    }
    recognition.start();
    voiceBtn.classList.add('active');
    voiceBtn.innerText = "\uD83C\uDF99 聴き取り中...";
};

// ===== ローディング表示 =====
const loadingOverlay = document.getElementById('loadingOverlay');

function showLoading() {
    loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    loadingOverlay.classList.add('hidden');
}

// ===== 見積もり計算ボタン =====
calcBtn.addEventListener('click', () => {
    const text = extractedPdfText || userInput.value;
    if (!text.trim()) {
        userInput.style.borderColor = '#ef4444';
        setTimeout(() => userInput.style.borderColor = '', 1500);
        return;
    }
    showLoading();
    setTimeout(() => {
        calculate();
        hideLoading();
    }, 1500);
});

// ===== クリアボタン =====
document.getElementById('clearBtn').addEventListener('click', () => {
    userInput.value = "";
    extractedPdfText = "";
    currentResult = null;
    resultCard.classList.add('hidden');
    pdfStatus.classList.add('hidden');
    pdfCalcHint.classList.add('hidden');
    pdfFile.value = "";
    dropZone.style.display = "";
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== モデルケースのマッチング =====
function findModelCase(text) {
    let bestMatch = null;
    let bestScore = 0;

    for (const mc of modelCases) {
        if (mc.name === "汎用アプリ / その他") continue;
        let score = 0;
        for (const kw of mc.keywords) {
            if (text.includes(kw)) score++;
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = mc;
        }
    }

    // マッチしなければ汎用アプリにフォールバック
    if (!bestMatch) {
        bestMatch = modelCases.find(mc => mc.name === "汎用アプリ / その他");
    }

    return bestMatch;
}

// ===== テキストから追加機能を検出 =====
function detectExtraFeatures(text, alreadyIncluded) {
    const extras = [];
    for (const [id, feat] of Object.entries(featureMaster)) {
        if (alreadyIncluded.includes(id)) continue;
        if (feat.keywords.some(kw => text.includes(kw))) {
            extras.push(id);
        }
    }
    return extras;
}

// ===== メイン計算 =====
function calculate() {
    const text = extractedPdfText || userInput.value;
    if (!text.trim()) {
        userInput.style.borderColor = '#ef4444';
        setTimeout(() => userInput.style.borderColor = '', 1500);
        return;
    }

    const modelCase = findModelCase(text);
    buildResult(modelCase, text);
}

// ===== ボタンクリック時の計算 =====
function calculateWithModelCase(mc) {
    showLoading();
    setTimeout(() => {
        const text = mc.keywords[0] || mc.name;
        buildResult(mc, text);
        hideLoading();
    }, 1500);
}

// ===== 結果構築の共通処理 =====
function buildResult(modelCase, text) {
    if (!modelCase) return;

    // テキストから追加検出された機能
    const allKnown = [...modelCase.required, ...modelCase.optional];
    const extras = detectExtraFeatures(text, allKnown);

    // 結果オブジェクトを構築
    currentResult = {
        modelCase: modelCase,
        basePrice: modelCase.basePrice,
        requiredIds: [...modelCase.required],
        optionalIds: [...modelCase.optional, ...extras],
        optionalEnabled: {} // id -> boolean
    };

    // テキストでマッチしたオプションはデフォルトON、それ以外もON
    for (const id of currentResult.optionalIds) {
        const feat = featureMaster[id];
        if (feat) {
            const matched = feat.keywords.some(kw => text.includes(kw));
            currentResult.optionalEnabled[id] = matched || modelCase.optional.includes(id);
        }
    }
    // 重複排除
    currentResult.optionalIds = [...new Set(currentResult.optionalIds)];

    renderResult();

    // 結果までスクロール
    setTimeout(() => {
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

// ===== 竹・松のティア分類（価格ベース）=====
// 竹（スタンダード）: 40万以下の機能
// 松（プレミアム）: 40万超の機能
function splitTiers(optionalIds) {
    const take = [];  // 竹
    const matsu = []; // 松
    for (const id of optionalIds) {
        const f = featureMaster[id];
        if (!f) continue;
        if (f.price <= 40) {
            take.push(id);
        } else {
            matsu.push(id);
        }
    }
    return { take, matsu };
}

// ===== 必須機能の合計 =====
function calcRequiredTotal() {
    if (!currentResult) return 0;
    let total = currentResult.basePrice;
    for (const id of currentResult.requiredIds) {
        const f = featureMaster[id];
        if (f) total += f.price;
    }
    return total;
}

// ===== ティア別の合計 =====
function calcTierTotal(tierIds) {
    let total = 0;
    for (const id of tierIds) {
        if (currentResult.optionalEnabled[id]) {
            const f = featureMaster[id];
            if (f) total += f.price;
        }
    }
    return total;
}

// ===== 合計金額の再計算 =====
function calcTotal() {
    if (!currentResult) return 0;
    let total = currentResult.basePrice;

    // 必須
    for (const id of currentResult.requiredIds) {
        const f = featureMaster[id];
        if (f) total += f.price;
    }

    // オプション（ONのもののみ）
    for (const id of currentResult.optionalIds) {
        if (currentResult.optionalEnabled[id]) {
            const f = featureMaster[id];
            if (f) total += f.price;
        }
    }

    return total;
}

// ===== アプリ詳細説明を生成 =====
function generateDescription(mc, result) {
    const reqNames = result.requiredIds.map(id => featureMaster[id]?.name).filter(Boolean);
    const optNames = result.optionalIds
        .filter(id => result.optionalEnabled[id])
        .map(id => featureMaster[id]?.name).filter(Boolean);

    const descriptions = {
        "ECサイト / ネットショップ": `オンラインで商品を販売するためのECサイトです。商品の検索・閲覧から決済・購入までをワンストップで提供し、在庫管理や注文管理などの運営機能も備えます。`,
        "SNSアプリ": `ユーザー同士がつながり、投稿やコメントを通じてコミュニケーションできるSNSプラットフォームです。タイムライン、プロフィール、フォロー機能などを中心に構成されます。`,
        "マッチングアプリ": `条件やプロフィールをもとにユーザー同士を結びつけるマッチングサービスです。検索・マッチング・メッセージ機能を軸に、安全性の高い仕組みを提供します。`,
        "予約システム": `店舗・施設・サービスの予約をオンラインで受け付けるシステムです。空き状況の確認からカレンダー連携、リマインド通知まで、予約業務を効率化します。`,
        "業務管理システム": `社内の業務プロセスをデジタル化し、情報の一元管理と効率的な運用を実現するシステムです。データの検索・集計・レポート機能により、経営判断をサポートします。`,
        "動画配信サービス": `動画コンテンツをオンラインで配信・視聴できるプラットフォームです。動画のアップロード・管理・ストリーミング再生、課金機能などを提供します。`,
        "チャット・メッセージアプリ": `リアルタイムでメッセージをやりとりできるコミュニケーションアプリです。テキスト・画像・ファイルの送受信、グループチャット機能を備えます。`,
        "CRM・顧客管理": `顧客情報を一元管理し、営業活動や顧客対応を効率化するシステムです。顧客データの検索・分析・レポート出力により、売上向上を支援します。`,
        "Webメディア / ブログ": `記事やニュースなどのコンテンツを発信するWebメディアです。CMS（管理画面）から記事の投稿・編集・公開が可能で、SEO対策にも対応します。`,
        "iOSアプリ": `iPhone / iPad向けのネイティブアプリケーションです。iOSの機能を最大限活用し、快適なユーザー体験を提供します。`,
        "Androidアプリ": `Android端末向けのネイティブアプリケーションです。Google Playでの配信を想定し、幅広いデバイスに対応します。`,
        "スマホゲーム": `スマートフォン向けのゲームアプリケーションです。魅力的なゲームプレイとソーシャル機能を組み合わせ、ユーザーの継続的なエンゲージメントを実現します。`,
        "Webアプリ": `ブラウザ上で動作するWebアプリケーションです。PC・スマホ問わずアクセスでき、インストール不要で利用できる利便性があります。`,
        "コーポレートサイト / LP": `企業の情報発信やサービス紹介を目的としたWebサイトです。ブランドイメージを反映したデザインで、訪問者に的確な情報を届けます。`,
        "AIコンシェルジュ": `AI技術を活用した自動応答・コンシェルジュシステムです。ユーザーの質問や要望に対してAIが最適な回答を提供し、24時間対応のサポートを実現します。`,
        "業務効率化アプリ": `業務プロセスの自動化・効率化を実現するアプリケーションです。承認ワークフロー、勤怠管理、データ集計などの業務をデジタル化し、生産性を向上させます。`,
        "簡易診断アプリ": `質問に答えるだけで結果がわかる簡易診断アプリです。セルフチェックやアンケート形式で、手軽に利用できます。SNSシェアによる拡散効果が見込めます。`,
        "商用診断アプリ": `収益化を前提とした本格的な診断サービスアプリです。会員登録・決済・診断結果の管理・分析レポートなど、ビジネス運営に必要な機能を包括的に備えます。`,
        "汎用アプリ / その他": `お客さまのご要望に合わせたカスタムアプリケーションです。要件に基づき最適なシステム構成を設計・開発いたします。`,
    };

    const baseDesc = descriptions[mc.name] || descriptions["汎用アプリ / その他"];

    let featureText = "";
    if (reqNames.length > 0) {
        featureText += `<br><br><strong>主な構成：</strong>${reqNames.join("、")}`;
    }
    if (optNames.length > 0) {
        featureText += `<br><strong>追加機能：</strong>${optNames.join("、")}`;
    }

    return `<div class="desc-title">📝 ${mc.name}の概要</div><div class="desc-body">${baseDesc}${featureText}</div>`;
}

// ===== 結果描画 =====
function renderResult() {
    if (!currentResult) return;

    const mc = currentResult.modelCase;

    // モデルケースバッジ
    const badge = document.getElementById('modelCaseBadge');
    badge.innerHTML = `<span>\uD83D\uDCCB モデルケース：${mc.name}</span>`;
    badge.classList.remove('hidden');

    // アプリ詳細説明を生成
    const descEl = document.getElementById('appDescription');
    const desc = generateDescription(mc, currentResult);
    if (desc) {
        descEl.innerHTML = desc;
        descEl.classList.remove('hidden');
    } else {
        descEl.classList.add('hidden');
    }

    // 必須機能リスト
    const requiredList = document.getElementById('requiredList');
    let requiredTotal = currentResult.basePrice;
    let reqHTML = `<li>
        <span class="feat-left"><span class="feat-icon">\uD83C\uDFD7️</span><span class="feat-name">${mc.baseName}</span></span>
        <span class="feat-price required">${currentResult.basePrice}万円</span>
    </li>`;

    for (const id of currentResult.requiredIds) {
        const f = featureMaster[id];
        if (!f) continue;
        requiredTotal += f.price;
        reqHTML += `<li>
            <span class="feat-left"><span class="feat-icon">${f.icon}</span><span class="feat-name">${f.name}</span></span>
            <span class="feat-price required">${f.price}万円</span>
        </li>`;
    }
    requiredList.innerHTML = reqHTML;
    document.getElementById('requiredSubtotal').textContent = `${requiredTotal}万円`;

    // メイン価格表示 = 必須合計（割引対応）
    const priceDisplay = document.querySelector('.price-display');
    if (isDiscountApplied) {
        const discounted = Math.round(requiredTotal * 0.8);
        totalPriceEl.textContent = discounted.toLocaleString();
        priceDisplay.classList.add('has-discount');
        // 元価格と割引バッジを表示
        let origEl = priceDisplay.querySelector('.discounted-original');
        if (!origEl) {
            origEl = document.createElement('span');
            origEl.className = 'discounted-original';
            priceDisplay.insertBefore(origEl, totalPriceEl);
        }
        origEl.textContent = `${requiredTotal.toLocaleString()}万円`;
        let badgeEl = priceDisplay.querySelector('.discount-rate-badge');
        if (!badgeEl) {
            badgeEl = document.createElement('span');
            badgeEl.className = 'discount-rate-badge';
            priceDisplay.appendChild(badgeEl);
        }
        badgeEl.textContent = '20%OFF';
    } else {
        totalPriceEl.textContent = requiredTotal.toLocaleString();
        priceDisplay.classList.remove('has-discount');
        const origEl = priceDisplay.querySelector('.discounted-original');
        if (origEl) origEl.remove();
        const badgeEl = priceDisplay.querySelector('.discount-rate-badge');
        if (badgeEl) badgeEl.remove();
    }

    // 竹・松ティア分類
    const { take, matsu } = splitTiers(currentResult.optionalIds);

    // 竹プラン描画
    renderTierColumn('takeList', take, 'takeSubtotal', 'takeTotal', requiredTotal);

    // 松プラン描画
    renderTierColumn('matsuList', matsu, 'matsuSubtotal', 'matsuTotal', requiredTotal);

    // 3プラン概要を描画
    const takeTotal = requiredTotal + calcTierTotal(take);
    const matsuTotal = requiredTotal + calcTierTotal(matsu);
    renderPlanSummary(requiredTotal, takeTotal, matsuTotal, take, matsu);

    // 表示
    resultCard.classList.remove('hidden');
}

// ===== 制作期間の目安を計算 =====
function estimatePeriod(totalPrice) {
    if (totalPrice <= 50) return "約2〜3週間";
    if (totalPrice <= 100) return "約1〜2ヶ月";
    if (totalPrice <= 200) return "約2〜3ヶ月";
    if (totalPrice <= 350) return "約3〜4ヶ月";
    if (totalPrice <= 500) return "約4〜6ヶ月";
    if (totalPrice <= 800) return "約6〜9ヶ月";
    return "約9〜12ヶ月";
}

// ===== 3プラン概要カードを描画 =====
function renderPlanSummary(basicTotal, takeTotal, matsuTotal, takeIds, matsuIds) {
    const el = document.getElementById('planSummary');
    if (!currentResult) { el.classList.add('hidden'); return; }

    const mc = currentResult.modelCase;

    // 基本プランの機能リスト（必須のみ）
    const basicFeatures = [mc.baseName];
    for (const id of currentResult.requiredIds) {
        const f = featureMaster[id];
        if (f) basicFeatures.push(f.name);
    }

    // 竹プランの機能リスト（必須 + 竹オプション）
    const takeFeatures = [...basicFeatures];
    for (const id of takeIds) {
        const f = featureMaster[id];
        if (f && currentResult.optionalEnabled[id]) takeFeatures.push(f.name);
    }

    // 松プランの機能リスト（必須 + 竹 + 松オプション）
    const matsuFeatures = [...takeFeatures];
    for (const id of matsuIds) {
        const f = featureMaster[id];
        if (f && currentResult.optionalEnabled[id]) matsuFeatures.push(f.name);
    }

    function featureListHTML(features, max) {
        const show = features.slice(0, max);
        let html = show.map(n => `<li>${n}</li>`).join('');
        if (features.length > max) {
            html += `<li style="color:var(--secondary);font-style:italic">他 ${features.length - max}機能</li>`;
        }
        return html;
    }

    el.innerHTML = `
        <div class="plan-card plan-basic">
            <div class="plan-card-header">📦 基本プラン</div>
            <div class="plan-card-body">
                <div class="plan-card-price${isDiscountApplied ? ' has-discount' : ''}">${isDiscountApplied ? `<span class="plan-original">${basicTotal.toLocaleString()}万円</span>${Math.round(basicTotal * 0.8).toLocaleString()}` : basicTotal.toLocaleString()}<span class="plan-unit">万円〜</span></div>
                <div class="plan-card-period">⏱ ${estimatePeriod(basicTotal)}</div>
                <ul class="plan-card-features">${featureListHTML(basicFeatures, 5)}</ul>
                <div class="plan-card-label">必須機能のみ</div>
            </div>
        </div>
        <div class="plan-card plan-take">
            <div class="plan-card-header">🎋 竹プラン</div>
            <div class="plan-card-body">
                <div class="plan-card-price${isDiscountApplied ? ' has-discount' : ''}">${isDiscountApplied ? `<span class="plan-original">${takeTotal.toLocaleString()}万円</span>${Math.round(takeTotal * 0.8).toLocaleString()}` : takeTotal.toLocaleString()}<span class="plan-unit">万円〜</span></div>
                <div class="plan-card-period">⏱ ${estimatePeriod(takeTotal)}</div>
                <ul class="plan-card-features">${featureListHTML(takeFeatures, 6)}</ul>
                <div class="plan-card-label">基本 + スタンダード機能</div>
            </div>
        </div>
        <div class="plan-card plan-matsu">
            <div class="plan-card-header">🌲 松プラン</div>
            <div class="plan-card-body">
                <div class="plan-card-price${isDiscountApplied ? ' has-discount' : ''}">${isDiscountApplied ? `<span class="plan-original">${matsuTotal.toLocaleString()}万円</span>${Math.round(matsuTotal * 0.8).toLocaleString()}` : matsuTotal.toLocaleString()}<span class="plan-unit">万円〜</span></div>
                <div class="plan-card-period">⏱ ${estimatePeriod(matsuTotal)}</div>
                <ul class="plan-card-features">${featureListHTML(matsuFeatures, 7)}</ul>
                <div class="plan-card-label">全機能フルパッケージ</div>
            </div>
        </div>
    `;
    el.classList.remove('hidden');
}

// ===== ティア別カラム描画 =====
function renderTierColumn(listId, tierIds, subtotalId, totalId, requiredTotal) {
    const listEl = document.getElementById(listId);
    let html = "";
    let tierTotal = 0;

    for (const id of tierIds) {
        const f = featureMaster[id];
        if (!f) continue;
        const enabled = currentResult.optionalEnabled[id];
        if (enabled) tierTotal += f.price;

        html += `<li class="option-item ${enabled ? '' : 'disabled'}" data-id="${id}">
            <span class="feat-left">
                <span class="feat-toggle"></span>
                <span class="feat-icon">${f.icon}</span>
                <span class="feat-name">${f.name}</span>
            </span>
            <span class="feat-price optional">${f.price}万円</span>
        </li>`;
    }
    listEl.innerHTML = html;
    document.getElementById(subtotalId).textContent = `${tierTotal}万円`;
    const grandTotal = requiredTotal + tierTotal;
    if (isDiscountApplied) {
        document.getElementById(totalId).textContent = `${Math.round(grandTotal * 0.8).toLocaleString()}万円〜`;
    } else {
        document.getElementById(totalId).textContent = `${grandTotal.toLocaleString()}万円〜`;
    }

    // クリックイベント（トグル）
    listEl.querySelectorAll('.option-item').forEach(li => {
        li.addEventListener('click', () => {
            const id = li.dataset.id;
            currentResult.optionalEnabled[id] = !currentResult.optionalEnabled[id];
            renderResult();
        });
    });
}

// ===== 読み上げ =====
const speakBtn = document.getElementById('speakResult');
speakBtn.addEventListener('click', () => {
    if (!('speechSynthesis' in window) || !currentResult) return;

    // 再生中なら停止
    if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        speakBtn.querySelector('.action-icon').textContent = '🔊';
        speakBtn.querySelector('.action-label').textContent = '読み上げ';
        speakBtn.classList.remove('speaking');
        return;
    }

    const mc = currentResult.modelCase;
    const total = calcTotal();
    let speech = `${mc.name}の概算見積もり結果です。`;

    speech += '必須機能として、';
    for (const id of currentResult.requiredIds) {
        const f = featureMaster[id];
        if (f) speech += `${f.name}、${f.price}万円。`;
    }

    const enabledOpts = currentResult.optionalIds.filter(id => currentResult.optionalEnabled[id]);
    if (enabledOpts.length > 0) {
        speech += 'オプション機能として、';
        for (const id of enabledOpts) {
            const f = featureMaster[id];
            if (f) speech += `${f.name}、${f.price}万円。`;
        }
    }

    speech += `合計、${total}万円からとなります。`;

    const utter = new SpeechSynthesisUtterance(speech);
    utter.lang = 'ja-JP';
    utter.rate = 1.1;

    // ボタンを停止状態に切り替え
    speakBtn.querySelector('.action-icon').textContent = '⏹';
    speakBtn.querySelector('.action-label').textContent = '停止';
    speakBtn.classList.add('speaking');

    utter.onend = () => {
        speakBtn.querySelector('.action-icon').textContent = '🔊';
        speakBtn.querySelector('.action-label').textContent = '読み上げ';
        speakBtn.classList.remove('speaking');
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utter);
});

// ===== 2割引ボタン =====
document.getElementById('discountBtn').addEventListener('click', () => {
    isDiscountApplied = !isDiscountApplied;
    const btn = document.getElementById('discountBtn');
    if (isDiscountApplied) {
        btn.textContent = '✅ 2割引 適用中（クリックで解除）';
        btn.classList.add('applied');
    } else {
        btn.textContent = '🏷 2割引を適用する';
        btn.classList.remove('applied');
    }
    if (currentResult) renderResult();
});

// ===== PDFエクスポート =====
document.getElementById('exportPdfBtn').addEventListener('click', () => {
    if (!currentResult) return;

    const mc = currentResult.modelCase;
    const rate = isDiscountApplied ? 0.8 : 1;
    const requiredTotal = calcRequiredTotal();
    const { take, matsu } = splitTiers(currentResult.optionalIds);
    const takeTotal = requiredTotal + calcTierTotal(take);
    const matsuTotal = requiredTotal + calcTierTotal(matsu);

    const today = new Date();
    const dateStr = `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,'0')}/${String(today.getDate()).padStart(2,'0')}`;

    // 必須機能一覧
    let reqRows = `<tr><td style="padding:8px 12px;border-bottom:1px solid #e8e0d8;color:#3d3331;">🏗️ ${mc.baseName}</td><td style="padding:8px 12px;border-bottom:1px solid #e8e0d8;text-align:right;color:#6b5344;font-weight:600;">${currentResult.basePrice}万円</td></tr>`;
    for (const id of currentResult.requiredIds) {
        const f = featureMaster[id];
        if (f) reqRows += `<tr><td style="padding:8px 12px;border-bottom:1px solid #e8e0d8;color:#3d3331;">${f.icon} ${f.name}</td><td style="padding:8px 12px;border-bottom:1px solid #e8e0d8;text-align:right;color:#6b5344;font-weight:600;">${f.price}万円</td></tr>`;
    }

    // 竹オプション一覧
    let takeRows = '';
    for (const id of take) {
        const f = featureMaster[id];
        if (f && currentResult.optionalEnabled[id]) takeRows += `<tr><td style="padding:7px 12px;border-bottom:1px solid #dde8dd;color:#3d3331;">${f.icon} ${f.name}</td><td style="padding:7px 12px;border-bottom:1px solid #dde8dd;text-align:right;color:#4a6b4a;font-weight:600;">${f.price}万円</td></tr>`;
    }

    // 松オプション一覧
    let matsuRows = '';
    for (const id of matsu) {
        const f = featureMaster[id];
        if (f && currentResult.optionalEnabled[id]) matsuRows += `<tr><td style="padding:7px 12px;border-bottom:1px solid #e0dace;color:#3d3331;">${f.icon} ${f.name}</td><td style="padding:7px 12px;border-bottom:1px solid #e0dace;text-align:right;color:#6b5a3a;font-weight:600;">${f.price}万円</td></tr>`;
    }

    const discountLabel = isDiscountApplied ? ' <span style="color:#c0392b;font-weight:700;">(20%OFF適用)</span>' : '';

    const pdfContent = `
    <div id="pdf-export-content" style="font-family:'Noto Sans JP',sans-serif;color:#3d3331;padding:40px 35px;max-width:700px;margin:0 auto;">
        <!-- ヘッダー -->
        <div style="text-align:center;margin-bottom:30px;padding-bottom:20px;border-bottom:3px solid #c4956a;">
            <div style="font-family:'Noto Serif JP',serif;font-size:32px;font-weight:700;color:#6b5344;letter-spacing:0.05em;">Michi<span style="background:linear-gradient(135deg,#c4956a,#d4a76a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Spark</span></div>
            <div style="font-size:10px;color:#b0a8a4;letter-spacing:4px;margin-top:6px;text-transform:uppercase;">System Estimation</div>
        </div>

        <!-- タイトル -->
        <div style="text-align:center;margin-bottom:25px;">
            <h1 style="font-size:22px;color:#6b5344;margin:0 0 8px;font-weight:700;">概 算 見 積 書</h1>
            <div style="width:40px;height:2px;background:linear-gradient(90deg,#c4956a,#d4a76a);margin:0 auto;"></div>
        </div>

        <!-- メタ情報 -->
        <table style="width:100%;margin-bottom:25px;font-size:13px;">
            <tr>
                <td style="color:#8c8584;">作成日：${dateStr}</td>
                <td style="text-align:right;color:#8c8584;">制作期間の目安：${estimatePeriod(requiredTotal)}</td>
            </tr>
        </table>

        <!-- モデルケース名 -->
        <div style="background:linear-gradient(135deg,#f7f4f2,#f0ebe6);padding:12px 18px;border-radius:10px;margin-bottom:25px;border-left:4px solid #c4956a;">
            <span style="font-size:13px;color:#8c8584;">モデルケース</span>
            <div style="font-size:16px;font-weight:700;color:#6b5344;margin-top:4px;">${mc.name}</div>
        </div>

        <!-- 必須機能 -->
        <div style="margin-bottom:25px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                <div style="width:4px;height:20px;background:#b5666a;border-radius:2px;"></div>
                <h2 style="font-size:15px;color:#b5666a;margin:0;font-weight:700;">🔒 必須機能（基本プラン）</h2>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead><tr style="background:#f7f4f2;"><th style="padding:8px 12px;text-align:left;font-weight:600;color:#6b5344;border-bottom:2px solid #e0d6ce;">機能名</th><th style="padding:8px 12px;text-align:right;font-weight:600;color:#6b5344;border-bottom:2px solid #e0d6ce;width:100px;">金額</th></tr></thead>
                <tbody>
                    ${reqRows}
                </tbody>
            </table>
            <div style="text-align:right;font-size:15px;font-weight:700;color:#6b5344;padding:10px 12px;background:#f7f4f2;border-radius:0 0 8px 8px;margin-top:2px;">
                基本プラン合計：${isDiscountApplied ? `<span style="text-decoration:line-through;color:#8c8584;font-weight:400;font-size:13px;">${requiredTotal.toLocaleString()}万円</span> <span style="color:#c0392b;">${Math.round(requiredTotal * rate).toLocaleString()}万円</span>` : `${requiredTotal.toLocaleString()}万円〜`}${discountLabel}
            </div>
        </div>

        ${takeRows ? `
        <!-- 竹プラン -->
        <div style="margin-bottom:25px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                <div style="width:4px;height:20px;background:#5a8a5a;border-radius:2px;"></div>
                <h2 style="font-size:15px;color:#4a6b4a;margin:0;font-weight:700;">🎋 竹プラン オプション</h2>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead><tr style="background:#f2f7f2;"><th style="padding:8px 12px;text-align:left;font-weight:600;color:#4a6b4a;border-bottom:2px solid #c5dcc5;">機能名</th><th style="padding:8px 12px;text-align:right;font-weight:600;color:#4a6b4a;border-bottom:2px solid #c5dcc5;width:100px;">金額</th></tr></thead>
                <tbody>
                    ${takeRows}
                </tbody>
            </table>
            <div style="text-align:right;font-size:14px;font-weight:700;color:#4a6b4a;padding:10px 12px;background:#f2f7f2;border-radius:0 0 8px 8px;margin-top:2px;">
                竹プラン合計（必須+竹）：${isDiscountApplied ? `<span style="text-decoration:line-through;color:#8c8584;font-weight:400;font-size:13px;">${takeTotal.toLocaleString()}万円</span> <span style="color:#c0392b;">${Math.round(takeTotal * rate).toLocaleString()}万円</span>` : `${takeTotal.toLocaleString()}万円〜`}
            </div>
        </div>` : ''}

        ${matsuRows ? `
        <!-- 松プラン -->
        <div style="margin-bottom:25px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
                <div style="width:4px;height:20px;background:#8a7040;border-radius:2px;"></div>
                <h2 style="font-size:15px;color:#6b5a3a;margin:0;font-weight:700;">🌲 松プラン オプション</h2>
            </div>
            <table style="width:100%;border-collapse:collapse;font-size:13px;">
                <thead><tr style="background:#f7f4ee;"><th style="padding:8px 12px;text-align:left;font-weight:600;color:#6b5a3a;border-bottom:2px solid #d4c9b0;">機能名</th><th style="padding:8px 12px;text-align:right;font-weight:600;color:#6b5a3a;border-bottom:2px solid #d4c9b0;width:100px;">金額</th></tr></thead>
                <tbody>
                    ${matsuRows}
                </tbody>
            </table>
            <div style="text-align:right;font-size:14px;font-weight:700;color:#6b5a3a;padding:10px 12px;background:#f7f4ee;border-radius:0 0 8px 8px;margin-top:2px;">
                松プラン合計（必須+竹+松）：${isDiscountApplied ? `<span style="text-decoration:line-through;color:#8c8584;font-weight:400;font-size:13px;">${matsuTotal.toLocaleString()}万円</span> <span style="color:#c0392b;">${Math.round(matsuTotal * rate).toLocaleString()}万円</span>` : `${matsuTotal.toLocaleString()}万円〜`}
            </div>
        </div>` : ''}

        ${isDiscountApplied ? `
        <!-- 割引バナー -->
        <div style="margin:25px 0;padding:15px 20px;background:linear-gradient(135deg,#fff5f5,#ffeaea);border:2px solid #e8a0a0;border-radius:12px;text-align:center;">
            <div style="font-size:11px;font-weight:700;color:#c0392b;letter-spacing:2px;margin-bottom:4px;">🤝 紹介者限定特典</div>
            <div style="font-size:18px;font-weight:900;color:#c0392b;">全プラン 20%OFF 適用中</div>
        </div>` : ''}

        <!-- 注意事項 -->
        <div style="margin-top:30px;padding:18px 20px;background:linear-gradient(135deg,#f7f4f2,#f0ebe6);border-radius:10px;font-size:11.5px;color:#8c8584;line-height:1.8;">
            <p style="margin:0 0 4px;">※ 上記は概算見積もりです。正確な金額はヒアリング後にご提示いたします。</p>
            <p style="margin:0;">※ 表示価格は税抜です。別途消費税がかかります。</p>
        </div>

        <!-- フッター -->
        <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #e0d6ce;">
            <div style="font-family:'Noto Serif JP',serif;font-size:15px;font-weight:700;color:#6b5344;letter-spacing:0.1em;">Michi<span style="color:#c4956a;">Spark</span></div>
            <div style="font-size:10px;color:#b0a8a4;margin-top:4px;letter-spacing:2px;">michispark.app</div>
        </div>
    </div>`;

    // 一時要素を作成してPDF化
    const wrapper = document.createElement('div');
    wrapper.innerHTML = pdfContent;
    document.body.appendChild(wrapper);

    const opt = {
        margin: [10, 10, 10, 10],
        filename: `MichiSpark_見積書_${mc.name.replace(/[\s/]/g, '_')}_${dateStr.replace(/\//g, '')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(wrapper.firstElementChild).toPdf().get('pdf').then((pdf) => {
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = opt.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        document.body.removeChild(wrapper);
    }).catch((err) => {
        console.error('PDF export error:', err);
        alert('PDFの生成に失敗しました。再度お試しください。');
        document.body.removeChild(wrapper);
    });
});
