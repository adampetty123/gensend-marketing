'use client';

import Link from 'next/link';
import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { SlotText } from 'slot-text/react';
import 'slot-text/style.css';
import useSWR from 'swr';
import GenFace from './components/GenFace';
import Logo from './components/Logo';

/**
 * gensend.ai homepage. Copy/positioning rebuilt per the CEO brief:
 *   - Sell "an agent that operates itself" vs "tools you operate".
 *   - Honest pricing everywhere: self-serve is Free $0 / Pro $20 per workspace
 *     (matches Stripe). Performance / "pay per result" is done-for-you only.
 *   - Strongest proof is the live "GenSend selling GenSend" self-campaign card,
 *     fed by a real, PII-stripped, flag-gated backend endpoint.
 *   - Every number real or it doesn't render. No invented case study/benchmark.
 *
 * Order: Hero -> Self-demo -> 4-stage loop -> Tool vs employee -> Pricing ->
 * Features -> Security -> FAQ -> Closing CTA. (Case study omitted until a real
 * customer funnel exists.)
 *
 * Motion (house standard): slot-text on every changing label; signature
 * count-up reveal on the self-demo stat card (first load only); custom easings.
 * All motion respects prefers-reduced-motion.
 */

const APP = 'https://app.gensend.ai';
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://backend.gensend.ai';
const SELF_DEMO_ON = process.env.NEXT_PUBLIC_SELF_CAMPAIGN_DEMO === 'true';

// ====================================================================
// hooks
// ====================================================================

function usePrefersReducedMotion(): boolean {
    const [reduced, setReduced] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduced(mq.matches);
        const on = () => setReduced(mq.matches);
        mq.addEventListener?.('change', on);
        return () => mq.removeEventListener?.('change', on);
    }, []);
    return reduced;
}

/** Count up 0 -> value over `duration` ms with an ease-out curve, after `delay`. */
function useCountUp(value: number, run: boolean, duration = 800, delay = 0): number {
    const reduced = usePrefersReducedMotion();
    const [n, setN] = useState(reduced ? value : 0);
    useEffect(() => {
        if (!run) return;
        if (reduced) { setN(value); return; }
        let raf = 0;
        let start = 0;
        let timeout = 0;
        const tick = (t: number) => {
            if (!start) start = t;
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
            setN(Math.round(eased * value));
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        timeout = window.setTimeout(() => { raf = requestAnimationFrame(tick); }, delay);
        return () => { cancelAnimationFrame(raf); clearTimeout(timeout); };
    }, [value, run, reduced, duration, delay]);
    return n;
}

function useInView<T extends HTMLElement>(threshold = 0.3): [React.RefObject<T | null>, boolean] {
    const ref = useRef<T>(null);
    const [seen, setSeen] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el || seen) return;
        const io = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } },
            { threshold },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [seen, threshold]);
    return [ref, seen];
}

// A button label that rolls between rest/hover/active states via slot-text.
function CtaLabel({ rest, hover, active }: { rest: string; hover?: string; active?: string }) {
    const [state, setState] = useState<'rest' | 'hover' | 'active'>('rest');
    const text = state === 'active' ? (active ?? rest) : state === 'hover' ? (hover ?? rest) : rest;
    return (
        <span
            onMouseEnter={() => setState('hover')}
            onMouseLeave={() => setState('rest')}
            onMouseDown={() => active && setState('active')}
            onMouseUp={() => setState('hover')}
        >
            <SlotText text={text} />
        </span>
    );
}

// ====================================================================
// page
// ====================================================================

export default function Landing() {
    const [signupHref, setSignupHref] = useState(`${APP}/register`);
    const [loginHref, setLoginHref] = useState(`${APP}/login`);
    useEffect(() => {
        try {
            if (window.localStorage.getItem('token')) {
                setSignupHref(`${APP}/manager`);
                setLoginHref(`${APP}/manager`);
            }
        } catch {}
    }, []);

    return (
        <>
            <Nav loginHref={loginHref} signupHref={signupHref} />
            <StickyBar signupHref={signupHref} />
            <Hero signupHref={signupHref} />
            <SelfCampaignDemo />
            <TheLoop signupHref={signupHref} />
            <ToolVsEmployee />
            <Pricing signupHref={signupHref} />
            <Features />
            <SecuritySection />
            <Faq />
            <ClosingCta signupHref={signupHref} />
            <Footer signupHref={signupHref} />
        </>
    );
}

