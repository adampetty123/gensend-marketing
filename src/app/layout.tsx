import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';

/**
 * gensend.ai marketing site. Standalone Next.js project, separate from
 * the product surface (app.gensend.ai). Owned solely by this repo so
 * marketing edits don't queue on app builds and vice versa.
 */

const serif = Instrument_Serif({
    subsets: ['latin'],
    weight: ['400'],
    variable: '--font-serif',
    display: 'swap',
});

const sans = Inter({
    subsets: ['latin'],
    variable: '--font-sans',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Gensend - Agentic Cold Email',
    description:
        'Done-for-you cold email. Strategy, infrastructure, copy, and campaigns - so you can focus on building. Booking calls with your perfect customers, on autopilot.',
    metadataBase: new URL('https://www.gensend.ai'),
    openGraph: {
        title: 'Gensend - Agentic Cold Email',
        description:
            'Done-for-you cold email. Strategy, infrastructure, copy, and campaigns - so you can focus on building.',
        url: 'https://www.gensend.ai',
        siteName: 'Gensend',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Gensend - Agentic Cold Email',
        description: 'Done-for-you cold email.',
    },
    icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${serif.variable} ${sans.variable}`}>
            <body>{children}</body>
        </html>
    );
}
