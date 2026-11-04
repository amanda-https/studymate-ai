export interface SamplePrompt {
  label: string;
  query: string;
  subject?: string;
}

export const SAMPLE_PROMPTS: Record<string, SamplePrompt[]> = {
  ask: [
    { label: 'Newton’s 3 Laws', query: 'Can you explain Newton’s three laws of motion and provide a real-life example for each?', subject: 'Science' },
    { label: 'Photosynthesis', query: 'How does photosynthesis convert sunlight into chemical energy in plant cells?', subject: 'Biology' },
    { label: 'Recursion in Code', query: 'What is recursion in programming, how does the call stack work, and when should I use it?', subject: 'Computer Science' },
    { label: 'French Revolution', query: 'What were the main economic and social catalysts of the French Revolution?', subject: 'History' },
  ],
  explain: [
    { label: 'Quantum Computing', query: 'Quantum Computing' },
    { label: 'How the Internet Works', query: 'How the Internet Works' },
    { label: 'Inflation & Central Banks', query: 'Inflation and Interest Rates' },
    { label: 'Black Holes & Event Horizons', query: 'Black Holes' },
  ],
  quiz: [
    { label: 'Cell Biology', query: 'Cell structure, mitochondria, organelles, and cell division (Mitosis)' },
    { label: 'World War II Key Events', query: 'Major battles, timeline, and turning points of World War II' },
    { label: 'Python Fundamentals', query: 'Variables, loops, lists, dictionaries, and functions in Python' },
    { label: 'Basic Macroeconomics', query: 'Supply and demand, GDP, inflation, and monetary policy' },
  ],
  notes: [
    { label: 'Mendelian Genetics', query: 'Mendelian Genetics: alleles, dominant/recessive traits, Punnett squares' },
    { label: 'Calculus: Derivatives', query: 'Derivatives: power rule, product rule, chain rule, and rate of change' },
    { label: 'The Solar System', query: 'Planetary formation, terrestrial vs gas giants, and orbital mechanics' },
    { label: 'Machine Learning Basics', query: 'Supervised vs unsupervised learning, neural networks, and overfitting' },
  ],
};

export const SUBJECT_OPTIONS = [
  'General',
  'Science',
  'Math',
  'Computer Science',
  'History',
  'Literature',
  'Economics',
];
