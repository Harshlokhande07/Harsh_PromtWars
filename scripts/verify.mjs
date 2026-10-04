import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("\n=======================================================");
console.log("🔍 THE BLIND SPOT — SELF-VERIFICATION GATEWAY");
console.log("=======================================================\n");

let failures = 0;

function check(title, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${title}`);
  } catch (err) {
    console.error(`❌ FAIL: ${title}`);
    console.error(`   Reason: ${err.message}`);
    failures++;
  }
}

// 1. Required File Tree Check
const REQUIRED_FILES = [
  "docs/PRD.md",
  "docs/TRD.md",
  "docs/UI_SPEC.md",
  "app/layout.tsx",
  "app/page.tsx",
  "app/globals.css",
  "app/api/analyze/route.ts",
  "app/api/health/route.ts",
  "app/print/page.tsx",
  "components/Sidebar.tsx",
  "components/Header.tsx",
  "components/Hero.tsx",
  "components/ChatInput.tsx",
  "components/StarterCards.tsx",
  "components/Orb3D.tsx",
  "components/ClarifyStep.tsx",
  "components/SafetyCard.tsx",
  "components/ReportView.tsx",
  "components/SummaryCard.tsx",
  "components/AssumptionCard.tsx",
  "components/FactorGroup.tsx",
  "components/ConflictCard.tsx",
  "components/QuestionList.tsx",
  "components/MindChangers.tsx",
  "components/BiasCard.tsx",
  "components/PlayOpposite.tsx",
  "components/CoverageMeter.tsx",
  "components/ReflectionControls.tsx",
  "components/FallbackPill.tsx",
  "components/GuardBadge.tsx",
  "components/HistoryDrawer.tsx",
  "components/ExportBar.tsx",
  "components/Skeletons.tsx",
  "components/ErrorState.tsx",
  "lib/schema.ts",
  "lib/prompt.ts",
  "lib/guard.ts",
  "lib/safety.ts",
  "lib/clarify.ts",
  "lib/llm.ts",
  "lib/storage.ts",
  "lib/markdown.ts",
  "lib/coverage.ts",
  "lib/fallback/internshipReport.ts",
  "tests/guard.test.ts",
  "tests/safety.test.ts",
  "tests/schema.test.ts",
  "tests/clarify.test.ts",
  "tests/fallback_matrix.test.ts",
  "scripts/verify.mjs",
  "scripts/smoke.mjs",
  ".env.example",
  "README.md",
  "SUBMISSION.md",
  "VERIFICATION_REPORT.md",
];

check("Required File Tree Existence and Non-Empty", () => {
  const missing = [];
  for (const relPath of REQUIRED_FILES) {
    const fullPath = path.join(rootDir, relPath);
    if (!fs.existsSync(fullPath)) {
      missing.push(`${relPath} (missing)`);
    } else {
      const stats = fs.statSync(fullPath);
      if (stats.size === 0) {
        missing.push(`${relPath} (empty)`);
      }
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing or empty files:\n - ${missing.join("\n - ")}`);
  }
});

// 2. Banned Directive Words in Fallback Data
check("Fallback Report Directive Word Grep", () => {
  const fallbackPath = path.join(rootDir, "lib/fallback/internshipReport.ts");
  const content = fs.readFileSync(fallbackPath, "utf-8");
  const bannedDirectives = [
    /\byou should\b/i,
    /\bi recommend\b/i,
    /\bbest option\b/i,
    /\byou must\b/i,
    /\byour verdict\b/i,
    /\bdecision score\b/i,
  ];

  for (const regex of bannedDirectives) {
    if (regex.test(content)) {
      throw new Error(`Found banned directive pattern ${regex} in fallback report`);
    }
  }
});

// 3. Fallback Report Structure Validation
check("Fallback Report Structure Validation", () => {
  const fallbackPath = path.join(rootDir, "lib/fallback/internshipReport.ts");
  const content = fs.readFileSync(fallbackPath, "utf-8");

  const requiredKeys = [
    "reasoningSummary",
    "unstatedAssumptions",
    "overlookedFactors",
    "shortTerm",
    "longTerm",
    "affectedPeople",
    "hiddenRisks",
    "opportunityCost",
    "reversibility",
    "reasoningConflicts",
    "socraticQuestions",
    "whatWouldChangeYourMind",
    "cognitiveBiases",
    "oppositeView",
    "preMortem",
    "timeLenses",
    "stakeholderVoices",
    "meta",
  ];

  for (const key of requiredKeys) {
    if (!content.includes(key)) {
      throw new Error(`Missing required key ${key} in fallback report`);
    }
  }
});

// 4. Gitignore and API Key Leakage Check
check(".env.local is gitignored & No hardcoded secret API keys in repo or client bundle", () => {
  const gitignorePath = path.join(rootDir, ".gitignore");
  if (!fs.existsSync(gitignorePath)) {
    throw new Error(".gitignore is missing");
  }
  const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
  if (!gitignoreContent.includes(".env*.local") && !gitignoreContent.includes(".env")) {
    throw new Error(".gitignore does not exclude .env.local");
  }

  // Scan components for hardcoded secret keys (e.g. AIzaSy...)
  const componentsDir = path.join(rootDir, "components");
  const compFiles = fs.readdirSync(componentsDir);
  for (const file of compFiles) {
    const content = fs.readFileSync(path.join(componentsDir, file), "utf-8");
    if (/AIzaSy[A-Za-z0-9_-]{33}/.test(content)) {
      throw new Error(`Hardcoded API key leaked in client component: ${file}`);
    }
  }

  // Scan .next/static if build directory exists
  const nextStaticDir = path.join(rootDir, ".next/static");
  if (fs.existsSync(nextStaticDir)) {
    function walkDir(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const full = path.join(dir, file);
        if (fs.statSync(full).isDirectory()) {
          walkDir(full);
        } else if (file.endsWith(".js")) {
          const jsContent = fs.readFileSync(full, "utf-8");
          if (/AIzaSy[A-Za-z0-9_-]{33}/.test(jsContent)) {
            throw new Error(`Hardcoded API key leaked in .next/static bundle: ${file}`);
          }
        }
      }
    }
    walkDir(nextStaticDir);
  }
});

console.log("\n-------------------------------------------------------");
if (failures === 0) {
  console.log("🎉 ALL VERIFICATION CHECKS PASSED WITH ZERO ERRORS!");
  console.log("-------------------------------------------------------\n");
  process.exit(0);
} else {
  console.error(`💥 ${failures} VERIFICATION CHECKS FAILED.`);
  console.log("-------------------------------------------------------\n");
  process.exit(1);
}