// ====================================================================
// NAV + sticky bar
// ====================================================================

function Nav({ loginHref, signupHref }: { loginHref: string; signupHref: string }) {
    return (
        <header className="m-nav">
            <div className="m-nav-inner">
                <Link href="/" className="m-nav-brand" aria-label="GenSend home"><Logo size={36} /></Link>
                <nav className="m-nav-links">
                    <a href="#loop">How it works</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#features">Features</a>
                    <Link href="/blog">Blog</Link>
                </nav>
                <div className="m-nav-cta">
                    <Link href={loginHref} className="m-btn-ghost">Login</Link>
                    <Link href={signupHref} className="m-btn-primary"><CtaLabel rest="Start free" hover="Zero friction. Zero cost." /></Link>
                </div>
            </div>
        </header>
    );
}

// Sticky bar fades in once the hero is scrolled past (~80vh).
function StickyBar({ signupHref }: { signupHref: string }) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <div className={`m-stickybar ${show ? 'is-shown' : ''}`} aria-hidden={!show}>
            <div className="m-stickybar-inner">
                <Link href="/" className="m-nav-brand" aria-label="GenSend home"><Logo size={30} /></Link>
                <Link href={signupHref} className="m-btn-primary" tabIndex={show ? 0 : -1}>
                    <CtaLabel rest="Start free" hover="Zero friction. Zero cost." active="Opening…" />
                </Link>
            </div>
        </div>
    );
}

// ====================================================================
// HERO
// ====================================================================

function Hero({ signupHref }: { signupHref: string }) {
    return (
        <section className="m-hero">
            <div className="m-hero-inner">
                <span className="m-pill"><span className="dot" /> Start free · Pro is $20/mo per workspace</span>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                    <GenFace size={96} />
                </div>
                <h1>Your outbound team is now one agent.</h1>
                <p className="m-hero-sub">
                    Brief GenSend like a new SDR — &ldquo;book me calls with founders of YC S26 AI infra
                    startups.&rdquo; It finds the leads, writes in your voice, sends from warmed mailboxes,
                    and handles every reply. Start free; Pro is $20/mo per workspace.
                </p>
                <div className="m-hero-cta">
                    <Link href={signupHref} className="m-btn-primary m-btn-lg">
                        <CtaLabel rest="Start free" hover="Zero friction. Zero cost." active="Opening…" />
                    </Link>
                    <a href="#self-demo" className="m-hero-secondary">
                        Watch it sell itself, live ↓
                        <span className="m-hero-secondary-sub">Free to start. No card. Connect a mailbox in 2 minutes.</span>
                    </a>
                </div>
                <HeroDemo />
            </div>
        </section>
    );
}

