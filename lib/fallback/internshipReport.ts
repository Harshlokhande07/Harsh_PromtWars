import { Report } from "../schema";

export const SAMPLE_INTERNSHIP_INPUT =
  "I have two internship offers: Offer A is at Google with great brand name, 80k stipend, but doing legacy migration. Offer B is at an early-stage AI startup with 40k stipend, where the founder promised I will build core agent systems with direct mentorship. My parents want me to take Google for my resume, but I want to actually learn bleeding-edge tech.";

export const INTERNSHIP_FALLBACK_REPORT: Report = {
  reasoningSummary:
    "You are weighing a high-stipend brand-name corporate internship with maintenance tasks against a lower-stipend early-stage startup role promising hands-on architecture and mentorship, while balancing family expectations of resume security with your personal drive for rapid skill acquisition.",
  unstatedAssumptions: [
    {
      id: "assump-1",
      assumption:
        "Assuming that working on legacy migration at a big tech company yields less long-term engineering growth than building from scratch at a startup.",
      groundedQuote: "Offer A is at Google with great brand name, 80k stipend, but doing legacy migration.",
      whyItMatters:
        "Large-scale distributed systems and enterprise testing cultures teach resilience at scale, whereas startup codebases teach speed and ambiguity.",
    },
    {
      id: "assump-2",
      assumption:
        "Assuming that the founder's promise of 1-on-1 mentorship and core system building will hold true under startup pressure.",
      groundedQuote: "where the founder promised I will build core agent systems with direct mentorship.",
      whyItMatters:
        "Founders often get pulled into fundraising, sales, or emergencies, which can compress the time available for dedicated mentorship.",
    },
    {
      id: "assump-3",
      assumption:
        "Assuming that parental desire for a recognized name is purely about status rather than risk mitigation.",
      groundedQuote: "My parents want me to take Google for my resume, but I want to actually learn bleeding-edge tech.",
      whyItMatters:
        "Understanding whether their concern is about market volatility or prestige helps clarify what reassurance they are actually seeking.",
    },
  ],
  overlookedFactors: {
    shortTerm: [
      {
        id: "st-1",
        factor: "Financial runway and daily friction",
        probe: "Does the 40k stipend difference impact your living conditions, mental bandwidth, or ability to focus during the internship?",
      },
      {
        id: "st-2",
        factor: "Peer intern cohort",
        probe: "What role does building a network of fellow interns play in your immediate learning environment?",
      },
    ],
    longTerm: [
      {
        id: "lt-1",
        factor: "Downstream recruiter filtering",
        probe: "How much does having a top-tier logo on your resume open initial doors for interviews compared to demonstrating a deployed AI project?",
      },
      {
        id: "lt-2",
        factor: "Full-time conversion likelihood (PPO)",
        probe: "What are the historical return offer conversion rates and headcount realities at both places right now?",
      },
    ],
    affectedPeople: [
      {
        id: "ap-1",
        factor: "Family trust and relationship dynamics",
        probe: "If you join the startup and it proves chaotic, how will discussions with your parents unfold?",
      },
      {
        id: "ap-2",
        factor: "Future collaborators and mentors",
        probe: "Who will write your reference letters or introduce you to your next opportunity in 2 years?",
      },
    ],
    hiddenRisks: [
      {
        id: "hr-1",
        factor: "Startup survival and scope pivot",
        probe: "If the startup pivots or runs low on runway midway through your term, what happens to the project you were promised?",
      },
      {
        id: "hr-2",
        factor: "Siloed corporate codebase access",
        probe: "Will proprietary internal tools at the large company translate to open-source ecosystem tools you want to master?",
      },
    ],
    opportunityCost: [
      {
        id: "oc-1",
        factor: "The value of internal mobility",
        probe: "Can an intern at the large company connect with internal AI research teams or switch projects once on the ground?",
      },
      {
        id: "oc-2",
        factor: "Public proof of work",
        probe: "Can your startup contributions be made public on GitHub, versus proprietary enterprise code that cannot leave the VPN?",
      },
    ],
    reversibility: [
      {
        id: "rev-1",
        factor: "Two-way door versus one-way door",
        probe: "Is it easier to transition from Big Tech to Startups later, or from an unknown Startup into Big Tech?",
      },
      {
        id: "rev-2",
        factor: "Stipend difference as an irreversible sunk cost",
        probe: "Is the 40k delta something you can recover in your first 3 months of full-time work, or is it needed now?",
      },
    ],
  },
  reasoningConflicts: [
    {
      id: "conf-1",
      statedPriority: "You prioritize learning bleeding-edge AI architecture.",
      conflictingSignal: "You are heavily weighing the brand recognition of a legacy migration role.",
      tension: "Is brand value being used as an emotional hedge against the uncertainty of startup learning?",
    },
    {
      id: "conf-2",
      statedPriority: "You want direct mentorship and fast feedback loops.",
      conflictingSignal: "You have not verified whether early-stage founders with urgent deadlines have consistent calendar time for intern coaching.",
      tension: "Mentorship is desired, but the structure required to deliver it reliably may be missing in an early-stage crunch.",
    },
  ],
  socraticQuestions: [
    "If neither company were allowed to go on your resume, which set of daily problems would you rather wake up and solve for 10 weeks?",
    "What specific evidence would prove to you that the startup founder has the pedagogical patience to mentor an intern?",
    "How might working on large-scale legacy migration change your understanding of how software systems survive in production?",
    "If your parents enthusiastically supported the startup, what doubts would still linger in your own mind?",
    "What is the single worst-case scenario for each option, and which one would you regret less?",
    "Can you build cutting-edge AI side-projects on weekends while collecting the larger stipend, or does the job need to be the source of learning?",
  ],
  whatWouldChangeYourMind: [
    "Discovering that the startup founder has previously mentored engineers who went on to lead major projects.",
    "Learning that the Big Tech team allows interns 20% exploration time with their applied AI lab.",
    "Finding out the startup currently has less than 4 months of cash runway.",
    "A direct conversation with a past intern from each team regarding their actual daily workload.",
  ],
  cognitiveBiases: [
    {
      id: "bias-1",
      name: "Halo Effect",
      plainDefinition: "Allowing an overall positive impression of a brand to color expectations of a specific, unrelated daily role.",
      groundedQuote: "Offer A is at Google with great brand name, 80k stipend, but doing legacy migration.",
      howItMayShowUp: "Assuming the day-to-day experience will feel prestigious even when the work is routine maintenance.",
    },
    {
      id: "bias-2",
      name: "Optimism Bias",
      plainDefinition: "Overestimating the likelihood of favorable outcomes while discounting operational risks.",
      groundedQuote: "where the founder promised I will build core agent systems with direct mentorship.",
      howItMayShowUp: "Taking an informal verbal promise as a guaranteed curriculum without considering startup fires.",
    },
  ],
  oppositeView: {
    title: "The Case for the Structured Enterprise Path",
    steelman:
      "A brand-name internship is not just a stamp of approval; it is an institutional credential that de-risks future hiring managers' evaluations for the next 5 years. Legacy migration at scale exposes an engineer to distributed system observability, backwards compatibility, and rigorous code reviews—disciplines rarely practiced in fast-and-loose startup MVPs. Furthermore, the financial margin of safety and predictable hours allow mental space to learn modern AI frameworks independently without startup burnout.",
    questionsItRaises: [
      "What if foundational software engineering discipline matters more in your early career than immediate domain hype?",
      "How much leverage does a recognized logo give you when negotiating full-time offers next year?",
    ],
  },
  preMortem: {
    scenario: "Imagine it is 12 months from today, and you feel the summer was a setback.",
    questions: [
      "If you chose the startup: did it pivot into manual ops, leaving you with incomplete code and no brand leverage?",
      "If you chose Big Tech: did you spend 10 weeks stuck in permissions and internal documentation without touching modern code?",
    ],
  },
  timeLenses: {
    tenDays: "Ten days in: Are you more anxious about reading a 10-year-old internal wiki, or about deploying unreviewed code directly to production?",
    tenMonths: "Ten months in: When interviewing for full-time roles, which story will sound more compelling and concrete to a technical interviewer?",
    tenYears: "Ten years in: Will your trajectory be defined by your first brand name, or by the problem-solving habits you built in your first year?",
  },
  stakeholderVoices: [
    {
      who: "Your Parents",
      theirConcernAsQuestion: "Will passing on a globally respected company create unnecessary friction when you seek stable employment?",
    },
    {
      who: "The Startup Founder",
      theirConcernAsQuestion: "Can this intern deliver production code independently when our runway demands speed over teaching?",
    },
    {
      who: "Your 30-Year-Old Future Self",
      theirConcernAsQuestion: "Did you choose based on genuine curiosity, or out of fear of what others might think?",
    },
  ],
  meta: {
    mode: "fallback",
    language: "en",
    guardReport: {
      scrubbed: 0,
      rules: [],
    },
  },
};
