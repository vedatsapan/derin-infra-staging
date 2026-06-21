# Görev Listesi - Der-In infra Güncellemeleri

## CSS Tasarımı ve Stil Geliştirmeleri (style.css)
- [ ] Önce/Sonra (Before/After) görsel kaydırıcısı stillerini ekle (`.ba-slider`, `.slider-handle`, `.ba-label` vb.)
- [ ] 5 Adımlı Fiyat Sihirbazı arayüz stillerini ekle (`.wizard-section`, `.wizard-progress-track`, `.selection-card`, vb.)
- [ ] Teklif çıktısı için `@media print` düzenlemelerini optimize et

## JavaScript Etkileşim ve Hesaplama Mantığı (app.js)
- [ ] Önce/Sonra kaydırıcısı sürükleme ve dokunmatik hareket kontrollerini kodla
- [ ] Sihirbaz adım geçişleri, ilerleme çubuğu ve İleri/Geri buton mantığını kur
- [ ] Adım adım form girdi doğrulamalarını (validation) bağla
- [ ] Fiyat hesaplayıcıyı sihirbazın yeni girdi alanları (ID'leri) ile senkronize et
- [ ] Ölçü kaydırıcı barı (range) ile sayısal girdinin (number input) birbirini eş zamanlı güncellemesini sağla
- [ ] Dinamik teklif oluşturucu şablonunu ve iş tanımlarını sihirbaz verileriyle entegre et

## Testler ve Doğrulama
- [ ] `node -c app.js` ile JavaScript sözdizimi kontrolü yap
- [ ] `node server.js` ile lokal sunucuyu başlatıp işlevleri manuel test et
- [ ] Değişiklikleri Git ile staging reposuna gönder (`git push origin master`)
