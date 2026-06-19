# Marka Tasarım & Renk Paleti Manifestosu
## Der-In infra - Kurumsal Kimlik Kılavuzu

Bu belge, **Der-In infra** şirketinin dijital varlığı, araç kaplamaları, iş kartları ve sosyal medya hesaplarında tutarlı, güven veren ve profesyonel bir görsel dil oluşturulması amacıyla hazırlanmıştır.

---

## 1. Tasarım Felsefesi
Tadilat, tesisat (riolering) ve inşaat (bouwtimmerwerk) sektörü doğrudan **güven, dayanıklılık ve hassasiyet** üzerine kuruludur. Markamızın görsel dili hem İnan abinin ustalığını ve dürüstlüğünü (sürpriz maliyet olmaması) hem de şirketin kurumsal gücünü temsil etmelidir. 

* **Derinlik ve Kalite:** Koyu renkli şık arka planlar, yüksek kaliteli işçiliğimizi ön plana çıkarır.
* **Modernlik ve Şeffaflık:** Canlı turuncu vurgular ve temiz platin çizgiler şeffaf fiyat politikamızı ve modern yapay zeka otomasyonlarımızı yansıtır.

---

## 2. Renk Paleti (Color Tokens)

Tasarımda kullandığımız kurumsal renklerin kodları ve anlamları:

```
█   #0b0f19 | Derin Uzay Siyahı (Slate-950) -> Ana Arkaplan
█   #131a2c | Lapis Laciverti (Slate-900)   -> Kartlar ve Yüzeyler
█   #0284c7 | Okyanus Mavisi (Sky-600)      -> Güven ve Birincil Vurgu
█   #f97316 | Emniyet Turuncusu (Orange-500) -> Harekete Geçirici & İnşaat Vurgusu
█   #f8fafc | Platin Beyazı (Slate-50)       -> Okunabilir Ana Metin
█   #94a3b8 | Duman Grisi (Slate-400)       -> Yardımcı/Muted Metin
```

### Renklerin Psikolojik Kullanımı:
1. **Derin Uzay Siyahı & Lapis Laciverti (#0b0f19 & #131a2c):** Sitenin ana gövdesini oluşturur. Gözü yormaz ve web sitesindeki banyo/tuvalet tadilat fotoğraflarının parlamasını sağlar. Sektördeki ucuz sitelerden sıyrılarak kurumsal bir "SaaS" veya büyük mühendislik firması havası katar.
2. **Okyanus Mavisi (#0284c7):** Hollanda pazarında kurumsal güveni temsil eder. Tesisat (su/kanalizasyon) işlerini çağrıştırır. Butonlarda ve garantilerde ana renk olarak kullanılır.
3. **Emniyet Turuncusu (#f97316):** Şantiye, güvenlik, hareket ve el emeğini simgeler. Müşterinin hemen dikkatini çekmesini istediğimiz "Fiyat Hesapla", "Teklif Al" gibi kritik butonlarda ve önemli uyarılarda ikincil vurgu rengi olarak kullanılır.

---

## 3. Tipografi ve Yazı Tipleri

* **Başlıklar ve Logolar:** `Outfit` (Google Fonts)
  * *Neden?:* Yuvarlak, modern ve geometrik hatlara sahip olup, şirketin yenilikçi ve yapay zeka destekli yapısını temsil eder.
* **Gövde Metinleri ve Formlar:** `Inter` veya sistem yazı tipleri (`-apple-system`, `BlinkMacSystemFont`)
  * *Neden?:* Küçük ekranlarda ve mobil cihazlarda en yüksek okunabilirliği (readability) sunar. iOS zoom korumasını destekler.

---

## 4. Görsel Bileşen Kuralları (UI Rules)

* **Glassmorphic Kartlar:** Tüm bilgi kutuları ve form alanları yarı saydam arkaplana (`rgba(19, 26, 44, 0.8)`) ve arkasındaki içeriği yumuşatan bir filtreye (`backdrop-filter: blur(16px)`) sahip olmalıdır. Bu, sitenin derinliğini artırır.
* **İnce Sınırlar (Borders):** Kartların ve pencerelerin etrafında kalın gölgeler yerine, çok ince yarı saydam beyaz/mavi çizgiler (`1px solid rgba(255, 255, 255, 0.05)`) kullanılmalıdır.
* **Yumuşak Köşeler:** Sert köşeler yerine dairesel, yumuşak köşeler (`border-radius: 14px`) tercih edilerek banyo ve tuvaletlerdeki seramiklerin pürüzsüz yapısı simgelenmelidir.
