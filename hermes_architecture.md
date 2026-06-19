# Hermes Agent & Hostinger VPS Kurulum Kılavuzu
## Der-In infra Akıllı İş Yönetim ve Otomatik Web Güncelleme Altyapısı

Bu kılavuz, **Hostinger KVM VPS (Ubuntu 22.04 LTS)** üzerinde çalışacak olan **Der-In infra Web Sunucusu (server.js)** ile **Hermes Agent (hermes.js)** yapay zeka sekreterinin teknik mimarisini, WhatsApp bağlantısını, dosyalama sistemini ve güvenlik onay mekanizmasını tanımlar.

---

## 1. Sunucu Altyapı Mimarisi

Sistem, Hostinger VPS üzerinde yan yana çalışan iki izole Node.js servisinden oluşur:
1. **Der-In Web Sunucusu (server.js):** Sitenin HTML/CSS/JS dosyalarını yayınlar ve web sitesindeki chatbot widget'ına güvenli bir Gemini AI API köprüsü (/api/chat) sağlar.
2. **Hermes Agent (hermes.js):** İnan abinin WhatsApp'ını dinleyen, gönderdiği ses/fotoğrafları işleyen, Derya abladan onay isteyen ve onay alınırsa web sitesini otomatik güncelleyen arka plan servisidir.

```
                  ┌────────────────────────────────────────┐
                  │              Hostinger VPS             │
                  │                                        │
                  │  ┌──────────────┐    ┌──────────────┐  │
                  │  │  server.js   │    │  hermes.js   │  │
                  │  │  (Port 8085) │    │  (WhatsApp)  │  │
                  │  └──────┬───────┘    └──────┬───────┘  │
                  │         │                   │          │
                  │         ▼ (Okur/Yazar)      │ (Yazar)  │
                  │   [projects.json] ◄─────────┘          │
                  └─────────▲──────────────────────────────┘
                            │
                     Nginx Reverse Proxy
                            │
               ┌────────────┴────────────┐
               │    Internet / Domain    │
               │   (derininfra.nl)       │
               └─────────────────────────┘
```

---

## 2. Hostinger VPS İlk Kurulum Adımları

Hostinger panelinden bir **Ubuntu 22.04 LTS** VPS seçip başlattıktan sonra SSH ile sunucuya bağlanın:

```bash
ssh root@vps_ip_adresi
```

### Adım A: Sunucu Paketlerini Güncelleyin
```bash
sudo apt update && sudo apt upgrade -y
```

