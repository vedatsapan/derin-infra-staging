// server.js - Production-ready backend for Der-In infra
// Usage: GEMINI_API_KEY=your_key node server.js
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8085;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Gemini System Instruction for the AI Chatbot
const SYSTEM_INSTRUCTION = `
You are the official AI assistant of Der-In infra (KVK: 89133226, BTW: NL004694216B91), a premium construction, renovation, and plumbing company owned by İnan Kuruöz and managed by Derya Kuruöz.
Your location is: De Valk 14, 8239AE Lelystad.
Phone / WhatsApp: +31 6 18694652.
Email: inankuruoz@hotmail.com.
IBAN: NL52 INGB 0101 4419 75 (I. Kuruoz).

Services & Pricing Structure:
- Badkamerrenovatie (Bathroom Renovation):
  * Sloop (demolition) & afval (waste disposal) are always included.
  * Base price (labor & rough materials only, e.g. glue, cement, pipes):
    - Small bathrooms (<= 2 m²): starting from €4,000 ex. BTW.
    - 3 m²: starting from €4,500 ex. BTW.
    - 4 m²: starting from €5,200 ex. BTW.
    - Standard bathrooms (5-6 m²): starting from €6,000 ex. BTW.
    - Large bathrooms (> 6 m²): €6,000 + €800 per extra m² ex. BTW.
  * If the client wants us to supply the decorative materials (tiles, toilets, faucets, shower cabinets), add a fixed €2,500 materials package fee. Otherwise, the client supplies their own sanitaries and tiles (Exclusief sanitair en tegels).
- Toiletrenovatie (Toilet Renovation):
  * Demolition & waste disposal included.
  * Labor & rough materials: €2,000 ex. BTW.
  * With materials package (All-in including toilet, reservoir, tiles): €3,000 ex. BTW.
- Tegelwerk (Tiling):
  * Large floor or wall tiling.
  * Labor only: €47.50 / m² ex. BTW.
  * Materials included (tiles, glue, grout): €100 / m² ex. BTW.
- Gipsplaat (Drywall & partition walls):
  * Metal-stud framing, drywall panels, insulation, smooth plastering.
  * Labor only: €42.50 / m² ex. BTW.
  * Materials included: €65 / m² ex. BTW.
- Riolering & Loodgieterswerk (Drainage, Sewerage & Plumbing):
  * Price on request (requires inspection).

Key Policies:
- "Geen verrassingen achteraf!" (No surprises afterwards): We guarantee that the price on the quotation is final. No unexpected extra charges.
- All-in travel and parking: There are no travel costs (voorrijkosten) or parking fees (parkeerkosten) within our service area.
- Service area: Lelystad and surroundings (50 to 75 km radius, including Amsterdam, Almere, Utrecht, Purmerend, Zaandam, etc.).
- Warranty: We offer a 12-month (1 Year) full warranty on all our workmanship from the day of completion.
- Spares/Materials: The client is responsible for purchasing the decorative items (sanitaries, tiles, faucets, furniture) unless they choose the materials-inclusive package.

Rules for response:
1. Always respond in the language the user is speaking (Dutch, English, or Turkish).
2. Keep your answers clear, professional, warm, and direct.
3. Help the user calculate a rough price based on our formulas, but remind them to fill out the form or contact us for a final quote.
4. Keep answers concise. Do not use markdown tags that might break in a simple chat bubble.
5. If the user asks about the Hermes Agent, explain that it is our automated system running on Hostinger VPS that helps İnan Abi update the website via WhatsApp, but only after Derya Abla approves.
`;

// Chat API Endpoint calling Google Gemini API directly
app.post('/api/chat', async (req, res) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('Error: GEMINI_API_KEY environment variable is not set.');
        return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
    }

    const { message, language } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message field is required.' });
    }

    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
        contents: [
            {
                role: 'user',
                parts: [{ text: message }]
            }
        ],
        systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION + `
Prefer to respond in the language: ${language || 'Dutch'}.` }]
        },
        generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7
        }
    };

    try {
        const geminiRes = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!geminiRes.ok) {
            const errorText = await geminiRes.text();
            throw new Error(`Gemini API returned ${geminiRes.status}: ${errorText}`);
        }

        const data = await geminiRes.json();
        let reply = '';
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
            reply = data.candidates[0].content.parts[0].text;
        } else {
            throw new Error('Unexpected response format from Gemini API');
        }

        res.json({ reply: reply.trim() });
    } catch (err) {
        console.error('Gemini Chat API Error:', err.message);
        res.status(500).json({ error: 'AI Assistant failed to generate a response. Please check server logs.' });
    }
});

// Fallback for HTML5 client-side routing
app.get('*any', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` Der-In infra Server is running on port ${PORT}`);
    console.log(` Serve static folder: ${__dirname}`);
    console.log(` Web chatbot endpoint: http://localhost:${PORT}/api/chat`);
    console.log(` Make sure to set GEMINI_API_KEY before calling chat API`);
    console.log(`==================================================`);
});
