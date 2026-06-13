'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import GenFace from './components/GenFace';

/**
 * Landing page — Gensend's story. Heavy emphasis on showing the
 * product, not describing it. The hero auto-plays a scripted run of
 * a real campaign brief: you watch Gen take a prompt, scrape leads,
 * verify emails, and draft a personalised message. The Loop section
 * lets you click through the four stages of how the agent thinks.
 *
 * Sections, top to bottom:
 *   - Nav
 *   - Hero (with live streaming demo)
 *   - Trust strip
 *   - The Loop (tabbed interactive walkthrough of the four agent stages)
 *   - Old way vs new way (comparison)
 *   - Production grid (six capability cards)
 *   - Customer stories
 *   - Security / privacy
 *   - CTA banner
 *   - Footer
 */
export default function Landing() {
    const APP = 'https://app.gensend.ai';
    const [loginHref, setLoginHref] = useState(`${APP}/login`);
    const [signupHref, setSignupHref] = useState(`${APP}/register`);
    useEffect(() => {
        try {
            const t = window.localStorage.getItem('token');
            if (t) {
                setLoginHref(`${APP}/manager`);
                setSignupHref(`${APP}/manager`);
            }
        } catch {}
    }, []);

    return (
        <>
            <Nav loginHref={loginHref} signupHref={signupHref} />
            <Hero signupHref={signupHref} />
            <TrustStrip />
            <TheLoop signupHref={signupHref} />
            <OldWay />
            <ProductionGrid />
            <CustomerStories />
            <SecuritySection />
            <CtaBanner signupHref={signupHref} />
            <Footer signupHref={signupHref} />
        </>
    );
}

// ====================================================================
// NAV
// ====================================================================

function Nav({ loginHref, signupHref }: { loginHref: string; signupHref: string }) {
    return (
        <header className="m-nav">
            <div className="m-nav-inner">
                <Link href="/" className="m-nav-brand" aria-label="Gensend home" style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                    <GenFace size={36} />
                    <Image src="/images/logo-full.svg" alt="Gensend" width={108} height={28} priority />
                </Link>
                <nav className="m-nav-links">
                    <a href="#loop">How it works</a>
                    <a href="#features">Features</a>
                    <Link href="/pricing">Pricing</Link>
                    <Link href="/blog">Blog</Link>
                </nav>
                <div className="m-nav-cta">
                    <Link href={loginHref} className="m-btn-ghost">Login</Link>
                    <Link href={signupHref} className="m-btn-primary">Get Started</Link>
                </div>
            </div>
        </header>
    );
}

// ====================================================================
// HERO — interactive streaming demo
// ====================================================================

/**
 * A scripted run that plays automatically when the hero comes into
 * view. The user picks one of three preset briefs; we play out a
 * realistic-looking response (chat reply -> leads streaming in ->
 * email draft appearing). Restartable. Switching briefs cancels the
 * current run cleanly so timers don't pile up.
 */

type Lead = {
    company: string;
    name: string;
    title: string;
    email: string;
    verified: 'verified' | 'guessed' | 'pending';
};

type Script = {
    label: string;
    reply: string;
    leads: Lead[];
    email: { to: string; subject: string; body: string };
};