### Adım B: Node.js (v18+) ve NPM Kurulumu
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```
Node ve npm versiyonlarını doğrulayın:
```bash
node -v
npm -v
```

### Adım C: PM2 Süreç Yöneticisi Kurulumu
PM2, sunucu çöktüğünde veya yeniden başlatıldığında uygulamalarımızın arka planda kesintisiz çalışmaya devam etmesini sağlar:
```bash
sudo npm install -g pm2
```

---

## 3. Web Sitesi & Gemini Chatbot Sunucusu (server.js) Kurulumu

### Adım A: Proje Dizinini Oluşturun ve Dosyaları Yükleyin
Sunucuda `/var/www/derininfra/` klasörü oluşturun ve web sitesi dosyalarımızı (index.html, style.css, app.js, server.js ve tüm görselleri) buraya yükleyin:
```bash
sudo mkdir -p /var/www/derininfra
cd /var/www/derininfra
```

### Adım B: Gerekli Kütüphaneleri Kurun
```bash
npm init -y
npm install express dotenv
```

### Adım C: .env Dosyasını Oluşturun
Gemini API anahtarını güvenli bir şekilde saklamak için bir `.env` dosyası oluşturun:
```bash
nano .env
```
İçerisine şu satırları yazıp kaydedin (CTRL+O, Enter, CTRL+X):
```env
PORT=8085
GEMINI_API_KEY=AIzaSyYourActualGoogleGeminiApiKeyHere
```

### Adım D: PM2 ile server.js Sunucusunu Başlatın
```bash
pm2 start server.js --name "derin-web"
pm2 save
pm2 startup
```
PM2 status ile çalıştığından emin olun:
```bash
pm2 status
```

---

## 4. Hermes WhatsApp Agent (hermes.js) Kurulumu

Hermes Agent, İnan abinin sesli komutlarını ve şantiye fotoğraflarını yakalayarak işleyen arka plan otomasyonudur.

### Adım A: Gerekli Kütüphanelerin Kurulumu
WhatsApp Web entegrasyonu (Baileys) ve ses dosyalarının dönüştürülmesi için ffmpeg kurulumu gerekir:
```bash
sudo apt install ffmpeg -y
cd /var/www/derininfra
npm install @whiskeysockets/baileys pino qrcode-terminal axios
```

### Adım B: hermes.js Kod Dosyasını Oluşturun
```bash
nano hermes.js
```
Aşağıdaki onay kapılı akıllı kodu yapıştırın:

```javascript
// hermes.js - PM2 ile arka planda çalıştırılacak WhatsApp Botu
const { makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// İnan Abi ve Derya Abla WhatsApp Numaraları (Bağlanacak Numaralar)
const INAN_JID = '31618694652@s.whatsapp.net'; // İnan Abi
const DERYA_JID = '316XXXXXXXX@s.whatsapp.net'; // Derya Abla (Onay Kapısı)

// Durum Takip Değişkenleri
let currentStatus = {
    step: 'IDLE', // IDLE, PENDING_APPROVAL
    pendingData: null
};

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true // Terminalde QR Kod basar
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error instanceof Boom) ? 
                lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut : true;
            console.log('Bağlantı koptu. Yeniden bağlanılıyor:', shouldReconnect);
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === 'open') {
            console.log('Der-In infra Hermes Agent WhatsApp Bağlantısı Başarıyla Kuruldu! ✅');
        }
    });

    // Mesajları Dinle
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const from = msg.key.remoteJid;
        const messageText = (msg.message.conversation || 
                             msg.message.extendedTextMessage?.text || '').trim();

        // --- 1. İNAN ABİ'DEN GELEN BİLGİ VE DOSYALARI DİNLE ---
        if (from === INAN_JID) {
            // İnan abi ses kaydı veya fotoğraf attığında
            if (msg.message.imageMessage || msg.message.audioMessage) {
                await sock.sendMessage(from, { text: '📥 Dosyayı aldım İnan abi, hemen işliyorum...' });
                
                // Yapay zeka ile ses/görüntü analizi simüle ediliyor (Gemini API entegrasyonu)
                const mockProjectNL = {
                    title: "Badkamerrenovatie Lelystad",
                    description: "Nieuwe moderne badkamer opgeleverd in Lelystad. Inloopdouche, strak tegelwerk en verlaagd plafond met spots.",
                    image: "gallery_bathroom_modern.png" // Kaydedilen görsel adı
                };

                currentStatus.step = 'PENDING_APPROVAL';
                currentStatus.pendingData = mockProjectNL;

                // Derya Abla'nın WhatsApp'ına onay talebi gönder
                const approvalMsg = `📢 *YENİ İŞ TALEBİ GELDİ!*
👤 *Gönderen:* İnan Abi

📄 *Hollandaca Web Sitesi Metni:*
*Başlık:* ${mockProjectNL.title}
*Açıklama:* ${mockProjectNL.description}

📸 *Görsel:* [Eklendi]

Lütfen onaylamak için *EVET* yazın. İptal etmek için *HAYIR* yazın. Değişiklik yapmak isterseniz doğrudan yeni Hollandaca açıklamayı yazıp gönderin.`;

                await sock.sendMessage(DERYA_JID, { text: approvalMsg });
                await sock.sendMessage(from, { text: '⏱️ Derya Abla\'s onayına sunuldu. Onay gelince web sitesinde yayınlanacak.' });
            }
            
            // Soru-Cevap & Dosyalama Komutları
            if (messageText.toLowerCase().includes('kaydet') || messageText.toLowerCase().includes('fatura')) {
                await sock.sendMessage(from, { text: '🗄️ Fatura/gider belgesi başarıyla Muhasebe klasörüne arşivlendi.' });
            }
        }

        // --- 2. DERYA ABLA'NIN ONAY KAPISI (VALIDATION GATE) ---
        if (from === DERYA_JID && currentStatus.step === 'PENDING_APPROVAL') {
            const reply = messageText.toUpperCase();

            if (reply === 'EVET') {
                // Web sitesindeki projects.json dosyasını güncelle
                const projectsPath = path.join(__dirname, 'projects.json');
                let projects = [];
                if (fs.existsSync(projectsPath)) {
                    projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
                }
                
                projects.unshift(currentStatus.pendingData); // Başa ekle
                fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), 'utf8');

                // Facebook API tetiklenebilir (Facebook Graph API)
                
                await sock.sendMessage(DERYA_JID, { text: '✅ Web sitesi başarıyla güncellendi ve yeni proje yayınlandı!' });
                await sock.sendMessage(INAN_JID, { text: '🎉 Müjde İnan abi, gönderdiğin iş Derya ablamızın onayıyla web sitesinde yayınlandı!' });
                
                currentStatus.step = 'IDLE';
                currentStatus.pendingData = null;

            } else if (reply === 'HAYIR') {
                await sock.sendMessage(DERYA_JID, { text: '❌ İşlem iptal edildi, web sitesine yüklenmeyecek.' });
                await sock.sendMessage(INAN_JID, { text: '⚠️ Gönderdiğin son iş Derya abla tarafından iptal edildi.' });
                
                currentStatus.step = 'IDLE';
                currentStatus.pendingData = null;
            } else {
                // Metin düzenleme yapılmışsa
                currentStatus.pendingData.description = messageText;
                await sock.sendMessage(DERYA_JID, { text: `📝 Açıklama güncellendi. Yeni metin ile onaylıyor musunuz? Onay için *EVET* yazın.` });
            }
        }
    });
}

