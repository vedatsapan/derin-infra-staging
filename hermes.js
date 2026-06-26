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

// Telegram sendMessage helper
async function sendTelegramMessage(chatId, text, parseMode = 'HTML') {
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: parseMode
        });
    } catch (err) {
        console.error(`Telegram message send failed for chat ${chatId}:`, err.message);
    }
}

// Startup downtime calculator and notification
async function handleStartup() {
    console.log("Startup downtime check running...");
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

<i>"Fayansların terazisi bozuksa, Derya abla hemen çimento kokusunu alır!" 😉</i>`;
            await sendTelegramMessage(INAN_CHAT_ID, startupMsg);
        } catch (err) {
            console.error("Error reading last seen timestamp:", err);
        }
    } else {
        const welcomeMsg = `🤖 <b>Merhaba İnan Abi!</b>
Der-In infra Hermes asistanın başarıyla kuruldu ve ilk kez çalıştırıldı!
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

// Telegram Message Dispatcher
async function handleTelegramMessage(message) {
    const chatId = message.chat.id.toString();
    
    // Authorization Check
    const isSenderAuthorized = (chatId === INAN_CHAT_ID || chatId === DERYA_CHAT_ID);
    if (!isSenderAuthorized) return;

    const text = (message.text || '').trim();

    // Check if reply to email notification
    if (message.reply_to_message) {
        const repliedMsg = message.reply_to_message;
        const repliedText = repliedMsg.text || '';
        if (repliedText.includes('📬 YENİ E-POSTA ALINDI!')) {
            await handleEmailReply(message, repliedText);
            return;
        }
    }

    // Command Router
    if (text.startsWith('/start') || text.startsWith('/yardim')) {
        const helpMsg = `🤖 <b>Der-In Infra Hermes Asistanı</b>

<b>Komutlar:</b>
🔑 <code>/bagla &lt;token&gt;</code> - Hostinger Mail API jetonunu bağlar.
🖥️ <code>/durum</code> - VPS sunucu durumunu gösterir.
🔄 <code>/restart</code> - VPS sunucuyu yeniden başlatır.
📝 <code>/chatbot_guncelle &lt;bilgi&gt;</code> - Chatbot bilgi tabanına yeni bilgi ekler.

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
}

init();
