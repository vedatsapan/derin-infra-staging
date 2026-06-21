# CLOUD AGENT HANDOFF: MEGA PROMPT FOR DER-IN INFRA WEBSITE RE-ENGINEERING

Copy and paste the entire prompt below into the new Cloud AI Agent session.

---

## START OF PROMPT

You are an expert full-stack developer and UI/UX designer tasked with re-engineering and completing the website for **Der-In infra**, a premium renovation, construction, and plumbing company based in Lelystad, Netherlands.

### 1. PROJECT CONTEXT & REAL BUSINESS DATA
* **Company Name:** Der-In infra (owned by İnan Kuruöz, managed by Derya Kuruöz)
* **Core Services:** Complete bathroom renovations (badkamerrenovatie), toilet renovations (toiletrenovatie), large-format tiling (tegelwerk), drywall/partition walls (gipsplaten / binnenwanden), and plumbing/drainage (loodgieterswerk & riolering).
* **Operating Region:** Lelystad, Almere, Amsterdam, Utrecht, Purmerend, Zaandam, and surroundings (up to 75 km radius).
* **Service Policies:** 
  - **"Geen verrassingen achteraf!"** (No surprises afterwards): The estimated price is final.
  - **No Travel or Parking Fees:** Voorrijkosten (travel fees) and parkeerkosten (parking) are €0 within the service area.
  - **12-Month (1 Year) Full Warranty:** Provided on all workmanship from the day of completion.
* **Official Registry & Financial Details (DO NOT USE PLACEHOLDERS):**
  - **KvK:** 89133226
  - **BTW:** NL004694216B91
  - **Address:** De Valk 14, 8239AE Lelystad
  - **Phone:** 0618694652
  - **Email:** inankuruoz@hotmail.com
  - **IBAN:** NL52 INGB 0101 4419 75 (I. Kuruoz)
* **Languages:** 100% fluent multilingual switching between **Dutch (NL)** (default), **English (EN)**, and **Turkish (TR)**. No mixed languages, no untranslated strings, no template leaks.

---

### 2. WHAT HAS BEEN BUILT SO FAR
The existing codebase is in the local folder `/Users/vedat/Desktop/der-in infra ` and deployed on GitHub Pages at: `https://vedatsapan.github.io/derin-infra-staging/` (Repository: `https://github.com/vedatsapan/derin-infra-staging`).
* `index.html` & `app.js` & `style.css`: Multi-language layout, premium dark-themed styling, interactive estimate calculator.
* **New Premium Logo:** A custom altıgen/house logo containing banyo (shower), alçıpan (drywall), and tesisat (piping) symbols, saved at `derin_infra_new_logo.png` and linked in the site.
* **Interactive Offerte Generator:** When the user calculates or submits a quote request, an overlay populates a formal contract-style PDF Offerte. Users can click "Afdrukken" to print a clean A4 sheet via browser print layout. A secondary button allows viewing a sample Toiletrenovatie document loaded from a real client template.
* `server.js`: Express server with a proxy `/api/chat` connecting widget chat directly to Google Gemini 1.5 Flash using `GEMINI_API_KEY`.
* `windows_local_guide.md` & `hostinger_guide.md`: Step-by-step server guides.
* `hermes_architecture.md`: Architecture code for the WhatsApp portfolio manager featuring an approval gate managed by Derya Abla.

---

### 3. YOUR MISSION: RE-ENGINEER FROM SCRATCH & MAKE IT AWESOME
Do not just copy the old website. Use it as a reference for details, text content, and back-end endpoints, but build a **significantly more advanced, visually stunning, and interactive web application**.

#### A) Next-Level UI/UX (Aesthetics & Layout)
* Use modern web design elements: glassmorphic sections, smooth gradients, custom typography (e.g. Google Fonts Outfit/Inter), scroll-driven reveals, hover micro-animations, and a responsive custom mobile menu.
* Build a premium **dark mode / luxury corporate** color scheme (deep navy, charcoal, silver, and gold/blue accents) representing high-end construction.

#### B) Portfolio Filters & Before/After Sliders
* Replace the static gallery with a dynamic grid with categories: **"All"**, **"Bathrooms"**, **"Toilets"**, **"Drywalls & Wands"**, **"Plumbing"**.
* Integrate **Interactive Before/After Image Sliders** where a user can slide a vertical divider across a photo to see the "Before" state on the left and the "After" state on the right.

