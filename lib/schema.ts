import { z } from "zod";

// Base Item for overlooked factors
export const ItemSchema = z.object({
  id: z.string(),
  factor: z.string(),
  probe: z.string(),
}).strict();
export type Item = z.infer<typeof ItemSchema>;

// Assumption with grounded verbatim quote
export const AssumptionSchema = z.object({
  id: z.string(),
  assumption: z.string(),
  groundedQuote: z.string(),
  whyItMatters: z.string(),
}).strict();
export type Assumption = z.infer<typeof AssumptionSchema>;

// Internal contradiction in reasoning
export const ConflictSchema = z.object({
  id: z.string(),
  statedPriority: z.string(),
  conflictingSignal: z.string(),
  tension: z.string(),
}).strict();
export type Conflict = z.infer<typeof ConflictSchema>;

// Cognitive bias grounded in user's text
export const BiasSchema = z.object({
  id: z.string(),
  name: z.string(),
  plainDefinition: z.string(),
  groundedQuote: z.string(),
  howItMayShowUp: z.string(),
}).strict();
export type Bias = z.infer<typeof BiasSchema>;

// Play the opposite steelman
export const OppositeViewSchema = z.object({
  title: z.string(),
  steelman: z.string(),
  questionsItRaises: z.array(z.string()),
}).strict();
export type OppositeView = z.infer<typeof OppositeViewSchema>;

// Pre-mortem
export const PreMortemSchema = z.object({
  scenario: z.string(),
  questions: z.array(z.string()),
}).strict();
export type PreMortem = z.infer<typeof PreMortemSchema>;

// Time lenses (questions only, never predictions)
export const TimeLensesSchema = z.object({
  tenDays: z.string(),
  tenMonths: z.string(),
  tenYears: z.string(),
}).strict();
export type TimeLenses = z.infer<typeof TimeLensesSchema>;

// Stakeholder voices as questions
export const StakeholderVoiceSchema = z.object({
  who: z.string(),
  theirConcernAsQuestion: z.string(),
}).strict();
export type StakeholderVoice = z.infer<typeof StakeholderVoiceSchema>;

// Guard transparency report
export const GuardReportSchema = z.object({
  scrubbed: z.number(),
  rules: z.array(z.string()),
}).strict();
export type GuardReport = z.infer<typeof GuardReportSchema>;

// Fallback Reason Enum
export const FallbackReasonSchema = z.enum([
  "no_key",
  "auth_error",
  "rate_limited",
  "timeout",
  "network",
  "bad_json",
  "schema_invalid",
  "guard_failed",
  "model_error",
  "forced_demo",
]);
export type FallbackReason = z.infer<typeof FallbackReasonSchema>;

// Meta
export const MetaSchema = z.object({
  mode: z.enum(["live", "fallback"]),
  language: z.enum(["en", "hinglish"]),
  guardReport: GuardReportSchema,
  fallbackReason: FallbackReasonSchema.optional(),
}).strict();
export type Meta = z.infer<typeof MetaSchema>;

// Overlooked factors grouped
export const OverlookedFactorsSchema = z.object({
  shortTerm: z.array(ItemSchema),
  longTerm: z.array(ItemSchema),
  affectedPeople: z.array(ItemSchema),
  hiddenRisks: z.array(ItemSchema),
  opportunityCost: z.array(ItemSchema),
  reversibility: z.array(ItemSchema),
}).strict();
export type OverlookedFactors = z.infer<typeof OverlookedFactorsSchema>;

// Complete Report Schema
export const ReportSchema = z.object({
  reasoningSummary: z.string(),
  unstatedAssumptions: z.array(AssumptionSchema),
  overlookedFactors: OverlookedFactorsSchema,
  reasoningConflicts: z.array(ConflictSchema),
  socraticQuestions: z.array(z.string()).min(4).max(10),
  whatWouldChangeYourMind: z.array(z.string()).min(2).max(6),
  cognitiveBiases: z.array(BiasSchema),
  oppositeView: OppositeViewSchema,
  preMortem: PreMortemSchema,
  timeLenses: TimeLensesSchema,
  stakeholderVoices: z.array(StakeholderVoiceSchema),
  meta: MetaSchema,
}).strict();
export type Report = z.infer<typeof ReportSchema>;

// Analyze Request Payload
export const AnalyzeRequestSchema = z.object({
  text: z.string().min(1).max(4000),
  language: z.enum(["en", "hinglish"]).default("en"),
  force: z.boolean().optional(),
}).strict();
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;

// Clarify Response
export const ClarifyResponseSchema = z.object({
  needsClarify: z.literal(true),
  questions: z.array(z.string()),
  reason: z.string(),
}).strict();
export type ClarifyResponse = z.infer<typeof ClarifyResponseSchema>;

// Helpline object
export const HelplineSchema = z.object({
  name: z.string(),
  contact: z.string(),
  tel: z.string().optional(),
  description: z.string(),
  url: z.string().optional(),
}).strict();
export type Helpline = z.infer<typeof HelplineSchema>;

// Safety Card Response
export const SafetyCardSchema = z.object({
  isSafetyTrigger: z.literal(true),
  category: z.enum(["self_harm", "medical", "legal", "abuse"]),
  message: z.string(),
  helplines: z.array(HelplineSchema),
}).strict();
export type SafetyCard = z.infer<typeof SafetyCardSchema>;

// Forbidden keys for schema check
export const FORBIDDEN_KEYS = [
  "verdict",
  "score",
  "rating",
  "rank",
  "recommendation",
  "bestOption",
  "winner",
  "decision",
  "advice",
] as const;
