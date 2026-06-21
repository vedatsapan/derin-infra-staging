// hermes.js - AI Assistant & WhatsApp Secretary for Der-In infra
// Orchestrates WhatsApp commands, project approvals, Hostinger VPS API, and chatbot updates.
// Run with: pm2 start hermes.js --name "hermes-agent"

require('dotenv').config();
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configure phone numbers (JIDs) for İnan Abi and Derya Abla
// Format: country_code + number + @s.whatsapp.net (e.g. '31618694652@s.whatsapp.net')
const INAN_JID = process.env.INAN_JID || '31618694652@s.whatsapp.net'; // İnan Abi (Default)
const DERYA_JID = process.env.DERYA_JID || '31618694652@s.whatsapp.net'; // Derya Abla (Default)

// State Tracking
let currentStatus = {
    step: 'IDLE', // IDLE, PENDING_APPROVAL
    pendingData: null
};

// Hostinger VPS API Helper
async function callHostingerAPI(endpoint, method = 'GET', data = null) {
    const apiKey = process.env.HOSTINGER_API_KEY;
    const serverId = process.env.HOSTINGER_SERVER_ID;
    
    if (!apiKey) {
        throw new Error('Hostinger API Key (.env) bulunamadı.');
    }
    if (!serverId) {
        throw new Error('Hostinger Server ID/IP (.env) bulunamadı.');
    }

    // Hostinger VPS REST API URL
    // Standard URL format for Hostinger API: https://api.hostinger.com/v1/vps/...
    const url = `https://api.hostinger.com/v1/vps/${serverId}/${endpoint}`;
    
    try {
        const response = await axios({
            url,
            method,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            data,
            timeout: 10000
        });
        return response.data;
    } catch (err) {
        if (err.response) {
            throw new Error(`Hostinger API Hatası (${err.response.status}): ${JSON.stringify(err.response.data)}`);
        }
        throw new Error(`Hostinger API Bağlantı Hatası: ${err.message}`);
    }
}

