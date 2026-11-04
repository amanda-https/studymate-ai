import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Maximum allowed input character limit to protect resources
const MAX_INPUT_LENGTH = 1500;

// Preferred model as requested, with fallback for resilience
const PRIMARY_MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
const FALLBACK_MODEL = 'gemini-2.5-flash';

const VALID_MODES = ['ask', 'explain', 'quiz', 'notes'] as const;
type StudyMode = (typeof VALID_MODES)[number];

const VALID_AUDIENCE_LEVELS = ['beginner', 'everyday', 'highschool'] as const;

// Structured JSON schemas for each study mode
const SCHEMAS = {
  ask: {
    type: 'object',
    properties: {
      topic: { type: 'string', description: 'The topic or question answered' },
      subject: { type: 'string', description: 'The academic subject area' },
      directAnswer: {
        type: 'string',
        description: 'Comprehensive, well-structured academic explanation with markdown formatting where appropriate',
      },
      keyTakeaways: {
        type: 'array',
        items: { type: 'string' },
        description: '3 to 4 core high-yield takeaway bullet points',
      },
      suggestedFollowUps: {
        type: 'array',
        items: { type: 'string' },
        description: '3 thoughtful questions for further exploration or deeper study',
      },
    },
    required: ['topic', 'subject', 'directAnswer', 'keyTakeaways', 'suggestedFollowUps'],
  },
  explain: {
    type: 'object',
    properties: {
      topic: { type: 'string', description: 'The concept or topic explained' },
      audienceLevel: {
        type: 'string',
        enum: ['beginner', 'everyday', 'highschool'],
        description: 'Target audience simplicity level',
      },
      coreConcept: {
        type: 'string',
        description: 'Core idea explained in 1-2 intuitive, jargon-free sentences',
      },
      metaphor: {
        type: 'object',
        properties: {
          title: { type: 'string', description: 'Memorable title for the metaphor or analogy' },
          description: {
            type: 'string',
            description: 'Vivid, relatable real-world comparison that demystifies the topic',
          },
        },
        required: ['title', 'description'],
      },
      stepByStep: {
        type: 'array',
        items: { type: 'string' },
        description: '3 to 4 sequential plain-language steps showing how the concept works',
      },
      takeaways: {
        type: 'array',
        items: { type: 'string' },
        description: '2 to 3 simple, memorable takeaway points',
      },
    },
    required: ['topic', 'audienceLevel', 'coreConcept', 'metaphor', 'stepByStep', 'takeaways'],
  },
  quiz: {
    type: 'object',
    properties: {
      topic: { type: 'string', description: 'The quiz topic' },
      totalQuestions: { type: 'integer', description: 'Total number of questions, exactly 4' },
      questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: '1-based question number (1, 2, 3, 4)' },
            question: { type: 'string', description: 'Multiple choice question testing active recall' },
            options: {
              type: 'array',
              items: { type: 'string' },
              description: 'Exactly 4 distinct, plausible answer choices',
            },
            correctAnswerIndex: {
              type: 'integer',
              description: '0-based index of the correct answer (0, 1, 2, or 3)',
            },
            explanation: {
              type: 'string',
              description: 'Clear educational explanation why the correct option is right',
            },
          },
          required: ['id', 'question', 'options', 'correctAnswerIndex', 'explanation'],
        },
      },
    },
    required: ['topic', 'totalQuestions', 'questions'],
  },
  notes: {
    type: 'object',
    properties: {
      topic: { type: 'string', description: 'The study revision topic' },
      subject: { type: 'string', description: 'The academic subject area' },
      executiveSummary: {
        type: 'string',
        description: 'Concise executive summary distilling the most vital concepts for exam review',
      },
      keyConcepts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            term: { type: 'string', description: 'Concept, term, or theorem name' },
            definition: { type: 'string', description: 'Clear, high-yield definition and significance' },
          },
          required: ['term', 'definition'],
        },
        description: '3 to 5 fundamental terms and definitions',
      },
      bulletPoints: {
        type: 'array',
        items: { type: 'string' },
        description: '4 to 6 high-yield revision bullet points or problem-solving tips',
      },
      cheatSheet: {
        type: 'array',
        items: { type: 'string' },
        description: '3 to 4 quick memory formulas, heuristics, acronyms, or exam tips',
      },
    },
    required: ['topic', 'subject', 'executiveSummary', 'keyConcepts', 'bulletPoints', 'cheatSheet'],
  },
};

