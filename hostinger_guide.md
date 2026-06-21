# Hostinger VPS & Hermes Agent Kurulum El Kitabı
## İnan Abi ve Derya Abla İçin Adım Adım Canlıya Geçiş Yolu

Bu rehber, Hostinger'den hesap aldıktan sonra web sitenizi ve **Hermes Agent** WhatsApp asistanını nasıl yayına alacağınızı adım adım anlatmaktadır.

---

## 1. ADIM: Hostinger'den Ne Satın Almalıyız?

Sistemin çalışması için Hostinger'den iki şey alınmalıdır:
1. **Alan Adı (Domain):** Tercihen `derininfra.nl` (veya alternatif olarak `derin-infra.nl`).
2. **Sunucu (VPS):** Hostinger menüsünden **KVM 1** veya **KVM 2** VPS paketi seçilmelidir. İşletim sistemi olarak kurulum sırasında **Ubuntu 22.04 LTS (64-bit)** seçilmelidir.

---

## 2. ADIM: Sunucuya Bağlanma ve Hazırlık

Sunucu kurulduktan sonra Hostinger size bir **IP Adresi** ve **Şifre** verecektir.
1. Bilgisayarınızdan terminal (veya Windows kullanıyorsanız PuTTY) uygulamasını açın.
2. Aşağıdaki komutla sunucuya bağlanın (IP_ADRESI yerine sunucunuzun IP'sini yazın):
   ```bash
   ssh root@IP_ADRESI
   ```
3. Sunucu şifrenizi girin.
4. Bağlandıktan sonra aşağıdaki komutları sırasıyla kopyalayıp terminale yapıştırarak gerekli programları kurun:



---

## 3. ADIM: Dosyaların Sunucuya Yüklenmesi

1. Sunucuda web klasörümüzü oluşturalım:
   ```bash
   sudo mkdir -p /var/www/derininfra
   cd /var/www/derininfra
   ```
2. Yerel bilgisayarınızdaki tüm proje dosyalarını (`index.html`, `style.css`, `app.js`, `server.js`, `projects.json` ve `gallery_*.png` resimleri) FileZilla veya SCP aracıyla sunucunun `/var/www/derininfra/` klasörüne yükleyin.
3. Sunucu terminalinde klasörün içine girip bağımlılıkları yükleyin:
   ```bash
   cd /var/www/derininfra
   npm init -y
   npm install express dotenv @whiskeysockets/baileys pino qrcode-terminal axios
   ```

---

## 4. ADIM: Gemini Yapay Zeka (API Key) Tanımlama

Müşteri chatbot'unun ve Hermes WhatsApp asistanının çalışması için Google Gemini API anahtarı girilmelidir.
1. Sunucu terminalinde bir `.env` (ortam değişkenleri) dosyası oluşturun:
   ```bash
   nano .env
   ```
2. Açılan ekrana şu satırları yazın (Kendi Gemini API anahtarınızı girin):
   ```env
   PORT=8085
   GEMINI_API_KEY=AIzaSySizinGercekGeminiApiKeyBurayaGelecek
   ```
3. Klasörde boş bir `projects.json` oluşturun:
   ```bash
   echo '[]' > projects.json
   ```
4. `CTRL + O`, ardından `Enter` ve `CTRL + X` tuşlarına basarak dosyayı kaydedip kapatın.

---

## 5. ADIM: Web Sitesi ve WhatsApp Servislerinin Başlatılması (PM2)

Uygulamalarımızın sunucu kapansa bile sürekli çalışması için PM2 süreç yöneticisini tetikleyelim:



---

## 6. ADIM: İnan Abi'nin WhatsApp'ını Bağlama

Hermes Agent'ın İnan abiden gelen sesleri ve resimleri alabilmesi için telefonunu bağlamalıyız:
1. Sunucu terminalinde şu komutu çalıştırın:
   ```bash
   pm2 logs hermes-agent
   ```
2. Log ekranında büyük bir **QR Kod** belirecektir.
3. İnan abi cep telefonundan WhatsApp uygulamasını açacak -> **Bağlı Cihazlar** -> **Cihaz Bağla** seçeneğine tıklayarak terminaldeki bu QR kodu kamerasıyla taratacak.
4. Tarama tamamlandığında loglarda `Der-In infra Hermes Agent WhatsApp Bağlantısı Başarıyla Kuruldu! ✅` yazısını göreceksiniz.
5. `CTRL + C` ile log ekranından çıkabilirsiniz. Bot artık arka planda çalışmaktadır.

*(Aynı QR tarama işlemini hermes.js içerisinde DERYA_JID kısmına kendi numarasını yazarak Derya Abla için de tanımlıyoruz. Böylece sistem Derya ablayı yönetici olarak tanıyacaktır).*

---

## 7. ADIM: İnternet Yönlendirmesi ve Güvenlik (HTTPS SSL)

Web sitenize girenlerin `https://derininfra.nl` olarak şifreli ve güvenli girmesi için SSL sertifikası kuralım:

1. Nginx yönlendirme dosyasını açın:
   ```bash
   sudo nano /etc/nginx/sites-available/derininfra
   ```
2. Aşağıdaki blok kodunu yapıştırın (derininfra.nl yerine kendi domaininizi yazın):
   ```nginx
   server {
       listen 80;
       server_name derininfra.nl www.derininfra.nl;

       location / {
           proxy_pass http://localhost:8085;
           proxy_http_version 1.1;
           proxy_set_header Upgrade ;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host ;
           proxy_cache_bypass ;
       }
   }
   ```
3. Kaydedip kapatın. Yönlendirmeyi aktif edin:
   ```bash
   sudo ln -s /etc/nginx/sites-available/derininfra /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   sudo systemctl restart nginx
   ```
4. Let's Encrypt ile ücretsiz ömür boyu SSL kurun:
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d derininfra.nl -d www.derininfra.nl
   ```
5. Gelen soruda **"Redirect"** seçeneğini seçerek HTTP trafiğini HTTPS'e yönlendirin.

**Tebrikler! Der-In infra web sitesi, yapay zeka chatbot'u ve Hermes WhatsApp otomasyonunuz tamamen kuruldu ve yayında!**