#### C) Advanced Multi-Step Estimate Wizard
* Instead of a single long form, build a sleek **Multi-Step Questionnaire/Wizard**:
  - **Step 1:** Select Project Type (illustrated cards for Bathroom, Toilet, Tiling, Drywall, Plumbing).
  - **Step 2:** Input Dimensions (interactive slider/input for m², material package toggle).
  - **Step 3:** Additional details (description, photo upload placeholder).
  - **Step 4:** Contact details (Name, Phone, Email, Location).
  - **Step 5:** Final Screen: Shows calculated richtprijs, webhook status, and triggers the **Printable Offerte Modal**.

#### D) Direct Print/PDF Offerte
* Ensure the printed Offerte matches standard Dutch business communication layouts (Antetli kağıt). It must look like a real letterhead paper (white background, dark grey text, correct metadata tables) when printed via `window.print()`, hiding all header/footer/chat bubble elements.

#### E) Gemini Chatbot Integration
* Connect the front-end chat widget with the secure `/api/chat` proxy. Write fallback offline chatbot rules in `app.js` using the exact pricing formulas below in case the API key is not configured.

---

### 4. PRICING FORMULA SPECIFICATION
All base calculations must match the actual business pricing:
1. **Bathroom Renovation (Badkamerrenovatie):**
   - Base Price (labor & rough materials: glue, cement, piping, demolition & waste disposal included):
     - Area <= 2 m²: **€4,000 ex. BTW**
     - Area = 3 m²: **€4,500 ex. BTW**
     - Area = 4 m²: **€5,200 ex. BTW**
     - Area = 5-6 m²: **€6,000 ex. BTW**
     - Area > 6 m²: **€6,000 + (Area - 6) * €800 ex. BTW**
   - Optional materials package (decorative materials: tiles, faucets, toilet, tub supplied by Der-In): **+€2,500 fixed**
2. **Toilet Renovation (Toiletrenovatie):**
   - Base Price (labor + rough materials, demolition & waste included): **€2,000 ex. BTW**
   - With materials package (toilet bowl, built-in reservoir, tiles supplied by us): **€3,000 ex. BTW**
3. **Drywall Wands (Gipsplaten):**
   - Labor only: **€42.50 / m² ex. BTW**
   - Materials included: **€65 / m² ex. BTW**
4. **Tiling (Tegelwerk - Large format):**
   - Labor only: **€47.50 / m² ex. BTW**
   - Materials included: **€100 / m² ex. BTW**
5. **Plumbing (Riolering & Loodgieterswerk):**
   - Always display: **"Prijs op aanvraag"** (Price on request).

---

### 5. REAL PHOTO INTEGRATION: ORGANIZE 60+ SHANTIYE PHOTOS
In `/Users/vedat/Downloads/`, there are 60+ real project photos belonging to the company.
1. **Analyze and Classify:** Run a Python script in this workspace using image processing or file metadata (or your vision capabilities) to scan the Downloads folder.
2. **Categorization:** Group them into categories: `banyo` (bathroom), `toilet` (toilet), `gipsplaat` (drywall), `tesisat` (piping).
3. **Before/After Pairing:** Identify which photos represent "Before" (old, dirty, dismantled bathroom/toilet) and "After" (new, clean tiling, finished toilet/bathroom).
4. **Optimize Assets:** Select the best **12 to 16 photos** from these categories, compress them to web-friendly sizes (recommended: max width 1200px, WebP or optimized PNG/JPG, under 200KB each to maintain high LCP PageSpeed score), rename them logically (e.g. `project_bathroom_after_1.jpg`, `project_bathroom_before_1.jpg`), and copy them to the project assets.
5. **Enrich Gallery:** Populate the website portfolio gallery section using these real photos. Create description tags in NL, EN, and TR describing exactly what the image shows (e.g., "Modern asma klozet montajı", "İnloopdouche montajı", etc.).

---

### 6. HOW TO BEGIN
1. Inspect the existing repository files (`/Users/vedat/Desktop/der-in infra `) to load current text resources, paths, and translations.
2. Scan `/Users/vedat/Downloads/` for the real photos.
3. Write your implementation plan, obtain user approval, and execute the task.

Let's build a spectacular, high-performance, and feature-rich renovation portal!

## END OF PROMPT
