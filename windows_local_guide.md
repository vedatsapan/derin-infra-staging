# Windows Lokal Bilgisayarda Hermes Agent Çalıştırma Kılavuzu
## Sunucu Kiralamadan, Kendi Windows Bilgisayarınızda Çalıştırma Yolu

Hermes Agent (WhatsApp asistanı) Node.js ile yazıldığı için, aylık sunucu (VPS) ücreti ödemek istemiyorsanız İnan abinin veya sizin kendi kişisel Windows bilgisayarınızda da çalışabilir.

### ⚠️ Önemli Kural (Bilmeniz Gerekenler):
* **Açık Kalma Koşulu:** Bilgisayar açık, internete bağlı ve Hermes terminali çalışır durumda olduğu sürece WhatsApp asistanı aktiftir. Bilgisayar kapatılırsa, uyku moduna geçerse veya interneti kesilirse asistan durur. Bilgisayar tekrar açılıp script başlatıldığında asistan otomatik olarak WhatsApp'a tekrar bağlanır.

---

## 1. ADIM: Bilgisayara Gerekli Programların Kurulması

Windows bilgisayarınızda asistanı çalıştırabilmek için 3 temel program kurulmalıdır. Bunları kurmak oldukça basittir:

### A) Node.js Kurulumu (Zorunlu)
1. [Node.js Resmi Web Sitesine](https://nodejs.org/) gidin.
2. Sol taraftaki **"LTS"** (Long Term Support - Önerilen) sürüm butonuna tıklayıp kurulum dosyasını (`.msi`) indirin.
3. İndirdiğiniz dosyayı çift tıklayarak açın ve standart adımları takip ederek ("Next" diyerek) kurulumu tamamlayın.

### B) FFmpeg Kurulumu (Sesli Mesajlar İçin Gerekli)
WhatsApp'tan İnan abinin atacağı ses kayıtlarını yapay zekanın anlayabileceği formata çevirmek için FFmpeg gereklidir. Windows'ta en kolay kurulum yolu şudur:
1. Windows Başlat menüsüne sağ tıklayın ve **"Terminal"** veya **"PowerShell"** uygulamasını yönetici olarak açın.
2. Aşağıdaki komutu yapıştırıp `Enter` tuşuna basın (Windows bu programı otomatik olarak indirip kuracaktır):
   ```powershell
   winget install Gyan.FFmpeg
   ```
3. Kurulum tamamlandıktan sonra PowerShell penceresini kapatın.

---

## 2. ADIM: Hermes Agent Dosyalarının Hazırlanması

1. Proje dosyalarınızın (`hermes.js`, `projects.json`, `package.json` vb.) bulunduğu klasörü Windows bilgisayarınızda kolay erişebileceğiniz bir yere koyun (Örneğin: `C:\DerinInfra` klasörü).
2. Klasörün içinde boş bir alana sağ tıklayın -> **Yeni** -> **Metin Belgesi** deyin.
3. Dosyanın adını `start_hermes.bat` yapın (dosya uzantısının `.txt` değil `.bat` olduğundan emin olun).
4. Bu dosyaya sağ tıklayıp **"Düzenle"** (veya Not Defteri ile Aç) deyin ve içine şu satırları yazıp kaydedin:

```bat
@echo off
title Der-In Infra - Hermes Agent
cd /d %~dp0
echo Gerekli kutuphaneler kontrol ediliyor...
call npm install
echo.
echo Gemini API anahtari yukleniyor...
set GEMINI_API_KEY=AIzaSyYourActualGoogleGeminiApiKeyHere
echo.
echo Hermes Agent baslatiliyor...
node hermes.js
pause
```

*Not: `AIzaSyYourActualGoogleGeminiApiKeyHere` yazan yere kendi Google Gemini API anahtarınızı yapıştırmayı unutmayın!*

---

## 3. ADIM: WhatsApp Bağlantısını Kurma (İlk Çalıştırma)

1. Klasörün içindeki `start_hermes.bat` dosyasına çift tıklayın.
2. Siyah bir komut satırı penceresi açılacak, gerekli kütüphaneleri kuracak ve ardından ekranda büyük kare şeklinde bir **QR Kod** belirecektir.
3. İnan abi cep telefonundan WhatsApp uygulamasını açacak -> **Bağlı Cihazlar** -> **Cihaz Bağla** seçeneğine tıklayarak bilgisayar ekranındaki bu QR kodu kamerasıyla taratacak.
4. Tarama tamamlandığında ekranda `Der-In infra Hermes Agent WhatsApp Bağlantısı Başarıyla Kuruldu! ✅` yazısını göreceksiniz.
5. Bu siyah pencereyi kapatmayın, simge durumuna küçülterek arka planda açık bırakın. Artık asistanınız aktiftir!

---

## 4. ADIM: Web Sitesini Güncelleme (Yerel ve Canlı Senkronizasyonu)

Hermes Agent kendi yerel bilgisayarınızda çalışırken, Derya abla onay verdiğinde yerel klasördeki `projects.json` dosyasını günceller. Web sitenizin canlı sunucuda da (örneğin GitHub Pages veya Hostinger hosting üzerinde) güncellenmesi için:
* Hermes Agent kodumuz, güncelleme başarılı olduğunda otomatik olarak değişiklikleri GitHub'a push edecek şekilde yapılandırılabilir.
* Böylece asistan yerel bilgisayarda çalışsa bile, Derya abla "EVET" dediği anda web siteniz canlıda da saniyeler içinde otomatik olarak güncellenmiş olur!

### Lokal Bilgisayar Kurulumunun Özeti:
| Özellik | Sunucu (VPS) Kiralama | Kendi Bilgisayarı (Windows) |
| :--- | :--- | :--- |
| **Maliyet** | Aylık Kiralama Ücreti Var | **Ücretsiz ($0)** |
| **Kesintisiz Çalışma** | 7/24 Kesintisiz Aktif | Sadece PC açıkken aktif |
| **Bakım / Kontrol** | Sıfır Bakım (PM2 yönetir) | Arada bir bat dosyasını çalıştırmak gerekir |
| **Kurulum Zorluğu** | Orta (Linux komutları gerektirir) | **Kolay (Klasik program kurulumları)** |