function buildPrompt(
  mode: StudyMode,
  text: string,
  subject: string,
  audienceLevel: 'beginner' | 'everyday' | 'highschool'
): string {
  switch (mode) {
    case 'ask':
      return [
        `You are StudyMate AI, an expert academic tutor and university-level educator.`,
        `Subject Area: ${subject}`,
        `Topic / Question: "${text}"`,
        `Provide an accurate, detailed, and insightful breakdown of this concept in ${subject}.`,
        `Include clear direct explanations, foundational principles, practical context, key takeaways, and 3 suggested follow-up questions for deeper mastery.`,
      ].join('\n');

    case 'explain': {
      const audienceDescriptions: Record<string, string> = {
        beginner: 'a 5-year-old child (use delightful everyday metaphors, playful tone, zero technical jargon)',
        everyday: 'a curious friend over coffee (relatable, engaging, clear, conversational, without academic jargon)',
        highschool: 'a high school student with basic general literacy but no advanced domain jargon',
      };
      return [
        `You are StudyMate AI, an expert at explaining complex, intimidating concepts simply (ELI5 / Feynman Technique).`,
        `Topic: "${text}"`,
        `Audience Level: ${audienceLevel} (${audienceDescriptions[audienceLevel] || audienceDescriptions.everyday})`,
        `Explain this concept intuitively. Provide an ultra-clear core concept, a vivid real-world metaphor, step-by-step mechanics, and quick takeaways.`,
      ].join('\n');
    }

    case 'quiz':
      return [
        `You are StudyMate AI, an assessment specialist creating high-yield active recall quizzes.`,
        `Topic: "${text}"`,
        `Generate exactly 4 multiple-choice questions testing conceptual understanding and practical application.`,
        `For each question, provide 4 distinct choices, set totalQuestions to 4, specify the 0-based correctAnswerIndex (0, 1, 2, or 3), and provide an educational explanation.`,
      ].join('\n');

    case 'notes':
      return [
        `You are StudyMate AI, an elite academic note-maker and revision strategist.`,
        `Subject: ${subject}`,
        `Topic: "${text}"`,
        `Create a condensed, high-yield study sheet. Include an executive summary, critical key concepts with precise definitions, high-yield revision bullet points, and an exam cheat sheet with formulas, rules, or mnemonics.`,
      ].join('\n');
  }
}

function cleanAndParseJSON(rawText: string) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  }
  return JSON.parse(cleaned);
}

