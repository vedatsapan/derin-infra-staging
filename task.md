# Görev Listesi - Der-In infra Güncellemeleri

## CSS Tasarımı ve Stil Geliştirmeleri (style.css)
- [x] Önce/Sonra (Before/After) görsel kaydırıcısı stillerini ekle (`.ba-slider`, `.slider-handle`, `.ba-label` vb.)
- [x] 5 Adımlı Fiyat Sihirbazı arayüz stillerini ekle (`.wizard-section`, `.wizard-progress-track`, `.selection-card`, vb.)
- [x] Teklif çıktısı için `@media print` düzenlemelerini optimize et

## JavaScript Etkileşim ve Hesaplama Mantığı (app.js)
- [x] Önce/Sonra kaydırıcısı sürükleme ve dokunmatik hareket kontrollerini kodla
- [x] Sihirbaz adım geçişleri, ilerleme çubuğu ve İleri/Geri buton mantığını kur
- [x] Adım adım form girdi doğrulamalarını (validation) bağla
- [x] Fiyat hesaplayıcıyı sihirbazın yeni girdi alanları (ID'leri) ile senkronize et
- [x] Ölçü kaydırıcı barı (range) ile sayısal girdinin (number input) birbirini eş zamanlı güncellemesini sağla
- [x] Dinamik teklif oluşturucu şablonunu ve iş tanımlarını sihirbaz verileriyle entegre et

## Testler en Doğrulama
- [x] `node -c app.js` ile JavaScript sözdizimi kontrolü yap
- [x] `node server.js` ile lokal sunucuyu başlatıp işlevleri manuel test et
- [x] Değişiklikleri Git ile staging reposuna gönder (`git push origin master`)
