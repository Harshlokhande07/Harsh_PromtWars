# The Blind Spot

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.2.35-black?style=for-the-badge&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Google_Gemini-2.5_Flash-4285F4?style=for-the-badge&logo=google" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Tests-40%2F40_Passing-brightgreen?style=for-the-badge" alt="Vitest 40/40" />
  <img src="https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-purple?style=for-the-badge" alt="Accessibility WCAG AA" />
</p>

> **An unbiased AI thinking partner for high-stakes decisions. It surfaces unstated assumptions, cognitive biases, second-order blind spots, and sharp Socratic questions. It NEVER decides, scores, ranks, or gives a verdict.**

---

## 🌟 The Pitch & Core Vision

Whenever humans face difficult dilemmas—career changes, startup risks, or personal life choices—our thinking is easily trapped by cognitive biases (confirmation bias, FOMO, sunk cost). Traditional AI assistants often make matters worse by prescribing opinions (*"You should pick Option A"*), playing God without bearing consequences.

**The Blind Spot** flips the paradigm:
1. **Questions Over Answers:** It never picks a winner or tells you what to do. It sharpens your own judgment.
2. **Grounded In Your Own Words:** Every implicit assumption and detected cognitive bias is linked to a verbatim quote from your input.
3. **Strict Double-Layered No-Verdict Guarantee:** System prompt instructions + deterministic server-side regex scrubbers strip away all prescriptive language.
4. **Zero-Crash Resilience (Zero 5xx HTTP Guarantee):** If network, API key, or rate limits fail, a high-fidelity demo fallback report is served gracefully at HTTP 200.
5. **100% Client-Side Privacy:** No external databases, no telemetry, no tracking. All session histories and reflection notes are stored privately in browser `localStorage`.
6. **Accessible & Motion-Safe:** WCAG 2.1 AA compliant contrast ratios (≥ 4.5:1), ARIA live announcers, full keyboard accessibility, and `prefers-reduced-motion` support.

---

## ✨ Interactive Visual Experience

- **3D Luminous Decision Orb (`components/Orb3D.tsx`):**
  - **Dynamic 3D Mouse Tilt:** Real-time normalized cursor tracking (`translate3d`) reacting fluidly to user movement.
  - **Continuous Levitation & Breathing Halo:** Soft floating micro-animations layered with ambient purple glow.
  - **Specular Surface Glint:** Shimmering surface reflections bringing the decision orb to life.
- **Shimmering Typography (`components/Hero.tsx`):**
  - Iridescent multi-color gradient sweep over the personalized greeting badge (`Hello, Harsh ✨`).

---

## 🏗️ System Architecture & Data Flow

```
[User Input: Complex Decision Dilemma]
                 │
                 ▼
     [Frontend Validation (Zod)]
                 │
                 ▼
     [POST /api/analyze]
                 │
       ┌─────────┴──────────────────────┐
       ▼                                ▼
[Safety Check?] (Crisis detected)   [Clarify Check?] (Too brief/vague)
 ➔ Returns 24/7 Helplines Card       ➔ Returns Socratic Clarification Prompts
       │ (Passed)                       │ (Passed)
       └────────────────┬───────────────┘
                        ▼
            [Google Gemini Flash LLM]
      Structured Socratic Extraction via JSON schema
                        ▼
         [Zod Output Verification]
                        ▼
   [Server-side Guard (Scrub Directives/Verdicts)]
                        ▼
     [Quote Grounding Validator (Verify Quotes)]
                        │
       ┌────────────────┴───────────────┐
       │ (Success)                      │ (On Error/Rate-limit/No Key)
       ▼                                ▼
 [Verified Blind Spot Report]     [High-Fidelity Demo Fallback Report]
       │                                │
       └────────────────┬───────────────┘
                        ▼
     [Interactive Glass UI with Tabs, History & Export]
```

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Harshlokhande07/Harsh_PromtWars.git
cd theblind
npm install
```

### 2. Configure Environment (Optional for Live Mode)
Create `.env.local` based on `.env.example`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
LLM_MODEL=gemini-1.5-flash
LLM_TIMEOUT_MS=25000
```
*(Note: If no API key is provided, the app seamlessly runs in high-fidelity Demo Fallback Mode without throwing 5xx errors).*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification Suite

Our test suite guarantees zero regressions across safety, clarity, fallback behavior, schema validation, and accessibility:

| Command | Purpose | Result |
|---|---|:---:|
| `npm test` | Vitest test suite (10 suites, 40 tests) | **40 / 40 Passed** |
| `npx tsc --noEmit` | Strict TypeScript compilation check | **0 Errors** |
| `npm run lint` | Next.js core web vitals and ESLint code hygiene | **0 Warnings / 0 Errors** |
| `npm run build` | Full production Next.js compilation | **Build Ready** |
| `npm run smoke` | End-to-end API smoke tests against server | **Verified** |

---

## 🚢 Production Deployment

### Deploy with Vercel
```bash
npm i -g vercel
vercel --prod
```

### Deploy with Netlify
```bash
npm i -g netlify-cli
netlify deploy --build --prod
```

---

## 📄 License
MIT © 2026 Harsh Lokhande
