export type StudyMode = 'ask' | 'explain' | 'quiz' | 'notes';

export type StatusState = 'idle' | 'loading' | 'success' | 'error';

export interface SubjectOption {
  id: string;
  label: string;
  iconName: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResultData {
  topic: string;
  questions: QuizQuestion[];
  totalQuestions: number;
}

export interface StudyNotesData {
  topic: string;
  subject: string;
  executiveSummary: string;
  keyConcepts: { term: string; definition: string }[];
  bulletPoints: string[];
  cheatSheet: string[];
}

export interface SimpleExplanationData {
  topic: string;
  audienceLevel: 'beginner' | 'everyday' | 'highschool';
  coreConcept: string;
  metaphor: {
    title: string;
    description: string;
  };
  stepByStep: string[];
  takeaways: string[];
}

export interface AskAIResultData {
  topic: string;
  subject: string;
  directAnswer: string;
  keyTakeaways: string[];
  suggestedFollowUps: string[];
}