export async function POST(request: NextRequest) {
  // 1. Read GEMINI_API_KEY strictly on the server
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return NextResponse.json(
      {
        error:
          'GEMINI_API_KEY is not configured on the server. Please define GEMINI_API_KEY in your server environment variables or .env file.',
      },
      { status: 500 }
    );
  }

  // 2. Parse request payload
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON request payload.' },
      { status: 400 }
    );
  }

  const { mode, prompt, topic, subject, audienceLevel, simulateError } = body || {};

  // 3. Validate mode
  if (!mode || typeof mode !== 'string' || !VALID_MODES.includes(mode as StudyMode)) {
    return NextResponse.json(
      {
        error: `Invalid or missing mode '${mode}'. Supported modes are: ${VALID_MODES.join(', ')}.`,
      },
      { status: 400 }
    );
  }
  const validatedMode = mode as StudyMode;

  // 4. Validate and limit input length
  const rawInput = prompt ?? topic ?? '';
  if (typeof rawInput !== 'string') {
    return NextResponse.json(
      { error: 'Input prompt or topic must be a string.' },
      { status: 400 }
    );
  }

  const cleanText = rawInput.trim();
  if (!cleanText) {
    return NextResponse.json(
      { error: 'Prompt or topic cannot be empty. Please enter a subject or question.' },
      { status: 400 }
    );
  }

  if (cleanText.length > MAX_INPUT_LENGTH) {
    return NextResponse.json(
      {
        error: `Input length (${cleanText.length} characters) exceeds the maximum allowed limit of ${MAX_INPUT_LENGTH} characters.`,
      },
      { status: 400 }
    );
  }

  // 5. Handle simulated error toggle (for UI testing)
  if (simulateError === true || cleanText.toLowerCase().includes('simulate error')) {
    return NextResponse.json(
      {
        error:
          'StudyMate AI simulated processing error: Click "Try Again" to re-run your query.',
      },
      { status: 500 }
    );
  }

  // 6. Validate secondary parameters
  const resolvedSubject =
    typeof subject === 'string' && subject.trim() ? subject.trim() : 'General';

  const resolvedAudienceLevel: 'beginner' | 'everyday' | 'highschool' =
    audienceLevel && VALID_AUDIENCE_LEVELS.includes(audienceLevel)
      ? audienceLevel
      : 'everyday';

  // 7. Initialize GoogleGenAI SDK on the server
  const ai = new GoogleGenAI({ apiKey });

  const promptMessage = buildPrompt(
    validatedMode,
    cleanText,
    resolvedSubject,
    resolvedAudienceLevel
  );

  const schema = SCHEMAS[validatedMode];

  // 8. Invoke Gemini model with gemini-3.5-flash-lite (with fallback)
  try {
    let response;
    let modelUsed = PRIMARY_MODEL;

    try {
      response = await ai.models.generateContent({
        model: PRIMARY_MODEL,
        contents: promptMessage,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });
    } catch (primaryErr: any) {
      const errMsg = primaryErr?.message || String(primaryErr);
      const isModelUnavailable =
        errMsg.includes('404') ||
        errMsg.toLowerCase().includes('not found') ||
        errMsg.toLowerCase().includes('unsupported') ||
        errMsg.toLowerCase().includes('is not available');

      if (isModelUnavailable && PRIMARY_MODEL !== FALLBACK_MODEL) {
        console.warn(
          `[API /api/chat] Primary model ${PRIMARY_MODEL} unavailable. Retrying with fallback model ${FALLBACK_MODEL}.`
        );
        modelUsed = FALLBACK_MODEL;
        response = await ai.models.generateContent({
          model: FALLBACK_MODEL,
          contents: promptMessage,
          config: {
            responseMimeType: 'application/json',
            responseSchema: schema,
          },
        });
      } else {
        throw primaryErr;
      }
    }

    const responseText = response?.text;
    if (!responseText) {
      return NextResponse.json(
        { error: 'The AI model returned an empty response. Please try again.' },
        { status: 502 }
      );
    }

    const parsedData = cleanAndParseJSON(responseText);

    // Ensure topic and subject are populated if missing in response
    if (parsedData && typeof parsedData === 'object') {
      if (!parsedData.topic) parsedData.topic = cleanText;
      if (validatedMode === 'ask' || validatedMode === 'notes') {
        if (!parsedData.subject) parsedData.subject = resolvedSubject;
      }
    }

    return NextResponse.json(parsedData, {
      status: 200,
      headers: {
        'x-model-used': modelUsed,
      },
    });
  } catch (err: any) {
    console.error('[API /api/chat Error]:', err?.message || err);

    let clientErrorMessage = 'An error occurred while generating the study response.';
    const rawError = err?.message || '';

    if (rawError.includes('API_KEY_INVALID') || rawError.includes('invalid API key')) {
      clientErrorMessage = 'Invalid GEMINI_API_KEY. Please verify your server API key credentials.';
    } else if (rawError.includes('RESOURCE_EXHAUSTED') || rawError.includes('quota')) {
      clientErrorMessage = 'API rate limit or quota exceeded. Please wait a moment and try again.';
    } else if (rawError) {
      clientErrorMessage = rawError;
    }

    return NextResponse.json({ error: clientErrorMessage }, { status: 500 });
  }
}

