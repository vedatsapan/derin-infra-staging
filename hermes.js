// hermes.js - AI Assistant & Telegram Secretary for Der-In infra
// Orchestrates Telegram commands, project approvals, Hostinger VPS API, and chatbot updates.
// Run with: pm2 start hermes.js --name "hermes-agent"

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Get Telegram and Chat configurations
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const INAN_CHAT_ID = process.env.INAN_CHAT_ID;
const DERYA_CHAT_ID = process.env.DERYA_CHAT_ID;

// Ensure Telegram Token is configured
if (!TELEGRAM_TOKEN || TELEGRAM_TOKEN.includes('placeholder')) {
    console.error("⚠️ Hata: TELEGRAM_TOKEN .env dosyasında tanımlı değil veya varsayılan değerde!");
    process.exit(1);
}

let offset = 0;
const lastSeenPath = path.join(__dirname, 'last_seen.json');

// Persistent pending approvals
const pendingApprovalsPath = path.join(__dirname, 'pending_approvals.json');
let pendingApprovals = {};
if (fs.existsSync(pendingApprovalsPath)) {
    try {
        pendingApprovals = JSON.parse(fs.readFileSync(pendingApprovalsPath, 'utf8'));
    } catch (e) {
        console.error("Failed to load pending_approvals.json:", e.message);
    }
}
function savePendingApprovals() {
    try {
        fs.writeFileSync(pendingApprovalsPath, JSON.stringify(pendingApprovals, null, 2), 'utf8');
    } catch (e) {
        console.error("Failed to save pending_approvals.json:", e.message);
    }
}

// Helper to escape HTML tags for Telegram
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Helper to update local .env file dynamically
function updateEnvFile(updates) {
    const envPath = path.join(__dirname, '.env');
    let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    for (const [key, val] of Object.entries(updates)) {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(content)) {
            content = content.replace(regex, `${key}=${val}`);
        } else {
            content += `\n${key}=${val}`;
        }
    }
    fs.writeFileSync(envPath, content, 'utf8');
    // Reload process env
    require('dotenv').config();
}

// Telegram sendMessage helper (returns the sent message payload)
async function sendTelegramMessage(chatId, text, parseMode = 'HTML') {
    try {
        const res = await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: parseMode
        });
        return res.data.result;
    } catch (err) {
        console.error(`Telegram message send failed for chat ${chatId}:`, err.message);
        return null;
    }
}

// Startup downtime calculator and notification
async function handleStartup() {
    console.log("Startup downtime check running...");
    
    // Fetch today's appointments
    let appsStr = "";
    try {
        const todayApps = await getTodayAppointments();
        if (todayApps.length > 0) {
            appsStr = `\n📅 <b>Bugünkü Randevuların:</b>\n` + todayApps.map((a, i) => `${i+1}. ⏰ <code>${a.time}</code> - <b>${escapeHTML(a.client)}</b>\n   📝 ${escapeHTML(a.detail)}`).join('\n') + `\n`;
        } else {
            appsStr = `\n📅 Bugün için kayıtlı randevun bulunmuyor.\n`;
        }
    } catch (appErr) {
        console.error("Failed to fetch today's appointments for startup msg:", appErr.message);
    }

    if (fs.existsSync(lastSeenPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(lastSeenPath, 'utf8'));
            const lastSeen = data.timestamp;
            const diffMs = Date.now() - lastSeen;
            const diffMins = Math.floor(diffMs / 60000);
            
            let timeStr = "";
            if (diffMins < 60) {
                timeStr = `${diffMins} dakika`;
            } else {
                const hours = Math.floor(diffMins / 60);
                const mins = diffMins % 60;
                timeStr = `${hours} saat ${mins} dakika`;
            }
            
            // Check for missing emails during downtime
            let emailsCount = 0;
            const token = process.env.HOSTINGER_MAIL_TOKEN;
            const mailboxResourceId = process.env.HOSTINGER_MAILBOX_RESOURCE_ID;
            if (token && mailboxResourceId) {
                try {
                    const res = await axios.get(`https://api.mail.hostinger.com/api/v1/mailboxes/${mailboxResourceId}/folders/INBOX/messages`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const messages = res.data.data || [];
                    for (const msg of messages) {
                        const msgDate = new Date(msg.date).getTime();
                        if (msgDate > lastSeen) {
                            emailsCount++;
                        }
                    }
                } catch (e) {
                    console.error("Failed to check emails since offline:", e.message);
                }
            }

            const startupMsg = `🤖 <b>Emrindeyim İnan Abi!</b> 🛠️

Bilgisayarın az önce açıldı ve Hermes Ajanın göreve hazır.
Sistem yaklaşık <b>${timeStr}</b> kapalı kaldı.
${emailsCount > 0 ? `📬 Sen yokken gelen kutuna <b>${emailsCount} yeni e-posta</b> düştü! (Bota bildirimleri gelmiş olmalı).` : "📬 Sen yokken yeni e-posta gelmedi."}
${appsStr}
<i>"Fayansların terazisi bozuksa, Derya abla hemen çimento kokusunu alır!" 😉</i>`;
            await sendTelegramMessage(INAN_CHAT_ID, startupMsg);
        } catch (err) {
            console.error("Error reading last seen timestamp:", err);
        }
    } else {
        const welcomeMsg = `🤖 <b>Merhaba İnan Abi!</b>
Der-In infra Hermes asistanın başarıyla kuruldu ve ilk kez çalıştırıldı!
${appsStr}
🛠️ <i>Tüm işler tıkırında, emrindeyim!</i>`;
        await sendTelegramMessage(INAN_CHAT_ID, welcomeMsg);
    }
    
    // Start periodic heartbeat
    setInterval(() => {
        try {
            fs.writeFileSync(lastSeenPath, JSON.stringify({ timestamp: Date.now() }), 'utf8');
        } catch (e) {
            console.error("Failed to write heartbeat:", e.message);
        }
    }, 15000); // every 15 seconds
}