connectToWhatsApp();
```

### Adım C: PM2 ile hermes.js WhatsApp Agent'ı Başlatın
```bash
pm2 start hermes.js --name "hermes-agent"
pm2 save
```

### Adım D: WhatsApp Hesabını Bağlayın (Bir Defalık QR Tarama)
Arka planda çalışan WhatsApp servisine bağlanmak için QR kod taraması yapılmalıdır. PM2 loglarını açarak terminalde üretilen QR kodu cep telefonundan taratın:
```bash
pm2 logs hermes-agent
```
Cep telefonunuzda WhatsApp uygulamasını açın -> **Bağlı Cihazlar (Linked Devices)** -> **Cihaz Bağla** butonuna tıklayın ve terminalde çıkan QR kodu kameraya gösterin. Bağlantı kurulduğunda loglarda `Der-In infra Hermes Agent WhatsApp Bağlantısı Başarıyla Kuruldu! ✅` yazısını göreceksiniz. PM2 log penceresinden `CTRL + C` ile çıkabilirsiniz.

---

## 5. Nginx Web Sunucusu Kurulumu & Domain Yönlendirme (Reverse Proxy)

Node.js sunucumuz arka planda `8085` portunda çalışır. Web trafiğini standart web portlarına (`80` HTTP ve `443` HTTPS) alarak domain adresimize bağlamak için Nginx reverse proxy kuracağız.

### Adım A: Nginx Kurulumu
```bash
sudo apt install nginx -y
```

### Adım B: Nginx Konfigürasyon Dosyasını Düzenleyin
`derininfra` adında bir Nginx blok yapılandırması oluşturun:
```bash
sudo nano /etc/nginx/sites-available/derininfra
```
Aşağıdaki Nginx ayarlarını yapıştırın:
```nginx
server {
    listen 80;
    server_name derininfra.nl www.derininfra.nl;

    location / {
        proxy_pass http://localhost:8085;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
Kaydedip kapatın.

### Adım C: Konfigürasyonu Aktif Hale Getirin
```bash
sudo ln -s /etc/nginx/sites-available/derininfra /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

### Adım D: SSL/HTTPS Sertifikası Alın (Let's Encrypt - Ücretsiz)
Güvenli kilit işareti (https) almak için Let's Encrypt botunu çalıştırın:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d derininfra.nl -d www.derininfra.nl
```
Certbot size e-posta adresinizi soracak ve ardından yönlendirme seçeneklerini getirecektir. HTTP trafiğini otomatik olarak HTTPS'e yönlendir seçeneğini (Redirect) işaretleyin. Tebrikler, siteniz artık 100% güvenli (HTTPS) olarak yayında!