const SCRIPTS: Record<string, Script> = {
    'yc-ai': {
        label: 'find 20 founders of YC Spring 2026 AI infra companies',
        reply: "got it. routing to the YC directory scraper — your brief matches the Spring 2026 batch. filtering to AI infra subset, ~14 companies. enriching personal emails now via web search + pattern verification.",
        leads: [
            { company: 'Modal Labs',     name: 'Erik Bernhardsson',  title: 'Co-Founder', email: 'erik@modal.com',     verified: 'verified' },
            { company: 'Baseten',        name: 'Tuhin Srivastava',   title: 'CEO',        email: 'tuhin@baseten.co',   verified: 'verified' },
            { company: 'Replicate',      name: 'Ben Firshman',       title: 'Co-Founder', email: 'ben@replicate.com',  verified: 'verified' },
            { company: 'Together AI',    name: 'Vipul Ved Prakash',  title: 'CEO',        email: 'vipul@together.ai',  verified: 'guessed' },
            { company: 'Fireworks AI',   name: 'Lin Qiao',           title: 'CEO',        email: 'lin@fireworks.ai',   verified: 'verified' },
        ],
        email: {
            to: 'erik@modal.com',
            subject: "modal's snapshotting + a 6-tool outbound problem",
            body: "Hey Erik,\n\nSaw Modal shipped GPU snapshotting last week — the kind of infra most teams don't realise they need until they're juggling 300+ concurrent inference workers.\n\nWe built Gensend because we hit the same wall on outbound. Six tools to find, clean, send, and reply, each with its own bill. So we turned it into one agent. Same loop you described in your Bay Area ML talk, just for go-to-market instead of inference.\n\nWorth a 15-min call to see if it saves your team time?\n\nAdam",
        },
    },
    'uk-fintech': {
        label: 'find 30 CTOs at UK fintechs that raised seed in 2026',
        reply: "got it. pulling Crunchbase + Beauhurst signals for UK fintech seeds closed in 2026. matching CTO titles only, skipping the founder/CEO overlap. should land ~30 verified contacts in a couple minutes.",
        leads: [
            { company: 'Plenty Finance', name: 'Adina Berman',      title: 'CTO',        email: 'adina@plenty.finance', verified: 'verified' },
            { company: 'Lumen Pay',      name: 'Oliver Hart',       title: 'CTO',        email: 'oliver@lumen.pay',     verified: 'verified' },
            { company: 'Quorum',         name: 'Priya Anand',       title: 'CTO',        email: 'priya@quorum.uk',      verified: 'guessed' },
            { company: 'Sable',          name: 'Henrik Larsen',     title: 'CTO',        email: 'henrik@sable.io',      verified: 'verified' },
            { company: 'Aerial',         name: 'Thomas Greene',     title: 'CTO',        email: 'tom@aerial.bank',      verified: 'verified' },
        ],
        email: {
            to: 'adina@plenty.finance',
            subject: "plenty's £4m raise + outbound that doesn't burn engineering time",
            body: "Hey Adina,\n\nCongrats on the Mosaic-led round. Saw the engineering hiring plan in the post — building out the platform team while keeping the existing product moving usually means GTM gets the leftover hours.\n\nWe built Gensend so a 2-person team can run the outbound of a 10-person team. The whole loop — finding accounts, writing the email, sending, reply triage — handled by one agent. Cuts the tool-stack down to one bill.\n\nQuick call this week to see if it'd help while you scale?\n\nAdam",
        },
    },
    'b2b-saas': {
        label: 'find 15 marketing leaders at series A B2B SaaS in NYC',
        reply: "got it. running through Apollo + LinkedIn-derived signals for series A B2B SaaS, NYC HQ. filtering to VP+ marketing titles. enriching emails via personal-site / company-page sources.",
        leads: [
            { company: 'Layer',           name: 'Carla Reyes',       title: 'VP Marketing',     email: 'carla@layer.io',          verified: 'verified' },
            { company: 'Pulse Analytics', name: 'Marcus Wen',        title: 'Head of Growth',   email: 'marcus@pulseanalytics.co',verified: 'guessed' },
            { company: 'Shipline',        name: 'Janelle Park',      title: 'CMO',              email: 'janelle@shipline.app',    verified: 'verified' },
            { company: 'Cleo HQ',         name: 'Ravi Subramanian',  title: 'VP Marketing',     email: 'ravi@cleohq.com',         verified: 'verified' },
            { company: 'Stenway',         name: 'Holly Cartwright',  title: 'Head of Marketing',email: 'holly@stenway.com',       verified: 'verified' },
        ],
        email: {
            to: 'carla@layer.io',
            subject: "layer's NYC office + the marketing-org bandwidth gap",
            body: "Hey Carla,\n\nSaw Layer just signed the new SoHo office and shipped the data-residency feature in the same week. That's the kind of release pace that usually means marketing is permanently a quarter behind on demand-gen.\n\nWe built Gensend so the outbound loop doesn't have to compete for your team's time. Find accounts, write the email, send, triage — one agent, one bill. Sub-30-min weekly review and the rest runs.\n\nWorth 15 mins this week?\n\nAdam",
        },
    },
};