// Hostinger Mail API Linker (Registers all available mailboxes)
async function handleEmailLink(chatId, token) {
    await sendTelegramMessage(chatId, "🔗 Hostinger Agentic Mail API doğrulanıyor, lütfen bekleyin...");
    try {
        const res = await axios.get('https://api.mail.hostinger.com/api/v1/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const mailboxes = res.data.data?.mailboxes || [];
        
        if (mailboxes.length === 0) {
            await sendTelegramMessage(chatId, "❌ Bağlı hesapta yönetilebilir bir e-posta kutusu bulunamadı.");
            return;
        }

        const targetUrl = 'https://derin-infra-staging.vercel.app/api/email-webhook';
        const mailboxMapping = {};
        let finalSecret = '';
        const registeredList = [];

        for (const mailbox of mailboxes) {
            const mailboxResourceId = mailbox.resourceId;
            mailboxMapping[mailbox.address] = mailboxResourceId;

            try {
                // List existing webhooks
                const webhooksRes = await axios.get(`https://api.mail.hostinger.com/api/v1/mailboxes/${mailboxResourceId}/webhooks`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const existingWebhooks = webhooksRes.data.data || [];
                let webhook = existingWebhooks.find(w => w.url === targetUrl);
                let secret = '';

                if (!webhook) {
                    // Create new webhook
                    const createRes = await axios.post(`https://api.mail.hostinger.com/api/v1/mailboxes/${mailboxResourceId}/webhooks`, {
                        name: "Hermes Webhook",
                        url: targetUrl,
                        events: ["message.received"],
                        status: "active"
                    }, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    webhook = createRes.data.data;
                    secret = webhook.secret;
                } else {
                    // Webhook exists, regenerate secret to ensure we have it stored
                    const regenRes = await axios.post(`https://api.mail.hostinger.com/api/v1/mailboxes/${mailboxResourceId}/webhooks/${webhook.id}/regenerate-secret`, {}, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    secret = regenRes.data.data.secret;
                }

                if (!finalSecret) {
                    finalSecret = secret;
                }
                registeredList.push(mailbox.address);
            } catch (webhookErr) {
                console.error(`Failed to configure webhook for mailbox ${mailbox.address}:`, webhookErr.message);
            }
        }

        // Save mapping to mailboxes.json
        fs.writeFileSync(path.join(__dirname, 'mailboxes.json'), JSON.stringify(mailboxMapping, null, 2), 'utf8');

        // Update .env file
        updateEnvFile({
            HOSTINGER_MAIL_TOKEN: token,
            WEBHOOK_SECRET: finalSecret
        });

        const reply = `✅ <b>E-posta kutuları başarıyla bağlandı!</b>
📬 <b>Bağlanan Adresler:</b>
${registeredList.map(email => `• <code>${email}</code>`).join('\n')}
⚡ <b>Webhook Durumu:</b> Tüm kutular için aktif ve 7/24 izleniyor!

İnan Abi, artık bu e-posta adreslerinin herhangi birine mesaj geldiğinde yapay zeka taslak cevabı bota otomatik düşecektir.`;
        await sendTelegramMessage(chatId, reply);
    } catch (err) {
        console.error("API Link Error:", err);
        let errMsg = err.message;
        if (err.response && err.response.data) {
            errMsg = JSON.stringify(err.response.data);
        }
        await sendTelegramMessage(chatId, `❌ <b>E-posta Bağlama Hatası:</b>\n<code>${escapeHTML(errMsg)}</code>`);
    }
}

// Hostinger Mail sending on reply (Supports dynamic mailbox selection)
async function handleEmailReply(message, repliedText) {
    const chatId = message.chat.id.toString();
    const text = (message.text || '').trim();

    // Parse Gelen Kutu address from the replied notification message
    let inbox = "info@derininfra.nl";
    const inboxMatch = repliedText.match(/📥 Gelen Kutu:\s*([^\n\r]+)/);
    if (inboxMatch) {
        inbox = inboxMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
    }

    // Extract emails using regex
    const emailRegex = /[\w.-]+@[\w.-]+\.[\w.-]+/g;
    const emails = repliedText.match(emailRegex) || [];
    const recipient = emails.find(e => e !== inbox && e !== 'info@derininfra.nl');
    
    if (!recipient) {
        await sendTelegramMessage(chatId, "❌ Alıcı e-posta adresi bildirim mesajından ayrıştırılamadı.");
        return;
    }

    // Extract Subject
    let subject = "Re: Der-In infra";
    const subjectMatch = repliedText.match(/📌 Konu:\s*([^\n\r]+)/);
    if (subjectMatch) {
        subject = "Re: " + subjectMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
    }

    // Extract Draft Reply
    let emailBody = "";
    if (text === '/gonder') {
        const draftMatch = repliedText.match(/🤖 Önerilen Cevap:\s*[\r\n]+([\s\S]*?)(?:----------------------------------------|$)/);
        if (draftMatch) {
            emailBody = draftMatch[1].replace(/<\/?[^>]+(>|$)/g, "").trim();
        } else {
            await sendTelegramMessage(chatId, "❌ Önerilen cevap taslağı bildirimden okunamadı.");
            return;
        }
    } else {
        emailBody = text; // Custom response body
    }

    const token = process.env.HOSTINGER_MAIL_TOKEN;
    
    // Look up mailboxResourceId from mapping file
    let mailboxResourceId = process.env.HOSTINGER_MAILBOX_RESOURCE_ID;
    const mappingPath = path.join(__dirname, 'mailboxes.json');
    if (fs.existsSync(mappingPath)) {
        try {
            const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
            if (mapping[inbox]) {
                mailboxResourceId = mapping[inbox];
            }
        } catch (e) {
            console.error("Failed to read mailboxes mapping:", e.message);
        }
    }
    
    if (!token || !mailboxResourceId) {
        await sendTelegramMessage(chatId, "❌ E-posta göndermek için önce e-posta kutusunu bağlamalısınız. Lütfen <code>/bagla &lt;token&gt;</code> komutunu çalıştırın.");
        return;
    }

    await sendTelegramMessage(chatId, `✉️ E-posta <b>${inbox}</b> adresi üzerinden gönderiliyor, lütfen bekleyin...`);

    try {
        await axios.post(`https://api.mail.hostinger.com/api/v1/mailboxes/${mailboxResourceId}/send`, {
            to: [recipient],
            subject: subject,
            text: emailBody
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const successMsg = `✅ <b>E-posta Başarıyla Gönderildi!</b>
📥 <b>Gönderen Kutu:</b> <code>${inbox}</code>
👤 <b>Alıcı:</b> <code>${recipient}</code>
📌 <b>Konu:</b> <code>${subject}</code>

📝 <b>Gönderilen Cevap:</b>
<pre>${escapeHTML(emailBody)}</pre>`;
        await sendTelegramMessage(chatId, successMsg);
    } catch (err) {
        console.error("Email send failed:", err);
        let errMsg = err.message;
        if (err.response && err.response.data) {
            errMsg = JSON.stringify(err.response.data);
        }
        await sendTelegramMessage(chatId, `❌ <b>E-posta Gönderme Hatası (${inbox} üzerinden):</b>\n<code>${escapeHTML(errMsg)}</code>`);
    }
}

// Hostinger VPS Status
async function showServerStatus(chatId) {
    await sendTelegramMessage(chatId, '🔍 Hostinger API üzerinden VPS durumu sorgulanıyor, lütfen bekleyin...');
    try {
        const apiKey = process.env.HOSTINGER_API_KEY;
        const serverId = process.env.HOSTINGER_SERVER_ID;
        
        if (!apiKey || apiKey.includes('key')) {
            const simMsg = `💡 <b>Bilgilendirme (Simüle Modu):</b> Hostinger API anahtarı girilmemiş.

🖥️ <b>Sunucu Durumu:</b> Aktif/Çalışıyor (Port 8085)
⚡ <b>CPU:</b> %5.2
💾 <b>RAM:</b> 480MB / 1024MB
🌐 <b>Web:</b> https://derininfra.nl/`;
            await sendTelegramMessage(chatId, simMsg);
            return;
        }

        const url = `https://api.hostinger.com/v1/vps/${serverId}/status`;
        const res = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        const vpsInfo = res.data;
        const reply = `🖥️ <b>HOSTINGER VPS DURUMU</b>
📌 <b>Sunucu ID:</b> <code>${serverId}</code>
🟢 <b>Durum:</b> ${vpsInfo.status || 'Aktif'}
⚡ <b>İşlemci (CPU):</b> %${vpsInfo.cpu || '0'}
💾 <b>Bellek (RAM):</b> ${vpsInfo.ram_used || '0'}MB / ${vpsInfo.ram_total || '0'}MB
💾 <b>Disk Kullanımı:</b> %${vpsInfo.disk_used_percent || '0'}
🌐 <b>IP Adresi:</b> <code>${vpsInfo.ip || 'Bilinmiyor'}</code>`;
        await sendTelegramMessage(chatId, reply);
    } catch (err) {
        await sendTelegramMessage(chatId, `❌ Sunucu durumu alınamadı: <code>${escapeHTML(err.message)}</code>`);
    }
}

// Hostinger VPS Restart
async function restartServer(chatId) {
    await sendTelegramMessage(chatId, '🔄 Sunucu yeniden başlatma komutu gönderiliyor...');
    try {
        const apiKey = process.env.HOSTINGER_API_KEY;
        const serverId = process.env.HOSTINGER_SERVER_ID;
        
        if (!apiKey || apiKey.includes('key')) {
            const simMsg = `💡 <b>Simüle Modu:</b> Hostinger API anahtarı eksik olduğu için fiziki restart tetiklenemedi. Lokal sunucu çalışmaya devam ediyor.`;
            await sendTelegramMessage(chatId, simMsg);
            return;
        }

        const url = `https://api.hostinger.com/v1/vps/${serverId}/reboot`;
        await axios.post(url, {}, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        await sendTelegramMessage(chatId, `✅ Sunucu başarıyla yeniden başlatıldı! 1-2 dakika içinde tekrar aktif olacaktır.`);
    } catch (err) {
        await sendTelegramMessage(chatId, `❌ Sunucu yeniden başlatılamadı: <code>${escapeHTML(err.message)}</code>`);
    }
}

// GitOps Chatbot Update
async function handleChatbotUpdate(chatId, newInfo) {
    if (!newInfo) {
        await sendTelegramMessage(chatId, '⚠️ Hata: Güncellenecek bilgiyi boş bırakamazsınız. Örnek: <code>/chatbot_guncelle Bayramda kapalıyız.</code>');
        return;
    }

    const updatesPath = path.join(__dirname, 'company_updates.txt');
    try {
        const timestamp = new Date().toLocaleString('tr-TR');
        const updateLine = `[${timestamp}]: ${newInfo}`;
        
        let currentContent = '';
        if (fs.existsSync(updatesPath)) {
            currentContent = fs.readFileSync(updatesPath, 'utf8');
        }
        
        const newContent = currentContent ? `${currentContent}\n${updateLine}` : updateLine;
        fs.writeFileSync(updatesPath, newContent, 'utf8');
        
        await sendTelegramMessage(chatId, `📝 Bilgi tabanı güncellendi. Değişiklikler canlıya (GitHub/Vercel) yükleniyor...`);
        
        const { exec } = require('child_process');
        exec('git add company_updates.txt && git commit -m "update chatbot info via Telegram" && git push origin master', (gitErr, stdout, stderr) => {
            if (gitErr) {
                console.error("Git Push failed:", gitErr);
                sendTelegramMessage(chatId, `❌ <b>Git Push Hatası:</b> Web sitesi güncellenemedi.\n<code>${escapeHTML(gitErr.message)}</code>`);
            } else {
                console.log("Git Push stdout:", stdout);
                sendTelegramMessage(chatId, `✅ <b>Chatbot bilgisi başarıyla güncellendi!</b>\n\nℹ️ <b>Eklenen Bilgi:</b>\n"${escapeHTML(newInfo)}"\n\n🚀 Vercel 1-2 dakika içinde otomatik derleyip canlıya alacaktır.`);
            }
        });
    } catch (err) {
        await sendTelegramMessage(chatId, `❌ Dosya güncelleme hatası: <code>${escapeHTML(err.message)}</code>`);
    }
}

// ============================================================================
// ADVANCED HERMES DATABASE & AI Otomasyon Yardımcıları
// ============================================================================

// Helper to read and write repository files via GitHub API with local fallback
async function gitHubFileOperation(filePath, updateCallback, commitMessage) {
    const token = process.env.GITHUB_TOKEN;
    const repo = "vedatsapan/derin-infra-staging";
    
    if (!token || token.includes('placeholder')) {
        console.warn("GITHUB_TOKEN is missing or placeholder, using local file operation for:", filePath);
        const localPath = path.join(__dirname, filePath);
        let data = [];
        if (fs.existsSync(localPath)) {
            try {
                data = JSON.parse(fs.readFileSync(localPath, 'utf8'));
            } catch (e) {
                console.error("Failed to parse local file:", filePath, e.message);
            }
        }
        const updatedData = updateCallback(data);
        fs.writeFileSync(localPath, JSON.stringify(updatedData, null, 2), 'utf8');
        return updatedData;
    }

    const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Hermes-Agent'
    };

    try {
        let fileSha = null;
        let data = [];

        try {
            const getRes = await axios.get(url, { headers });
            if (getRes.status === 200) {
                fileSha = getRes.data.sha;
                const content = Buffer.from(getRes.data.content, 'base64').toString('utf8');
                data = JSON.parse(content);
            }
        } catch (getErr) {
            if (getErr.response && getErr.response.status === 404) {
                console.log(`File ${filePath} not found on GitHub, starting fresh.`);
            } else {
                throw getErr;
            }
        }

        const updatedData = updateCallback(data);
        const updatedContentBase64 = Buffer.from(JSON.stringify(updatedData, null, 2), 'utf8').toString('base64');
        
        const putPayload = {
            message: commitMessage,
            content: updatedContentBase64
        };
        if (fileSha) {
            putPayload.sha = fileSha;
        }

        await axios.put(url, putPayload, { headers });
        console.log(`Successfully committed ${filePath} to GitHub!`);
        
        // Keep local file in sync
        const localPath = path.join(__dirname, filePath);
        fs.writeFileSync(localPath, JSON.stringify(updatedData, null, 2), 'utf8');

        return updatedData;
    } catch (err) {
        console.error(`Error in gitHubFileOperation for ${filePath}:`, err.message);
        // Fallback to local
        const localPath = path.join(__dirname, filePath);
        let data = [];
        if (fs.existsSync(localPath)) {
            try {
                data = JSON.parse(fs.readFileSync(localPath, 'utf8'));
            } catch (e) {}
        }
        const updatedData = updateCallback(data);
        fs.writeFileSync(localPath, JSON.stringify(updatedData, null, 2), 'utf8');
        return updatedData;
    }
}

// Call Gemini API helper
async function callGemini(prompt, systemInstruction = '') {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const payload = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 }
    };
    if (systemInstruction) {
        payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }
    const res = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
    if (res.data.candidates && res.data.candidates[0] && res.data.candidates[0].content && res.data.candidates[0].content.parts[0]) {
        return res.data.candidates[0].content.parts[0].text.trim();
    }
    throw new Error("Unexpected response structure from Gemini API");
}

// Cleans JSON markdown wrapping
function cleanJsonResponse(text) {
    let clean = text.trim();
    if (clean.startsWith('```')) {
        clean = clean.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '');
    }
    return clean.trim();
}

// AI Appointment parser
async function parseAppointmentWithGemini(inputText) {
    const today = new Date();
    const systemPrompt = `You are a scheduling AI assistant. Extract appointment details from Turkish, Dutch, or English text.
Current date/time context: ${today.toLocaleDateString('tr-TR')} ${today.toLocaleTimeString('tr-TR')} (Europe/Amsterdam timezone).
If the text refers to "yarın" (tomorrow), calculate tomorrow's date. If it refers to next week or specific days, calculate relative to the current date.
Extract fields into JSON:
{
    "date": "DD.MM.YYYY",
    "time": "HH:MM",
    "client": "Client/Company Name (Default: Bilinmeyen Müşteri)",
    "detail": "Purpose of the appointment (Default: Keşif / Tadilat)"
}
Return ONLY valid JSON. No markdown tags.`;

    const response = await callGemini(inputText, systemPrompt);
    const clean = cleanJsonResponse(response);
    return JSON.parse(clean);
}

// AI Pricing Update Generator
async function generatePriceUpdateWithGemini(userRequest, currentPrices) {
    const systemPrompt = `You are a pricing configuration updates AI.
Given the current pricing JSON, modify the fields based on the user's request.
Return a JSON containing two fields:
{
    "new_content": <updated prices JSON structure matching exactly current file structure>,
    "change_description": "Explanation of changes in Turkish (e.g., 'Banyo 2m² fiyatı 4000 Euro\\'dan 4250 Euro\\'ya çıkarıldı.')"
}
Return ONLY valid JSON. No markdown tags.`;

    const prompt = `Current pricing JSON:
${JSON.stringify(currentPrices, null, 2)}

User request: "${userRequest}"`;

    const response = await callGemini(prompt, systemPrompt);
    const clean = cleanJsonResponse(response);
    return JSON.parse(clean);
}

// Helper to filter appointments for today
async function getTodayAppointments() {
    const localPath = path.join(__dirname, 'appointments.json');
    let appointments = [];
    
    const token = process.env.GITHUB_TOKEN;
    if (token && !token.includes('placeholder')) {
        const repo = "vedatsapan/derin-infra-staging";
        const url = `https://api.github.com/repos/${repo}/contents/appointments.json`;
        const headers = {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Hermes-Agent'
        };
        try {
            const res = await axios.get(url, { headers });
            if (res.status === 200) {
                const content = Buffer.from(res.data.content, 'base64').toString('utf8');
                appointments = JSON.parse(content);
            }
        } catch (e) {
            console.warn("Failed to fetch appointments from GitHub, using local fallback:", e.message);
            if (fs.existsSync(localPath)) {
                appointments = JSON.parse(fs.readFileSync(localPath, 'utf8'));
            }
        }
    } else {
        if (fs.existsSync(localPath)) {
            appointments = JSON.parse(fs.readFileSync(localPath, 'utf8'));
        }
    }

    const todayStr = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }); // GG.AA.YYYY
    return appointments.filter(app => {
        const appDateClean = app.date.replace(/[-/]/g, '.');
        return appDateClean === todayStr;
    });
}

// Daily check-in scheduler
let lastAppointmentNotificationDay = "";
async function checkDailyAppointments() {
    try {
        const now = new Date();
        const todayStr = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const currentHour = now.getHours();
        
        // Notify at 08:00 AM
        if (currentHour === 8 && lastAppointmentNotificationDay !== todayStr) {
            lastAppointmentNotificationDay = todayStr;
            const todayApps = await getTodayAppointments();
            
            let msg = `☀️ <b>Günaydın İnan Abi!</b> 🛠️\n\n`;
            if (todayApps.length > 0) {
                msg += `📅 <b>Bugünkü Randevuların:</b>\n` + todayApps.map((a, i) => `${i+1}. ⏰ <code>${a.time}</code> - <b>${escapeHTML(a.client)}</b>\n   📝 ${escapeHTML(a.detail)}`).join('\n');
            } else {
                msg += `📅 Bugün için planlanmış bir randevun bulunmuyor.`;
            }
            msg += `\n\n<i>İyi çalışmalar, şantiyede işler rast gitsin! 🏗️</i>`;
            
            await sendTelegramMessage(INAN_CHAT_ID, msg);
        }
    } catch (err) {
        console.error("Error in checkDailyAppointments:", err.message);
    }
}

// Telegram Message Dispatcher
async function handleTelegramMessage(message) {
    const chatId = message.chat.id.toString();
    
    // Authorization Check
    const isSenderAuthorized = (chatId === INAN_CHAT_ID || chatId === DERYA_CHAT_ID);
    if (!isSenderAuthorized) return;

    const text = (message.text || '').trim();

    // Check if reply to email or approval notifications
    if (message.reply_to_message) {
        const repliedMsg = message.reply_to_message;
        const repliedText = repliedMsg.text || '';
        const replyToId = repliedMsg.message_id;

        if (repliedText.includes('📬 YENİ E-POSTA ALINDI!')) {
            await handleEmailReply(message, repliedText);
            return;
        }

        if (pendingApprovals[replyToId]) {
            const approval = pendingApprovals[replyToId];
            const decision = text.toUpperCase().trim();

            if (decision === 'EVET') {
                await sendTelegramMessage(chatId, "🔄 Değişiklikler GitHub'a gönderiliyor, lütfen bekleyin...");
                try {
                    await gitHubFileOperation(approval.file, () => approval.newContent, `update ${approval.file} via Telegram approval`);
                    await sendTelegramMessage(chatId, `✅ <b>Güncelleme onaylandı ve web sitesi güncellendi!</b>\n\n📝 <b>Değişiklik:</b> ${escapeHTML(approval.description)}\n🚀 Vercel 1-2 dakika içinde otomatik canlıya alacaktır.`);
                    if (approval.requestedBy !== chatId) {
                        await sendTelegramMessage(approval.requestedBy, `🎉 İnan Abi, gönderdiğin web sitesi güncelleme talebi Derya Abla'nın onayıyla yayına alındı!\n\n📝 <b>Değişiklik:</b> ${escapeHTML(approval.description)}`);
                    }
                    delete pendingApprovals[replyToId];
                    savePendingApprovals();
                } catch (err) {
                    console.error("Failed to apply approval:", err);
                    await sendTelegramMessage(chatId, `❌ Değişiklik uygulanırken hata oluştu: <code>${escapeHTML(err.message)}</code>`);
                }
            } else if (decision === 'HAYIR') {
                await sendTelegramMessage(chatId, "❌ Güncelleme reddedildi ve iptal edildi.");
                if (approval.requestedBy !== chatId) {
                    await sendTelegramMessage(approval.requestedBy, `⚠️ Derya Abla gönderdiğin web sitesi güncelleme talebini reddetti.`);
                }
                delete pendingApprovals[replyToId];
                savePendingApprovals();
            } else {
                await sendTelegramMessage(chatId, "⚠️ Lütfen onay için sadece <b>EVET</b> veya iptal için <b>HAYIR</b> yazarak yanıtlayın.");
            }
            return;
        }
    }

    // Smart GitHub Token Auto-Extractor (ghp_... or github_pat_...)
    const githubTokenMatch = text.match(/\b(ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9_]{82})\b/);
    if (githubTokenMatch) {
        const ghToken = githubTokenMatch[1];
        updateEnvFile({ GITHUB_TOKEN: ghToken });
        await sendTelegramMessage(chatId, "🔑 <b>GitHub Token başarıyla kaydedildi!</b> Artık teklifleri, randevuları ve web sitesi güncellemelerini yönetebilirim.");
        return;
    }

    // Smart Token Auto-Extractor (Checks if the message contains a 64-character Hostinger API token)
    const tokenMatch = text.match(/\b([a-f0-9]{64})\b/i);
    if (tokenMatch) {
        const token = tokenMatch[1];
        await handleEmailLink(chatId, token);
        return;
    }

    // Command Router
    if (text.startsWith('/start') || text.startsWith('/yardim')) {
        const helpMsg = `🤖 <b>Der-In Infra Hermes Asistanı</b>

<b>E-posta & Sunucu Komutları:</b>
🔑 <code>/bagla &lt;token&gt;</code> - Hostinger Mail API jetonunu bağlar.
🖥️ <code>/durum</code> - VPS sunucu durumunu gösterir.
🔄 <code>/restart</code> - VPS sunucuyu yeniden başlatır.
📝 <code>/chatbot_guncelle &lt;bilgi&gt;</code> - Chatbot bilgi tabanına bilgi ekler.

<b>Web Sitesi & Randevu Yönetimi:</b>
📋 <code>/teklifler</code> - Son 5 web teklif formunu listeler.
📅 <code>/randevular</code> - Yaklaşan randevuları listeler.
➕ <code>/randevu_ekle &lt;metin&gt;</code> - Yapay zeka ile randevu ekler (Örn: <i>/randevu_ekle yarın 14:00 Ahmet bey ile keşif</i>).
🗑️ <code>/randevu_sil &lt;id&gt;</code> - Belirtilen ID'ye sahip randevuyu siler.
🌐 <code>/guncelle &lt;istek&gt;</code> - Yapay zeka ile fiyatları günceller (Derya Abla onaylı).

<i>Şantiyede çimento kokusu varsa teraziyi kontrol etmeyi unutma İnan Abi! 🛠️</i>`;
        await sendTelegramMessage(chatId, helpMsg);
        return;
    }

    if (text.startsWith('/bagla ')) {
        const token = text.substring(7).trim();
        await handleEmailLink(chatId, token);
        return;
    }

    if (text === '/durum' || text === '/sunucu_durumu') {
        await showServerStatus(chatId);
        return;
    }

    if (text === '/restart' || text === '/sunucu_restart') {
        await restartServer(chatId);
        return;
    }

    if (text.startsWith('/chatbot_guncelle ')) {
        const newInfo = text.substring(18).trim();
        await handleChatbotUpdate(chatId, newInfo);
        return;
    }

    // --- NEW ADVANCED INTEGRATION COMMANDS ---

    // 1. /teklifler - List last 5 web quote forms
    if (text === '/teklifler') {
        await sendTelegramMessage(chatId, "🔍 Son teklif talepleri GitHub/veritabanından çekiliyor, lütfen bekleyin...");
        try {
            const token = process.env.GITHUB_TOKEN;
            const repo = "vedatsapan/derin-infra-staging";
            let quotes = [];
            const localPath = path.join(__dirname, 'quotes.json');

            if (token && !token.includes('placeholder')) {
                const url = `https://api.github.com/repos/${repo}/contents/quotes.json`;
                const headers = {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Hermes-Agent'
                };
                const res = await axios.get(url, { headers });
                if (res.status === 200) {
                    const content = Buffer.from(res.data.content, 'base64').toString('utf8');
                    quotes = JSON.parse(content);
                }
            } else {
                if (fs.existsSync(localPath)) {
                    quotes = JSON.parse(fs.readFileSync(localPath, 'utf8'));
                }
            }

            if (quotes.length === 0) {
                await sendTelegramMessage(chatId, "📭 Kayıtlı herhangi bir teklif talebi bulunamadı.");
                return;
            }

            const last5 = quotes.slice(0, 5);
            let responseMsg = `📋 <b>Son 5 Teklif Talebi (Web Sitesi):</b>\n\n`;
            last5.forEach((q, idx) => {
                const date = q.created_at ? new Date(q.created_at).toLocaleDateString('tr-TR') : 'Bilinmiyor';
                responseMsg += `<b>${idx + 1}. 👤 ${escapeHTML(q.client_name)}</b>\n` +
                               `📅 <b>Tarih:</b> ${date}\n` +
                               `📞 <b>Tel:</b> <code>${escapeHTML(q.client_phone)}</code>\n` +
                               `✉️ <b>E-posta:</b> <code>${escapeHTML(q.client_email)}</code>\n` +
                               `📍 <b>Konum:</b> ${escapeHTML(q.location)}\n` +
                               `🛠️ <b>Hizmet:</b> ${escapeHTML(q.project_type)} (${q.size} m², ${escapeHTML(q.material_preference)})\n` +
                               `💰 <b>Hesaplanan:</b> €${q.calculated_estimate} ex. BTW\n` +
                               `📝 <b>Açıklama:</b> <i>${escapeHTML(q.description || 'Yok')}</i>\n\n` +
                               `----------------------------------------\n`;
            });
            await sendTelegramMessage(chatId, responseMsg);
        } catch (err) {
            console.error("Failed to list proposals:", err);
            await sendTelegramMessage(chatId, `❌ Teklifler listelenemedi: <code>${escapeHTML(err.message)}</code>`);
        }
        return;
    }

    // 2. /randevu_ekle <metin> - AI-assisted appointment addition
    if (text.startsWith('/randevu_ekle')) {
        const appointmentText = text.substring(13).trim();
        if (!appointmentText) {
            await sendTelegramMessage(chatId, "⚠️ Hata: Eklemek istediğiniz randevu detayını yazın. Örnek: <code>/randevu_ekle yarın saat 14:00'te Ahmet bey ile banyo keşfi</code>");
            return;
        }

        await sendTelegramMessage(chatId, "🤖 Randevu detayları yapay zeka ile analiz ediliyor...");
        try {
            const parsed = await parseAppointmentWithGemini(appointmentText);
            const appUniqueId = Date.now().toString().slice(-8); // Short ID

            const newApp = {
                id: appUniqueId,
                date: parsed.date,
                time: parsed.time,
                client: parsed.client,
                detail: parsed.detail,
                created_at: new Date().toISOString()
            };

            await gitHubFileOperation('appointments.json', (data) => {
                data.push(newApp);
                data.sort((a, b) => {
                    const [dayA, monthA, yearA] = a.date.split('.').map(Number);
                    const [dayB, monthB, yearB] = b.date.split('.').map(Number);
                    const dateA = new Date(yearA, monthA - 1, dayA);
                    const dateB = new Date(yearB, monthB - 1, dayB);
                    if (dateA.getTime() !== dateB.getTime()) {
                        return dateA.getTime() - dateB.getTime();
                    }
                    return a.time.localeCompare(b.time);
                });
                return data;
            }, `add appointment for ${newApp.client}`);

            const reply = `✅ <b>Randevu Başarıyla Eklendi!</b>\n\n` +
                          `📅 <b>Tarih:</b> <code>${newApp.date}</code>\n` +
                          `⏰ <b>Saat:</b> <code>${newApp.time}</code>\n` +
                          `👤 <b>Müşteri:</b> <b>${escapeHTML(newApp.client)}</b>\n` +
                          `📝 <b>Detay:</b> ${escapeHTML(newApp.detail)}\n` +
                          `🆔 <b>Randevu ID:</b> <code>${newApp.id}</code>\n\n` +
                          `<i>Silmek için: <code>/randevu_sil ${newApp.id}</code></i>`;
            await sendTelegramMessage(chatId, reply);
        } catch (err) {
            console.error("Appointment parse/save error:", err);
            await sendTelegramMessage(chatId, `❌ Randevu eklenemedi: <code>${escapeHTML(err.message)}</code>`);
        }
        return;
    }

    // 3. /randevular - List upcoming appointments
    if (text === '/randevular') {
        await sendTelegramMessage(chatId, "🔍 Randevu listesi yükleniyor...");
        try {
            const token = process.env.GITHUB_TOKEN;
            const repo = "vedatsapan/derin-infra-staging";
            let appointments = [];
            const localPath = path.join(__dirname, 'appointments.json');

            if (token && !token.includes('placeholder')) {
                const url = `https://api.github.com/repos/${repo}/contents/appointments.json`;
                const headers = {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Hermes-Agent'
                };
                const res = await axios.get(url, { headers });
                if (res.status === 200) {
                    const content = Buffer.from(res.data.content, 'base64').toString('utf8');
                    appointments = JSON.parse(content);
                }
            } else {
                if (fs.existsSync(localPath)) {
                    appointments = JSON.parse(fs.readFileSync(localPath, 'utf8'));
                }
            }

            if (appointments.length === 0) {
                await sendTelegramMessage(chatId, "📅 Planlanmış herhangi bir randevu bulunmamaktadır.");
                return;
            }

            let msg = `📅 <b>Güncel Randevu Listesi:</b>\n\n`;
            appointments.forEach((a, idx) => {
                msg += `<b>${idx + 1}. 👤 ${escapeHTML(a.client)}</b>\n` +
                       `📅 <b>Tarih:</b> <code>${a.date}</code> | ⏰ <b>Saat:</b> <code>${a.time}</code>\n` +
                       `📝 <b>Detay:</b> ${escapeHTML(a.detail)}\n` +
                       `🆔 <b>ID:</b> <code>${a.id}</code>\n` +
                       `----------------------------------------\n`;
            });
            await sendTelegramMessage(chatId, msg);
        } catch (err) {
            console.error("Failed to load appointments:", err);
            await sendTelegramMessage(chatId, `❌ Randevular listelenemedi: <code>${escapeHTML(err.message)}</code>`);
        }
        return;
    }

    // 4. /randevu_sil <id> - Delete an appointment by ID
    if (text.startsWith('/randevu_sil')) {
        const appId = text.substring(12).trim();
        if (!appId) {
            await sendTelegramMessage(chatId, "⚠️ Hata: Silmek istediğiniz randevunun ID'sini belirtin. Örnek: <code>/randevu_sil 123456</code>");
            return;
        }

        await sendTelegramMessage(chatId, `🔄 ID: ${appId} olan randevu siliniyor...`);
        try {
            let found = false;
            await gitHubFileOperation('appointments.json', (data) => {
                const idx = data.findIndex(a => a.id === appId);
                if (idx !== -1) {
                    data.splice(idx, 1);
                    found = true;
                }
                return data;
            }, `delete appointment ID ${appId}`);

            if (found) {
                await sendTelegramMessage(chatId, `✅ Randevu başarıyla silindi!`);
            } else {
                await sendTelegramMessage(chatId, `⚠️ Belirtilen ID (<code>${appId}</code>) ile eşleşen bir randevu bulunamadı.`);
            }
        } catch (err) {
            console.error("Failed to delete appointment:", err);
            await sendTelegramMessage(chatId, `❌ Randevu silinemedi: <code>${escapeHTML(err.message)}</code>`);
        }
        return;
    }

    // 5. /guncelle <istek> - Natural language pricing/text website update
    if (text.startsWith('/guncelle')) {
        const updateRequest = text.substring(9).trim();
        if (!updateRequest) {
            await sendTelegramMessage(chatId, "⚠️ Hata: Güncellemek istediğiniz fiyat veya içerik talebini yazın. Örnek: <code>/guncelle banyo fiyatını 4250 yap</code>");
            return;
        }

        await sendTelegramMessage(chatId, "🤖 Fiyat değişiklik taslağı yapay zeka ile hazırlanıyor...");
        try {
            const localPricesPath = path.join(__dirname, 'prices.json');
            let currentPrices = {};
            if (fs.existsSync(localPricesPath)) {
                currentPrices = JSON.parse(fs.readFileSync(localPricesPath, 'utf8'));
            } else {
                currentPrices = {
                    badkamer_2: 4000,
                    badkamer_3: 4500,
                    badkamer_4: 5200,
                    badkamer_5_6: 6000,
                    badkamer_extra_m2: 800,
                    badkamer_material: 2500,
                    toilet_base: 2000,
                    toilet_material: 1000,
                    gipsplaat_labor: 42.5,
                    gipsplaat_material: 22.5,
                    fayans_labor: 47.5,
                    fayans_material: 52.5
                };
            }

            const response = await generatePriceUpdateWithGemini(updateRequest, currentPrices);
            const newContent = response.new_content;
            const changeDescription = response.change_description;

            const approvalMsg = `📢 <b>WEB SİTESİ GÜNCELLEME TALEBİ!</b>\n` +
                                `👤 <b>Talep Eden:</b> İnan Abi\n` +
                                `📝 <b>İstek:</b> "${escapeHTML(updateRequest)}"\n\n` +
                                `🔄 <b>Yapılacak Değişiklikler (prices.json):</b>\n` +
                                `<pre>${escapeHTML(changeDescription)}</pre>\n\n` +
                                `👉 <i>Bu güncellemeyi onaylamak için bu mesaja <b>Yanıtla (Reply)</b> deyip sadece <b>EVET</b> yazın.</i>\n` +
                                `👉 <i>İptal etmek için <b>HAYIR</b> yazın.</i>`;

            const targetApprovalChat = DERYA_CHAT_ID || INAN_CHAT_ID;
            const sentMsg = await sendTelegramMessage(targetApprovalChat, approvalMsg);

            if (sentMsg && sentMsg.message_id) {
                pendingApprovals[sentMsg.message_id] = {
                    type: 'website_update',
                    file: 'prices.json',
                    newContent: newContent,
                    description: changeDescription,
                    requestedBy: chatId,
                    chatId: targetApprovalChat
                };
                savePendingApprovals();
                if (chatId !== targetApprovalChat) {
                    await sendTelegramMessage(chatId, `⏱️ Web sitesi fiyat güncellemesi Derya Abla'nın onayına (<code>${targetApprovalChat}</code>) sunuldu. Onay geldiğinde fiyatlar güncellenecektir.`);
                }
            } else {
                throw new Error("Failed to send approval message.");
            }
        } catch (err) {
            console.error("Failed to generate price update draft:", err);
            await sendTelegramMessage(chatId, `❌ Değişiklik taslağı hazırlanamadı: <code>${escapeHTML(err.message)}</code>`);
        }
        return;
    }
}

// Polling Updates loop
async function pollTelegramUpdates() {
    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates?offset=${offset}&timeout=30`;
        const res = await axios.get(url, { timeout: 35000 });
        const updates = res.data.result || [];
        for (const update of updates) {
            offset = update.update_id + 1;
            if (update.message) {
                await handleTelegramMessage(update.message);
            }
        }
    } catch (err) {
        console.error("Telegram polling connection error:", err.message);
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    setTimeout(pollTelegramUpdates, 500);
}

// Initialize Hermes Agent
async function init() {
    console.log("==================================================");
    console.log(" Der-In infra Hermes Agent (Telegram Bot) is starting...");
    console.log(` Target User Chat ID: ${INAN_CHAT_ID}`);
    console.log("==================================================");

    await handleStartup();
    pollTelegramUpdates();
    
    // Start periodic check for daily appointments summary (every 30 mins)
    setInterval(checkDailyAppointments, 1800000);
}

init();
