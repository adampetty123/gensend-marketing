import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

/**
 * gensend.ai marketing site. Standalone Next.js project, separate from
 * the product surface (app.gensend.ai). Owned solely by this repo so
 * marketing edits don't queue on app builds and vice versa.
 */

// F37 Zagma Serif Book — the original Webflow brand serif, self-hosted
// from /public/fonts. Loaded as a CSS variable so the rest of the
// stylesheet can reference it cleanly.
const serif = localFont({
    src: '../../public/fonts/F37ZagmaSerif-Book.ttf',
    variable: '--font-serif',
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
        <html lang="en" className={serif.variable}>
            <body>{children}</body>
        </html>
    );
}
