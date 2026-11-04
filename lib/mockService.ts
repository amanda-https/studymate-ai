import {
  AskAIResultData,
  SimpleExplanationData,
  QuizResultData,
  StudyNotesData,
  StudyMode,
} from '@/types';
import { fetchStudyChat } from '@/lib/api';

export async function generateStudyResponse(
  mode: StudyMode,
  prompt: string,
  options: {
    subject?: string;
    audienceLevel?: 'beginner' | 'everyday' | 'highschool';
    simulateError?: boolean;
  } = {}
): Promise<any> {
  return fetchStudyChat(mode, prompt, options);
}

function generateMockAskAI(topic: string, subject: string): AskAIResultData {
  return {
    topic,
    subject,
    directAnswer: `Here is a clear, academic breakdown of **${topic}**:\n\n` +
      `At its fundamental level, ${topic} represents a foundational concept in ${subject}. ` +
      `Understanding it requires breaking it down into its core principles, how it interacts with surrounding systems, ` +
      `and its practical real-world significance.\n\n` +
      `1. **Core Mechanism**: When analyzing ${topic}, the primary driving force is the systematic relationship between its constituent parts. ` +
      `Whether viewed theoretically or practically, each element builds upon established rules.\n\n` +
      `2. **Context & Relevance**: In modern academic and applied contexts, mastering ${topic} allows students and practitioners to solve complex analytical problems ` +
      `and draw parallels across adjacent disciplines.\n\n` +
      `3. **Common Pitfalls to Avoid**: Students often confuse the surface-level definitions with underlying causal mechanisms. ` +
      `Always test your understanding by explaining each step without relying on memorized jargon.`,
    keyTakeaways: [
      `Foundational principle: ${topic} forms a bedrock concept in ${subject}.`,
      `Always verify boundary conditions and practical constraints when applying this concept.`,
      `Synthesizing this with active practice problems ensures long-term cognitive retention.`,
    ],
    suggestedFollowUps: [
      `How does ${topic} compare to its closest alternative or opposite?`,
      `Can you give me a step-by-step mathematical or logical proof for this?`,
      `What are the most frequent exam questions asked about ${topic}?`,
    ],
  };
}

function generateMockSimpleExplanation(
  topic: string,
  level: 'beginner' | 'everyday' | 'highschool'
): SimpleExplanationData {
  const levelLabels = {
    beginner: '5-year-old',
    everyday: 'curious friend over coffee',
    highschool: 'high school student without prior jargon',
  };

  return {
    topic,
    audienceLevel: level,
    coreConcept: `Imagine ${topic} explained to a ${levelLabels[level]}: it's like a well-organized system where every piece has one simple job, and together they make magic happen without chaos.`,
    metaphor: {
      title: `The Busy City Kitchen Metaphor`,
      description: `Think of ${topic} like an ultra-busy pizzeria kitchen. If everyone tried to bake the dough, chop cheese, and deliver boxes at the same time, dinner would be ruined. Instead, each station receives an exact recipe, waits for their cue, and passes the tray to the next teammate smoothly. That is exactly how ${topic} operates!`,
    },
    stepByStep: [
      `Step 1: The Input — Raw ingredients or signals arrive at the starting gate.`,
      `Step 2: The Transformation — The core engine processes that input using straightforward rules.`,
      `Step 3: The Output — A clean, finished product is delivered, ready to be used by the rest of the world.`,
    ],
    takeaways: [
      `No confusing terminology needed: it's all about order and inputs/outputs.`,
      `Whenever you feel stuck, picture the kitchen conveyor belt!`,
      `Complex systems are just simple rules repeated reliably.`,
    ],
  };
}

function generateMockQuiz(topic: string): QuizResultData {
  return {
    topic,
    totalQuestions: 4,
    questions: [
      {
        id: 1,
        question: `What is the primary governing principle or primary objective of "${topic}"?`,
        options: [
          `To maximize random fluctuation without constraints`,
          `To provide a structured, repeatable framework for processing inputs`,
          `To eliminate all external variables permanently`,
          `To replace manual testing entirely with unverified guesswork`,
        ],
        correctAnswerIndex: 1,
        explanation: `Correct! ${topic} is structured around repeatable principles that organize processes and yield predictable, verifiable outcomes.`,
      },
      {
        id: 2,
        question: `When analyzing ${topic}, which of the following is considered a best practice?`,
        options: [
          `Skipping edge-case verification to speed up execution`,
          `Assuming theoretical values always match real-world friction exactly`,
          `Deconstructing the system into modular components for systematic evaluation`,
          `Ignoring conservation laws or baseline assumptions`,
        ],
        correctAnswerIndex: 2,
        explanation: `Breaking down ${topic} into smaller modular pieces allows clearer diagnostic verification and prevents cascading errors.`,
      },
      {
        id: 3,
        question: `Which factor most commonly leads to misinterpretations or errors when studying ${topic}?`,
        options: [
          `Conflating correlation with causation between interdependent components`,
          `Recording too many empirical observations`,
          `Using peer-reviewed reference materials`,
          `Testing hypotheses with controlled trials`,
        ],
        correctAnswerIndex: 0,
        explanation: `A classic cognitive trap in ${topic} is confusing two variables that move together as having a direct causal relationship.`,
      },
      {
        id: 4,
        question: `What is the most practical real-world outcome of mastering ${topic}?`,
        options: [
          `It only applies in isolated classroom simulations`,
          `It equips you with predictive models to make informed, data-driven decisions`,
          `It renders all subsequent study unnecessary`,
          `It prevents any future technological changes from affecting your workflow`,
        ],
        correctAnswerIndex: 1,
        explanation: `Mastery over ${topic} gives you reliable mental models and tools to accurately predict and optimize outcomes in practical applications.`,
      },
    ],
  };
}

function generateMockStudyNotes(topic: string, subject: string): StudyNotesData {
  return {
    topic,
    subject,
    executiveSummary: `${topic} is an essential unit of study in ${subject}. It explores how fundamental rules govern behavior, dynamic interactions, and systemic equilibria. This revision sheet condenses the critical points, formulas/heuristics, and pitfalls to guarantee peak exam readiness.`,
    keyConcepts: [
      {
        term: `Primary Axiom of ${topic}`,
        definition: `The fundamental baseline rule stating that balance is maintained unless an external perturbing factor is introduced.`,
      },
      {
        term: `Throughput & Efficiency`,
        definition: `The quantitative ratio comparing productive output against cumulative input resources.`,
      },
      {
        term: `Equilibrium State`,
        definition: `The steady operating condition where competing forces cancel each other out, ensuring operational stability.`,
      },
      {
        term: `Boundary Constraints`,
        definition: `The physical, mathematical, or logical limits beyond which standard formulas no longer hold true.`,
      },
    ],
    bulletPoints: [
      `Always state your known variables and initial conditions before jumping into calculations or arguments.`,
      `Keep track of units and dimensions: consistent dimensional analysis prevents over 60% of common exam errors.`,
      `Draw diagrams or system maps: visualizing the interactions in ${topic} clarifies flow and interdependencies.`,
      `Pay special attention to transition states—points where behavior abruptly changes (e.g., saturation, phase change, inflection).`,
    ],
    cheatSheet: [
      `Rule 1: Input Energy/Signal = Output + Dissipation (Conservation principle).`,
      `Key Heuristic: Double-check edge values (0, 1, and infinity).`,
      `Memory Acronym: O-V-E-R (Observe, Verify, Evaluate, Review).`,
      `Exam Tip: State definitions in the first sentence of your essay or response for full credit.`,
    ],
  };
}