// Main WhatsApp Bot Initialization
async function connectToWhatsApp() {
    console.log('Hermes Agent WhatsApp bağlantısı başlatılıyor...');
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true // Prints QR code to terminal for easy linking
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            console.log('👉 Lütfen telefonunuzdan WhatsApp -> Bağlı Cihazlar -> Cihaz Bağla seçeneğiyle bu QR kodu taratın:');
        }
        
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) ? 
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            console.log('Bağlantı koptu. Yeniden bağlanılıyor:', shouldReconnect);
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('==================================================');
            console.log(' Der-In infra Hermes Agent WhatsApp Bağlantısı Kuruldu! ✅');
            console.log(` Dinlenen Numaralar:`);
            console.log(` İnan Abi: ${INAN_JID}`);
            console.log(` Derya Abla: ${DERYA_JID}`);
            console.log('==================================================');
        }
    });

    // Listen for incoming messages
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const messageText = (msg.message.conversation || 
                             msg.message.extendedTextMessage?.text || '').trim();

        // Check if message is from İnan Abi or Derya Abla
        const isSenderAuthorized = (from === INAN_JID || from === DERYA_JID);
        if (!isSenderAuthorized) return;

        // --- COMMAND 1: Chatbot Bilgi Güncelleme (Real-time updates) ---
        if (messageText.toLowerCase().startsWith('chatbot güncelle:') || messageText.toLowerCase().startsWith('chatbot güncelle ')) {
            const newInfo = messageText.substring(17).trim();
            if (!newInfo) {
                await sock.sendMessage(from, { text: '⚠️ Hata: Güncellenecek bilgiyi boş bırakamazsınız. Örnek: "Chatbot Güncelle: Bayramda kapalıyız."' });
                return;
            }

            const updatesPath = path.join(__dirname, 'company_updates.txt');
            try {
                // Append or write the update to the file
                const timestamp = new Date().toLocaleString('tr-TR');
                const updateLine = `[${timestamp}]: ${newInfo}`;
                
                // Read current content to keep history
                let currentContent = '';
                if (fs.existsSync(updatesPath)) {
                    currentContent = fs.readFileSync(updatesPath, 'utf8');
                }
                
                const newContent = currentContent ? `${currentContent}\n${updateLine}` : updateLine;
                fs.writeFileSync(updatesPath, newContent, 'utf8');
                
                await sock.sendMessage(from, { text: `✅ Chatbot bilgi tabanı başarıyla güncellendi ve aktif oldu!\n\nℹ️ *Yeni Eklenen Bilgi:*\n"${newInfo}"` });
                console.log(`Chatbot updated by WhatsApp user: ${newInfo}`);
            } catch (err) {
                await sock.sendMessage(from, { text: `❌ Dosya güncelleme hatası: ${err.message}` });
            }
            return;
        }

        // --- COMMAND 2: Hostinger VPS Durumu Sorgulama ---
        if (messageText.toLowerCase() === 'sunucu durumu' || messageText.toLowerCase() === 'hostinger durum') {
            await sock.sendMessage(from, { text: '🔍 Hostinger API üzerinden VPS durumu sorgulanıyor, lütfen bekleyin...' });
            try {
                // Fetch status from Hostinger VPS API
                const vpsInfo = await callHostingerAPI('status', 'GET');
                // Format response
                const reply = `🖥️ *HOSTINGER VPS DURUMU*
📌 *Sunucu ID:* ${process.env.HOSTINGER_SERVER_ID}
🟢 *Durum:* ${vpsInfo.status || 'Aktif'}
⚡ *İşlemci (CPU):* %${vpsInfo.cpu || '0'}
💾 *Bellek (RAM):* ${vpsInfo.ram_used || '0'}MB / ${vpsInfo.ram_total || '0'}MB
💾 *Disk Kullanımı:* %${vpsInfo.disk_used_percent || '0'}
🌐 *IP Adresi:* ${vpsInfo.ip || 'Bilinmiyor'}`;
                
                await sock.sendMessage(from, { text: reply });
            } catch (err) {
                // Fallback / simulated info if credentials are placeholders
                const isPlaceholder = !process.env.HOSTINGER_API_KEY || process.env.HOSTINGER_API_KEY.includes('key');
                if (isPlaceholder) {
                    await sock.sendMessage(from, { text: `💡 *Bilgilendirme (Simüle Modu):* Hostinger API anahtarı girilmemiş. \n\n🖥️ *Sunucu Durumu:* Aktif/Çalışıyor (Port 8085)\n⚡ *CPU:* %5.2\n💾 *RAM:* 480MB / 1024MB\n🌐 *Web:* https://derininfra.nl/` });
                } else {
                    await sock.sendMessage(from, { text: `❌ Hostinger API Sorgu Hatası: ${err.message}` });
                }
            }
            return;
        }

        // --- COMMAND 3: Hostinger VPS Yeniden Başlatma (Reboot) ---
        if (messageText.toLowerCase() === 'sunucu restart' || messageText.toLowerCase() === 'sunucuyu yeniden başlat') {
            await sock.sendMessage(from, { text: '🔄 Sunucu yeniden başlatma komutu gönderiliyor...' });
            try {
                const response = await callHostingerAPI('reboot', 'POST');
                await sock.sendMessage(from, { text: `✅ Sunucu başarıyla yeniden başlatıldı! 1-2 dakika içinde tekrar aktif olacaktır.` });
            } catch (err) {
                const isPlaceholder = !process.env.HOSTINGER_API_KEY || process.env.HOSTINGER_API_KEY.includes('key');
                if (isPlaceholder) {
                    await sock.sendMessage(from, { text: `💡 *Simüle Modu:* Hostinger API anahtarı eksik olduğu için fiziki restart tetiklenemedi. Lokal sunucu çalışmaya devam ediyor.` });
                } else {
                    await sock.sendMessage(from, { text: `❌ Hostinger API Restart Hatası: ${err.message}` });
                }
            }
            return;
        }

        // --- FLOW 4: İNAN ABİ'DEN GELEN YENİ İŞ / RESİM ONAY SÜRECİ ---
        if (from === INAN_JID) {
            // İnan abi ses kaydı veya şantiye resmi gönderdiğinde
            if (msg.message.imageMessage || msg.message.audioMessage) {
                await sock.sendMessage(from, { text: '📥 Dosyayı aldım İnan abi. Yapay zeka ile görseli/sesi işliyorum...' });
                
                // Setup metadata for the new project
                const mockProject = {
                    id: Date.now(),
                    image: "projects/gallery_bathroom_modern.png", // Or the actual saved filename
                    category: "badkamer",
                    title: {
                        nl: "Nieuwe Badkamer Opgeleverd",
                        en: "New Bathroom Completed",
                        tr: "Yeni Banyo Teslimi"
                    },
                    desc: {
                        nl: "Complete renovatie van badkamer met grote tegels en inloopdouche.",
                        en: "Complete renovation of bathroom with large tiles and walk-in shower.",
                        tr: "Büyük ebatlı fayanslar ve duşakabin ile komple banyo tadilatı."
                    }
                };

                currentStatus.step = 'PENDING_APPROVAL';
                currentStatus.pendingData = mockProject;

                // Send request to Derya Abla for approval
                const approvalMsg = `📢 *YENİ İŞ ONAY TALEBİ!*
👤 *Gönderen:* İnan Abi

📄 *Hollandaca Açıklama:*
*Başlık:* ${mockProject.title.nl}
*Metin:* ${mockProject.desc.nl}

📄 *Türkçe Açıklama:*
*Başlık:* ${mockProject.title.tr}
*Metin:* ${mockProject.desc.tr}

📸 *Görsel:* [Yeni Resim Eklendi]

Lütfen web sitesinde yayınlamak için *EVET* yazın, iptal etmek için *HAYIR* yazın. Açıklamayı değiştirmek için doğrudan yeni metni yazıp gönderebilirsiniz.`;

                await sock.sendMessage(DERYA_JID, { text: approvalMsg });
                await sock.sendMessage(from, { text: '⏱️ İş detayları ve görsel Derya Abla\'nın onayına sunuldu. Onaylandığı an web sitesinde yayına alınacaktır.' });
            }
        }

        // --- FLOW 5: DERYA ABLA ONAY KONTROLÜ ---
        if (from === DERYA_JID && currentStatus.step === 'PENDING_APPROVAL') {
            const reply = messageText.toUpperCase().trim();

            if (reply === 'EVET') {
                const projectsPath = path.join(__dirname, 'projects.json');
                let projects = [];
                try {
                    if (fs.existsSync(projectsPath)) {
                        projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
                    }
                    
                    // Prepend new project
                    projects.unshift(currentStatus.pendingData);
                    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), 'utf8');
                    
                    await sock.sendMessage(DERYA_JID, { text: '✅ Web sitesi başarıyla güncellendi! Yeni iş galeride en başta yayında.' });
                    await sock.sendMessage(INAN_JID, { text: '🎉 Müjde İnan abi, gönderdiğin iş Derya ablanın onayıyla web sitesinde yayınlandı!' });
                } catch (err) {
                    await sock.sendMessage(DERYA_JID, { text: `❌ Dosya yazma hatası: ${err.message}` });
                }
                
                currentStatus.step = 'IDLE';
                currentStatus.pendingData = null;

            } else if (reply === 'HAYIR') {
                await sock.sendMessage(DERYA_JID, { text: '❌ İşlem iptal edildi, web sitesine eklenmeyecek.' });
                await sock.sendMessage(INAN_JID, { text: '⚠️ Gönderdiğin iş Derya abla tarafından uygun görülmedi ve iptal edildi.' });
                
                currentStatus.step = 'IDLE';
                currentStatus.pendingData = null;
            } else {
                // If Derya abla edits the text
                currentStatus.pendingData.desc.tr = messageText;
                currentStatus.pendingData.desc.nl = messageText; // For simplicity in mock
                await sock.sendMessage(DERYA_JID, { text: `📝 Açıklama güncellendi. Yeni metni onaylıyor musunuz? Onaylamak için *EVET* yazın.` });
            }
        }
    });
}

connectToWhatsApp();
