# UI SPEC — The Blind Spot

Goal: simple, calm, presentable. One main screen, progressive reveal. A judge should get it in 10 seconds.

## 1. Design tokens
| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAF8F5` | page background (warm off-white) |
| `--surface` | `#FFFFFF` | cards |
| `--ink` | `#1F2430` | main text |
| `--muted` | `#6B7280` | secondary text |
| `--primary` | `#4F46E5` | main buttons, focus |
| `--accent` | `#F59E0B` | blind-spot highlight, "Hadn't thought of this" |
| `--ok` | `#10B981` | "Already considered" |
| `--warn` | `#EF4444` | "Disagree", safety |
| `--border` | `#E5E7EB` | card borders |
Dark mode optional (nice-to-have), contrast >= 4.5:1.
Type: Inter (system fallback), headings 600, body 16px, line-height 1.6. Radius 16px cards, 12px buttons. Max content width 880px. Soft shadow `0 1px 3px rgba(0,0,0,.08)`.

## 2. Layout (top to bottom)
1. **Header**: logo/wordmark "The Blind Spot", tagline "I won't tell you what to do. I'll show you what you might be missing.", EN/Hinglish toggle, History button.
2. **Input panel**: large textarea (placeholder: "Describe your decision, your options, and why you're leaning the way you are..."), char counter, mic button, **Analyze** button (disabled when empty).
3. **Example starters**: 5 chips under the textarea (Internship, Career Switch, Taking a Loan, Startup vs Job, Relocation). One click fills the text.
4. **Clarify step** (conditional): friendly card, 2-3 questions with small inputs, buttons "Add details" and "Continue anyway".
5. **Loading**: skeleton cards (5 shimmering blocks) + `aria-live` text "Looking for blind spots...".
6. **Safety card** (conditional): soft red/blue background, calm text, helplines as tappable links, no analysis.
7. **Report view** (see section 3).
8. **Footer**: privacy note ("Stays in your browser"), Neutrality Badge.

## 3. Report view
Sticky top bar: **Coverage Meter** (progress bar + "6 of 18 reviewed"), **Export** (Copy Markdown, Print/PDF), mode pill, Neutrality Badge.
Sections in this order, each collapsible, with a counter:
1. **Your reasoning, as I understood it** (summary card, soft indigo background)
2. **Unstated assumptions** — card: assumption, quoted words in a highlighted blockquote, "why it matters", ReflectionControls
3. **Overlooked factors** — tabs/accordion: Short-term, Long-term, Affected People, Hidden Risks, Opportunity Cost, Reversibility. Item card: factor + probe + ReflectionControls
4. **Reasoning conflicts** — two-column card: "You said" vs "But also", tension line, ReflectionControls
5. **Questions to sit with** — numbered list 5-8
6. **What would change your mind** — 3-4 bullet triggers
7. **Possible biases** — cards: name, plain definition, quote proof, "how it may show up"
8. **Play the Opposite** — collapsed by default, amber border; steelman text + questions it raises
9. **Extras** (collapsed): Pre-mortem, Time Lenses (3 columns: 10 days / 10 months / 10 years), Stakeholder Voices
10. **Confidence Check**: before/after sliders (user's own data, with neutral caption "Your own rating, not an assessment")
11. **Add new info & re-run**: small textarea + button, shows "new vs earlier questions" diff

## 4. ReflectionControls (on every blind-spot card)
Three toggle buttons (segmented control): `Hadn't thought of this` (amber), `Already considered` (green), `Disagree` (red outline). Selected state = filled + check icon. Below: "Add a note" link expands a small textarea. Autosave to localStorage. Keyboard accessible, `aria-pressed`.

## 5. Coverage Meter
Horizontal bar with percentage and a per-section mini breakdown on hover/tap. Caption: "How much of this you've reflected on". At 100%: gentle message "You've looked at every angle I found. Nothing here is a verdict." No score, no grade.

## 6. States
| State | UI |
|---|---|
| Empty | Starters highlighted, helper text |
| Typing | counter, Analyze enabled |
| Clarify | Clarify card above the textarea |
| Loading | Skeleton + live text, Analyze disabled |
| Success | Report with scroll-to-top of report |
| Fallback | Subtle pill "Demo Fallback Mode" (grey, small) near the report title |
| Safety | SafetyCard only |
| Error (rare) | Friendly retry card; auto-falls back to demo report |

## 7. Reflection state flow
`unseen -> (hadn't thought | already considered | disagree) -> optional note`. A card can be re-marked anytime. Coverage counts any mark. History stores marks and notes per session.

## 8. Responsive
- 375px: single column, sticky meter condensed to a thin bar, chips horizontally scrollable, tabs become accordion.
- 768px: single column wider padding.
- 1280px: centered 880px column.
Tap targets >= 44px. No horizontal scroll.

## 9. Accessibility
Labels on all inputs, visible focus ring (primary), `aria-live="polite"` for loading and meter, reduced-motion support, headings in order, colour never the only signal (icons + text on marks).

## 10. Microcopy rules
Warm, curious, non-judgmental. Use "might", "what if", "have you considered". Never "you should", "best", "better", "score".

## 11. Print view (`/print`)
White background, single column, no buttons, section headings, reflection marks shown as text tags, page-break avoidance inside cards, footer "Generated by The Blind Spot - a thinking aid, not advice".