function Hero({ signupHref }: { signupHref: string }) {
    return (
        <section className="m-hero">
            <div className="m-hero-inner">
                <span className="m-pill"><span className="dot" /> Pay only when GenSend gets you a booked call or a sale</span>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <GenFace size={96} />
                </div>
                <h1>The Agent that finds<br />customers and emails them<br />for you.</h1>
                <p className="m-hero-sub">
                    Tell GenSend who to reach. It scrapes the lead list, writes the email,
                    sends it from a warmed mailbox, and replies to anyone who's interested.
                    Run cold outreach like Meta campaigns — set a target outcome and a bid,
                    pay only when it lands.
                </p>
                <div className="m-hero-cta">
                    <Link href={signupHref} className="m-btn-primary m-btn-lg">Try GenSend free</Link>
                    <div className="m-rating">
                        <span className="m-stars">★★★★★</span>
                        <span className="m-rating-text">Loved by AI founders</span>
                    </div>
                </div>
                <LiveDemo />
            </div>
        </section>
    );
}

function LiveDemo() {
    const briefKeys = Object.keys(SCRIPTS) as (keyof typeof SCRIPTS)[];
    const [briefKey, setBriefKey] = useState<keyof typeof SCRIPTS>('yc-ai');
    const script = SCRIPTS[briefKey];

    type Phase = 'idle' | 'typing' | 'thinking' | 'replying' | 'leads' | 'email' | 'done';
    const [phase, setPhase] = useState<Phase>('typing');
    const [typedBrief, setTypedBrief] = useState('');
    const [typedReply, setTypedReply] = useState('');
    const [visibleLeads, setVisibleLeads] = useState(0);
    const [typedEmail, setTypedEmail] = useState('');
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    // Clear all pending timers — needed when the user switches briefs
    // mid-stream so we don't have overlapping animations.
    const clearAll = () => {
        timers.current.forEach(clearTimeout);
        timers.current = [];
    };
    const schedule = (fn: () => void, ms: number) => {
        const id = setTimeout(fn, ms);
        timers.current.push(id);
    };

    // Reset + drive the animation whenever briefKey changes.
    useEffect(() => {
        clearAll();
        setTypedBrief('');
        setTypedReply('');
        setVisibleLeads(0);
        setTypedEmail('');
        setPhase('typing');

        const brief = script.label;
        const reply = script.reply;
        const email = script.email.body;

        // 1. Type the brief into the prompt input.
        const briefSpeed = 28;
        for (let i = 1; i <= brief.length; i++) {
            schedule(() => setTypedBrief(brief.slice(0, i)), i * briefSpeed);
        }
        const briefDoneAt = brief.length * briefSpeed + 400;

        // 2. Brief "thinking" pause, then Gen replies.
        schedule(() => setPhase('thinking'), briefDoneAt);
        const thinkPause = 700;
        const replyStart = briefDoneAt + thinkPause;
        schedule(() => setPhase('replying'), replyStart);
        const replySpeed = 14;
        for (let i = 1; i <= reply.length; i++) {
            schedule(() => setTypedReply(reply.slice(0, i)), replyStart + i * replySpeed);
        }
        const replyDoneAt = replyStart + reply.length * replySpeed + 400;

        // 3. Leads stream in one by one (table mounts here).
        schedule(() => setPhase('leads'), replyDoneAt);
        const leadStep = 420;
        for (let i = 1; i <= script.leads.length; i++) {
            schedule(() => setVisibleLeads(i), replyDoneAt + i * leadStep);
        }
        const leadsDoneAt = replyDoneAt + script.leads.length * leadStep + 600;

        // 4. Email draft types out next to the leads.
        schedule(() => setPhase('email'), leadsDoneAt);
        const emailSpeed = 9;
        for (let i = 1; i <= email.length; i++) {
            schedule(() => setTypedEmail(email.slice(0, i)), leadsDoneAt + i * emailSpeed);
        }
        const emailDoneAt = leadsDoneAt + email.length * emailSpeed + 600;

        schedule(() => setPhase('done'), emailDoneAt);
        return clearAll;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [briefKey]);

    const showReply = phase === 'replying' || phase === 'leads' || phase === 'email' || phase === 'done';
    const showThinking = phase === 'thinking';
    const showTable = phase === 'leads' || phase === 'email' || phase === 'done';
    const showEmail = phase === 'email' || phase === 'done';
    const briefStillTyping = typedBrief.length < script.label.length;

    return (
        <div className="m-demo">
            <div className="m-demo-suggestions">
                <span className="m-demo-suggestions-label">Try a brief:</span>
                {briefKeys.map((k) => (
                    <button
                        key={k}
                        type="button"
                        className={`m-demo-pill ${k === briefKey ? 'is-active' : ''}`}
                        onClick={() => setBriefKey(k)}
                    >
                        {SCRIPTS[k].label}
                    </button>
                ))}
            </div>
            <div className="m-demo-window">
                <div className="m-demo-chrome">
                    <span className="dot-r" />
                    <span className="dot-y" />
                    <span className="dot-g" />
                    <span className="m-demo-url">app.gensend.ai / new campaign</span>
                </div>
                <div className="m-demo-body">
                    <div className="m-demo-stage">
                        <div className="m-demo-chat">
                            <div className="m-chat-bubble">
                                <span className="m-chat-label">You</span>
                                <span className="m-chat-text">
                                    {typedBrief}
                                    {briefStillTyping && <span className="m-caret" />}
                                </span>
                            </div>
                            {(showReply || showThinking) && (
                                <div className="m-chat-bubble m-chat-bubble-ai">
                                    <span className="m-chat-label">Gen</span>
                                    {showThinking ? (
                                        <span className="m-typing"><span /><span /><span /></span>
                                    ) : (
                                        <span className="m-chat-text">
                                            {typedReply}
                                            {phase === 'replying' && typedReply.length < script.reply.length && (
                                                <span className="m-caret" />
                                            )}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {showTable && (
                            <div className="m-demo-side">
                                <div className="m-demo-table">
                                    <div className="m-demo-table-head">
                                        <span>#</span>
                                        <span>Company</span>
                                        <span>Contact</span>
                                        <span>Email</span>
                                    </div>
                                    {script.leads.map((lead, i) => {
                                        const visible = i < visibleLeads;
                                        return (
                                            <div
                                                key={lead.email}
                                                className={`m-demo-table-row ${visible ? 'is-visible' : ''}`}
                                            >
                                                <span className="m-demo-num">{i + 1}</span>
                                                <span className="m-demo-company">{lead.company}</span>
                                                <span className="m-demo-name">
                                                    <span className="m-demo-name-main">{lead.name}</span>
                                                    <span className="m-demo-title">{lead.title}</span>
                                                </span>
                                                <span className="m-demo-email">
                                                    <span className="m-demo-email-addr">{lead.email}</span>
                                                    {lead.verified === 'verified' && (
                                                        <span className="m-demo-tag m-demo-tag-ok">verified</span>
                                                    )}
                                                    {lead.verified === 'guessed' && (
                                                        <span className="m-demo-tag m-demo-tag-guess">guessed</span>
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {showEmail && (
                                    <div className="m-demo-email-card">
                                        <div className="m-demo-email-head">
                                            <span className="m-demo-email-label">Draft</span>
                                            <span className="m-demo-email-to">to {script.email.to}</span>
                                        </div>
                                        <div className="m-demo-email-subject">{script.email.subject}</div>
                                        <pre className="m-demo-email-body">
                                            {typedEmail}
                                            {typedEmail.length < script.email.body.length && <span className="m-caret" />}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ====================================================================
// TRUST STRIP
// ====================================================================

function TrustStrip() {
    const logos = ['Cignara', 'Outset', 'Flowjam', 'Stride', 'Atlas', 'Adella', 'Maquoketa', 'Akkari'];
    return (
        <section className="m-trust">
            <p className="m-trust-title">Loved by leading AI software companies.</p>
            <div className="m-trust-logos">
                {logos.map((l) => <span key={l} className="m-trust-logo">{l}</span>)}
            </div>
        </section>
    );
}

// ====================================================================
// THE LOOP — tabbed walkthrough of the four agent stages
// ====================================================================

/**
 * Click through the four stages of the agent. Each tab swaps the
 * visual on the right to show what that stage actually looks like
 * in the product. Auto-advances every ~5s; pauses if the user takes
 * over.
 */
function TheLoop({ signupHref }: { signupHref: string }) {
    type Stage = {
        key: string;
        badge: string;
        title: string;
        body: string;
        visual: ReactNode;
    };
    const stages: Stage[] = [
        {
            key: 'brief',
            badge: 'Brief',
            title: 'Tell Gen who to find',
            body: 'Plain English — "founders of YC P26 ai infra startups", "VPs of marketing at series A B2B SaaS in NYC". Gen routes the brief to the right data source: canonical directory, web crawler, internal Apollo, or your own customer list.',
            visual: (
                <div className="m-loop-visual m-loop-visual-chat">
                    <div className="m-chat-bubble">
                        <span className="m-chat-label">You</span>
                        find every CRO at a Series B SaaS that raised in Q1
                    </div>
                    <div className="m-chat-bubble m-chat-bubble-ai">
                        <span className="m-chat-label">Gen</span>
                        nice brief. routing to Apollo + Crunchbase. filtering to Series B, US/EU, CRO title only — should be ~80 matches.
                    </div>
                </div>
            ),
        },
        {
            key: 'find',
            badge: 'Find',
            title: 'Watch real leads stream in',
            body: 'Gen pulls from the source, validates every row against your ICP, and drops duplicates against past campaigns + your customer list automatically. Bad data and weak fits are dropped on the way in.',
            visual: (
                <div className="m-loop-visual m-loop-table">
                    <div className="m-demo-table-head">
                        <span>#</span><span>Company</span><span>Contact</span><span>Fit</span>
                    </div>
                    {[
                        { c: 'Tessera Bio',  n: 'Aria Chen',     t: 'CRO', s: 92 },
                        { c: 'Mosaic Cloud', n: 'Daniel Reyes',  t: 'CRO', s: 88 },
                        { c: 'Lumalink',     n: 'Sofia Karim',   t: 'CRO', s: 81 },
                        { c: 'Cumulus',      n: 'Henry Brooks',  t: 'CRO', s: 76 },
                    ].map((r, i) => (
                        <div key={i} className="m-demo-table-row is-visible">
                            <span className="m-demo-num">{i + 1}</span>
                            <span className="m-demo-company">{r.c}</span>
                            <span className="m-demo-name">
                                <span className="m-demo-name-main">{r.n}</span>
                                <span className="m-demo-title">{r.t}</span>
                            </span>
                            <span className="m-demo-email">
                                <span className={`m-fit ${r.s >= 85 ? 'is-strong' : r.s >= 70 ? 'is-mid' : 'is-weak'}`}>{r.s}</span>
                            </span>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            key: 'write',
            badge: 'Write',
            title: 'In your voice. Personal every time.',
            body: 'Every email pulls from your knowledge file plus a corpus of cold emails that converted, so the writing sounds like a senior operator wrote it. References specific signals — funding, hiring, product launches — not generic "I saw your LinkedIn".',
            visual: (
                <div className="m-loop-visual m-loop-email">
                    <div className="m-demo-email-head">
                        <span className="m-demo-email-label">Draft</span>
                        <span className="m-demo-email-to">to aria@tessera.bio</span>
                    </div>
                    <div className="m-demo-email-subject">tessera's manufacturing milestone + scaling RevOps</div>
                    <pre className="m-demo-email-body">{`Hey Aria,

Tessera hitting the 200k-cell-line milestone last month — congrats, that usually means the next quarter is sales-hiring chaos.

We built Gensend so a 2-person RevOps team can run the outbound of a 10-person one. One agent does find, write, send, triage. Replaces 5 tools.

15 mins this week to see the workflow?

Adam`}</pre>
                </div>
            ),
        },
        {
            key: 'send',
            badge: 'Send + reply',
            title: 'Send, throttle, triage replies',
            body: 'Multi-mailbox rotation with deliverability self-healing. When replies come in, Gen classifies intent — positive, not now, objection, referral — and queues the right follow-up. You only see what needs a human.',
            visual: (
                <div className="m-loop-visual m-loop-replies">
                    <div className="m-reply-row m-reply-positive">
                        <div className="m-reply-head">
                            <span className="m-reply-from">Aria Chen · Tessera Bio</span>
                            <span className="m-reply-tag m-reply-tag-pos">positive</span>
                        </div>
                        <div className="m-reply-text">"Worth a chat. Tuesday 2pm work?"</div>
                        <div className="m-reply-action">Gen booked the call. You'll get the calendar event.</div>
                    </div>
                    <div className="m-reply-row">
                        <div className="m-reply-head">
                            <span className="m-reply-from">Daniel Reyes · Mosaic Cloud</span>
                            <span className="m-reply-tag m-reply-tag-defer">not now</span>
                        </div>
                        <div className="m-reply-text">"Interesting but mid quarter. Hit me up in May."</div>
                        <div className="m-reply-action">Scheduled follow-up for May 5. Removed from active queue.</div>
                    </div>
                    <div className="m-reply-row">
                        <div className="m-reply-head">
                            <span className="m-reply-from">Sofia Karim · Lumalink</span>
                            <span className="m-reply-tag m-reply-tag-obj">objection</span>
                        </div>
                        <div className="m-reply-text">"Already using Apollo + Lemlist."</div>
                        <div className="m-reply-action">Drafted reply addressing the stack consolidation angle. Pending your approval.</div>
                    </div>
                </div>
            ),
        },
    ];

    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (paused) return;
        const id = setInterval(() => setActive((a) => (a + 1) % stages.length), 6500);
        return () => clearInterval(id);
    }, [paused, stages.length]);

    return (
        <section className="m-section" id="loop">
            <div className="m-section-head">
                <span className="m-section-num">[01]</span>
                <h2>One agent. Four jobs.</h2>
                <p>Click through the loop. Each stage is what Gen actually does — same UI as the live product.</p>
            </div>

            <div className="m-loop">
                <div className="m-loop-tabs">
                    {stages.map((s, i) => (
                        <button
                            key={s.key}
                            type="button"
                            onClick={() => { setActive(i); setPaused(true); }}
                            className={`m-loop-tab ${i === active ? 'is-active' : ''}`}
                        >
                            <span className="m-loop-tab-num">[0{i + 1}]</span>
                            <span className="m-loop-tab-badge">{s.badge}</span>
                            <span className="m-loop-tab-title">{s.title}</span>
                            <span className="m-loop-tab-body">{s.body}</span>
                        </button>
                    ))}
                </div>
                <div className="m-loop-stage">
                    {stages.map((s, i) => (
                        <div key={s.key} className={`m-loop-stage-panel ${i === active ? 'is-active' : ''}`}>
                            {s.visual}
                        </div>
                    ))}
                </div>
            </div>

            <div className="m-section-foot">
                <Link href={signupHref} className="m-btn-primary">Run your own brief</Link>
            </div>
        </section>
    );
}

// ====================================================================
// OLD WAY vs GENSEND — visual comparison
// ====================================================================

function OldWay() {
    const oldStack = [
        { name: 'Apollo',    role: 'find leads' },
        { name: 'Clay',      role: 'enrich' },
        { name: 'ChatGPT',   role: 'write copy' },
        { name: 'Instantly', role: 'send + warm' },
        { name: 'Reply.io',  role: 'sequence' },
        { name: 'Smartlead', role: 'rotate mailbox' },
        { name: 'Hunter',    role: 'verify' },
        { name: 'Notion',    role: 'track' },
    ];
    return (
        <section className="m-section m-section-features">
            <div className="m-section-head">
                <span className="m-section-num">[02]</span>
                <h2>One bill. Not eight.</h2>
                <p>The old cold email stack was a tab graveyard. Eight tools, eight bills, eight places data lives. Gensend replaces it.</p>
            </div>
            <div className="m-old">
                <div className="m-old-side">
                    <div className="m-old-label">Before</div>
                    <div className="m-old-stack">
                        {oldStack.map((t) => (
                            <div key={t.name} className="m-old-chip">
                                <span className="m-old-chip-name">{t.name}</span>
                                <span className="m-old-chip-role">{t.role}</span>
                            </div>
                        ))}
                    </div>
                    <div className="m-old-total">~$1,400/mo. 8 contracts. 4 hours/week of glue work.</div>
                </div>
                <div className="m-old-arrow">→</div>
                <div className="m-old-side m-old-side-after">
                    <div className="m-old-label">After</div>
                    <div className="m-old-stack m-old-stack-after">
                        <div className="m-old-gensend">
                            <Image src="/images/logo-full.svg" alt="Gensend" width={140} height={36} />
                            <span className="m-old-chip-role">find / write / send / reply</span>
                        </div>
                    </div>
                    <div className="m-old-total m-old-total-after">From $99/mo. One bill. 30 min/week of review.</div>
                </div>
            </div>
        </section>
    );
}

// ====================================================================
// 03 — PRODUCTION GRID
// ====================================================================

function ProductionGrid() {
    const caps = [
        { title: 'Deliverability self-healing', body: 'Per-mailbox warmup, throttling, and rotation based on bounce signals. We pause weak mailboxes before they hurt your domain.' },
        { title: 'Customer-list block', body: 'Upload your customers. We never cold-email anyone already on the list — across every campaign, automatically.' },
        { title: 'ICP distillation', body: 'Drop in your customer list. Gensend reads it, finds the real ICP patterns, and proposes lookalike campaigns you can launch in one click.' },
        { title: 'Reply triage', body: 'Every reply classified by intent — positive, not now, objection, referral. The right follow-up gets queued; you only see what needs a human.' },
        { title: 'Multi-mailbox', body: 'Round-robin across as many sending mailboxes as you connect. Per-campaign restrictions, per-row overrides, no daily-cap drama.' },
        { title: 'Persistent memory', body: 'Every campaign remembers preferences, every workspace remembers what worked. The brain compounds across runs.' },
    ];
    return (
        <section className="m-section m-section-dark" id="features">
            <div className="m-section-head">
                <span className="m-section-num">[03]</span>
                <h2>Built for production outbound.</h2>
                <p>Six things every serious cold email operation needs — and most tools skip.</p>
            </div>
            <div className="m-grid">
                {caps.map((c) => (
                    <div key={c.title} className="m-card">
                        <h3>{c.title}</h3>
                        <p>{c.body}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ====================================================================
// 04 — CUSTOMER STORIES
// ====================================================================

function CustomerStories() {
    const stories = [
        { brand: 'Flowjam', quote: 'Replaced our entire outbound stack. We were paying for Instantly, Apollo, and an agency. Gensend does all three for one bill.', who: 'Adam, Founder' },
        { brand: 'AI startup (NDA)', quote: "Booked four discovery calls in the first week with companies we'd been trying to crack for months. The reply rate is genuinely higher.", who: 'Head of Growth' },
        { brand: 'Solo operator', quote: 'I used to spend 6 hours a week writing cold emails. Now I spend 20 minutes reviewing what Gensend wrote and approving the sends.', who: 'Indie SaaS founder' },
    ];
    return (
        <section className="m-section" id="customers">
            <div className="m-section-head">
                <span className="m-section-num">[04]</span>
                <h2>Built by founders. Used by founders.</h2>
                <p>Gensend started because we couldn&apos;t find a cold email tool that thought about the problem like a human operator. So we built one.</p>
            </div>
            <div className="m-stories">
                {stories.map((s, i) => (
                    <div key={i} className="m-story">
                        <p className="m-story-quote">&ldquo;{s.quote}&rdquo;</p>
                        <div className="m-story-who">
                            <div className="m-story-avatar">{s.brand.slice(0, 1)}</div>
                            <div>
                                <div className="m-story-brand">{s.brand}</div>
                                <div className="m-story-name">{s.who}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ====================================================================
// 05 — SECURITY / PRIVACY
// ====================================================================

function SecuritySection() {
    const items = [
        { title: 'Your data, your account', body: 'Mailboxes connect via OAuth to your own Google or Outlook. We never see passwords. Disconnect any time — your sending continues from the providers you control.' },
        { title: 'Domain-safe by design', body: 'Per-mailbox warmup, send caps, and bounce-rate monitoring. Mailboxes that hurt your domain reputation get auto-paused before damage compounds.' },
        { title: 'Customer data isolation', body: 'Workspaces are tenant-isolated end-to-end. Your customer list and lead pipeline never leak between workspaces, even ones you own.' },
    ];
    return (
        <section className="m-section m-section-light" id="security">
            <div className="m-section-head">
                <span className="m-section-num">[05]</span>
                <h2>Built for serious outbound.</h2>
                <p>Sending real volume from real domains means infrastructure that protects your reputation, not just our metrics.</p>
            </div>
            <div className="m-security">
                {items.map((s) => (
                    <div key={s.title} className="m-security-item">
                        <h3>{s.title}</h3>
                        <p>{s.body}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

// ====================================================================
// CTA BANNER
// ====================================================================

function CtaBanner({ signupHref }: { signupHref: string }) {
    return (
        <section className="m-cta-banner">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
                <GenFace size={64} />
            </div>
            <h2>Get a sales team that<br />runs while you sleep.</h2>
            <p>Set a target. Set a bid. GenSend handles the rest. Only pay when it lands a booked call or sale.</p>
            <Link href={signupHref} className="m-btn-primary m-btn-lg">Try GenSend free</Link>
        </section>
    );
}

// ====================================================================
// FOOTER
// ====================================================================

function Footer({ signupHref }: { signupHref: string }) {
    return (
        <footer className="m-footer">
            <div className="m-footer-inner">
                <div className="m-footer-cols">
                    <div className="m-footer-brand">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <GenFace size={40} />
                            <Image
                                src="/images/logo-full.svg"
                                alt="Gensend"
                                width={108}
                                height={28}
                                style={{ filter: 'invert(1)' }}
                            />
                        </div>
                        <p className="m-footer-tag">The Agent that finds customers and emails them for you.</p>
                        <Link href={signupHref} className="m-btn-primary" style={{ marginTop: 14 }}>
                            Try GenSend free
                        </Link>
                    </div>
                    <div>
                        <div className="m-footer-h">Product</div>
                        <a href="#loop">How it works</a>
                        <a href="#features">Features</a>
                        <Link href="/pricing">Pricing</Link>
                    </div>
                    <div>
                        <div className="m-footer-h">Resources</div>
                        <Link href="/blog">Blog</Link>
                        <a href="#customers">Customer stories</a>
                        <a href="mailto:adam@gensend.ai">Talk to us</a>
                    </div>
                    <div>
                        <div className="m-footer-h">Company</div>
                        <a href="mailto:adam@gensend.ai">Contact</a>
                        <a href="https://app.gensend.ai/login">Login</a>
                    </div>
                </div>
                <div className="m-footer-watermark">GENSEND</div>
                <div className="m-footer-legal">
                    © {new Date().getFullYear()} Gensend.&nbsp;&nbsp;adam@gensend.ai
                </div>
            </div>
        </footer>
    );
}
