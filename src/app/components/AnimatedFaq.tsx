'use client';

import { useState } from 'react';

/**
 * Animated FAQ accordion, dark island within the light marketing page.
 *
 * Behavior matches the reference clip Adam shared:
 *   - All items live in a single tight stack by default.
 *   - On open: clicked item lifts out, a soft aurora gradient fades in
 *     behind its header, the answer reveals with a blur->sharp text
 *     transition, and sibling items push apart into separated cards.
 *   - On close: gradient fades out, answer collapses, siblings merge
 *     back into the tight stack.
 *
 * Pure CSS transitions (no framer-motion dep) using the grid-template-rows
 * 0fr -> 1fr trick for height auto-animate and the gap property for the
 * stack-to-separate motion. One spring-like cubic-bezier curve, applied
 * consistently so the whole thing feels coherent.
 */

type Item = { icon: 'sparkle' | 'pen' | 'compass' | 'people' | 'send'; q: string; a: string };

const ITEMS: Item[] = [
    {
        icon: 'sparkle',
        q: 'What does Gensend do?',
        a: 'Gensend runs agentic cold email end to end. We source the right leads, write personalized copy per recipient, send across warmed-up mailboxes, triage replies, and scale your spend against your bid per result. Pure SaaS, or done-for-you if you want us to operate it.',
    },
    {
        icon: 'pen',
        q: 'How is this different from Instantly or Smartlead?',
        a: 'Those are great sequencers. We are an operator. Sequencers move emails through a pipeline you built. Gensend builds the pipeline, runs it, watches results, and adjusts. The work humans usually do, the agent does.',
    },
    {
        icon: 'compass',
        q: 'How does a campaign actually run?',
        a: 'You tell the agent who to target and what a win looks like. It builds the ICP, sources leads, drafts the copy, gets your approval on a sample, then sends and scales while you sleep. You see results in the dashboard. You can change the bid per result anytime to dial how fast it grows.',
    },
    {
        icon: 'people',
        q: 'Who is this for?',
        a: 'Founders running outbound themselves, agencies running it for clients, and revenue teams who would rather watch the dashboard than build campaigns. If you value craft and clarity, we will get along just fine.',
    },
    {
        icon: 'send',
        q: 'How do we get started?',
        a: 'Sign up, plug in your website, the agent reads your business and proposes the first campaign in minutes. Free workspace forever for 1 campaign at 5 sends a day. Upgrade when you want it to scale.',
    },
];

export default function AnimatedFaq() {
    const [openIdx, setOpenIdx] = useState<number | null>(null);

    return (
        <section className="af-section">
            <div className="af-section-head">
                <span className="af-section-num">[02]</span>
                <h2>Common questions.</h2>
            </div>

            <div className={`af-list ${openIdx !== null ? 'af-list-open' : ''}`}>
                {ITEMS.map((it, i) => {
                    const isOpen = openIdx === i;
                    return (
                        <div
                            key={it.q}
                            className={`af-item ${isOpen ? 'af-item-open' : ''}`}
                            onClick={() => setOpenIdx(isOpen ? null : i)}
                        >
                            <div className="af-aurora" aria-hidden />

                            <button type="button" className="af-row" aria-expanded={isOpen}>
                                <span className="af-icon" aria-hidden>
                                    <Icon name={it.icon} />
                                </span>
                                <span className="af-q">{it.q}</span>
                                <span className="af-toggle">{isOpen ? <CloseGlyph /> : <PlusGlyph />}</span>
                            </button>

                            <div className="af-answer-wrap">
                                <div className="af-answer">
                                    <p>{it.a}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function PlusGlyph() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5v11M1.5 7h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

function CloseGlyph() {
    return (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 2.5l9 9M11.5 2.5l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
    );
}

function Icon({ name }: { name: Item['icon'] }) {
    switch (name) {
        case 'sparkle':
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                    <path d="M19 14.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                </svg>
            );
        case 'pen':
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M14 4l6 6-9 9H5v-6l9-9z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                    <path d="M13 5l6 6" stroke="currentColor" strokeWidth="1.4" />
                </svg>
            );
        case 'compass':
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
            );
        case 'people':
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.4" />
                    <circle cx="17" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    <path d="M14.5 19c0-2 1.6-3.6 4.5-3.6 1.3 0 2.5.4 3 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
            );
        case 'send':
            return (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M3 11.5l18-8-8 18-2.5-7.5L3 11.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                </svg>
            );
    }
}
