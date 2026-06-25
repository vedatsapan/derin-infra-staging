document.addEventListener('DOMContentLoaded', () => {
    // Global State Variables (declared first to prevent Temporal Dead Zone ReferenceErrors)
    let currentLang = localStorage.getItem('preferred_language') || 'nl';
    let allProjects = [];
    let currentFilter = 'all';
    let visibleCount = 9;
    let sizeInput = document.getElementById('wizard_size');
    let galleryGrid = document.getElementById('gallery-grid');
    let loadMoreBtn = document.getElementById('load-more-btn');

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
            chat_welcome: "Hallo! Ik ben de AI-assistent van Der-In infra. Ik kan u helpen met richtprijzen voor badkamerrenovatie, toiletrenovatie, tegelwerk en wanden. Hoe kan ik u vandaag helpen?",
            wizard_btn_appointment: "Plan Direct Opmeting",
            btn_load_more: "Meer projecten laden",
            nav_transformations: "Voor & Na",
            hero_cta_transformations: "Bekijk Transformaties",
            ba_title: "Voor & Na Transformaties",
            ba_subtitle: "Bekijk het indrukwekkende verschil van onze echte renovaties.",
            ba_card_bathroom_1: "Badkamer Renovatie (Inloopdouche)",
            label_before: "Voor",
            label_after: "Na",
            ba_card_toilet_1: "Toiletrenovatie (Hangend Toilet)",
            ba_card_drywall: "Gipsplaten Plafond & Spots",
            ba_card_bathroom_2: "Badkamer (Waterdichting & Tegels)",
            filter_all: "Alle",
            filter_bathroom: "Badkamers",
            filter_toilet: "Toiletten",
            filter_drywall: "Wanden & Plafonds",
            filter_plumbing: "Loodgieterswerk",
            wizard_indicator_1: "Dienst",
            wizard_indicator_2: "Afmetingen",
            wizard_indicator_3: "Wensen",
            wizard_indicator_4: "Contact",
            wizard_indicator_5: "Resultaat",
            wizard_step_1_title: "Welk project wilt u uitvoeren?",
            wizard_step_2_title: "Afmetingen & Materiaalopties",
            wizard_step_3_title: "Beschrijf uw specifieke wensen",
            wizard_step_4_title: "Uw Contactgegevens",
            wizard_step_5_title: "Uw Offerte Samenvatting",
            wizard_estimated_price: "Live Richtprijs:",
            wizard_price_policy: "Sloop, afvalafvoer en reiskosten zijn 100% inbegrepen.",
            wizard_submit_msg: "Uw aanvraag is verzonden! De officiële offerte is hieronder gegenereerd.",
            btn_prev: "Vorige",
            btn_next: "Volgende",
            btn_submit_request: "Verzend Aanvraag & Genereer Offerte",
            btn_view_offerte: "Bekijk & Print Uw Offerte",
            contact_company_details_title: "Bedrijfsgegevens",
            btn_print_pdf: "Afdrukken / Opslaan als PDF"
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
            chat_welcome: "Hello! I am the AI assistant of Der-In infra. I can help you with estimates for bathroom renovations, toilet renovations, tiling, and walls. How can I help you today?",
            wizard_btn_appointment: "Schedule Measurement",
            btn_load_more: "Load more projects",
            nav_transformations: "Before & After",
            hero_cta_transformations: "View Transformations",
            ba_title: "Before & After Transformations",
            ba_subtitle: "See the impressive difference in our real renovations.",
            ba_card_bathroom_1: "Bathroom Renovation (Walk-in Shower)",
            label_before: "Before",
            label_after: "After",
            ba_card_toilet_1: "Toilet Renovation (Wall-hung Toilet)",
            ba_card_drywall: "Drywall Ceiling & Spots",
            ba_card_bathroom_2: "Bathroom (Waterproofing & Tiling)",
            filter_all: "All",
            filter_bathroom: "Bathrooms",
            filter_toilet: "Toilets",
            filter_drywall: "Walls & Ceilings",
            filter_plumbing: "Plumbing",
            wizard_indicator_1: "Service",
            wizard_indicator_2: "Dimensions",
            wizard_indicator_3: "Wishes",
            wizard_indicator_4: "Contact",
            wizard_indicator_5: "Result",
            wizard_step_1_title: "Which project do you want to perform?",
            wizard_step_2_title: "Dimensions & Material Options",
            wizard_step_3_title: "Describe your specific wishes",
            wizard_step_4_title: "Your Contact Details",
            wizard_step_5_title: "Your Quote Summary",
            wizard_estimated_price: "Live Estimate:",
            wizard_price_policy: "Demolition, waste disposal, and travel costs are 100% included.",
            wizard_submit_msg: "Your request has been sent! The official quote has been generated below.",
            btn_prev: "Previous",
            btn_next: "Next",
            btn_submit_request: "Send Request & Generate Quote",
            btn_view_offerte: "View & Print Your Quote",
            contact_company_details_title: "Company Details",
            btn_print_pdf: "Print / Save as PDF"
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
            chat_welcome: "Merhaba! Ben Der-In infra Yapay Zeka Asistanıyım. Banyo yenileme, tuvalet yenileme, fayans ve alçıpan duvar richtprijs (fiyat) tahminleri konusunda yardımcı olabilirim. Size nasıl yardımcı olabilirim?",
            wizard_btn_appointment: "Ücretsiz Keşif / Randevu Planla",
            btn_load_more: "Daha fazla proje yükle",
            nav_transformations: "Öncesi & Sonrası",
            hero_cta_transformations: "Değişimleri İncele",
            ba_title: "Öncesi & Sonrası Değişimler",
            ba_subtitle: "Gerçek tadilat projelerimizdeki etkileyici farkı görün.",
            ba_card_bathroom_1: "Banyo Yenileme (Duşakabin)",
            label_before: "Önce",
            label_after: "Sonra",
            ba_card_toilet_1: "Tuvalet Yenileme (Asma Klozet)",
            ba_card_drywall: "Alçıpan Tavan & Spot Işıklar",
            ba_card_bathroom_2: "Banyo Değişimi (Su Yalıtımı & Fayans)",
            filter_all: "Tümü",
            filter_bathroom: "Banyolar",
            filter_toilet: "Tuvaletler",
            filter_drywall: "Duvar & Tavanlar",
            filter_plumbing: "Tesisat İşleri",
            wizard_indicator_1: "Hizmet",
            wizard_indicator_2: "Ölçüler",
            wizard_indicator_3: "İstekler",
            wizard_indicator_4: "İletişim",
            wizard_indicator_5: "Sonuç",
            wizard_step_1_title: "Hangi projeyi yaptırmak istiyorsunuz?",
            wizard_step_2_title: "Ölçüler & Malzeme Seçenekleri",
            wizard_step_3_title: "Özel isteklerinizi belirtin",
            wizard_step_4_title: "İletişim Bilgileriniz",
            wizard_step_5_title: "Teklif Özetiniz",
            wizard_estimated_price: "Canlı Fiyat Tahmini:",
            wizard_price_policy: "Yıkım, moloz atımı ve yol ücreti %100 fiyata dahildir.",
            wizard_submit_msg: "Talebiniz gönderildi! Resmi teklif belgesi aşağıda oluşturuldu.",
            btn_prev: "Geri",
            btn_next: "İleri",
            btn_submit_request: "Talebi Gönder ve Teklif Oluştur",
            btn_view_offerte: "Teklifi Görüntüle & Yazdır",
            contact_company_details_title: "Firma Bilgileri",
            btn_print_pdf: "Yazdır / PDF Olarak Kaydet"
        }
    };

    // ----------------------------------------------------------------
    // 2. Language Switching Engine
    // ----------------------------------------------------------------
    // (currentLang is already declared at the top)
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
        const sizeInput = document.getElementById('wizard_size');
        const locationInput = document.getElementById('wizard_location');
        const descInput = document.getElementById('wizard_description');
        const nameInput = document.getElementById('wizard_client_name');
        const phoneInput = document.getElementById('wizard_client_phone');
        const emailInput = document.getElementById('wizard_client_email');
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

        // Only call if defined
        if (typeof calculateEstimate === 'function') {
            calculateEstimate();
        }

        // Re-render gallery with new language
        if (typeof renderGallery === 'function') {
            renderGallery();
        }
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
    // 3.1. Before/After Image Slider Drag Logic
    // ----------------------------------------------------------------
    const sliders = document.querySelectorAll('.ba-slider');
    sliders.forEach(slider => {
        const handle = slider.querySelector('.slider-handle');
        const afterImg = slider.querySelector('.after-image');
        
        if (!handle || !afterImg) return;
        
        let isDragging = false;
        
        function updateSlider(clientX) {
            const rect = slider.getBoundingClientRect();
            const x = clientX - rect.left;
            let percentage = (x / rect.width) * 100;
            
            // Constrain between 0% and 100%
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;
            
            slider.style.setProperty('--clip-percentage', `${percentage}%`);
        }
        
        // Pointer Events (supports both mouse and touch input natively)
        slider.addEventListener('pointerdown', (e) => {
            isDragging = true;
            slider.setPointerCapture(e.pointerId);
            updateSlider(e.clientX);
        });
        
        slider.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });
        
        slider.addEventListener('pointerup', (e) => {
            if (!isDragging) return;
            slider.releasePointerCapture(e.pointerId);
            isDragging = false;
        });
        
        slider.addEventListener('pointercancel', (e) => {
            if (!isDragging) return;
            slider.releasePointerCapture(e.pointerId);
            isDragging = false;
        });
    });

    // ----------------------------------------------------------------
    // 3.2. Dynamic Portfolio Category Filter & Load More Logic
    // ----------------------------------------------------------------
    const filterTabs = document.querySelectorAll('.filter-tab');
    galleryGrid = document.getElementById('gallery-grid');
    loadMoreBtn = document.getElementById('load-more-btn');

    // (allProjects, currentFilter, visibleCount are already declared at the top)

    async function initGallery() {
        try {
            const response = await fetch('projects.json');
            allProjects = await response.json();
            renderGallery();
        } catch (error) {
            console.error('Error loading projects.json:', error);
            if (galleryGrid) {
                galleryGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">Error loading projects. Please refresh the page.</p>';
            }
        }
    }

    function renderGallery(resetAnimation = false) {
        if (!galleryGrid) return;

        // Filter projects
        const filtered = allProjects.filter(project => {
            return currentFilter === 'all' || project.category === currentFilter;
        });

        // Slice for pagination
        const sliced = filtered.slice(0, visibleCount);

        // Render items
        galleryGrid.innerHTML = '';
        sliced.forEach((project, idx) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.setAttribute('data-category', project.category);
            item.setAttribute('tabindex', '0');
            
            // Localize title and description based on currentLang
            const title = (project.title && project.title[currentLang]) ? project.title[currentLang] : (project.title ? project.title['nl'] : '');
            const desc = (project.desc && project.desc[currentLang]) ? project.desc[currentLang] : (project.desc ? project.desc['nl'] : '');
            
            item.innerHTML = `
                <img src="${project.image}" alt="${desc}">
                <div class="gallery-overlay">
                    <h4>${title}</h4>
                    <p>${desc}</p>
                </div>
            `;

            // Micro-animation for items loading
            if (resetAnimation) {
                item.style.transform = 'scale(0.95)';
                item.style.opacity = '0';
                item.style.transition = 'all 0.3s ease';
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                    item.style.opacity = '1';
                }, idx * 30 + 30);
            }
            
            galleryGrid.appendChild(item);
        });

        // Show/hide load more button
        if (loadMoreBtn) {
            if (filtered.length > visibleCount) {
                loadMoreBtn.style.display = 'inline-flex';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    // Filter switch listener
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            currentFilter = tab.getAttribute('data-filter');
            visibleCount = 9; // Reset page size on filter change
            renderGallery(true);
        });
    });

    // Load More listener
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += 9;
            renderGallery(false);
        });
    }

    // Call dynamic gallery initialization
    initGallery();

    // ----------------------------------------------------------------
    // 4. Live Pricing Calculator & Multi-Step Wizard Logic
    // ----------------------------------------------------------------
    const wizardForm = document.getElementById('quoteWizardForm');
    const wizardSteps = document.querySelectorAll('.wizard-step');
    const progressFill = document.getElementById('progressFill');
    const indicators = document.querySelectorAll('.step-indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const wSubmitBtn = document.getElementById('wSubmitBtn');
    const sizeRange = document.getElementById('wizard_size_range');
    sizeInput = document.getElementById('wizard_size');

    let currentStep = 1;
    const totalSteps = 5;

    // Range & Number sync
    function updateSliderProgress() {
        if (!sizeRange) return;
        const min = parseFloat(sizeRange.min) || 1;
        const max = parseFloat(sizeRange.max) || 50;
        const val = parseFloat(sizeRange.value) || 10;
        const percentage = ((val - min) / (max - min)) * 100;
        sizeRange.style.setProperty('--slider-progress', percentage + '%');
    }

    if (sizeRange && sizeInput) {
        // Initial progress fill
        updateSliderProgress();

        sizeRange.addEventListener('input', () => {
            sizeInput.value = sizeRange.value;
            updateSliderProgress();
            calculateEstimate();
        });
        sizeInput.addEventListener('input', () => {
            let val = parseInt(sizeInput.value);
            if (isNaN(val)) val = 1;
            if (val < 1) val = 1;
            if (val > 100) val = 100;
            sizeRange.value = val;
            updateSliderProgress();
            calculateEstimate();
        });
    }

    function calculateEstimate() {
        if (!sizeInput) return null;
        
        const projectTypeChecked = document.querySelector('input[name="project_type"]:checked');
        const projectType = projectTypeChecked ? projectTypeChecked.value : null;
        const materialPref = document.getElementById('wizard_material_preference')?.value;
        const size = parseFloat(sizeInput.value) || 0;

        if (!projectType) {
            return null;
        }

        let basePrice = 0;
        let materialCost = 0;
        let isOnRequest = false;

        switch (projectType) {
            case 'badkamer':
                if (size <= 2) {
                    basePrice = 4000;
                } else if (size === 3) {
                    basePrice = 4500;
                } else if (size === 4) {
                    basePrice = 5200;
                } else if (size === 5 || size === 6) {
                    basePrice = 6000;
                } else if (size > 6) {
                    basePrice = 6000 + (size - 6) * 800;
                }
                materialCost = materialPref === 'met-materiaal' ? 2500 : 0;
                break;

            case 'toilet':
                basePrice = 2000;
                materialCost = materialPref === 'met-materiaal' ? 1000 : 0;
                break;

            case 'gipsplaat':
                basePrice = size * 42.5;
                materialCost = materialPref === 'met-materiaal' ? (size * 22.5) : 0;
                break;

            case 'fayans':
                basePrice = size * 47.5;
                materialCost = materialPref === 'met-materiaal' ? (size * 52.5) : 0;
                break;

            case 'riolering':
                isOnRequest = true;
                break;
        }

        if (isOnRequest) {
            return currentLang === 'tr' ? 'Fiyat teklifi isteyin' : (currentLang === 'en' ? 'Price on request' : 'Prijs op aanvraag');
        }

        const total = basePrice + materialCost;
        return total > 0 ? `€ ${total.toLocaleString('nl-NL')}` : null;
    }

    function populateSummaryAndPrice() {
        const projectTypeChecked = document.querySelector('input[name="project_type"]:checked');
        const projectType = projectTypeChecked ? projectTypeChecked.value : null;
        const materialPref = document.getElementById('wizard_material_preference')?.value;
        const size = parseFloat(sizeInput?.value) || 0;
        const name = document.getElementById('wizard_client_name')?.value || '';
        const phone = document.getElementById('wizard_client_phone')?.value || '';
        
        const typeNames = {
            badkamer: currentLang === 'tr' ? 'Komple Banyo Yenileme' : (currentLang === 'en' ? 'Complete Bathroom Renovation' : 'Complete Badkamerrenovatie'),
            toilet: currentLang === 'tr' ? 'Tuvalet Yenileme' : (currentLang === 'en' ? 'Toilet Renovation' : 'Toiletrenovatie'),
            gipsplaat: currentLang === 'tr' ? 'Alçıpan Bölme Duvar' : (currentLang === 'en' ? 'Drywall Partition Walls' : 'Gipsplaten scheidingswanden'),
            fayans: currentLang === 'tr' ? 'Tegelwerk (Fayans)' : (currentLang === 'en' ? 'Tiling' : 'Tegelwerk'),
            riolering: currentLang === 'tr' ? 'Su Tesisatı & Kanalizasyon' : (currentLang === 'en' ? 'Sewerage & Plumbing' : 'Riolering & Loodgieterswerk')
        };
        
        const materialPrefTexts = {
            'zonder-materiaal': currentLang === 'tr' ? 'Sadece İşçilik (+Kaba Malzeme)' : (currentLang === 'en' ? 'Labor & Rough Materials only' : 'Alleen arbeid & basis-materialen'),
            'met-materiaal': currentLang === 'tr' ? 'Her Şey Dahil (Malzemeli)' : (currentLang === 'en' ? 'All-in including materials' : 'All-in inclusief sanitair/tegels')
        };

        const sumProject = document.getElementById('sumProject');
        const sumSize = document.getElementById('sumSize');
        const sumMaterials = document.getElementById('sumMaterials');
        const sumName = document.getElementById('sumName');
        const sumPhone = document.getElementById('sumPhone');
        const wizardPriceVal = document.getElementById('wizardPriceVal');
        const sumSizeRow = document.getElementById('sumSizeRow');
        const sumMaterialsRow = document.getElementById('sumMaterialsRow');

        if (sumProject) sumProject.textContent = typeNames[projectType] || '-';
        
        if (projectType === 'riolering') {
            if (sumSizeRow) sumSizeRow.style.display = 'none';
            if (sumMaterialsRow) sumMaterialsRow.style.display = 'none';
        } else {
            if (sumSizeRow) sumSizeRow.style.display = 'block';
            if (sumMaterialsRow) sumMaterialsRow.style.display = 'block';
            if (sumSize) sumSize.textContent = size;
            if (sumMaterials) sumMaterials.textContent = materialPrefTexts[materialPref] || '-';
        }

        if (sumName) sumName.textContent = name;
        if (sumPhone) sumPhone.textContent = phone;

        const estimate = calculateEstimate();
        if (wizardPriceVal) {
            wizardPriceVal.textContent = estimate || '-';
        }
    }

    function updateWizardUI() {
        wizardSteps.forEach(step => {
            const stepNum = parseInt(step.getAttribute('data-step'));
            step.classList.toggle('active', stepNum === currentStep);
        });

        const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;
        if (progressFill) progressFill.style.width = `${progressPercent}%`;

        indicators.forEach(indicator => {
            const stepNum = parseInt(indicator.getAttribute('data-step-indicator'));
            indicator.classList.toggle('active', stepNum === currentStep);
            indicator.classList.toggle('completed', stepNum < currentStep);
        });

        if (currentStep === 1) {
            if (prevBtn) prevBtn.style.display = 'none';
            if (nextBtn) nextBtn.style.display = 'inline-flex';
            if (wSubmitBtn) wSubmitBtn.style.display = 'none';
        } else if (currentStep === 5) {
            if (prevBtn) prevBtn.style.display = 'inline-flex';
            if (nextBtn) nextBtn.style.display = 'none';
            if (wSubmitBtn) wSubmitBtn.style.display = 'inline-flex';
            populateSummaryAndPrice();
        } else {
            if (prevBtn) prevBtn.style.display = 'inline-flex';
            if (nextBtn) nextBtn.style.display = 'inline-flex';
            if (wSubmitBtn) wSubmitBtn.style.display = 'none';
        }
    }

    indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const targetStep = parseInt(indicator.getAttribute('data-step-indicator'));
            if (targetStep < currentStep) {
                currentStep = targetStep;
                updateWizardUI();
            }
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                updateWizardUI();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < totalSteps) {
                    currentStep++;
                    updateWizardUI();
                }
            } else {
                const activeStep = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
                const invalidEl = activeStep?.querySelector('[aria-invalid="true"]');
                if (invalidEl) invalidEl.focus();
            }
        });
    }

    // Initialize wizard
    updateWizardUI();

    // ----------------------------------------------------------------
    // 5. Accessible Form Validation (Per Step & Blur)
    // ----------------------------------------------------------------
    function validateField(fieldId) {
        const field = document.getElementById(fieldId);
        let errorSpanId = '';
        if (fieldId === 'wizard_client_name') errorSpanId = 'error-client_name';
        else if (fieldId === 'wizard_client_phone') errorSpanId = 'error-client_phone';
        else if (fieldId === 'wizard_client_email') errorSpanId = 'error-client_email';
        else if (fieldId === 'wizard_location') errorSpanId = 'error-location';
        else if (fieldId === 'wizard_size') errorSpanId = 'error-size';
        
        const errorSpan = document.getElementById(errorSpanId);
        const parentGroup = field?.closest('.form-group');

        if (!field || !errorSpan) return true;

        let isValid = true;
        let errorMsg = '';

        if (field.required && !field.value.trim()) {
            isValid = false;
            errorMsg = currentLang === 'tr' ? 'Bu alan zorunludur.' : (currentLang === 'en' ? 'This field is required.' : 'Dit veld is verplicht.');
        } else if (fieldId === 'wizard_client_email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value.trim())) {
                isValid = false;
                errorMsg = currentLang === 'tr' ? 'Geçersiz e-posta adresi.' : (currentLang === 'en' ? 'Invalid email address.' : 'Vul een geldig e-mailadres in.');
            }
        }

        if (!isValid) {
            if (parentGroup) parentGroup.classList.add('has-error');
            errorSpan.textContent = errorMsg;
            errorSpan.style.display = 'block';
            field.setAttribute('aria-invalid', 'true');
        } else {
            if (parentGroup) parentGroup.classList.remove('has-error');
            errorSpan.textContent = '';
            errorSpan.style.display = 'none';
            field.removeAttribute('aria-invalid');
        }

        return isValid;
    }

    function validateStep(step) {
        let isValid = true;
        if (step === 1) {
            const projectType = document.querySelector('input[name="project_type"]:checked');
            const errorSpan = document.getElementById('error-project_type');
            if (!projectType) {
                isValid = false;
                if (errorSpan) {
                    errorSpan.textContent = currentLang === 'tr' ? 'Lütfen bir proje seçin.' : (currentLang === 'en' ? 'Please select a project.' : 'Kies een project.');
                    errorSpan.style.display = 'block';
                }
            } else {
                if (errorSpan) {
                    errorSpan.textContent = '';
                    errorSpan.style.display = 'none';
                }
            }
        } else if (step === 2) {
            const projectTypeChecked = document.querySelector('input[name="project_type"]:checked');
            const projectType = projectTypeChecked ? projectTypeChecked.value : null;
            const size = parseFloat(sizeInput?.value);
            const errorSpan = document.getElementById('error-size');
            const parentGroup = sizeInput?.closest('.form-group');
            
            if (projectType === 'badkamer' || projectType === 'gipsplaat' || projectType === 'fayans') {
                if (isNaN(size) || size <= 0) {
                    isValid = false;
                    sizeInput.setAttribute('aria-invalid', 'true');
                    if (parentGroup) parentGroup.classList.add('has-error');
                    if (errorSpan) {
                        errorSpan.textContent = currentLang === 'tr' ? 'Lütfen sıfırdan büyük geçerli bir alan boyutu girin.' : (currentLang === 'en' ? 'Please enter a valid size greater than 0.' : 'Vul een geldige oppervlakte in groter dan 0.');
                        errorSpan.style.display = 'block';
                    }
                } else {
                    sizeInput.removeAttribute('aria-invalid');
                    if (parentGroup) parentGroup.classList.remove('has-error');
                    if (errorSpan) {
                        errorSpan.textContent = '';
                        errorSpan.style.display = 'none';
                    }
                }
            }
        } else if (step === 4) {
            if (!validateField('wizard_client_name')) isValid = false;
            if (!validateField('wizard_client_phone')) isValid = false;
            if (!validateField('wizard_client_email')) isValid = false;
            if (!validateField('wizard_location')) isValid = false;
        }
        return isValid;
    }

    ['wizard_client_name', 'wizard_client_phone', 'wizard_client_email', 'wizard_location'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                const parentGroup = el.closest('.form-group');
                let errorSpanId = '';
                if (id === 'wizard_client_name') errorSpanId = 'error-client_name';
                else if (id === 'wizard_client_phone') errorSpanId = 'error-client_phone';
                else if (id === 'wizard_client_email') errorSpanId = 'error-client_email';
                else if (id === 'wizard_location') errorSpanId = 'error-location';
                
                const errorSpan = document.getElementById(errorSpanId);
                if (parentGroup && errorSpan) {
                    parentGroup.classList.remove('has-error');
                    errorSpan.style.display = 'none';
                    el.removeAttribute('aria-invalid');
                }
            });
            el.addEventListener('blur', () => validateField(id));
        }
    });

    // ----------------------------------------------------------------
    // 6. Form Submission (Webhook & Honeypot)
    // ----------------------------------------------------------------
    if (wizardForm) {
        wizardForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Honeypot check
            const honeypot = document.getElementById('w_honeypot');
            if (honeypot && honeypot.value !== '') {
                console.warn('Bot detected.');
                wizardForm.style.display = 'none';
                document.getElementById('wizardSuccessBox').classList.remove('hidden');
                return;
            }

            // Validation
            if (!validateStep(4)) {
                return;
            }

            const projectTypeChecked = document.querySelector('input[name="project_type"]:checked');
            const projectType = projectTypeChecked ? projectTypeChecked.value : null;
            const size = parseFloat(sizeInput?.value) || 0;
            const materialPref = document.getElementById('wizard_material_preference')?.value;
            const description = document.getElementById('wizard_description')?.value;
            const name = document.getElementById('wizard_client_name')?.value;
            const phone = document.getElementById('wizard_client_phone')?.value;
            const email = document.getElementById('wizard_client_email')?.value;
            const location = document.getElementById('wizard_location')?.value;
            const calculated_estimate = calculateEstimate();

            const data = {
                project_type: projectType,
                size: size,
                material_preference: materialPref,
                description: description,
                client_name: name,
                client_phone: phone,
                client_email: email,
                location: location,
                calculated_estimate: calculated_estimate
            };

            const submitBtn = document.getElementById('wSubmitBtn');
            const originalBtnHTML = submitBtn ? submitBtn.innerHTML : '';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Loading...`;
            }
            // Fallback to Vercel API endpoint for Telegram notification proxy if no explicit webhook URL is set
            let webhookUrl = document.getElementById('wizard_webhook_url')?.value;
            if (!webhookUrl || webhookUrl.includes('placeholder-webhook-id') || webhookUrl.includes('make.com')) {
                // If running on derininfra.nl static Pages, point to Vercel deployment URL
                webhookUrl = window.location.hostname === 'derininfra.nl' || window.location.hostname === 'www.derininfra.nl'
                    ? 'https://derin-infra-staging.vercel.app/api/quote'
                    : '/api/quote';
            }

            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    mode: 'cors'
                });
            } catch (err) {
                console.warn("Webhook submission error. Showing success fallback.", err);
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnHTML;
                }
                
                wizardForm.style.display = 'none';
                const successBox = document.getElementById('wizardSuccessBox');
                if (successBox) successBox.classList.remove('hidden');
                
                const successAlert = document.getElementById('wizardSubmitSuccess');
                if (successAlert) successAlert.style.display = 'flex';
                
                const viewOfferteBtn = document.getElementById('viewGeneratedOfferteBtn');
                if (viewOfferteBtn) {
                    const newBtn = viewOfferteBtn.cloneNode(true);
                    newBtn.addEventListener('click', () => showOfferte(data));
                    viewOfferteBtn.parentNode.replaceChild(newBtn, viewOfferteBtn);
                }
            }
        });
    }

    const resetWizardBtn = document.getElementById('resetWizardBtn');
    if (resetWizardBtn) {
        resetWizardBtn.addEventListener('click', () => {
            wizardForm.reset();
            currentStep = 1;
            wizardForm.style.display = 'block';
            document.getElementById('wizardSuccessBox').classList.add('hidden');
            const successAlert = document.getElementById('wizardSubmitSuccess');
            if (successAlert) successAlert.style.display = 'none';
            
            if (sizeRange) sizeRange.value = 10;
            if (sizeInput) sizeInput.value = 10;
            
            updateWizardUI();
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

    let chatState = {
        step: 'idle', // 'idle', 'booking_service', 'booking_name', 'booking_phone', 'booking_datetime', 'booking_confirm', 'pricing_service', 'pricing_size', 'pricing_materials', 'pricing_result'
        data: {
            project_type: '',
            client_name: '',
            client_phone: '',
            datetime: '',
            size: 10,
            material_pref: 'zonder-materiaal'
        }
    };

    const chatTranslations = {
        tr: {
            welcome: "Merhaba! Ben Der-In infra Yapay Zeka Asistanıyım. Size banyo/tuvalet tadilatı, fayans döşeme, alçıpan ve su tesisatı hizmetlerimiz ve fiyatlarımız hakkında bilgi verebilirim. Nasıl yardımcı olabilirim?",
            chip_booking: "📅 Randevu Oluştur",
            chip_pricing: "💰 Fiyat Hesapla",
            chip_question: "💬 Soru Sor",
            ask_service: "Hangi hizmet için randevu oluşturmak istersiniz?",
            ask_service_pricing: "Hangi hizmet için yaklaşık fiyat hesaplamak istersiniz?",
            ask_name: "Lütfen adınızı ve soyadınızı yazar mısınız?",
            ask_phone: "Lütfen size ulaşabileceğimiz telefon numaranızı yazar mısınız?",
            ask_datetime: "Randevu için uygun gün ve saati belirtir misiniz? (Örn: Pazartesi 14:00)",
            ask_size: "Tadilat yapılacak alanın büyüklüğünü (m²) yazar mısınız? Aşağıdaki hazır butonları da kullanabilirsiniz:",
            ask_materials: "Malzeme tercihiniz nedir?",
            material_labor: "🛠️ Sadece İşçilik (+Kaba Malzeme)",
            material_all: "💎 Her Şey Dahil (Malzemeli Paket)",
            summary_title: "📋 Randevu Talebi Özetiniz",
            summary_desc: "Bilgilerinizi aldım. WhatsApp üzerinden İnan Usta'ya göndermek için aşağıdaki butona tıklayın:",
            btn_send_whatsapp: "🟢 WhatsApp ile Gönder & Tamamla",
            price_summary_title: "📋 Hesaplanan Richtprijs",
            price_summary_desc: "Şirket fiyatlandırma formüllerimize göre yaklaşık fiyat:",
            btn_book_this: "📅 Bu Projeye Randevu Al",
            btn_recalc: "🔄 Yeniden Hesapla",
            btn_cancel: "❌ İptal Et & Menüye Dön",
            field_service: "Hizmet",
            field_client: "Müşteri",
            field_phone: "Telefon",
            field_datetime: "Tarih/Saat",
            field_size: "Alan (m²)",
            field_materials: "Malzeme",
            field_price: "Yaklaşık Fiyat",
            cancel_msg: "İşlem iptal edildi. Ana menüye dönüldü.",
            whatsapp_template: "Merhaba İnan Usta, derininfra.nl sitesinden randevu talebi oluşturdum:\n\n- Hizmet: {service}\n- Müşteri: {name}\n- Telefon: {phone}\n- Tercih Edilen Zaman: {datetime}",
            detect_lang_tr: "Türkçe dili algılandı. Size Türkçe olarak yardımcı olacağım.",
            detect_lang_nl: "Nederlands gedetecteerd. Ik zal in het Nederlands antwoorden.",
            detect_lang_en: "English detected. I will reply in English.",
            error_invalid_size: "Lütfen geçerli bir sayı girin (1-100 m²).",
            status_just_now: "Şimdi"
        },
        nl: {
            welcome: "Hallo! Ik ben de AI-assistent van Der-In infra. Ik kan u helpen met richtprijzen voor badkamerrenovatie, toiletrenovatie, tegelwerk en wanden. Hoe kan ik u vandaag helpen?",
            chip_booking: "📅 Afspraak Maken",
            chip_pricing: "💰 Richtprijs Berekenen",
            chip_question: "💬 Vraag Stellen",
            ask_service: "Voor welk project wilt u een afspraak maken?",
            ask_service_pricing: "Voor welk project wilt u de richtprijs berekenen?",
            ask_name: "Wat is uw naam?",
            ask_phone: "Wat is uw telefoonnummer?",
            ask_datetime: "Wat is de gewenste datum en tijd voor de opmeting? (Bijv. Maandag 14:00)",
            ask_size: "Wat is de geschatte oppervlakte in m²? Typ het of kies een optie:",
            ask_materials: "Wat is uw materiaal voorkeur?",
            material_labor: "🛠️ Alleen Arbeid (+Kaba Materialen)",
            material_all: "💎 All-in Inclusief Materialen",
            summary_title: "📋 Uw Afspraak Samenvatting",
            summary_desc: "Ik heb uw gegevens ontvangen. Klik op de knop hieronder om het direct via WhatsApp naar İnan te sturen:",
            btn_send_whatsapp: "🟢 Stuur via WhatsApp & Afronden",
            price_summary_title: "📋 Berekende Richtprijs",
            price_summary_desc: "Op basis van onze vaste tarieven is dit uw live richtprijs:",
            btn_book_this: "📅 Plan Direct Opmeting",
            btn_recalc: "🔄 Nieuwe Berekening",
            btn_cancel: "❌ Annuleren",
            field_service: "Dienst",
            field_client: "Klant",
            field_phone: "Telefoon",
            field_datetime: "Datum & Tijd",
            field_size: "Oppervlakte",
            field_materials: "Materiaal",
            field_price: "Richtprijs",
            cancel_msg: "Geannuleerd. Terug naar het hoofdmenu.",
            whatsapp_template: "Hallo İnan, ik heb een afspraakverzoek ingediend via derininfra.nl:\n\n- Dienst: {service}\n- Klant: {name}\n- Telefoon: {phone}\n- Gewenste tijd: {datetime}",
            detect_lang_tr: "Turks gedetecteerd. Ik zal in het Turks antwoorden.",
            detect_lang_nl: "Nederlands gedetecteerd. Ik zal in het Nederlands antwoorden.",
            detect_lang_en: "Engels gedetecteerd. Ik zal in het Engels antwoorden.",
            error_invalid_size: "Vul een geldig getal in (1-100 m²).",
            status_just_now: "Zojuist"
        },
        en: {
            welcome: "Hello! I am the AI assistant of Der-In infra. I can help you with estimates for bathroom, toilet, tiling, and drywall work. How can I assist you today?",
            chip_booking: "📅 Book Appointment",
            chip_pricing: "💰 Calculate Price",
            chip_question: "💬 Ask a Question",
            ask_service: "Which project would you like to book an appointment for?",
            ask_service_pricing: "Which project would you like to calculate the price for?",
            ask_name: "What is your name?",
            ask_phone: "What is your telephone number?",
            ask_datetime: "Please specify your preferred date and time for the measurement. (e.g. Monday 14:00)",
            ask_size: "What is the estimated area size in m²? You can type it or select an option:",
            ask_materials: "What is your material preference?",
            material_labor: "🛠️ Labor & Rough Materials only",
            material_all: "💎 All-in Including Materials",
            summary_title: "📋 Your Appointment Summary",
            summary_desc: "I have received your details. Click the button below to send it to İnan via WhatsApp:",
            btn_send_whatsapp: "🟢 Send via WhatsApp & Complete",
            price_summary_title: "📋 Calculated Estimate",
            price_summary_desc: "Based on our pricing formulas, here is your estimated price:",
            btn_book_this: "📅 Book Appointment for this",
            btn_recalc: "🔄 Recalculate",
            btn_cancel: "❌ Cancel & Return to Menu",
            field_service: "Service",
            field_client: "Client",
            field_phone: "Phone",
            field_datetime: "Date/Time",
            field_size: "Area (m²)",
            field_materials: "Material",
            field_price: "Estimated Price",
            cancel_msg: "Cancelled. Returning to main menu.",
            whatsapp_template: "Hello İnan, I have created an appointment request from derininfra.nl:\n\n- Service: {service}\n- Client: {name}\n- Phone: {phone}\n- Preferred Time: {datetime}",
            detect_lang_tr: "Turkish language detected. I will reply in Turkish.",
            detect_lang_nl: "Dutch language detected. I will reply in Dutch.",
            detect_lang_en: "English language detected. I will reply in English.",
            error_invalid_size: "Please enter a valid number (1-100 m²).",
            status_just_now: "Just now"
        }
    };

    const projectTypeLabels = {
        tr: {
            badkamer: "Komple Banyo Yenileme",
            toilet: "Tuvalet Yenileme",
            fayans: "Tegelwerk (Fayans Döşeme)",
            gipsplaat: "Alçıpan / Bölme Duvar",
            riolering: "Su & Kanalizasyon Tesisatı"
        },
        nl: {
            badkamer: "Complete Badkamerrenovatie",
            toilet: "Toiletrenovatie",
            fayans: "Tegelwerk (Tegels)",
            gipsplaat: "Gipsplaten Wanden",
            riolering: "Riolering & Loodgieterswerk"
        },
        en: {
            badkamer: "Complete Bathroom Renovation",
            toilet: "Toilet Renovation",
            fayans: "Tiling Work",
            gipsplaat: "Drywall Partition Walls",
            riolering: "Sewerage & Plumbing"
        }
    };

    const materialPrefLabels = {
        tr: {
            'zonder-materiaal': "Sadece İşçilik (+Kaba Malzeme)",
            'met-materiaal': "Her Şey Dahil (Malzemeli)"
        },
        nl: {
            'zonder-materiaal': "Alleen arbeid & basis-materialen",
            'met-materiaal': "All-in inclusief sanitair/tegels"
        },
        en: {
            'zonder-materiaal': "Labor & Rough Materials only",
            'met-materiaal': "All-in including materials"
        }
    };

    function resetChatState() {
        chatState.step = 'idle';
        chatState.data = {
            project_type: '',
            client_name: '',
            client_phone: '',
            datetime: '',
            size: 10,
            material_pref: 'zonder-materiaal'
        };
    }

    function calculateChatEstimate(projectType, size, materialPref) {
        let basePrice = 0;
        let materialCost = 0;
        let isOnRequest = false;

        switch (projectType) {
            case 'badkamer':
                if (size <= 2) basePrice = 4000;
                else if (size === 3) basePrice = 4500;
                else if (size === 4) basePrice = 5200;
                else if (size === 5 || size === 6) basePrice = 6000;
                else if (size > 6) basePrice = 6000 + (size - 6) * 800;
                materialCost = materialPref === 'met-materiaal' ? 2500 : 0;
                break;

            case 'toilet':
                basePrice = 2000;
                materialCost = materialPref === 'met-materiaal' ? 1000 : 0;
                break;

            case 'gipsplaat':
                basePrice = size * 42.5;
                materialCost = materialPref === 'met-materiaal' ? (size * 22.5) : 0;
                break;

            case 'fayans':
                basePrice = size * 47.5;
                materialCost = materialPref === 'met-materiaal' ? (size * 52.5) : 0;
                break;

            case 'riolering':
                isOnRequest = true;
                break;
        }

        if (isOnRequest) {
            return null;
        }

        return basePrice + materialCost;
    }

    function autoDetectLanguage(msg) {
        const text = msg.toLowerCase();
        
        const trKeywords = ['türkçe', 'turkce', 'merhaba', 'selam', 'randevu', 'fiyat', 'banyo', 'fayans', 'alçıpan', 'alcipan', 'tuvalet', 'yardım', 'tesisat', 'nedir', 'konuş'];
        const nlKeywords = ['hallo', 'goedemorgen', 'goedemiddag', 'afspraak', 'prijs', 'badkamer', 'renovatie', 'tegelwerk', 'gipsplaten', 'toilet', 'hulp', 'riolering', 'zojuist', 'offerte', 'nederlands'];
        const enKeywords = ['hello', 'hi', 'appointment', 'price', 'bathroom', 'renovation', 'tiling', 'drywall', 'toilet', 'help', 'plumbing', 'estimate', 'calculate', 'english'];

        let trScore = 0;
        let nlScore = 0;
        let enScore = 0;

        trKeywords.forEach(kw => { if (text.includes(kw)) trScore++; });
        nlKeywords.forEach(kw => { if (text.includes(kw)) nlScore++; });
        enKeywords.forEach(kw => { if (text.includes(kw)) enScore++; });

        if (trScore > nlScore && trScore > enScore) return 'tr';
        if (enScore > trScore && enScore > nlScore) return 'en';
        if (nlScore > trScore && nlScore > enScore) return 'nl';
        
        return null;
    }

    function addChatMessage(text, sender) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        bubble.textContent = text;
        
        const time = document.createElement('span');
        time.className = 'msg-time';
        
        const lang = currentLang || 'nl';
        time.textContent = chatTranslations[lang].status_just_now;

        msgDiv.appendChild(bubble);
        msgDiv.appendChild(time);
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addBotResponse(text, chips = [], card = null) {
        if (!chatTyping) return;
        chatTyping.classList.remove('hidden');
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            chatTyping.classList.add('hidden');
            
            if (text) {
                addChatMessage(text, 'bot');
            }
            
            if (card) {
                renderChatCard(card);
            }

            if (chips && chips.length > 0) {
                renderChatChips(chips);
            }
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 300 + Math.random() * 300);
    }

    function renderChatChips(chips) {
        if (!chatMessages) return;
        const existingChips = chatMessages.querySelectorAll('.chat-chips');
        existingChips.forEach(el => el.remove());

        const chipsDiv = document.createElement('div');
        chipsDiv.className = 'chat-chips';

        chips.forEach(chip => {
            const btn = document.createElement('button');
            btn.className = `chat-chip ${chip.accent ? 'accent' : ''}`;
            btn.textContent = chip.text;
            btn.addEventListener('click', () => {
                addChatMessage(chip.text, 'user');
                chipsDiv.remove();
                handleChatAction(chip.action, chip.text);
            });
            chipsDiv.appendChild(btn);
        });

        chatMessages.appendChild(chipsDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function renderChatCard(card) {
        if (!chatMessages) return;
        const cardDiv = document.createElement('div');
        cardDiv.className = 'chat-card';

        if (card.title) {
            const titleDiv = document.createElement('div');
            titleDiv.className = 'chat-card-title';
            titleDiv.textContent = card.title;
            cardDiv.appendChild(titleDiv);
        }

        if (card.rows) {
            const bodyDiv = document.createElement('div');
            bodyDiv.className = 'chat-card-body';
            
            card.rows.forEach(row => {
                const p = document.createElement('p');
                p.innerHTML = `<strong>${row.label}:</strong> ${row.value}`;
                bodyDiv.appendChild(p);
            });
            cardDiv.appendChild(bodyDiv);
        }

        if (card.actions) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'chat-card-actions';

            card.actions.forEach(act => {
                const btn = document.createElement('button');
                btn.className = `chat-card-btn ${act.primary ? 'primary' : ''}`;
                btn.innerHTML = act.text;
                btn.addEventListener('click', () => {
                    if (act.url) {
                        window.open(act.url, '_blank');
                    } else if (act.action) {
                        btn.closest('.chat-card').remove();
                        handleChatAction(act.action, act.text);
                    }
                });
                actionsDiv.appendChild(btn);
            });
            cardDiv.appendChild(actionsDiv);
        }

        chatMessages.appendChild(cardDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleChatAction(action, textInput) {
        const lang = currentLang || 'nl';
        const t = chatTranslations[lang];

        if (action === 'cancel' || textInput.toLowerCase() === 'exit' || textInput.toLowerCase() === 'cancel' || textInput.toLowerCase() === 'iptal' || textInput.toLowerCase() === 'menu') {
            resetChatState();
            addBotResponse(t.cancel_msg, [
                { text: t.chip_booking, action: 'start_booking' },
                { text: t.chip_pricing, action: 'start_pricing' },
                { text: t.chip_question, action: 'start_question' }
            ]);
            return;
        }

        switch (chatState.step) {
            case 'idle':
                if (action === 'start_booking') {
                    chatState.step = 'booking_service';
                    addBotResponse(t.ask_service, [
                        { text: projectTypeLabels[lang].badkamer, action: 'book_service_badkamer' },
                        { text: projectTypeLabels[lang].toilet, action: 'book_service_toilet' },
                        { text: projectTypeLabels[lang].fayans, action: 'book_service_fayans' },
                        { text: projectTypeLabels[lang].gipsplaat, action: 'book_service_gipsplaat' },
                        { text: projectTypeLabels[lang].riolering, action: 'book_service_riolering' },
                        { text: t.btn_cancel, action: 'cancel', accent: true }
                    ]);
                } else if (action === 'start_pricing') {
                    chatState.step = 'pricing_service';
                    addBotResponse(t.ask_service_pricing, [
                        { text: projectTypeLabels[lang].badkamer, action: 'price_service_badkamer' },
                        { text: projectTypeLabels[lang].toilet, action: 'price_service_toilet' },
                        { text: projectTypeLabels[lang].fayans, action: 'price_service_fayans' },
                        { text: projectTypeLabels[lang].gipsplaat, action: 'price_service_gipsplaat' },
                        { text: t.btn_cancel, action: 'cancel', accent: true }
                    ]);
                } else if (action === 'start_question') {
                    addBotResponse(lang === 'tr' ? "Lütfen sorunuzu yazın. Size yardımcı olmaktan memnuniyet duyarım." : (lang === 'en' ? "Please type your question. I will be happy to help." : "Typ uw vraag. Ik help u graag."));
                }
                break;

            case 'booking_service':
                let selectedService = '';
                if (action.startsWith('book_service_')) {
                    selectedService = action.replace('book_service_', '');
                } else {
                    selectedService = 'toilet';
                }
                chatState.data.project_type = selectedService;
                chatState.step = 'booking_name';
                addBotResponse(t.ask_name, [
                    { text: t.btn_cancel, action: 'cancel', accent: true }
                ]);
                break;

            case 'booking_name':
                chatState.data.client_name = textInput;
                chatState.step = 'booking_phone';
                addBotResponse(t.ask_phone, [
                    { text: t.btn_cancel, action: 'cancel', accent: true }
                ]);
                break;

            case 'booking_phone':
                chatState.data.client_phone = textInput;
                chatState.step = 'booking_datetime';
                addBotResponse(t.ask_datetime, [
                    { text: t.btn_cancel, action: 'cancel', accent: true }
                ]);
                break;

            case 'booking_datetime':
                chatState.data.datetime = textInput;
                chatState.step = 'booking_confirm';
                
                const serviceLabel = projectTypeLabels[lang][chatState.data.project_type] || chatState.data.project_type;
                let waText = t.whatsapp_template
                    .replace('{service}', serviceLabel)
                    .replace('{name}', chatState.data.client_name)
                    .replace('{phone}', chatState.data.client_phone)
                    .replace('{datetime}', chatState.data.datetime);
                
                if (chatState.data.size && chatState.data.project_type !== 'riolering') {
                    const matLabel = materialPrefLabels[lang][chatState.data.material_pref] || chatState.data.material_pref;
                    const rawPrice = calculateChatEstimate(chatState.data.project_type, chatState.data.size, chatState.data.material_pref);
                    const priceFormatted = rawPrice ? `€ ${rawPrice.toLocaleString('nl-NL')}` : 'Prijs op aanvraag';
                    waText += `\n- Oppervlakte: ${chatState.data.size} m²\n- Materiaal: ${matLabel}\n- Richtprijs: ${priceFormatted}`;
                }

                const waUrl = `https://wa.me/31618694652?text=${encodeURIComponent(waText)}`;

                const confirmCard = {
                    title: t.summary_title,
                    rows: [
                        { label: t.field_service, value: serviceLabel },
                        { label: t.field_client, value: chatState.data.client_name },
                        { label: t.field_phone, value: chatState.data.client_phone },
                        { label: t.field_datetime, value: chatState.data.datetime }
                    ],
                    actions: [
                        { text: t.btn_send_whatsapp, url: waUrl, primary: true },
                        { text: t.btn_cancel, action: 'cancel' }
                    ]
                };

                addBotResponse(t.summary_desc, [], confirmCard);
                break;

            case 'pricing_service':
                let prService = '';
                if (action.startsWith('price_service_')) {
                    prService = action.replace('price_service_', '');
                } else {
                    prService = 'toilet';
                }
                chatState.data.project_type = prService;
                
                if (prService === 'toilet') {
                    chatState.data.size = 1;
                    chatState.step = 'pricing_materials';
                    addBotResponse(t.ask_materials, [
                        { text: materialPrefLabels[lang]['zonder-materiaal'], action: 'price_mat_zonder' },
                        { text: materialPrefLabels[lang]['met-materiaal'], action: 'price_mat_met' },
                        { text: t.btn_cancel, action: 'cancel', accent: true }
                    ]);
                } else {
                    chatState.step = 'pricing_size';
                    addBotResponse(t.ask_size, [
                        { text: "2 m²", action: "price_size_2" },
                        { text: "5 m²", action: "price_size_5" },
                        { text: "8 m²", action: "price_size_8" },
                        { text: "12 m²", action: "price_size_12" },
                        { text: "15 m²", action: "price_size_15" },
                        { text: "25 m²", action: "price_size_25" },
                        { text: t.btn_cancel, action: 'cancel', accent: true }
                    ]);
                }
                break;

            case 'pricing_size':
                let sizeVal = 10;
                if (action.startsWith('price_size_')) {
                    sizeVal = parseFloat(action.replace('price_size_', ''));
                } else {
                    sizeVal = parseFloat(textInput.replace(/[^0-9.]/g, ''));
                    if (isNaN(sizeVal) || sizeVal <= 0) {
                        addBotResponse(t.error_invalid_size, [
                            { text: t.btn_cancel, action: 'cancel', accent: true }
                        ]);
                        return;
                    }
                }
                chatState.data.size = sizeVal;
                chatState.step = 'pricing_materials';
                addBotResponse(t.ask_materials, [
                    { text: materialPrefLabels[lang]['zonder-materiaal'], action: 'price_mat_zonder' },
                    { text: materialPrefLabels[lang]['met-materiaal'], action: 'price_mat_met' },
                    { text: t.btn_cancel, action: 'cancel', accent: true }
                ]);
                break;

            case 'pricing_materials':
                let matPref = 'zonder-materiaal';
                if (action === 'price_mat_met') {
                    matPref = 'met-materiaal';
                }
                chatState.data.material_pref = matPref;
                chatState.step = 'pricing_result';

                const calculated = calculateChatEstimate(chatState.data.project_type, chatState.data.size, chatState.data.material_pref);
                const formattedPrice = calculated ? `€ ${calculated.toLocaleString('nl-NL')}` : 'Prijs op aanvraag';

                const prServiceLabel = projectTypeLabels[lang][chatState.data.project_type] || chatState.data.project_type;
                const matLabel = materialPrefLabels[lang][chatState.data.material_pref];

                const resultCard = {
                    title: t.price_summary_title,
                    rows: [
                        { label: t.field_service, value: prServiceLabel },
                        { label: t.field_size, value: chatState.data.project_type === 'toilet' ? '1 adet' : `${chatState.data.size} m²` },
                        { label: t.field_materials, value: matLabel },
                        { label: t.field_price, value: `${formattedPrice} (excl. BTW)` }
                    ],
                    actions: [
                        { text: t.btn_book_this, action: 'pricing_to_booking', primary: true },
                        { text: t.btn_recalc, action: 'start_pricing' },
                        { text: t.btn_cancel, action: 'cancel' }
                    ]
                };

                addBotResponse(t.price_summary_desc, [], resultCard);
                break;

            case 'pricing_result':
                if (action === 'pricing_to_booking') {
                    chatState.step = 'booking_name';
                    addBotResponse(t.ask_name, [
                        { text: t.btn_cancel, action: 'cancel', accent: true }
                    ]);
                } else if (action === 'start_pricing') {
                    chatState.step = 'pricing_service';
                    addBotResponse(t.ask_service_pricing, [
                        { text: projectTypeLabels[lang].badkamer, action: 'price_service_badkamer' },
                        { text: projectTypeLabels[lang].toilet, action: 'price_service_toilet' },
                        { text: projectTypeLabels[lang].fayans, action: 'price_service_fayans' },
                        { text: projectTypeLabels[lang].gipsplaat, action: 'price_service_gipsplaat' },
                        { text: t.btn_cancel, action: 'cancel', accent: true }
                    ]);
                }
                break;
        }
    }

    if (chatBubble && chatWindow && chatClose) {
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

                const msgsCount = chatMessages.querySelectorAll('.chat-msg').length;
                if (msgsCount <= 1) {
                    const lang = currentLang || 'nl';
                    const t = chatTranslations[lang];
                    renderChatChips([
                        { text: t.chip_booking, action: 'start_booking' },
                        { text: t.chip_pricing, action: 'start_pricing' },
                        { text: t.chip_question, action: 'start_question' }
                    ]);
                }
            }
        });

        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('open');
            setTimeout(() => chatWindow.classList.add('hidden'), 300);
            chatBubble.setAttribute('aria-expanded', 'false');
        });
    }

    if (chatForm && chatInput && chatMessages && chatTyping) {
        chatForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userMsgText = chatInput.value.trim();
            if (!userMsgText) return;

            addChatMessage(userMsgText, 'user');
            chatInput.value = '';

            const detectedLang = autoDetectLanguage(userMsgText);
            if (detectedLang && detectedLang !== currentLang) {
                currentLang = detectedLang;
                localStorage.setItem('preferred_language', detectedLang);
                if (typeof setLanguage === 'function') {
                    setLanguage(detectedLang);
                }
                
                const sysMsg = chatTranslations[detectedLang].detect_lang_tr || chatTranslations[detectedLang].detect_lang_nl || chatTranslations[detectedLang].detect_lang_en;
                addBotResponse(sysMsg);
            }

            if (chatState.step !== 'idle') {
                handleChatAction(chatState.step, userMsgText);
                return;
            }

            const lowerMsg = userMsgText.toLowerCase();
            const lang = currentLang || 'nl';
            const t = chatTranslations[lang];

            if (lowerMsg.includes('randevu') || lowerMsg.includes('afspraak') || lowerMsg.includes('book') || lowerMsg.includes('appointment') || lowerMsg.includes('plan')) {
                handleChatAction('start_booking', userMsgText);
                return;
            }

            if (lowerMsg.includes('fiyat') || lowerMsg.includes('prijs') || lowerMsg.includes('price') || lowerMsg.includes('hesapla') || lowerMsg.includes('bereken') || lowerMsg.includes('cost')) {
                handleChatAction('start_pricing', userMsgText);
                return;
            }

            chatTyping.classList.remove('hidden');
            chatMessages.scrollTop = chatMessages.scrollHeight;

            let replyText = "";
            try {
                // If running on a static GitHub Pages environment, relative /api/chat will return index.html (or fail).
                // In that case, we fall back to the Vercel serverless proxy endpoint.
                let chatEndpoint = '/api/chat';
                
                // Direct fallback for typical *.github.io or when explicitly on derininfra.nl static Pages
                if (window.location.hostname.includes('github.io') || window.location.hostname === 'derininfra.nl') {
                    // Try the Vercel deployment URL (replace this if Vercel assigns a different name)
                    chatEndpoint = 'https://derin-infra-staging.vercel.app/api/chat'; 
                }

                let response = await fetch(chatEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: userMsgText,
                        language: lang
                    })
                });

                // Check if the response is HTML (GitHub Pages returns index.html for 404 routes like /api/chat)
                const contentType = response.headers.get('content-type') || '';
                if (!response.ok || !contentType.includes('application/json')) {
                    if (chatEndpoint === '/api/chat') {
                        console.log("Relative API did not return JSON. Trying Vercel backend fallback...");
                        chatEndpoint = 'https://derin-infra-staging.vercel.app/api/chat';
                        response = await fetch(chatEndpoint, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                message: userMsgText,
                                language: lang
                            })
                        });
                    }
                }

                if (response.ok) {
                    const data = await response.json();
                    replyText = data.reply;
                } else {
                    throw new Error("Server error " + response.status);
                }
            } catch (err) {
                console.warn("AI Chatbot API not available. Using fallback...", err);
                replyText = generateAIResponse(userMsgText);
            }

            setTimeout(() => {
                chatTyping.classList.add('hidden');
                addChatMessage(replyText, 'bot');
                
                renderChatChips([
                    { text: t.chip_booking, action: 'start_booking' },
                    { text: t.chip_pricing, action: 'start_pricing' },
                    { text: t.chip_question, action: 'start_question' }
                ]);
                
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 500 + Math.random() * 500);
        });
    }

    const openChatbotBtn = document.getElementById('openChatbotAppointmentBtn');
    if (openChatbotBtn) {
        openChatbotBtn.addEventListener('click', () => {
            if (chatWindow.classList.contains('hidden') || !chatWindow.classList.contains('open')) {
                chatWindow.classList.remove('hidden');
                setTimeout(() => chatWindow.classList.add('open'), 10);
                chatBubble.setAttribute('aria-expanded', 'true');
            }

            const lang = currentLang || 'nl';
            const t = chatTranslations[lang];

            const projectTypeChecked = document.querySelector('input[name="project_type"]:checked');
            const projectType = projectTypeChecked ? projectTypeChecked.value : 'toilet';
            const size = parseFloat(sizeInput?.value) || 10;
            const materialPref = document.getElementById('wizard_material_preference')?.value || 'zonder-materiaal';
            const name = document.getElementById('wizard_client_name')?.value || '';
            const phone = document.getElementById('wizard_client_phone')?.value || '';

            chatState.step = 'booking_datetime';
            chatState.data = {
                project_type: projectType,
                client_name: name,
                client_phone: phone,
                size: size,
                material_pref: materialPref,
                datetime: ''
            };

            const prefilledMsg = lang === 'tr' 
                ? `Hesaplayıcıdan gelen proje bilgilerinizi aldım:\n- Hizmet: ${projectTypeLabels[lang][projectType]}\n- Alan: ${size} m²\n- Malzeme: ${materialPrefLabels[lang][materialPref]}\n- İsim: ${name}\n- Telefon: ${phone}\n\nRandevu planlamasını tamamlamak için uygun olduğunuz gün ve saati yazar misiniz?`
                : (lang === 'en'
                    ? `I have imported your project details from the calculator:\n- Service: ${projectTypeLabels[lang][projectType]}\n- Area: ${size} m²\n- Material: ${materialPrefLabels[lang][materialPref]}\n- Name: ${name}\n- Phone: ${phone}\n\nTo complete the booking, please specify your preferred date and time:`
                    : `Ik heb uw projectgegevens uit de calculator geïmporteerd:\n- Dienst: ${projectTypeLabels[lang][projectType]}\n- Oppervlakte: ${size} m²\n- Materiaal: ${materialPrefLabels[lang][materialPref]}\n- Naam: ${name}\n- Telefoon: ${phone}\n\nOm de afspraak af te ronden, wat is de gewenste datum en tijd voor de opmeting?`);

            addBotResponse(prefilledMsg, [
                { text: t.btn_cancel, action: 'cancel', accent: true }
            ]);
        });
    }

    function generateAIResponse(query) {
        const q = query.toLowerCase();
        const lang = currentLang || 'nl';
        
        const isBanyo = q.includes('badd') || q.includes('bath') || q.includes('banyo') || q.includes('renovatie');
        const isToilet = q.includes('toil') || q.includes('klozet') || q.includes('wc');
        const isFayans = q.includes('fay') || q.includes('teg') || q.includes('tile');
        const isAlcipan = q.includes('alc') || q.includes('alç') || q.includes('gips') || q.includes('dry') || q.includes('wand');
        const isTesisat = q.includes('tesi') || q.includes('lood') || q.includes('plum') || q.includes('riol');
        const isPrice = q.includes('prijs') || q.includes('fiyat') || q.includes('tar') || q.includes('cost') || q.includes('price') || q.includes('offert');
        const isArea = q.includes('lely') || q.includes('regio') || q.includes('stad') || q.includes('amster') || q.includes('alme') || q.includes('utre');
        const isGaranti = q.includes('garant') || q.includes('guar');
        const isHermes = q.includes('herm') || q.includes('host') || q.includes('agent') || q.includes('vps');
        const isContact = q.includes('adres') || q.includes('kvk') || q.includes('btw') || q.includes('ilet') || q.includes('cont') || q.includes('tel') || q.includes('mail');

        if (lang === 'tr') {
            if (isHermes) {
                return "Hermes Agent sistemimiz, İnan abimizin şantiyeden doğrudan WhatsApp üzerinden fotoğraf ve ses kaydı atarak web sitesini ve Facebook sayfasını güncellemesini sağlayan gelişmiş bir yapay zeka köprüsüdür. Derya ablamızın onayından geçtikten sonra site anında güncellenir. Hostinger VPS üzerinde izole bir şekilde güvenle çalışmaktadır.";
            }
            if (isBanyo) {
                return "Banyo yenileme işçilik ve kaba malzeme fiyatlarımız 2 m² küçük alanlar için €4.000, standart banyolar (5-6 m²) için €6.000 taban fiyatından başlar. Söküm ve moloz atımı dahildir. Tüm malzemeleri bizim almamızı isterseniz +€2.500 eklenir. Siz kendi zevkinize göre fayans ve vitrifiyeyi seçip getirebilirsiniz.";
            }
            if (isToilet) {
                return "Tuvalet yenileme fiyatımız eski tuvaletin sökülmesi, moloz atılması ve anahtar teslim kurulum dahil malzemesiz (sadece işçilik ve kaba malzeme) €2.000'dur. Tüm malzemeleri bizim almamızı isterseniz (All-in klozet, rezervuar ve fayans dahil) €3.000'dur.";
            }
            if (isFayans) {
                return "Büyük ebat fayans döşeme işlerinde sadece işçilik m² fiyatımız €47.50'dir. Fayanslar dahil malzemeli m² fiyatımız €100 ex. BTW'dir.";
            }
            if (isAlcipan) {
                return "Alçıpan bölme duvar yapımı işçilik m² fiyatı €42.50'dir. Levhalar ve profiller dahil malzemeli fiyatımız m² başına €65 ex. BTW'dir.";
            }
            if (isTesisat) {
                return "Su tesisatı ve kanalizasyon/riolering işlerinde, yerinde inceleme yapıp detaylı bir keşif raporu sunarak fiyatlandırıyoruz. Keşif randevusu almak için lütfen menüden 'Randevu Oluştur' seçeneğini kullanın.";
            }
            if (isPrice) {
                return "Fiyatlarımız net olup otopark ve yol masrafları dahil her şey dahil (excl. BTW) fiyatlardır. Ekstra veya sürpriz hiçbir masraf çıkarılmaz (Geen verrassingen achteraf!).";
            }
            if (isArea) {
                return "Merkezimiz Lelystad'da yer almaktadır. Lelystad, Almere, Amsterdam, Utrecht ve civarındaki 50-75 km çapındaki tüm bölgelere hizmet sunuyoruz. Yol ücreti almıyoruz.";
            }
            if (isGaranti) {
                return "Der-In infra olarak yaptığımız tüm işçilik ve tesisat işleri için teslim tarihinden itibaren 12 ay (1 Yıl) tam garanti veriyoruz.";
            }
            if (isContact) {
                return "Der-In infra İletişim Bilgileri:\n- Telefon: +31 6 18694652\n- E-posta: info@derininfra.nl\n- Konum: De Valk, 8239AE Lelystad\n- KVK Numarası: 89133226\n- BTW Numarası: NL004694216B91";
            }
            return "Size banyo/tuvalet tadilatı, alçıpan, riolering tesisatı, Lelystad ve çevresindeki hizmet bölgelerimiz, fiyatlar ve garantilerimiz hakkında detaylı bilgi verebilirim. Sorunuz nedir?";
        } 
        else if (lang === 'en') {
            if (isHermes) {
                return "Our Hermes Agent runs as an advanced AI assistant hosted securely on a Hostinger VPS. It allows İnan Abi to update the website and Facebook page via WhatsApp voice and photos, which are deployed instantly after Derya Abla's approval. It keeps the web server and business files completely separate and safe.";
            }
            if (isBanyo) {
                return "Bathroom renovation labor + rough materials starts from €4,000 for small areas (2 m²) and €6,000 for standard bathrooms (5-6 m²). Demolition and waste removal are fully included. A materials package adds +€2,500.";
            }
            if (isToilet) {
                return "A complete toilet renovation is €2,000 for labor + rough materials (dismantling and debris disposal included). If we supply all sanitaries and tiles (All-in package), the price is €3,000 ex. VAT.";
            }
            if (isFayans) {
                return "For large tiling works, labor is €47.50 per m². Tiling materials included is €100 per m² ex. VAT.";
            }
            if (isAlcipan) {
                return "Drywall wall installation is €42.50 per m² (labor). Materials included is €65 per m² ex. VAT.";
            }
            if (isTesisat) {
                return "For plumbing, drainage, and sewerage (riolering) works, we provide pricing after a site inspection. Please use 'Book Appointment' to schedule a free inspection.";
            }
            if (isPrice) {
                return "Our prices are listed ex. VAT (excl. BTW) but are strictly all-inclusive. Parking fees and travel charges are covered. We guarantee no surprises afterwards (Geen surprises afterwards!).";
            }
            if (isArea) {
                return "We are based in Lelystad and serve all areas within a 50 to 75 km radius, including Amsterdam, Almere, Utrecht, Purmerend, and Zaandam.";
            }
            if (isGaranti) {
                return "We offer a 12-month (1 Year) full warranty on all our labor, piping, and installation works from the completion date.";
            }
            if (isContact) {
                return "Der-In infra Contact Details:\n- Phone: +31 6 18694652\n- Email: info@derininfra.nl\n- Location: De Valk, 8239AE Lelystad\n- Chamber of Commerce (KVK): 89133226\n- VAT (BTW): NL004694216B91";
            }
            return "I can help you with bathroom/toilet renovations, tiling, drywall, sewerage, pricing details, and our service area around Lelystad. What is your question?";
        } 
        else { // Dutch default
            if (isHermes) {
                return "Onze Hermes Agent is een geavanceerde AI-assistent die veilig op een Hostinger VPS draait. Hiermee kan İnan Abi de website en Facebook-pagina bijwerken via WhatsApp-spraakberichten en foto's. Wijzigingen worden direct doorgevoerd na goedkeuring van Derya Abla.";
            }
            if (isBanyo) {
                return "Badkamerrenovatie arbeid + kaba materiaal begint vanaf € 4.000 voor kleine ruimtes (2 m²) en € 6.000 voor standaard badkamers (5-6 m²). Sloopwerk en afvalafvoer zijn volledig inbegrepen. Materialenpakket voegt +€ 2.500 toe.";
            }
            if (isToilet) {
                return "Een toiletrenovatie is € 2.000 voor arbeid + kaba materiaal (demontage en afvalafvoer inbegrepen). Als wij alle sanitair en tegels leveren (All-in pakket), is de prijs € 3.000 ex. BTW.";
            }
            if (isFayans) {
                return "Voor grote tegelwerken bedraagt de arbeid € 47.50 per m². Inclusief tegels is dit € 100 per m² ex. BTW.";
            }
            if (isAlcipan) {
                return "Gipsplaten scheidingswand montage is € 42.50 per m². Inclusief platen en metal-stud profielen is dit € 65 per m² ex. BTW.";
            }
            if (isTesisat) {
                return "Voor riolerings- en loodgieterswerkzaamheden maken we een prijsopgave na inspectie ter plaatse. Gebruik 'Afspraak Maken' om een gratis opmeting in te plannen.";
            }
            if (isPrice) {
                return "Onze prijzen zijn ex. BTW maar zijn all-in. Parkeerkosten en reiskosten zijn gedekt. Wij garanderen geen verrassingen achteraf (Geen verrassingen achteraf!).";
            }
            if (isArea) {
                return "Wij zijn gevestigd in Lelystad en bedienen alle regio's binnen een straal van 50 tot 75 km, inclusief Amsterdam, Almere, Utrecht, Purmerend en Zaandam.";
            }
            if (isGaranti) {
                return "Wij bieden een volledige garantie van 12 maanden (1 Jaar) op al onze werkzaamheden vanaf de opleverdatum.";
            }
            if (isContact) {
                return "Der-In infra Contactgegevens:\n- Telefoon: +31 6 18694652\n- E-mail: info@derininfra.nl\n- Adres: De Valk, 8239AE Lelystad\n- KVK-nummer: 89133226\n- BTW-nummer: NL004694216B91";
            }
            return "Ik kan u helpen met vragen over badkamer- en toiletrenovaties, tegelwerk, gipsplaat wanden, loodgieterswerk, prijzen en garanties rond Lelystad. Wat is uw vraag?";
        }
    }

    // ----------------------------------------------------------------
    // 8. Dynamic Portfolio Loader (Hermes integration via initGallery)
    // ----------------------------------------------------------------
    // Portfolio images are loaded dynamically and localized inside initGallery().

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
            "Het plafond schilderen.",
            "Voegwerk en afwerking.",
            "Afkitten met sanitair siliconenkit.",
            "Montage van nieuw toilet, wastafel en kraan.",
            "Montage van spiegel, toiletrolhouder, toiletborstelhouder ve overige accessoires.",
            "Controle op lekkages en correcte werking.",
            "Schoon opleveren van de ruimte."
        ],
        gipsplaat: [
            "Montage van metal-stud of houten frameprofielen.",
            "Aanbrengen van thermische en geluidsisolatie (steenwol/glaswol).",
            "Monteren van gipsplaten (wanden en/of plafonds).",
            "Glad afwerken van naden en schroefgaten (klaar voor stucwerk).",
            "Afvoeren van restafval.",
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
            "Lekkage-controle en draktesten.",
            "Schoon opleveren van de ruimte."
        ]
    };

    function showOfferte(data) {
        if (!offerteModal) return;

        const today = new Date();
        const dateStr = today.toLocaleDateString('nl-NL');
        if (offerteDate) offerteDate.textContent = dateStr;
        currentDateSpans.forEach(el => el.textContent = dateStr);

        const randomNum = Math.floor(1000 + Math.random() * 9000);
        if (offerteNumber) offerteNumber.textContent = `DI-${today.getFullYear()}-${randomNum}`;

        if (offerteClientName) offerteClientName.textContent = data.client_name || "-";
        if (offerteClientPhone) offerteClientPhone.textContent = data.client_phone || "-";
        if (offerteClientEmail) offerteClientEmail.textContent = data.client_email || "-";
        if (offerteClientLocation) offerteClientLocation.textContent = data.location || "-";

        const typeNames = {
            badkamer: "BADKAMERENOVATIE",
            toilet: "TOILETRENOVATIE",
            gipsplaat: "GIPSPLATEN WANDEN",
            fayans: "TEGELWERK",
            riolering: "RIOLERING & LOODGIETERSWERK"
        };
        const pType = data.project_type || "toilet";
        if (offerteProjectTitle) offerteProjectTitle.textContent = typeNames[pType] || pType.toUpperCase();

        if (offerteWorksList) {
            offerteWorksList.innerHTML = "";
            const works = worksTemplates[pType] || worksTemplates.toilet;
            works.forEach(w => {
                const li = document.createElement('li');
                li.textContent = w;
                offerteWorksList.appendChild(li);
            });
        }

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

        if (offertePriceVal) offertePriceVal.textContent = data.calculated_estimate || "Op aanvraag";

        offerteModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeOfferte() {
        if (offerteModal) offerteModal.classList.add('hidden');
        document.body.style.overflow = '';
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
                client_email: "info@derininfra.nl",
                location: "De Valk, 8239AE Lelystad",
                project_type: "toilet",
                material_preference: "zonder-materiaal",
                calculated_estimate: "€ 2.000,-"
            });
        });
    }

    window.__appJsLoaded = true;
});
