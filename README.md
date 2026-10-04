# The Blind Spot

> **An AI thinking partner for tough decisions. It surfaces unstated assumptions, overlooked factors, internal contradictions, cognitive biases, and sharp socratic questions. It NEVER decides, scores, ranks, or gives a verdict.**

---

## 🌟 Vision & Key Principles

1. **Questions Over Answers**: We do not solve your dilemma or pick a winner. We sharpen your own reasoning.
2. **Grounded in Your Own Words**: Every implicit assumption and detected cognitive bias is linked to a verbatim quote from your input.
3. **Strict No-Verdict Guarantee**: Two layers of defense (System Prompt instructions + Server-side string parsing guard) neutralize directive advice and recommendation language.
4. **Never Crashes On Stage**: Demo-safe offline fallback automatically activates if network, rate limits, or keys fail.
5. **Private & Local**: No database, no accounts. All session history and interactive reflection cards persist in your browser's private `localStorage`.

---

## 🏗️ Architecture

```
Browser Client (Next.js 14 App Router + Tailwind CSS + LocalStorage)
   │
   │ POST /api/analyze { text, language: "en" | "hinglish", force? }
   ▼
Server Route Handler
   ├── 1. Request Validation (Zod, max 4000 chars)
   ├── 2. Pre-LLM Safety Guard (lib/safety.ts) ──> Return SafetyCard with 24/7 Crisis Helplines
   ├── 3. Pre-LLM Clarify Gate (lib/clarify.ts) ──> Return Clarify questions for sparse inputs
   ├── 4. AI Thinking Generation (lib/llm.ts, Google Gemini 2.5 Flash / 1.5 Flash)
   ├── 5. Zod Schema Verification (lib/schema.ts)
   ├── 6. Grounded Quote Verifier (lib/guard.ts)
   ├── 7. Directive & Verdict Guard (lib/guard.ts) ──> Scrub & neutralize directive phrases
   └── 8. Return Verified Blind Spot Report
         (Any failure in 4-7 gracefully serves high-quality Demo Fallback Report at HTTP 200)
```

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
npm install
```

### 2. Configure Environment (Optional for Live Mode)
Create `.env.local` based on `.env.example`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
LLM_MODEL=gemini-1.5-flash
LLM_TIMEOUT_MS=25000
```
*(Note: If no API key is provided, the app seamlessly runs in high-fidelity Demo Fallback Mode).*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the comprehensive unit test suite (guardrails, safety, schema, clarify, coverage):
```bash
npm test
```

Run the build & typecheck:
```bash
npm run build
npx tsc --noEmit
```

Run the automated self-verifier:
```bash
npm run verify
```

---

## 🚢 Deployment

### Vercel
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Netlify
```bash
npm i -g netlify-cli
netlify login
netlify init
netlify deploy --build --prod
```