// Scripted product run — illustrative UI, not a customer claim (no numbers).
function HeroDemo() {
    const reduced = usePrefersReducedMotion();
    const script = {
        brief: 'book me calls with founders of YC S26 AI infra startups',
        reply: "on it. routing to the YC S26 directory, filtering to AI infra. enriching founder emails via web search + pattern verification, then drafting in your voice.",
        leads: [
            { c: 'Modal Labs', n: 'E. Bernhardsson', t: 'Co-Founder', v: 'verified' },
            { c: 'Baseten', n: 'T. Srivastava', t: 'CEO', v: 'verified' },
            { c: 'Replicate', n: 'B. Firshman', t: 'Co-Founder', v: 'verified' },
            { c: 'Fireworks AI', n: 'L. Qiao', t: 'CEO', v: 'guessed' },
        ],
    };
    const [typedBrief, setTypedBrief] = useState(reduced ? script.brief : '');
    const [phase, setPhase] = useState<'idle' | 'reply' | 'leads'>(reduced ? 'leads' : 'idle');
    const [shownLeads, setShownLeads] = useState(reduced ? script.leads.length : 0);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        if (reduced) return;
        const t = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };
        for (let i = 1; i <= script.brief.length; i++) t(() => setTypedBrief(script.brief.slice(0, i)), i * 26);
        const afterBrief = script.brief.length * 26 + 500;
        t(() => setPhase('reply'), afterBrief);
        t(() => setPhase('leads'), afterBrief + 1400);
        for (let i = 1; i <= script.leads.length; i++) t(() => setShownLeads(i), afterBrief + 1400 + i * 360);
        return () => { timers.current.forEach(clearTimeout); timers.current = []; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reduced]);

    return (
        <div className="m-demo">
            <div className="m-demo-window">
                <div className="m-demo-chrome">
                    <span className="dot-r" /><span className="dot-y" /><span className="dot-g" />
                    <span className="m-demo-url">app.gensend.ai / new campaign</span>
                </div>
                <div className="m-demo-body">
                    <div className="m-demo-chat">
                        <div className="m-chat-bubble">
                            <span className="m-chat-label">You</span>
                            <span className="m-chat-text">{typedBrief}{typedBrief.length < script.brief.length && <span className="m-caret" />}</span>
                        </div>
                        {phase !== 'idle' && (
                            <div className="m-chat-bubble m-chat-bubble-ai">
                                <span className="m-chat-label">GenSend</span>
                                <span className="m-chat-text">{script.reply}</span>
                            </div>
                        )}
                    </div>
                    {phase === 'leads' && (
                        <div className="m-demo-table">
                            <div className="m-demo-table-head"><span>#</span><span>Company</span><span>Contact</span><span>Email</span></div>
                            {script.leads.map((l, i) => (
                                <div key={l.c} className={`m-demo-table-row ${i < shownLeads ? 'is-visible' : ''}`}>
                                    <span className="m-demo-num">{i + 1}</span>
                                    <span className="m-demo-company">{l.c}</span>
                                    <span className="m-demo-name"><span className="m-demo-name-main">{l.n}</span><span className="m-demo-title">{l.t}</span></span>
                                    <span className="m-demo-email">
                                        <span className={`m-demo-tag ${l.v === 'verified' ? 'm-demo-tag-ok' : 'm-demo-tag-guess'}`}>{l.v}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ====================================================================
// 01 — SELF-CAMPAIGN DEMO  (the proof)
// ====================================================================

type SelfStats = { leads_briefed: number | null; emails_sent: number | null; replies_total: number | null; calls_booked: number | null };
type SelfExample = { brief: string; wrote: string; highlight: string; triaged_reply: string; triaged_class: string; triaged_action: string };
type SelfResp = { status: 'ok' | 'unavailable'; campaign_live: boolean; stats?: SelfStats; data_age_seconds?: number | null; examples?: SelfExample[] };

const fetcher = (url: string) => fetch(url).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); });

function relativeTime(seconds?: number | null): string {
    if (seconds == null) return '';
    if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))}m ago`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)}h ago`;
    const d = new Date(Date.now() - seconds * 1000);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function SelfCampaignDemo() {
    // SWR only runs when the feature flag is on AND we have a live endpoint.
    const { data, error, isLoading } = useSWR<SelfResp>(
        SELF_DEMO_ON ? `${API_BASE}/api/public/self-campaign-stats` : null,
        fetcher,
        { refreshInterval: 60000, revalidateOnFocus: false, shouldRetryOnError: false },
    );

    const live = SELF_DEMO_ON && data?.status === 'ok' && data?.campaign_live === true && !!data?.stats;
    const stale = live && (data?.data_age_seconds ?? 0) > 604800;

    return (
        <section className="m-section" id="self-demo">
            <div className="m-section-head">
                <span className="m-section-num">[01]</span>
                <h2>{live ? 'Right now, GenSend is selling GenSend.' : 'We run our own outbound on GenSend.'}</h2>
                <p>We run our own outbound on the exact product you&apos;d use. Here&apos;s our self-campaign, live from our dashboard.</p>
            </div>

            {!SELF_DEMO_ON ? (
                <SelfStaticCard />
            ) : isLoading ? (
                <SelfSkeleton />
            ) : error || !live ? (
                <SelfFallback />
            ) : (
                <SelfLiveCard data={data!} stale={!!stale} />
            )}
        </section>
    );
}

// Pre-live (flag off): honest static framing, no numbers.
function SelfStaticCard() {
    return (
        <div className="m-self-card">
            <p className="m-self-static">
                We run GenSend&apos;s own outbound on GenSend — same agent, same dashboard you get, no demo
                environment. Live numbers from our self-campaign appear here the moment it&apos;s producing results.
            </p>
            <p className="m-self-caption">Same agent, same dashboard you get. No demo environment.</p>
        </div>
    );
}

function SelfSkeleton() {
    return (
        <div className="m-self-card">
            <div className="m-self-stats">
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="m-self-stat">
                        <span className="m-self-stat-value m-skeleton">&nbsp;</span>
                        <span className="m-self-stat-label m-skeleton-sm">&nbsp;</span>
                    </div>
                ))}
            </div>
            <p className="m-self-caption"><SlotText text="Loading our latest run…" /></p>
        </div>
    );
}

