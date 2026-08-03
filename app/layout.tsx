import type { Metadata } from 'next';
import './globals.css';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'EduAI Academy | Industry Ready AI, Data Science & Full Stack Courses',
  description:
    'Upgrade your tech skills with EduAI Academy. Offering production-level courses in Artificial Intelligence, Data Science, Machine Learning, and Full Stack Web Development with live counseling and Google Sheets automated registration.',
  keywords: [
    'Artificial Intelligence Course',
    'Data Science Bootcamp',
    'Machine Learning Engineering',
    'Full Stack Web Development',
    'Online Education Platform',
    'EduAI Academy',
  ],
  authors: [{ name: 'EduAI Academy' }],
  openGraph: {
    title: 'EduAI Academy - Next-Gen Education Platform',
    description: 'Upgrade Your Skills with Industry Ready Courses in AI, Data Science, Machine Learning, and Development.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://app.snapserve.ai/api/widget/lead-capture.js"
          data-token="YOUR_TOKEN"
        ></script>
      </head>
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
