document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------
    // 1. Translation Dictionary (Dutch, English, Turkish)
    // ----------------------------------------------------------------
            const translations = {
        nl: {
            nav_home: "Home",
            nav_services: "Diensten",
            nav_usp: "Garanties",
            nav_gallery: "Projecten",
            nav_quote: "Offerte",
            nav_contact: "Contact",
            btn_call: "Bel Direct",
            btn_get_quote: "Gratis Offerte",
            hero_badge_text: "1 Jaar Volledige Garantie",
            hero_title: "Der-In infra",
            hero_subtitle: "Uw specialist in complete badkamer- en toiletrenovaties, strak tegelwerk, gipsplaat wanden en water- / afvoerleidingen. Actief in Lelystad en omgeving.",
            hero_usp_1: "Sloop & Afval Inbegrepen",
            hero_usp_2: "Geen reiskosten & parkeerkosten",
            hero_usp_3: "Geen verrassingen achteraf!",
            hero_cta_calc: "Bereken Richtprijs",
            hero_cta_projects: "Bekijk Projecten",
            usp_title: "Onze Duidelijke Beloften",
            usp_subtitle: "Eerlijk vakmanschap zonder verborgen kosten.",
            usp_card_1_title: "Geen verrassingen achteraf!",
            usp_card_1_desc: "Onze tarieven zijn all-in (excl. BTW). Voorrijkosten en parkeerkosten zijn volledig inbegrepen. U betaalt wat op de offerte staat.",
            usp_card_2_title: "Materiaal & Uren Splitsing",
            usp_card_2_desc: "U kiest en koopt uw eigen tegels, kranen, bad en meubels naar eigen smaak. Wij verzorgen de vakkundige montage en leveren alle kaba-materialen (lijm, cement, leidingen).",
            usp_card_3_title: "Sloop & Afval Inclusief",
            usp_card_3_desc: "Bij al onze renovaties is het slopen van de oude badkamer/toilet en het afvoeren van alle puin en restafval volledig bij de prijs inbegrepen.",
            services_title: "Onze Diensten",
            services_subtitle: "Wij leveren vakmanschap van A tot Z voor uw woning of bedrijfspand.",
            service_1_title: "Badkamerrenovatie",
            service_1_desc: "Complete renovatie inclusief sloopwerk, leidingen verleggen, stucwerk, tegelen en montage van douchecabines en sanitair.",
            service_2_title: "Toiletrenovatie",
            service_2_desc: "Installatie van inbouwreservoirs (hangend toilet), modern tegelwerk, fonteintjes en strakke plafondafwerking.",
            service_3_title: "Gipsplaten & Scheidingswanden",
            service_3_desc: "Plaatsen van scheidingswanden en voorzetwanden met gipsplaten, inclusief isolatie en strakke afwerking.",
            service_4_title: "Riolering & Loodgieterswerk",
            service_4_desc: "Aanleg, reparatie en onderhoud van rioleringsbuizen, afvoeren en waterleidingen. Snel en lekvrij.",
            service_tag_starting: "Vanaf",
            service_tag_per_m2: "per m²",
            service_tag_on_request: "Prijs op aanvraag",
            gallery_title: "Ons Opgeleverde Werk",
            gallery_subtitle: "100% echte foto's van onze projecten in badkamerrenovatie, toiletrenovatie, tegelwerk en wanden.",
            gallery_item_1_title: "Badkamer Amsterdam",
            gallery_item_1_desc: "Inloopdouche & Grote plavuizen",
            gallery_item_2_title: "Luxe Badkamer Almere",
            gallery_item_2_desc: "Dubbele wastafel & Goudkleurige kranen",
            gallery_item_3_title: "Toilet Lelystad",
            gallery_item_3_desc: "Hangtoilet & Nis verlichting",
            gallery_item_4_title: "Toilet Utrecht",
            gallery_item_4_desc: "Klassiek tegelwerk & Fonteintje",
            gallery_item_5_title: "Scheidingswand Lelystad",
            gallery_item_5_desc: "Gipsplaten wand & Glad stucwerk",
            gallery_item_6_title: "Wand in opbouw",
            gallery_item_6_desc: "Metal-stud isolatie & Gipsplaten",
            gallery_item_7_title: "Vloertegels Lelystad",
            gallery_item_7_desc: "Grote plavuizen met nivelleersysteem",
            gallery_item_8_title: "Wandtegelwerk",
            gallery_item_8_desc: "Precisie tegelen met laser-nivellering",
            gallery_item_9_title: "Loodgieterswerk",
            gallery_item_9_desc: "Koperen leidingen & Riolering",
            gallery_item_10_title: "Compacte Badkamer",
            gallery_item_10_desc: "2 m² slimme indeling & inloopdouche",
            quote_title: "Bereken Uw Richtprijs",
            quote_subtitle: "Vul het formulier in. De richtprijs wordt live berekend. Onze AI-assistent stuurt de aanvraag direct door naar ons team!",
            form_project_type: "Type Project",
            form_choose_project: "Kies uw project...",
            form_opt_badkamer: "Complete Badkamerrenovatie",
            form_opt_toilet: "Toiletrenovatie",
            form_opt_gipsplaat: "Gipsplaten wanden plaatsen",
            form_opt_riolering: "Riolering & Loodgieterswerk",
            form_opt_fayans: "Tegelwerk (Grote Tegels)",
            form_material_pref: "Materiaal Optie",
            form_opt_labor_only: "Ik lever zelf sanitair & tegels (Alleen arbeid & basis-materialen)",
            form_opt_with_materials: "Der-In infra levert alles (All-in inclusief sanitair/tegels)",
            form_size: "Geschatte Oppervlakte in m²",
            form_size_hint: "Vul alleen hele getallen in.",
            form_location: "Stad / Regio",
            form_description: "Beschrijf uw wensen (Bijv. inloopdouche, hangend toilet, verlaagd plafond, etc.)",
            form_div_contact: "Uw Contactgegevens",
            form_name: "Naam",
            form_phone: "Telefoonnummer",
            form_email: "E-mailadres",
            form_btn_calc: "Vul gegevens in voor richtprijs",
            success_title: "Bedankt! Uw aanvraag is succesvol verstuurd.",
            success_desc: "Onze AI-assistent ve verwerken uw aanvraag. We nemen zo snel mogelijk contact met u op.",
            success_btn_reset: "Nieuwe berekening maken",
            contact_title: "Neem Direct Contact Op",
            contact_subtitle: "Wilt u direct bir afspraak maken voor een opmeting of advies bij u thuis?",
            contact_phone_title: "Bellen / WhatsApp",
            contact_email_title: "E-mail",
            contact_area_title: "Werkgebied",
            contact_area_desc: "Lelystad en omgeving (50 to 75 km straal)",
            map_title: "Actief in Flevoland & Omstreken",
            footer_note: "Gerealiseerd met AI-assistentie & Vakmanschap.",
            chat_status: "Altijd online",
            chat_welcome: "Hallo! Ik ben de AI-assistent van Der-In infra. Ik kan u helpen met richtprijzen voor badkamerrenovatie, toiletrenovatie, tegelwerk en wanden. Hoe kan ik u vandaag helpen?"
        },
        en: {
            nav_home: "Home",
            nav_services: "Services",
            nav_usp: "Guarantees",
            nav_gallery: "Projects",
            nav_quote: "Estimate",
            nav_contact: "Contact",
            btn_call: "Call Directly",
            btn_get_quote: "Free Quote",
            hero_badge_text: "1 Year Full Warranty",
            hero_title: "Der-In infra",
            hero_subtitle: "Your specialist in complete bathroom and toilet renovations, precise tiling, drywall partitions, and plumbing/sewer lines. Active in Lelystad and surroundings.",
            hero_usp_1: "Demolition & Waste Removal Included",
            hero_usp_2: "No travel or parking fees",
            hero_usp_3: "No surprises afterwards!",
            hero_cta_calc: "Calculate Price",
            hero_cta_projects: "View Projects",
            usp_title: "Our Clear Promises",
            usp_subtitle: "Honest craftsmanship without hidden costs.",
            usp_card_1_title: "No Hidden Fees!",
            usp_card_1_desc: "Our rates are all-in (excl. VAT). Call-out charges (travel costs) and parking fees are fully included. You pay what is on the quote.",
            usp_card_2_title: "Material & Labor Split",
            usp_card_2_desc: "You choose and buy your own tiles, taps, bath, and cabinets. We provide the expert installation and supply all rough building materials (glue, cement, pipes).",
            usp_card_3_title: "Demolition & Waste Included",
            usp_card_3_desc: "For all our renovations, dismantling the old bathroom/toilet and disposal of all debris and construction waste is fully included in the price.",
            services_title: "Our Services",
            services_subtitle: "We deliver craftsmanship from A to Z for your home or business premises.",
            service_1_title: "Bathroom Renovation",
            service_1_desc: "Complete renovation including demolition, pipe relocation, plastering, tiling, and installation of shower enclosures and sanitary ware.",
            service_2_title: "Toilet Renovation",
            service_2_desc: "Installation of built-in reservoirs (wall-hung toilets), modern tiling, hand washbasins, and clean ceiling plastering.",
            service_3_title: "Drywall & Partition Walls",
            service_3_desc: "Installing stable metal-stud frames, drywall partitions, and insulation for perfect room division.",
            service_4_title: "Sewerage & Plumbing",
            service_4_desc: "Connecting professional water and sewage pipes, fixing leaks, and replacing sewer lines professionally.",
            service_tag_starting: "From",
            service_tag_per_m2: "per m²",
            service_tag_on_request: "Price on request",
            gallery_title: "Our Completed Work",
            gallery_subtitle: "100% real photos of our projects in bathroom renovation, toilet renovation, tiling, and walls.",
            gallery_item_1_title: "Bathroom Amsterdam",
            gallery_item_1_desc: "Walk-in shower & Large floor tiles",
            gallery_item_2_title: "Luxury Bathroom Almere",
            gallery_item_2_desc: "Double vanity & Gold-colored faucets",
            gallery_item_3_title: "Toilet Lelystad",
            gallery_item_3_desc: "Wall-hung toilet & Niche lighting",
            gallery_item_4_title: "Toilet Utrecht",
            gallery_item_4_desc: "Classic tiling & Hand basin",
            gallery_item_5_title: "Partition Wall Lelystad",
            gallery_item_5_desc: "Drywall partition & Smooth plastering",
            gallery_item_6_title: "Wall Under Construction",
            gallery_item_6_desc: "Metal-stud framing & Drywall boards",
            gallery_item_7_title: "Floor Tiling Lelystad",
            gallery_item_7_desc: "Large tiles with leveling system",
            gallery_item_8_title: "Wall Tiling",
            gallery_item_8_desc: "Precision tiling with laser leveling",
            gallery_item_9_title: "Plumbing Work",
            gallery_item_9_desc: "Copper piping & Drainage lines",
            gallery_item_10_title: "Compact Bathroom",
            gallery_item_10_desc: "2 m² smart layout & Walk-in shower",
            quote_title: "Calculate Estimate",
            quote_subtitle: "Fill out the form. The estimate is calculated live. Our AI assistant forwards the request directly to our team!",
            form_project_type: "Project Type",
            form_choose_project: "Choose your project...",
            form_opt_badkamer: "Complete Bathroom Renovation",
            form_opt_toilet: "Toilet Renovation",
            form_opt_gipsplaat: "Drywall Installation",
            form_opt_riolering: "Sewerage & Plumbing",
            form_opt_fayans: "Tiling (Large Tiles)",
            form_material_pref: "Material Option",
            form_opt_labor_only: "I supply tiles & sanitary (Labor + Rough Materials only)",
            form_opt_with_materials: "Der-In infra supplies everything (All-in including tiles/sanitary)",
            form_size: "Estimated Area in m²",
            form_size_hint: "Enter whole numbers only.",
            form_location: "City / Region",
            form_description: "Describe your wishes (e.g. walk-in shower, wall-hung toilet, suspended ceiling)",
            form_div_contact: "Your Contact Details",
            form_name: "Name",
            form_phone: "Phone Number",
            form_email: "Email Address",
            form_btn_calc: "Fill in details for estimate",
            success_title: "Thank you! Your request has been successfully sent.",
            success_desc: "Our AI assistant and our team are processing your request. We will contact you as soon as possible.",
            success_btn_reset: "Make a new calculation",
            contact_title: "Contact Us Directly",
            contact_subtitle: "Would you like to make an appointment directly for an inspection or advice?",
            contact_phone_title: "Call / WhatsApp",
            contact_email_title: "Email",
            contact_area_title: "Service Area",
            contact_area_desc: "Lelystad and surroundings (50 to 75 km radius)",
            map_title: "Active in Flevoland & Surroundings",
            footer_note: "Realized with AI assistance & Craftsmanship.",
            chat_status: "Always online",
            chat_welcome: "Hello! I am the AI assistant of Der-In infra. I can help you with estimates for bathroom renovations, toilet renovations, tiling, and walls. How can I help you today?"
        },
        tr: {
            nav_home: "Ana Sayfa",
            nav_services: "Hizmetler",
            nav_usp: "Garantiler",
            nav_gallery: "Projeler",
            nav_quote: "Teklif Al",
            nav_contact: "İletişim",
            btn_call: "Tıkla Ara",
            btn_get_quote: "Ücretsiz Teklif",
            hero_badge_text: "1 Yıl Tam Garanti",
            hero_title: "Der-In infra",
            hero_subtitle: "Komple banyo ve tuvalet yenileme, hassas fayans döşeme, alçıpan bölme duvar yapımı ve su ve atık su tesisatı alanında uzmanınız. Lelystad ve çevresinde aktifiz.",
            hero_usp_1: "Yıkım & Moloz Atımı Dahil",
            hero_usp_2: "Yol ve otopark ücreti alınmaz",
            hero_usp_3: "Sonradan sürpriz maliyet yok!",
            hero_cta_calc: "Fiyat Hesapla",
            hero_cta_projects: "Projeleri İncele",
            usp_title: "Açık ve Net Vaatlerimiz",
            usp_subtitle: "Gizli maliyetler olmadan dürüst işçilik.",
            usp_card_1_title: "Sürpriz Ücret Yok!",
            usp_card_1_desc: "Fiyatlarımız her şey dahil (KDV hariç) esasına göredir. Yol masrafı ve otopark ücretleri fiyata dahildir. Teklifte ne görüyorsanız onu ödersiniz.",
            usp_card_2_title: "Malzeme & İşçilik Ayrımı",
            usp_card_2_desc: "Fayans, musluk, banyo dolabı ve küvet gibi malzemeleri kendi zevkinize göre alırsınız. Biz montajı yapar ve kaba inşaat malzemelerini (harç, yapıştırıcı, boru) sağlarız.",
            usp_card_3_title: "Yıkım & Çöp Dahil",
            usp_card_3_desc: "Tüm tadilatlarımızda, eski banyonun/tuvaletin sökülmesi ve molozların şantiyeden atılması tamamen taban fiyatlarımıza dahildir.",
            services_title: "Hizmetlerimiz",
            services_subtitle: "Eviniz veya iş yeriniz için A'dan Z'ye profesyonel ustalık çözümleri sunuyoruz.",
            service_1_title: "Banyo Yenileme",
            service_1_desc: "Yıkım, sıhhi tesisat hatlarının çekilmesi, sıva, fayans kaplama, duşakabin ve banyo mobilyalarının montajı dahil anahtar teslim süreç.",
            service_2_title: "Tuvalet Yenileme",
            service_2_desc: "Gömme rezervuar (asma klozet) montajı, modern fayans kaplama, lavabo takılması ve asma tavan sıva işleri.",
            service_3_title: "Alçıpan & Bölme Duvar",
            service_3_desc: "Sağlam metal karkas kurulumu, alçıpan panellerin montajı, ısı/ses yalıtımı ve pürüzsüz sıva işleri.",
            service_4_title: "Su Tesisatı & Kanalizasyon",
            service_4_desc: "Temiz ve atık su borularının profesyonel montajı, sızıntı tamiratı ve riolering altyapısının yenilenmesi.",
            service_tag_starting: "Başlangıç",
            service_tag_per_m2: "m² başına",
            service_tag_on_request: "Teklif isteyin",
            gallery_title: "Tamamlanan İşlerimiz",
            gallery_subtitle: "Banyo, tuvalet, fayans ve alçıpan projelerimizden %100 gerçek fotoğraflar.",
            gallery_item_1_title: "Banyo Amsterdam",
            gallery_item_1_desc: "İnloopdouche & Büyük ebatlı yer karoları",
            gallery_item_2_title: "Lüks Banyo Almere",
            gallery_item_2_desc: "Çift lavabo & Gold bataryalar",
            gallery_item_3_title: "Tuvalet Lelystad",
            gallery_item_3_desc: "Asma klozet & Gizli niş aydınlatması",
            gallery_item_4_title: "Tuvalet Utrecht",
            gallery_item_4_desc: "Klasik metrotegeller & Mini lavabo",
            gallery_item_5_title: "Bölme Duvar Lelystad",
            gallery_item_5_desc: "Alçıpan duvar bölme & Alçı sıva",
            gallery_item_6_title: "Yapım Aşamasında Duvar",
            gallery_item_6_desc: "Metal profil iskele & Alçıpan montajı",
            gallery_item_7_title: "Yer Seramiği Lelystad",
            gallery_item_7_desc: "Nivelleer klipsli büyük ebat fayans döşeme",
            gallery_item_8_title: "Duvar Fayans Kaplama",
            gallery_item_8_desc: "Lazer hizalama ile milimetrik fayans döşeme",
            gallery_item_9_title: "Tesisat Çalışması",
            gallery_item_9_desc: "Temiz bakır boru hattı & Atık su riolering",
            gallery_item_10_title: "Kompakt Banyo",
            gallery_item_10_desc: "2 m² alan için akıllı duş ve tuvalet yerleşimi",
            quote_title: "Yaklaşık Fiyat Hesapla (Richtprijs)",
            quote_subtitle: "Formu doldurun. Yaklaşık fiyat (richtprijs) anlık olarak hesaplanır. Yapay zeka asistanımız talebinizi doğrudan ekibimize iletir!",
            form_project_type: "Proje Türü",
            form_choose_project: "Proje seçin...",
            form_opt_badkamer: "Komple Banyo Yenileme",
            form_opt_toilet: "Tuvalet Yenileme",
            form_opt_gipsplaat: "Alçıpan Duvar Yapımı",
            form_opt_riolering: "Su Tesisatı & Loodgieterswerk",
            form_opt_fayans: "Fayans Döşeme (Büyük Boy)",
            form_material_pref: "Malzeme Seçeneği",
            form_opt_labor_only: "Fayans ve vitrifiyeyi ben alacağım (Sadece İşçilik + Kaba Malzeme)",
            form_opt_with_materials: "Der-In infra alsın (Her şey dahil malzemeli paket)",
            form_size: "Yaklaşık m² Alanı",
            form_size_hint: "Lütfen sadece tam sayı girin.",
            form_location: "Şehir / Bölge",
            form_description: "İsteklerinizi belirtin (Örn: inloopdouche, asma klozet, tavan spotları vb.)",
            form_div_contact: "İletişim Bilgileriniz",
            form_name: "Adınız Soyadınız",
            form_phone: "Telefon Numaranız",
            form_email: "E-postanız",
            form_btn_calc: "Fiyatı Hesapla ve Teklif İste",
            success_title: "Teşekkürler! Talebiniz başarıyla gönderildi.",
            success_desc: "Yapay zeka asistanımız ve ekibimiz bilgilerinizi aldı. En kısa sürede sizinle iletişime geçeceğiz.",
            success_btn_reset: "Yeni hesaplama yap",
            contact_title: "Doğrudan İletişime Geçin",
            contact_subtitle: "Keşif veya malzeme danışmanlığı için hemen randevu almak ister misiniz?",
            contact_phone_title: "Telefon / WhatsApp",
            contact_email_title: "E-posta",
            contact_area_title: "Hizmet Bölgesi",
            contact_area_desc: "Lelystad ve çevresi (50 - 75 km yarıçap)",
            map_title: "Flevoland & Çevresinde Aktifiz",
            footer_note: "Yapay zeka asistanlığı ve ustalıkla hazırlanmıştır.",
            chat_status: "Her zaman çevrimiçi",
            chat_welcome: "Merhaba! Ben Der-In infra Yapay Zeka Asistanıyım. Banyo yenileme, tuvalet yenileme, fayans ve alçıpan duvar richtprijs (fiyat) tahminleri konusunda yardımcı olabilirim. Size nasıl yardımcı olabilirim?"
        }
    };

    // ----------------------------------------------------------------
    // 2. Language Switching Engine
    // ----------------------------------------------------------------
    let currentLang = localStorage.getItem('preferred_language') || 'nl';
    const langBtns = document.querySelectorAll('.lang-btn');
    const mobileLangBtns = document.querySelectorAll('.lang-btn-mobile');

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferred_language', lang);

        // Update active classes on buttons
        langBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });
        mobileLangBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Translate text contents using data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                element.textContent = translations[lang][key];
            }
        });

        // Update form placeholders
        const sizeInput = document.getElementById('size');
        const locationInput = document.getElementById('location');
        const descInput = document.getElementById('description');
        const nameInput = document.getElementById('client_name');
        const phoneInput = document.getElementById('client_phone');
        const emailInput = document.getElementById('client_email');
        const chatInput = document.getElementById('chatInput');

        if (lang === 'en') {
            if (sizeInput) sizeInput.placeholder = "e.g. 12";
            if (locationInput) locationInput.placeholder = "e.g. Lelystad";
            if (descInput) descInput.placeholder = "Describe your specific project details...";
            if (nameInput) nameInput.placeholder = "Your full name";
            if (phoneInput) phoneInput.placeholder = "e.g. 06 12345678";
            if (emailInput) emailInput.placeholder = "e.g. info@domain.com";
            if (chatInput) chatInput.placeholder = "Ask a question...";
        } else if (lang === 'tr') {
            if (sizeInput) sizeInput.placeholder = "Örn: 12";
            if (locationInput) locationInput.placeholder = "Örn: Lelystad";
            if (descInput) descInput.placeholder = "Yapılacak işin detaylarını veya isteklerinizi yazın...";
            if (nameInput) nameInput.placeholder = "Adınız ve soyadınız";
            if (phoneInput) phoneInput.placeholder = "Örn: 06 12345678";
            if (emailInput) emailInput.placeholder = "Örn: adiniz@domain.com";
            if (chatInput) chatInput.placeholder = "Soru sorun...";
        } else { // Dutch default
            if (sizeInput) sizeInput.placeholder = "Bijv. 12";
            if (locationInput) locationInput.placeholder = "Bijv. Lelystad";
            if (descInput) descInput.placeholder = "Geef ons zoveel mogelijk details over uw project...";
            if (nameInput) nameInput.placeholder = "Voor- en achternaam";
            if (phoneInput) phoneInput.placeholder = "Bijv. 06 12345678";
            if (emailInput) emailInput.placeholder = "Bijv. info@domein.nl";
            if (chatInput) chatInput.placeholder = "Stel een vraag...";
        }

        calculateEstimate(); // Recalculate helper text on button
    }

    // Set click listeners for header and mobile menu language switchers
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
    });

    mobileLangBtns.forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.getAttribute('data-lang')));
    });

    // Initialize Language
    setLanguage(currentLang);

    // ----------------------------------------------------------------
    // 3. Mobile Navigation Menu
    // ----------------------------------------------------------------
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.querySelector('.mobile-menu-close');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    if (mobileToggle && mobileMenu && mobileClose) {
        function openMobileMenu() {
            mobileMenu.classList.add('open');
            mobileMenu.setAttribute('aria-hidden', 'false');
            mobileToggle.setAttribute('aria-expanded', 'true');
        }

        function closeMobileMenu() {
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden', 'true');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }

        mobileToggle.addEventListener('click', openMobileMenu);
        mobileClose.addEventListener('click', closeMobileMenu);

        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // ----------------------------------------------------------------
    // 4. Live Pricing Calculator Logic (Real Business Data)
    // ----------------------------------------------------------------
    const projectTypeSelect = document.getElementById('project_type');
    const materialPrefSelect = document.getElementById('material_preference');
    const sizeInput = document.getElementById('size');
    const submitBtnText = document.getElementById('btnText');

    function calculateEstimate() {
        const type = projectTypeSelect.value;
        const materialPref = materialPrefSelect.value;
        const size = parseFloat(sizeInput.value) || 0;

        if (!type) {
            submitBtnText.textContent = translations[currentLang].form_btn_calc;
            return null;
        }

        let basePrice = 0;
        let materialCost = 0;
        let requiresSize = false;

        switch (type) {
            case 'badkamer':
                requiresSize = true;
                // Banyo taban fiyatı (söküm, moloz dahil)
                if (size <= 2) {
                    basePrice = 4000; // 2m² banyo €4000
                } else if (size === 3) {
                    basePrice = 4500;
                } else if (size === 4) {
                    basePrice = 5200;
                } else if (size === 5 || size === 6) {
                    basePrice = 6000; // Normal boy banyo €6000
                } else if (size > 6) {
                    basePrice = 6000 + (size - 6) * 800; // m² başına +800 Euro
                }
                
                // Malzeme bedeli eklenirse sabit +2500 Euro
                materialCost = materialPref === 'met-materiaal' ? 2500 : 0;
                break;

            case 'toilet':
                basePrice = 2000; // Taban €2000 (Söküm/moloz dahil)
                materialCost = materialPref === 'met-materiaal' ? 1000 : 0; // Malzemeli €3000
                break;

            case 'gipsplaat':
                requiresSize = true;
                basePrice = size * 42.5; // €42.50 işçilik
                materialCost = materialPref === 'met-materiaal' ? (size * 22.5) : 0; // Toplam €65/m2 malzemeli
                break;

            case 'fayans':
                requiresSize = true;
                basePrice = size * 47.5; // €47.50 işçilik
                materialCost = materialPref === 'met-materiaal' ? (size * 52.5) : 0; // Toplam €100/m2 malzemeli
                break;

            case 'riolering':
                if (currentLang === 'tr') {
                    submitBtnText.innerHTML = `<i class="fa-solid fa-calculator"></i> Tesisat: Fiyat Teklifi İsteyin`;
                } else if (currentLang === 'en') {
                    submitBtnText.innerHTML = `<i class="fa-solid fa-calculator"></i> Plumbing: Price on Request`;
                } else {
                    submitBtnText.innerHTML = `<i class="fa-solid fa-calculator"></i> Loodgieterswerk: Prijs op aanvraag`;
                }
                return 'Op aanvraag';
        }

        const sizeHint = document.getElementById('size-hint');
        if (sizeHint) {
            if (requiresSize && size === 0) {
                sizeHint.style.color = '#ef4444';
                sizeHint.textContent = currentLang === 'tr' ? 'Lütfen alan boyutunu girin.' : (currentLang === 'en' ? 'Please enter the size.' : 'Vul a.b.v. de oppervlakte in.');
            } else {
                sizeHint.style.color = '#94a3b8';
                sizeHint.textContent = translations[currentLang].form_size_hint;
            }
        }

        const totalPrice = basePrice + materialCost;
        if (totalPrice > 0) {
            const prefix = currentLang === 'tr' ? 'Tahmini Fiyat' : (currentLang === 'en' ? 'Estimated Price' : 'Richtprijs');
            const suffix = currentLang === 'tr' ? 'Teklif İste' : (currentLang === 'en' ? 'Request Quote' : 'Vraag Offerte');
            submitBtnText.innerHTML = `<i class="fa-solid fa-calculator"></i> ${prefix}: € ${totalPrice.toLocaleString('nl-NL')} ex. BTW - ${suffix}`;
            return `€ ${totalPrice.toLocaleString('nl-NL')} ex. BTW`;
        } else {
            submitBtnText.textContent = translations[currentLang].form_btn_calc;
            return null;
        }
    }

    // Calculator event listeners
    if (projectTypeSelect && materialPrefSelect && sizeInput) {
        projectTypeSelect.addEventListener('change', calculateEstimate);
        materialPrefSelect.addEventListener('change', calculateEstimate);
        sizeInput.addEventListener('input', calculateEstimate);
    }

    // ----------------------------------------------------------------
    // 5. Accessible Form Validation (Validate on Blur, Clear on Input)
    // ----------------------------------------------------------------
    const quoteForm = document.getElementById('quoteForm');
    const fieldsToValidate = ['project_type', 'material_preference', 'size', 'location', 'client_name', 'client_phone', 'client_email'];

    function validateField(fieldId) {
        const field = document.getElementById(fieldId);
        const errorSpan = document.getElementById(`error-${fieldId}`);
        const parentGroup = field.closest('.form-group');

        if (!field || !errorSpan) return true;

        let isValid = true;
        let errorMsg = '';

        if (field.required && !field.value) {
            isValid = false;
            errorMsg = currentLang === 'tr' ? 'Bu alan zorunludur.' : (currentLang === 'en' ? 'This field is required.' : 'Dit veld is verplicht.');
        } else if (fieldId === 'client_email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                isValid = false;
                errorMsg = currentLang === 'tr' ? 'Geçersiz e-posta.' : (currentLang === 'en' ? 'Invalid email.' : 'Vul een geldig e-mailadres in.');
            }
        } else if (fieldId === 'size' && field.value) {
            const sizeVal = parseFloat(field.value);
            if (isNaN(sizeVal) || sizeVal <= 0) {
                isValid = false;
                errorMsg = currentLang === 'tr' ? 'Lütfen sıfırdan büyük değer girin.' : (currentLang === 'en' ? 'Please enter a number > 0.' : 'Vul een getal groter dan 0 in.');
            }
        }

        if (!isValid) {
            parentGroup.classList.add('has-error');
            errorSpan.textContent = errorMsg;
            errorSpan.style.display = 'block';
            field.setAttribute('aria-invalid', 'true');
        } else {
            parentGroup.classList.remove('has-error');
            errorSpan.textContent = '';
            errorSpan.style.display = 'none';
            field.removeAttribute('aria-invalid');
        }

        return isValid;
    }

    fieldsToValidate.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldId));
            field.addEventListener('input', () => {
                const parentGroup = field.closest('.form-group');
                const errorSpan = document.getElementById(`error-${fieldId}`);
                if (parentGroup && errorSpan) {
                    parentGroup.classList.remove('has-error');
                    errorSpan.style.display = 'none';
                    field.removeAttribute('aria-invalid');
                }
                calculateEstimate();
            });
        }
    });

    // ----------------------------------------------------------------
    // 6. Form Submission (Webhook & Honeypot)
    // ----------------------------------------------------------------
    const formSuccess = document.getElementById('formSuccess');
    const resetFormBtn = document.getElementById('resetFormBtn');

    if (quoteForm && formSuccess) {
        quoteForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Honeypot spam check
            const honeypot = document.getElementById('honeypot_field');
            if (honeypot && honeypot.value !== '') {
                console.warn('Bot detected.');
                quoteForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
                return;
            }

            // Form validation check
            let isFormValid = true;
            fieldsToValidate.forEach(fieldId => {
                const isFieldValid = validateField(fieldId);
                if (!isFieldValid) isFormValid = false;
            });

            if (!isFormValid) {
                const firstInvalid = document.querySelector('[aria-invalid="true"]');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtnText.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Loading...`;

            const formData = new FormData(quoteForm);
            const data = {};
            formData.forEach((value, key) => {
                if (key !== 'honeypot_field') data[key] = value;
            });

            data['calculated_estimate'] = calculateEstimate();

            const webhookUrl = data.webhook_url || 'https://hook.us2.make.com/placeholder-webhook-id';

            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    mode: 'cors'
                });
                quoteForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
                
                // Show dynamic Offerte preview modal
                showOfferte(data);
                createReopenButton(data);
            } catch (err) {
                console.error(err);
                // Fallback success for user ease
                quoteForm.classList.add('hidden');
                formSuccess.classList.remove('hidden');
                
                showOfferte(data);
                createReopenButton(data);
            } finally {
                submitBtn.disabled = false;
            }
        });
    }

    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            quoteForm.reset();
            formSuccess.classList.add('hidden');
            quoteForm.classList.remove('hidden');
            calculateEstimate();
        });
    }

    // ----------------------------------------------------------------
    // 7. Advanced AI Chatbot Simulator (Real pricing & details)
    // ----------------------------------------------------------------
    const chatBubble = document.getElementById('chatBubble');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatForm = document.getElementById('chatForm');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const chatTyping = document.getElementById('chatTyping');

    if (chatBubble && chatWindow && chatClose) {
        // Toggle Chat Window
        chatBubble.addEventListener('click', () => {
            const isOpen = chatWindow.classList.contains('open');
            if (isOpen) {
                chatWindow.classList.remove('open');
                setTimeout(() => chatWindow.classList.add('hidden'), 300);
                chatBubble.setAttribute('aria-expanded', 'false');
            } else {
                chatWindow.classList.remove('hidden');
                setTimeout(() => chatWindow.classList.add('open'), 10);
                chatBubble.setAttribute('aria-expanded', 'true');
                chatInput.focus();
            }
        });

        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('open');
            setTimeout(() => chatWindow.classList.add('hidden'), 300);
            chatBubble.setAttribute('aria-expanded', 'false');
        });
    }

    // Handle Chat Messages Sending & AI Response Generation
    if (chatForm && chatInput && chatMessages && chatTyping) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userMsgText = chatInput.value.trim();
            if (!userMsgText) return;

            // Add User Message bubble
            addChatMessage(userMsgText, 'user');
            chatInput.value = '';

            // Show AI Typing indicator
            chatTyping.classList.remove('hidden');
            chatMessages.scrollTop = chatMessages.scrollHeight;

            let replyText = "";
            try {
                // Attempt to call the real Gemini AI Chatbot backend running on VPS
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: userMsgText,
                        language: currentLang
                    })
                });
                if (response.ok) {
                    const data = await response.json();
                    replyText = data.reply;
                } else {
                    throw new Error("Server responded with code " + response.status);
                }
            } catch (err) {
                console.warn("Real-time AI Chatbot API not available (offline/local). Using intelligent fallback...", err);
                // Fallback to local keyword-matching algorithm
                replyText = generateAIResponse(userMsgText);
            }

            // Natural typing delay simulation
            setTimeout(() => {
                chatTyping.classList.add('hidden');
                addChatMessage(replyText, 'bot');
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 600 + Math.random() * 600);
        });
    }

    function addChatMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.textContent = text;
        
        const time = document.createElement('span');
        time.className = 'msg-time';
        time.textContent = currentLang === 'tr' ? 'Şimdi' : (currentLang === 'en' ? 'Just now' : 'Zojuist');

        msgDiv.appendChild(bubble);
        msgDiv.appendChild(time);
        chatMessages.appendChild(msgDiv);
    }

    function generateAIResponse(query) {
        const q = query.toLowerCase();
        
        // Contextual keywords in Dutch, English, Turkish
        const isBanyo = q.includes('badd') || q.includes('bath') || q.includes('banyo') || q.includes('renovatie');
        const isToilet = q.includes('toil') || q.includes('klozet') || q.includes('wc');
        const isFayans = q.includes('fay') || q.includes('teg') || q.includes('tile');
        const isAlcipan = q.includes('alc') || q.includes('alç') || q.includes('gips') || q.includes('dry') || q.includes('wand');
        const isPrice = q.includes('prijs') || q.includes('fiyat') || q.includes('tar') || q.includes('cost') || q.includes('price') || q.includes('offert');
        const isLelystad = q.includes('lely') || q.includes('elit') || q.includes('regio') || q.includes('stad');
        const isGaranti = q.includes('garant') || q.includes('guar');
        const isHostingerHermes = q.includes('herm') || q.includes('host') || q.includes('agent') || q.includes('vps') || q.includes('what');

        if (currentLang === 'tr') {
            if (isHostingerHermes) {
                return "Hermes Agent sistemimiz, İnan abimizin şantiyeden doğrudan WhatsApp üzerinden fotoğraf ve ses kaydı atarak web sitesini ve Facebook sayfasını güncellemesini sağlayan gelişmiş bir yapay zeka köprüsüdür. Derya ablamızın onayından geçtikten sonra site anında güncellenir. Hostinger VPS üzerinde izole bir şekilde güvenle çalışmaktadır.";
            }
            if (isBanyo) {
                return "Banyo yenileme işçilik ve kaba malzeme fiyatlarımız 2 m² küçük alanlar için €2.000 - €4.000, standart banyolar (5-6 m²) için €6.000 taban fiyatından başlar. Söküm ve moloz atımı dahildir. Malzemeyi bizim almamızı isterseniz +€2.500 eklenir.";
            }
            if (isToilet) {
                return "Tuvalet yenileme fiyatımız eski tuvaletin sökülmesi, moloz atılması ve anahtar teslim kurulum dahil malzemesiz €2.000'dur. Tüm malzemeleri bizim almamızı isterseniz (All-in klozet, rezervuar ve fayans dahil) €3.000'dur.";
            }
            if (isFayans) {
                return "Büyük ebat fayans döşeme işlerinde sadece işçilik m² fiyatımız €45 - €50 arasıdır. Fayanslar dahil malzemeli m² fiyatımız €100 ex. BTW'dir.";
            }
            if (isAlcipan) {
                return "Alçıpan bölme duvar yapımı işçilik m² fiyatı €40 - €45 arasındadır. Levhalar ve profiller dahil malzemeli fiyatımız m² başına €65 ex. BTW'dir.";
            }
            if (isPrice) {
                return "Fiyatlarımız Lelystad ve çevresinde otopark ve yol masrafları dahil her şey dahil (excl. BTW) net fiyatlardır. Ekstra veya sürpriz hiçbir masraf çıkarılmaz (Geen verrassingen achteraf!).";
            }
            if (isLelystad) {
                return "Merkezimiz Lelystad'da yer almaktadır (De Valk 14). Lelystad, Almere, Amsterdam, Utrecht ve civarındaki 50-75 km çapındaki tüm bölgelere hizmet sunuyoruz.";
            }
            if (isGaranti) {
                return "Der-In infra olarak yaptığımız tüm işçilik ve tesisat işleri için teslim tarihinden itibaren 12 ay (1 Yıl) tam garanti veriyoruz.";
            }
            return "Size banyo/tuvalet tadilatı, alçıpan, riolering tesisatı, Lelystad ve çevresindeki hizmet bölgelerimiz, fiyatlar ve garantilerimiz hakkında detaylı bilgi verebilirim. Sorunuz nedir?";
        } 
        else if (currentLang === 'en') {
            if (isHostingerHermes) {
                return "Our Hermes Agent runs as an advanced AI assistant hosted securely on a Hostinger VPS. It allows İnan Abi to update the website and Facebook page via WhatsApp voice and photos, which are deployed instantly after Derya Abla's approval. It keeps the web server and business files completely separate and safe.";
            }
            if (isBanyo) {
                return "Bathroom renovation labor + rough materials starts from €4,000 for small areas (2 m²) and €6,000 for standard bathrooms (5-6 m²). Demolition and waste removal are fully included. A materials package adds +€2,500.";
            }
            if (isToilet) {
                return "A complete toilet renovation is €2,000 for labor + rough materials (dismantling and debris disposal included). If we supply all sanitaries and tiles (All-in package), the price is €3,000 ex. VAT.";
            }
            if (isFayans) {
                return "For large tiling works, labor is €45 - €50 per m². Tiling materials included is €100 per m² ex. VAT.";
            }
            if (isAlcipan) {
                return "Drywall partition installation labor is €40 - €45 per m². Drywall materials and studs included is €65 per m² ex. VAT.";
            }
            if (isPrice) {
                return "Our prices are listed ex. VAT (excl. BTW) but are strictly all-inclusive. Parking fees and travel charges are covered. We guarantee no surprises afterwards (Geen verrassingen achteraf!).";
            }
            if (isLelystad) {
                return "We are based in Lelystad (De Valk 14) and serve all areas within a 50 to 75 km radius, including Amsterdam, Almere, Utrecht, Purmerend, and Zaandam.";
            }
            if (isGaranti) {
                return "We offer a 12-month (1 Year) full warranty on all our labor, piping, and installation works from the completion date.";
            }
            return "I can help you with bathroom/toilet renovations, tiling, drywall, sewerage, pricing details, and our service area around Lelystad. What is your question?";
        } 
        else { // Dutch default
            if (isHostingerHermes) {
                return "Onze Hermes Agent is een geavanceerde AI-assistent die veilig op een Hostinger VPS draait. Hiermee kan İnan Abi de website en Facebook-pagina bijwerken via WhatsApp-spraakberichten en foto's. Wijzigingen worden direct doorgevoerd na goedkeuring van Derya Abla.";
            }
            if (isBanyo) {
                return "Badkamerrenovatie arbeid + kaba materiaal begint vanaf € 4.000 voor kleine ruimtes (2 m²) en € 6.000 voor standaard badkamers (5-6 m²). Sloopwerk en afvalafvoer zijn volledig inbegrepen. Materialenpakket voegt +€ 2.500 toe.";
            }
            if (isToilet) {
                return "Een toiletrenovatie is € 2.000 voor arbeid + kaba materiaal (demontage en afvalafvoer inbegrepen). Als wij alle sanitair en tegels leveren (All-in pakket), is de prijs € 3.000 ex. BTW.";
            }
            if (isFayans) {
                return "Voor grote tegelwerken bedraagt de arbeid € 45 - € 50 per m². Inclusief tegels is dit € 100 per m² ex. BTW.";
            }
            if (isAlcipan) {
                return "Gipsplaten scheidingswand montage is € 40 - € 45 per m². Inclusief platen en metal-stud profielen is dit € 65 per m² ex. BTW.";
            }
            if (isPrice) {
                return "Onze prijzen zijn ex. BTW maar zijn all-in. Parkeerkosten en reiskosten zijn gedekt. Wij garanderen geen verrassingen achteraf (Geen verrassingen achteraf!).";
            }
            if (isLelystad) {
                return "Wij zijn gevestigd in Lelystad (De Valk 14) en bedienen alle regio's binnen een straal van 50 tot 75 km, inclusief Amsterdam, Almere, Utrecht, Purmerend en Zaandam.";
            }
            if (isGaranti) {
                return "Wij bieden een volledige garantie van 12 maanden (1 Jaar) op al onze werkzaamheden vanaf de opleverdatum.";
            }
            return "Ik kan u helpen met vragen over badkamer- en toiletrenovaties, tegelwerk, gipsplaat wanden, loodgieterswerk, prijzen en garanties rond Lelystad. Wat is uw vraag?";
        }
    }
    // ----------------------------------------------------------------
    // 8. Dynamic Portfolio Loader (Hermes integration)
    // ----------------------------------------------------------------
    async function loadDynamicProjects() {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (!galleryGrid) return;
        
        try {
            const response = await fetch('projects.json');
            if (response.ok) {
                const projects = await response.json();
                if (projects && projects.length > 0) {
                    projects.forEach(proj => {
                        const exists = Array.from(galleryGrid.querySelectorAll('.gallery-item h4'))
                            .some(el => el.textContent === proj.title);
                            
                        if (!exists) {
                            const item = document.createElement('div');
                            item.className = 'gallery-item';
                            item.tabIndex = 0;
                            
                            const title = proj.title;
                            const desc = proj.description;
                            
                            item.innerHTML = `
                                <img src="${proj.image}" alt="${title}">
                                <div class="gallery-overlay">
                                    <h4>${title}</h4>
                                    <p>${desc}</p>
                                </div>
                            `;
                            galleryGrid.insertBefore(item, galleryGrid.firstChild);
                        }
                    });
                }
            }
        } catch (err) {
            console.warn("Dynamic projects.json could not be loaded. Running on static fallback.", err);
        }
    }
    loadDynamicProjects();

    // ----------------------------------------------------------------
    // 9. Offerte Modal & Generator Handler
    // ----------------------------------------------------------------
    const offerteModal = document.getElementById('offerteModal');
    const offerteClose = document.getElementById('offerteClose');
    const closeOfferteModalBtn = document.getElementById('closeOfferteModalBtn');
    const printOfferteBtn = document.getElementById('printOfferteBtn');
    const viewSampleOfferteBtn = document.getElementById('viewSampleOfferteBtn');

    // Modal populate fields
    const offerteClientName = document.getElementById('offerteClientName');
    const offerteClientPhone = document.getElementById('offerteClientPhone');
    const offerteClientEmail = document.getElementById('offerteClientEmail');
    const offerteClientLocation = document.getElementById('offerteClientLocation');
    const offerteDate = document.getElementById('offerteDate');
    const offerteNumber = document.getElementById('offerteNumber');
    const offerteProjectTitle = document.getElementById('offerteProjectTitle');
    const offerteWorksList = document.getElementById('offerteWorksList');
    const offertePriceVal = document.getElementById('offertePriceVal');
    const offerteMaterialNote = document.getElementById('offerteMaterialNote');
    const currentDateSpans = document.querySelectorAll('.current-date-span');

    // List of included works per project type (toilet matches ODT exactly!)
    const worksTemplates = {
        badkamer: [
            "Verwijderen van bestaande badkamer (wastafel, douche/bad, toilet, wand- en vloertegels).",
            "Afvoeren van alle sloop- en bouwafval (inbegrepen).",
            "Gereedmaken en uitvlakken van wanden en vloer voor nieuw tegelwerk.",
            "Aanleggen en aanpassen van water- en afvoerleidingen.",
            "Installatie van inbouwreservoir (indien toilet aanwezig).",
            "Plaatsen van nieuwe wand- en vloertegels.",
            "Het plafond herstellen en schilderen.",
            "Professioneel voegwerk en afwerking.",
            "Afkitten van alle hoeken en sanitair met sanitair siliconenkit.",
            "Montage van nieuw douchecabine/bad, wastafel en kraan.",
            "Montage van spiegel, planchet en overige accessoires.",
            "Controle op lekkages en correcte werking.",
            "Schoon opleveren van de ruimte."
        ],
        toilet: [
            "Verwijderen van bestaande wastafel, toilet, kraan en wand-/vloertegels.",
            "Gereedmaken van wanden voor nieuw tegelwerk.",
            "Afvoer van puin en bouwafval.",
            "Aanleggen en aanpassen van water- en afvoerleidingen.",
            "Installatie van inbouwreservoir.",
            "Plaatsen van nieuwe wand- en vloertegels.",
            "het plafond schilderen",
            "Voegwerk en afwerking.",
            "Afkitten met sanitair siliconenkit.",
            "Montage van nieuw toilet, wastafel en kraan.",
            "Montage van spiegel, toiletrolhouder, toiletborstelhouder en overige accessoires indien aanwezig.",
            "Controle op lekkages en correcte werking.",
            "Schoon opleveren van de ruimte."
        ],
        gipsplaat: [
            "Montage van metal-stud of houten frameprofielen.",
            "Aanbrengen van thermische en geluidsisolatie (steenwol/glaswol).",
            "Monteren van gipsplaten (wanden en/of plafonds).",
            "Glad afwerken van naden en schroefgaten (klaar voor stucwerk).",
            "Afvoeren van restafval en restanten.",
            "Schoon opleveren van de werkplek."
        ],
        fayans: [
            "Voorbereiden, reinigen en primeren van de ondergrond.",
            "Precieze laser-meting voor optimaal voegverloop.",
            "Verlijmen van grootformaat wand- of vloertegels met levelsysteem.",
            "Inwassen / Voegen van het tegelwerk in kleur naar keuze.",
            "Elastisch afkitten van aansluitingen en hoeken.",
            "Afvoer van snijafval.",
            "Schoon opleveren."
        ],
        riolering: [
            "Inspectie en lekdetectie van riolering en afvoeren.",
            "Aanleg of vernieuwing van koperen en kunststof waterleidingen.",
            "Professionele installatie of reparatie van PVC afvoerbuizen.",
            "Montage van sifons, kranen en sanitair aansluitingen.",
            "Lekkage-controle en druktesten.",
            "Schoon opleveren van de ruimte."
        ]
    };

    function showOfferte(data) {
        if (!offerteModal) return;

        // Set date
        const today = new Date();
        const dateStr = today.toLocaleDateString('nl-NL');
        if (offerteDate) offerteDate.textContent = dateStr;
        currentDateSpans.forEach(el => el.textContent = dateStr);

        // Generate Offerte Number
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        if (offerteNumber) offerteNumber.textContent = `DI-${today.getFullYear()}-${randomNum}`;

        // Populate client details
        if (offerteClientName) offerteClientName.textContent = data.client_name || "-";
        if (offerteClientPhone) offerteClientPhone.textContent = data.client_phone || "-";
        if (offerteClientEmail) offerteClientEmail.textContent = data.client_email || "-";
        if (offerteClientLocation) offerteClientLocation.textContent = data.location || "-";

        // Set project title
        const typeNames = {
            badkamer: "BADKAMERENOVATIE",
            toilet: "TOILETRENOVATIE",
            gipsplaat: "GIPSPLATEN WANDEN",
            fayans: "TEGELWERK",
            riolering: "RIOLERING & LOODGIETERSWERK"
        };
        const pType = data.project_type || "toilet";
        if (offerteProjectTitle) offerteProjectTitle.textContent = typeNames[pType] || pType.toUpperCase();

        // Populate works list
        if (offerteWorksList) {
            offerteWorksList.innerHTML = "";
            const works = worksTemplates[pType] || worksTemplates.toilet;
            works.forEach(w => {
                const li = document.createElement('li');
                li.textContent = w;
                offerteWorksList.appendChild(li);
            });
        }

        // Set materials note
        if (offerteMaterialNote) {
            const isWithMaterials = data.material_preference === 'met-materiaal';
            if (pType === 'badkamer') {
                offerteMaterialNote.textContent = isWithMaterials 
                    ? "Der-In infra levert alle materialen inclusief sanitair, A-merk tegels, kranen en badkamermeubels conform de gemaakte specificaties."
                    : "De klant is verantwoordelijk voor de te gebruiken materialen: nieuwe tegels, sanitair, kranen, meubels, etc. Der-In infra levert alle kaba-bouwmaterialen (lijm, cement, leidingen, voegmiddel).";
            } else if (pType === 'toilet') {
                offerteMaterialNote.textContent = isWithMaterials
                    ? "Der-In infra levert alle materialen inclusief inbouwreservoir, toiletpot, wastafeltje, kraan en tegels."
                    : "De klant is verantwoordelijk voor de te gebruiken materialen: nieuwe tegels, een nieuwe wastafel en kraan, een inbouwreservoir en een nieuw toilet.";
            } else if (pType === 'gipsplaat' || pType === 'fayans') {
                offerteMaterialNote.textContent = isWithMaterials
                    ? "Der-In infra levert alle materialen (gipsplaten, metal-studs, isolatie / tegels, lijm, voegen)."
                    : "De klant levert zelf de gipsplaten / tegels. Der-In infra levert de overige verbruiksartikelen (schroeven, profielen / lijm, voegen).";
            } else {
                offerteMaterialNote.textContent = "Prijsopgave is op basis van inspectie ter plaatse.";
            }
        }

        // Set Price Value
        if (offertePriceVal) offertePriceVal.textContent = data.calculated_estimate || "Op aanvraag";

        // Show Modal
        offerteModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeOfferte() {
        if (offerteModal) offerteModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    // Dynamic button on success page
    function createReopenButton(data) {
        const formSuccessDiv = document.getElementById('formSuccess');
        if (!formSuccessDiv) return;
        
        let reopenBtn = document.getElementById('reopenOfferteBtn');
        if (!reopenBtn) {
            reopenBtn = document.createElement('button');
            reopenBtn.type = 'button';
            reopenBtn.className = 'btn btn-primary btn-block';
            reopenBtn.id = 'reopenOfferteBtn';
            reopenBtn.style.marginBottom = '15px';
            reopenBtn.style.marginTop = '15px';
            reopenBtn.innerHTML = `<i class="fa-solid fa-file-invoice"></i> Bekijk en Print Offerte`;
            reopenBtn.addEventListener('click', () => showOfferte(data));
            
            const resetBtn = document.getElementById('resetFormBtn');
            if (resetBtn) {
                formSuccessDiv.insertBefore(reopenBtn, resetBtn);
            } else {
                formSuccessDiv.appendChild(reopenBtn);
            }
        } else {
            // Update click handler with new data
            const newBtn = reopenBtn.cloneNode(true);
            newBtn.addEventListener('click', () => showOfferte(data));
            reopenBtn.parentNode.replaceChild(newBtn, reopenBtn);
        }
    }

    if (offerteClose) offerteClose.addEventListener('click', closeOfferte);
    if (closeOfferteModalBtn) closeOfferteModalBtn.addEventListener('click', closeOfferte);
    if (offerteModal) {
        offerteModal.addEventListener('click', (e) => {
            if (e.target === offerteModal) closeOfferte();
        });
    }

    if (printOfferteBtn) {
        printOfferteBtn.addEventListener('click', () => {
            window.print();
        });
    }

    if (viewSampleOfferteBtn) {
        viewSampleOfferteBtn.addEventListener('click', () => {
            showOfferte({
                client_name: "İnan Kuruöz (Voorbeeld)",
                client_phone: "0618694652",
                client_email: "inankuruoz@hotmail.com",
                location: "De Valk 14, 8239AE Lelystad",
                project_type: "toilet",
                material_preference: "zonder-materiaal",
                calculated_estimate: "€ 2.000,-"
            });
        });
    }

});
