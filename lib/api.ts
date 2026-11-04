import {
  StudyMode,
  AskAIResultData,
  SimpleExplanationData,
  QuizResultData,
  StudyNotesData,
} from '@/types';

export interface StudyRequestOptions {
  subject?: string;
  audienceLevel?: 'beginner' | 'everyday' | 'highschool';
  simulateError?: boolean;
}

export type StudyModeResponseMap = {
  ask: AskAIResultData;
  explain: SimpleExplanationData;
  quiz: QuizResultData;
  notes: StudyNotesData;
};

/**
 * Client helper to call the server-side POST /api/chat route.
 * GEMINI_API_KEY is kept strictly on the server.
 */
export async function fetchStudyChat<M extends StudyMode>(
  mode: M,
  prompt: string,
  options: StudyRequestOptions = {}
): Promise<StudyModeResponseMap[M]> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode,
      prompt,
      subject: options.subject,
      audienceLevel: options.audienceLevel,
      simulateError: options.simulateError,
    }),
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    // Non-JSON response
  }

  if (!response.ok) {
    const errorMsg =
      data?.error || `Server request failed with status code ${response.status}.`;
    throw new Error(errorMsg);
  }

  return data as StudyModeResponseMap[M];
}

