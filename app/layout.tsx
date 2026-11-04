import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudyMate AI — Your Intelligent Learning Companion',
  description: 'Master any topic with Ask AI, Explain Simply, Generate Quiz, and Structured Study Notes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
        <div className="relative min-h-screen flex flex-col justify-between">
          <main className="flex-1">{children}</main>
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
            <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>© {new Date().getFullYear()} StudyMate AI — Built for self-paced learners.</p>
              <div className="flex items-center gap-3 font-medium text-slate-600">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Ready (Offline Mock Engine)
                </span>
                <span>No sign-in required</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