function SelfFallback() {
    return (
        <div className="m-self-card">
            <p className="m-self-static">Our self-campaign data is between runs — refresh shortly.</p>
        </div>
    );
}

function SelfLiveCard({ data, stale }: { data: SelfResp; stale: boolean }) {
    const s = data.stats!;
    const [ref, inView] = useInView<HTMLDivElement>(0.4);
    const examples = (data.examples ?? []).slice(0, 3);
    const [expanded, setExpanded] = useState(false);

    const caption = stale
        ? 'from our last completed run.'
        : `Updated ${relativeTime(data.data_age_seconds)} · same agent, same dashboard you get. No demo environment.`;

    return (
        <>
            <div className={`m-self-card m-self-card-reveal ${inView ? 'is-revealed' : ''}`} ref={ref}>
                <div className="m-self-stats">
                    <Stat label="Founders briefed" value={s.leads_briefed} run={inView} delay={0} />
                    <Stat label="Emails sent" value={s.emails_sent} run={inView} delay={60} />
                    <Stat label="Replies" value={s.replies_total} run={inView} delay={120} />
                    <Stat label="Calls booked" value={s.calls_booked} run={inView} delay={180} />
                </div>
                <p className="m-self-caption"><SlotText text={caption} /></p>
            </div>

            {examples.length > 0 && (
                <div className="m-self-expand">
                    <button type="button" className="m-btn-ghost" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
                        <SlotText text={expanded ? 'Hide examples ↑' : 'Watch it work ↓'} />
                    </button>
                    <div className={`m-self-examples ${expanded ? 'is-open' : ''}`}>
                        <div className="m-self-examples-inner">
                            {examples.map((ex, i) => <ExampleCard key={i} ex={ex} />)}
                            <p className="m-self-footnote">These are real emails from our own campaign, recipient details removed.</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function Stat({ label, value, run, delay }: { label: string; value: number | null; run: boolean; delay: number }) {
    const n = useCountUp(value ?? 0, run && value != null, 800, delay);
    return (
        <div className="m-self-stat" style={{ transitionDelay: `${delay}ms` }}>
            <span className="m-self-stat-value">{value == null ? '—' : n.toLocaleString()}</span>
            <span className="m-self-stat-label">{label}</span>
        </div>
    );
}

function ExampleCard({ ex }: { ex: SelfExample }) {
    const renderWrote = () => {
        if (!ex.highlight || !ex.wrote.includes(ex.highlight)) return ex.wrote;
        const parts = ex.wrote.split(ex.highlight);
        return <>{parts[0]}<mark className="m-mark">{ex.highlight}</mark>{parts.slice(1).join(ex.highlight)}</>;
    };
    return (
        <div className="m-self-example">
            {ex.brief && (<div className="m-self-ex-block"><span className="m-self-ex-tag">Brief</span><p>{ex.brief}</p></div>)}
            {ex.wrote && (<div className="m-self-ex-block"><span className="m-self-ex-tag">Wrote</span><pre className="m-self-ex-email">{renderWrote()}</pre></div>)}
            {ex.triaged_reply && (
                <div className="m-self-ex-block">
                    <span className="m-self-ex-tag">Triaged{ex.triaged_class ? ` · ${ex.triaged_class}` : ''}</span>
                    <p className="m-self-ex-reply">&ldquo;{ex.triaged_reply}&rdquo;</p>
                    {ex.triaged_action && <p className="m-self-ex-action">{ex.triaged_action}</p>}
                </div>
            )}
        </div>
    );
}

// ====================================================================
// 02 — THE LOOP (kept; outcome line per card)
// ====================================================================

function TheLoop({ signupHref }: { signupHref: string }) {
    type Stage = { key: string; badge: string; title: string; body: string; outcome: string; visual: ReactNode };
    const stages: Stage[] = [
        {
            key: 'brief', badge: 'Brief', title: 'Tell GenSend who to reach',
            body: 'Plain English — "founders of YC S26 AI infra startups", "VPs of marketing at series A B2B SaaS in NYC". GenSend routes the brief to the right data source.',
            outcome: 'Leads validated against your ICP before anything sends.',
            visual: (
                <div className="m-loop-visual m-loop-visual-chat">
                    <div className="m-chat-bubble"><span className="m-chat-label">You</span>find every CRO at a Series B SaaS that raised in Q1</div>
                    <div className="m-chat-bubble m-chat-bubble-ai"><span className="m-chat-label">GenSend</span>nice brief. routing to Apollo + Crunchbase. filtering to Series B, US/EU, CRO title only — should be ~80 matches.</div>
                </div>
            ),
        },
        {
            key: 'find', badge: 'Find', title: 'Watch real leads stream in',
            body: 'GenSend pulls from the source, validates every row against your ICP, and dedupes against past campaigns and your customer list.',
            outcome: 'Duplicates and weak fits dropped automatically.',
            visual: (
                <div className="m-loop-visual m-loop-table">
                    <div className="m-demo-table-head"><span>#</span><span>Company</span><span>Contact</span><span>Fit</span></div>
                    {[{ c: 'Tessera Bio', n: 'Aria Chen', t: 'CRO', s: 92 }, { c: 'Mosaic Cloud', n: 'Daniel Reyes', t: 'CRO', s: 88 }, { c: 'Lumalink', n: 'Sofia Karim', t: 'CRO', s: 81 }, { c: 'Cumulus', n: 'Henry Brooks', t: 'CRO', s: 76 }].map((r, i) => (
                        <div key={i} className="m-demo-table-row is-visible">
                            <span className="m-demo-num">{i + 1}</span>
                            <span className="m-demo-company">{r.c}</span>
                            <span className="m-demo-name"><span className="m-demo-name-main">{r.n}</span><span className="m-demo-title">{r.t}</span></span>
                            <span className="m-demo-email"><span className={`m-fit ${r.s >= 85 ? 'is-strong' : r.s >= 70 ? 'is-mid' : 'is-weak'}`}>{r.s}</span></span>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            key: 'write', badge: 'Write', title: 'In your voice. Personal every time.',
            body: 'Every email pulls from your knowledge file plus a corpus of cold emails that converted, so it reads like a senior operator wrote it.',
            outcome: "References real signals — funding, hiring, launches — not 'saw your LinkedIn.'",
            visual: (
                <div className="m-loop-visual m-loop-email">
                    <div className="m-demo-email-head"><span className="m-demo-email-label">Draft</span><span className="m-demo-email-to">to aria@tessera.bio</span></div>
                    <div className="m-demo-email-subject">tessera&apos;s manufacturing milestone + scaling RevOps</div>
                    <pre className="m-demo-email-body">{`Hey Aria,

Tessera hitting the 200k-cell-line milestone last month — congrats, that usually means the next quarter is sales-hiring chaos.

We built GenSend so a 2-person RevOps team can run the outbound of a 10-person one. One agent does find, write, send, triage.

15 mins this week to see the workflow?

Adam`}</pre>
                </div>
            ),
        },
        {
            key: 'send', badge: 'Send + reply', title: 'Send, throttle, triage replies',
            body: 'Multi-mailbox rotation with deliverability self-healing. Replies are classified by intent and the right follow-up is queued.',
            outcome: 'Multi-mailbox rotation, deliverability self-healing. You only see replies that need a human.',
            visual: (
                <div className="m-loop-visual m-loop-replies">
                    <div className="m-reply-row m-reply-positive">
                        <div className="m-reply-head"><span className="m-reply-from">Aria Chen · Tessera Bio</span><span className="m-reply-tag m-reply-tag-pos">positive</span></div>
                        <div className="m-reply-text">&ldquo;Worth a chat. Tuesday 2pm work?&rdquo;</div>
                        <div className="m-reply-action">GenSend booked the call. You&apos;ll get the calendar event.</div>
                    </div>
                    <div className="m-reply-row">
                        <div className="m-reply-head"><span className="m-reply-from">Daniel Reyes · Mosaic Cloud</span><span className="m-reply-tag m-reply-tag-defer">not now</span></div>
                        <div className="m-reply-text">&ldquo;Interesting but mid quarter. Hit me up in May.&rdquo;</div>
                        <div className="m-reply-action">Scheduled follow-up for May 5. Removed from active queue.</div>
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
        <section className="m-section m-section-light" id="loop">
            <div className="m-section-head">
                <span className="m-section-num">[02]</span>
                <h2>One agent. Four jobs.</h2>
                <p>Click through the loop. Each stage is what the agent actually does — same UI as the live product.</p>
            </div>
            <div className="m-loop">
                <div className="m-loop-tabs">
                    {stages.map((s, i) => (
                        <button key={s.key} type="button" onClick={() => { setActive(i); setPaused(true); }} className={`m-loop-tab ${i === active ? 'is-active' : ''}`}>
                            <span className="m-loop-tab-num">[0{i + 1}]</span>
                            <span className="m-loop-tab-badge"><SlotText text={s.badge} /></span>
                            <span className="m-loop-tab-title">{s.title}</span>
                            <span className="m-loop-tab-body">{s.body}</span>
                            <span className="m-loop-tab-outcome">{s.outcome}</span>
                        </button>
                    ))}
                </div>
                <div className="m-loop-stage">
                    {stages.map((s, i) => (
                        <div key={s.key} className={`m-loop-stage-panel ${i === active ? 'is-active' : ''}`}>{s.visual}</div>
                    ))}
                </div>
            </div>
            <div className="m-section-foot">
                <Link href={signupHref} className="m-btn-primary"><CtaLabel rest="Run your own brief" hover="Zero friction. Zero cost." /></Link>
            </div>
        </section>
    );
}

// ====================================================================
// 03 — TOOL VS EMPLOYEE
// ====================================================================

function ToolVsEmployee() {
    return (
        <section className="m-section m-section-features">
            <div className="m-section-head">
                <span className="m-section-num">[03]</span>
                <h2>Every other stack is tools you operate. GenSend is an agent that operates itself.</h2>
                <p>Same outcomes the whole stack was for — one agent doing the work instead of you operating eight tools.</p>
            </div>
            <div className="m-old">
                <div className="m-old-side">
                    <div className="m-old-label">A stacked outbound toolkit</div>
                    <ul className="m-tve-list">
                        <li>build the lead list <span>Apollo, Clay, Hunter</span></li>
                        <li>write every email <span>ChatGPT + your time</span></li>
                        <li>babysit the sequences <span>Instantly, Reply.io, Smartlead</span></li>
                        <li>sort every reply by hand</li>
                    </ul>
                    <div className="m-old-total">~4 hrs/week. 8 logins. ~$1,400/mo.</div>
                </div>
                <div className="m-old-arrow">→</div>
                <div className="m-old-side m-old-side-after">
                    <div className="m-old-label">GenSend</div>
                    <ul className="m-tve-list m-tve-list-after">
                        <li>write one brief</li>
                        <li>agent finds / validates / dedupes</li>
                        <li>agent writes / sends / rotates mailboxes</li>
                        <li>agent triages replies, you approve what matters</li>
                    </ul>
                    <div className="m-old-total m-old-total-after">~20 min/week. One agent. From $20/mo per workspace.</div>
                </div>
            </div>
        </section>
    );
}

// ====================================================================
// 04 — PRICING
// ====================================================================

function Pricing({ signupHref }: { signupHref: string }) {
    return (
        <section className="m-section" id="pricing">
            <div className="m-section-head">
                <span className="m-section-num">[04]</span>
                <h2>Start free. Go Pro at $20.</h2>
                <p>Per workspace, billed monthly — and you can run as many workspaces as you like. Free to try the agent; Pro when you want it running at volume.</p>
            </div>
            <div className="m-pricing">
                <div className="m-pricing-card">
                    <div className="m-pricing-base">
                        <span className="m-pricing-amount">$0</span>
                        <span className="m-pricing-per">/mo · Free</span>
                    </div>
                    <p className="m-pricing-desc">Meet the agent. 1 campaign, 5 emails a day, every lead source, agent writes and triages. Unlimited workspaces.</p>
                    <Link href={signupHref} className="m-btn-secondary m-btn-lg" style={{ width: '100%' }}>
                        <CtaLabel rest="Start free" hover="Zero friction. Zero cost." active="Opening…" />
                    </Link>
                </div>
                <div className="m-pricing-card">
                    <div className="m-pricing-plus" style={{ marginTop: 0 }}>Most popular</div>
                    <div className="m-pricing-base">
                        <span className="m-pricing-amount">$20</span>
                        <span className="m-pricing-per">/mo per workspace</span>
                    </div>
                    <p className="m-pricing-desc">Infrastructure gone, volume on. Domains and mailboxes provisioned for you, unlimited campaigns, unlimited sends with safety caps, self-healing deliverability.</p>
                    <Link href={signupHref} className="m-btn-primary m-btn-lg" style={{ width: '100%' }}>
                        <CtaLabel rest="Upgrade workspace" hover="$20/mo, cancel anytime" active="Opening…" />
                    </Link>
                    <p className="m-pricing-trial">Per workspace. Cancel anytime.</p>
                </div>
            </div>
            <div className="m-pricing-dfy">
                <div>
                    <div className="m-pricing-callout-h" style={{ color: '#fff' }}>Don&apos;t want to run it? We do.</div>
                    <p className="m-pricing-reassure">Our team runs the whole program for you — priced on outcomes (booked calls or closed sales), agreed up front. A managed engagement, not a plan.</p>
                </div>
                <a href="mailto:adam@gensend.ai?subject=GenSend%20done-for-you" className="m-btn-primary"><CtaLabel rest="Talk to us about done-for-you" /></a>
            </div>
            <div className="m-section-foot">
                <Link href="/pricing" className="m-btn-ghost">See full pricing &amp; comparison →</Link>
            </div>
        </section>
    );
}

// ====================================================================
// 05 — FEATURES
// ====================================================================

function Features() {
    const caps = [
        { title: 'Deliverability self-healing', body: 'Per-mailbox warmup, throttling, and rotation based on bounce signals. Weak mailboxes pause before they hurt your domain.' },
        { title: 'Customer-list block', body: 'Upload your customers. We never cold-email anyone already on the list — across every campaign, automatically.' },
        { title: 'ICP distillation', body: 'Drop in your customer list. GenSend reads it, finds the real ICP patterns, and proposes lookalike campaigns in one click.' },
        { title: 'Reply triage', body: 'Every reply classified by intent — positive, not now, objection, referral. The right follow-up gets queued; you only see what needs a human.' },
        { title: 'Multi-mailbox', body: 'Round-robin across as many sending mailboxes as you connect. Per-campaign restrictions, per-row overrides, no daily-cap drama.' },
        { title: 'Persistent memory', body: 'Every campaign remembers preferences, every workspace remembers what worked. The brain compounds across runs.' },
    ];
    return (
        <section className="m-section m-section-dark" id="features">
            <div className="m-section-head">
                <span className="m-section-num">[05]</span>
                <h2>Built for production outbound.</h2>
                <p>Six things every serious cold email operation needs — and most tools skip.</p>
            </div>
            <div className="m-grid">
                {caps.map((c) => (<div key={c.title} className="m-card"><h3>{c.title}</h3><p>{c.body}</p></div>))}
            </div>
        </section>
    );
}

// ====================================================================
// 06 — SECURITY
// ====================================================================

function SecuritySection() {
    const items = [
        { title: 'Your data, your account', body: 'Mailboxes connect via OAuth to your own Google or Outlook. We never see passwords. Disconnect any time.' },
        { title: 'Domain-safe by design', body: 'Per-mailbox warmup, send caps, and bounce-rate monitoring. Mailboxes that hurt your reputation get auto-paused before damage compounds.' },
        { title: 'Customer data isolation', body: 'Workspaces are tenant-isolated end to end. Your customer list and lead pipeline never leak between workspaces, even ones you own.' },
    ];
    return (
        <section className="m-section m-section-light" id="security">
            <div className="m-section-head">
                <span className="m-section-num">[06]</span>
                <h2>Built for serious outbound.</h2>
                <p>Sending real volume from real domains means infrastructure that protects your reputation, not just our metrics.</p>
            </div>
            <div className="m-security">
                {items.map((s) => (<div key={s.title} className="m-security-item"><h3>{s.title}</h3><p>{s.body}</p></div>))}
            </div>
        </section>
    );
}

// ====================================================================
// 07 — FAQ
// ====================================================================

function Faq() {
    const items = [
        { q: 'How is this different from Instantly or Apollo?', a: 'Those are tools you operate — you still build the list, write the copy, work the replies. GenSend is an agent that does the whole loop from one brief. Different category.' },
        { q: 'What does it cost?', a: 'Free is $0/mo per workspace — 1 campaign, 5 emails a day. Pro is $20/mo per workspace and removes the ceilings: unlimited campaigns, unlimited daily sends with safety caps, and sending infrastructure provisioned for you. Run as many workspaces as you like, each billed separately.' },
        { q: 'Is there a free plan?', a: 'Yes — Free is $0/mo, no credit card. Connect a mailbox and run a real campaign before you ever pay. Upgrade to Pro when you want it at volume.' },
        { q: 'Will this hurt my domain?', a: 'No. Per-mailbox warmup + send caps, bounce monitoring, auto-pause before damage.' },
        { q: 'Do you store my email password?', a: 'Never. OAuth to Google/Outlook, no passwords, disconnect anytime.' },
    ];
    const [open, setOpen] = useState<number | null>(0);
    return (
        <section className="m-section" id="faq">
            <div className="m-section-head">
                <span className="m-section-num">[07]</span>
                <h2>Common questions.</h2>
            </div>
            <div className="m-faq">
                {items.map((it, i) => {
                    const isOpen = open === i;
                    return (
                        <div key={it.q} className={`m-faq-item ${isOpen ? 'is-open' : ''}`}>
                            <button type="button" className="m-faq-row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                                <span className="m-faq-q">{it.q}</span>
                                <span className="m-faq-toggle"><SlotText text={isOpen ? '−' : '+'} /></span>
                            </button>
                            <div className="m-faq-answer-wrap"><div className="m-faq-answer"><p>{it.a}</p></div></div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

// ====================================================================
// CLOSING CTA + FOOTER
// ====================================================================

function ClosingCta({ signupHref }: { signupHref: string }) {
    return (
        <section className="m-cta-banner">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}><GenFace size={64} /></div>
            <h2>Hire the agent.<br />Start free, scale on Pro.</h2>
            <p>Free to start. Pro is $20/mo per workspace. Brief it once; it finds, writes, sends, and replies.</p>
            <Link href={signupHref} className="m-btn-primary m-btn-lg">
                <CtaLabel rest="Start free" hover="Zero friction. Zero cost." active="Opening…" />
            </Link>
        </section>
    );
}

function Footer({ signupHref }: { signupHref: string }) {
    return (
        <footer className="m-footer">
            <div className="m-footer-inner">
                <div className="m-footer-cols">
                    <div className="m-footer-brand">
                        <Logo size={40} color="#ffffff" />
                        <p className="m-footer-tag">Your outbound team is now one agent.</p>
                        <Link href={signupHref} className="m-btn-primary" style={{ marginTop: 14 }}><CtaLabel rest="Start free" hover="Zero friction. Zero cost." /></Link>
                    </div>
                    <div><div className="m-footer-h">Product</div><a href="#loop">How it works</a><a href="#pricing">Pricing</a><a href="#features">Features</a></div>
                    <div><div className="m-footer-h">Resources</div><Link href="/blog">Blog</Link><a href="#faq">FAQ</a><a href="mailto:adam@gensend.ai">Talk to us</a></div>
                    <div><div className="m-footer-h">Company</div><a href="mailto:adam@gensend.ai">Contact</a><a href="https://app.gensend.ai/login">Login</a></div>
                </div>
                <div className="m-footer-watermark">GENSEND</div>
                <div className="m-footer-legal">© {new Date().getFullYear()} GenSend.&nbsp;&nbsp;adam@gensend.ai</div>
            </div>
        </footer>
    );
}
