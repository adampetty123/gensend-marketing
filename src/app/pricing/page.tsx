'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { SlotText } from 'slot-text/react';
import 'slot-text/style.css';
import Logo from '../components/Logo';

/**
 * /pricing — self-serve pricing is the source of truth for the whole site.
 * Truth anchor (confirmed against Stripe 2026-06-16):
 *   Free $0/mo per workspace · Pro $20/mo per workspace · Agency custom.
 * Only one active Stripe price exists ($20/mo) → no annual toggle.
 * Performance / "pay per result" pricing lives ONLY in the done-for-you band
 * (contact sales) — never as a self-serve number.
 *
 * Namespaced `pp-` classes so this page's styling can't collide with the
 * homepage's pricing-section classes.
 */

const APP = 'https://app.gensend.ai';

function usePrefersReducedMotion() {
    const [r, setR] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setR(mq.matches);
        const on = () => setR(mq.matches);
        mq.addEventListener?.('change', on);
        return () => mq.removeEventListener?.('change', on);
    }, []);
    return r;
}

function CtaLabel({ rest, hover }: { rest: string; hover?: string }) {
    const [h, setH] = useState(false);
    return (
        <span onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}>
            <SlotText text={h ? (hover ?? rest) : rest} />
        </span>
    );
}

export default function PricingPage() {
    const [loginHref, setLoginHref] = useState(`${APP}/login`);
    const [signupHref, setSignupHref] = useState(`${APP}/register`);
    useEffect(() => {
        try {
            if (window.localStorage.getItem('token')) {
                setLoginHref(`${APP}/manager`);
                setSignupHref(`${APP}/manager`);
            }
        } catch {}
    }, []);

    return (
        <>
            <Nav loginHref={loginHref} signupHref={signupHref} />
            <PricingHero />
            <PlanCards signupHref={signupHref} />
            <DoneForYou />
            <Comparison />
            <Faq />
            <ClosingCta signupHref={signupHref} />
            <Footer signupHref={signupHref} />
        </>
    );
}

function Nav({ loginHref, signupHref }: { loginHref: string; signupHref: string }) {
    return (
        <header className="m-nav">
            <div className="m-nav-inner">
                <Link href="/" className="m-nav-brand" aria-label="GenSend home"><Logo size={36} /></Link>
                <nav className="m-nav-links">
                    <Link href="/#loop">How it works</Link>
                    <Link href="/#features">Features</Link>
                    <Link href="/pricing">Pricing</Link>
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

function PricingHero() {
    return (
        <section className="pp-hero">
            <span className="pp-eyebrow">Pricing</span>
            <h1>An outbound agent.<br />Not a tool you operate.</h1>
            <p className="pp-signature">Briefs, not busywork.</p>
            <p className="pp-subhead">For teams who want outbound running, not more tools to run.</p>
            <div className="pp-outcome-bar">Zero setup. Full agent. Brief to first send in minutes.</div>
        </section>
    );
}

type Plan = {
    name: string;
    price: string;
    period: string;
    badge?: string;
    tagline: string;
    outcome: string;
    includes: string[];
    cta: string;
    ctaHover?: string;
    href: string;
    reassurance?: string;
    highlighted?: boolean;
};

const PLANS: Plan[] = [
    {
        name: 'Free', price: '$0', period: '/mo per workspace',
        tagline: 'Meet the agent. Free.',
        outcome: 'See it run the loop. Free.',
        includes: [
            '1 campaign',
            '5 emails a day',
            'Every lead source — Apollo, YC, agentic',
            'Agent writes the copy, triages the replies',
            'Google or Outlook in one click',
            'Unlimited workspaces',
        ],
        cta: 'Start free', ctaHover: 'Zero friction. Zero cost.', href: `${APP}/register`,
    },
    {
        name: 'Pro', price: '$20', period: '/mo per workspace', badge: 'Most popular',
        tagline: 'Infrastructure gone. Volume on.',
        outcome: 'You brief. The agent ships.',
        includes: [
            'Everything in Free, plus —',
            'Domains and mailboxes, provisioned for you',
            'Unlimited campaigns, no ceiling',
            'Unlimited daily sends, caps keep you safe',
            'Mailboxes that rotate and warm themselves',
            'Deliverability that self-heals — bad mailboxes auto-pause',
            'Connection column — open warm, not cold',
            'Priority support, from a human',
        ],
        cta: 'Upgrade workspace', ctaHover: '$20/mo, cancel anytime', href: `${APP}/register`,
        reassurance: 'Per workspace. Cancel anytime.', highlighted: true,
    },
    {
        name: 'Agency / Enterprise', price: 'Custom', period: '',
        tagline: 'Fifty clients. One bill. No seat math.',
        outcome: 'Every workspace on Pro. One account team.',
        includes: [
            'Every workspace on Pro',
            'Volume discount past 10 workspaces',
            'One consolidated bill, one account manager',
            'Hands-on onboarding',
        ],
        cta: 'Talk to us', href: 'mailto:adam@gensend.ai?subject=GenSend%20Agency%20plan',
    },
];

function PlanCards({ signupHref }: { signupHref: string }) {
    const reduced = usePrefersReducedMotion();
    return (
        <section className="pp-section">
            <div className="pp-plans">
                {PLANS.map((p, i) => {
                    const isMail = p.href.startsWith('mailto:');
                    const href = p.name === 'Free' || p.name === 'Pro' ? signupHref : p.href;
                    return (
                        <div
                            key={p.name}
                            className={`pp-card ${p.highlighted ? 'pp-card-pro' : ''} ${reduced ? '' : 'pp-card-reveal'}`}
                            style={reduced ? undefined : { animationDelay: `${i * 60}ms` }}
                        >
                            {p.badge && <span className="pp-badge">{p.badge}</span>}
                            <div className="pp-card-top">
                                <h3 className="pp-card-name">{p.name}</h3>
                                <div className="pp-price"><span className="pp-amount">{p.price}</span><span className="pp-period">{p.period}</span></div>
                                <p className="pp-tagline">{p.tagline}</p>
                                <p className="pp-outcome">{p.outcome}</p>
                            </div>
                            <ul className="pp-includes">
                                {p.includes.map((f) => (
                                    <li key={f} className={/^Everything in Free/.test(f) ? 'pp-includes-sub' : ''}>
                                        {!/^Everything in Free/.test(f) && <Check />}<span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="pp-card-cta">
                                {isMail ? (
                                    <a href={href} className={p.highlighted ? 'm-btn-primary' : 'm-btn-secondary'} style={{ width: '100%' }}><CtaLabel rest={p.cta} hover={p.ctaHover} /></a>
                                ) : (
                                    <Link href={href} className={p.highlighted ? 'm-btn-primary' : 'm-btn-secondary'} style={{ width: '100%' }}><CtaLabel rest={p.cta} hover={p.ctaHover} /></Link>
                                )}
                                {p.reassurance && <p className="pp-reassure">{p.reassurance}</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function Check() {
    return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden className="pp-check">
            <circle cx="8" cy="8" r="8" fill="#ff0095" opacity="0.15" />
            <path d="M4.5 8.5 L7 11 L11.5 6" stroke="#ff0095" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function DoneForYou() {
    return (
        <section className="pp-section">
            <div className="pp-dfy">
                <div className="pp-dfy-text">
                    <h2>Don&apos;t want to run it? We do.</h2>
                    <p>Our team runs the whole program on GenSend — strategy, lists, copy, sending, replies. Priced on outcomes: you pay for booked calls or closed sales, agreed up front. A managed engagement, not a plan.</p>
                </div>
                <a href="mailto:adam@gensend.ai?subject=GenSend%20done-for-you" className="m-btn-primary m-btn-lg pp-dfy-cta">
                    <CtaLabel rest="Talk to us about done-for-you" />
                </a>
            </div>
        </section>
    );
}

type Cell = 'yes' | 'no' | 'partial';
function Comparison() {
    const cols = ['GenSend', 'Instantly', 'Smartlead', 'Apollo'];
    const rows: { cap: string; cells: Cell[] }[] = [
        { cap: 'Finds the leads', cells: ['yes', 'no', 'no', 'yes'] },
        { cap: 'Writes the emails', cells: ['yes', 'no', 'no', 'no'] },
        { cap: 'Sends / rotates / warms mailboxes', cells: ['yes', 'yes', 'yes', 'partial'] },
        { cap: 'Triages replies + queues follow-ups', cells: ['yes', 'no', 'no', 'no'] },
        { cap: 'One brief, agent does the rest', cells: ['yes', 'no', 'no', 'no'] },
    ];
    const cell = (c: Cell) => {
        const label = c === 'yes' ? 'Yes' : c === 'no' ? 'No' : 'Partial';
        const glyph = c === 'yes' ? '✓' : c === 'no' ? '✕' : '~';
        const cls = c === 'yes' ? 'pp-yes' : c === 'no' ? 'pp-no' : 'pp-partial';
        return <span className={cls} role="img" aria-label={label}><span aria-hidden>{glyph}</span><span className="pp-sr">{label}</span></span>;
    };
    return (
        <section className="pp-section">
            <div className="pp-section-head">
                <h2>A stack of tools, or one agent that runs the loop.</h2>
                <p>There are a dozen email senders. If all you need is mailbox rotation, use Instantly. If you want an agent that runs find → write → send → reply from one brief, that&apos;s GenSend.</p>
            </div>

            {/* Desktop matrix */}
            <div className="pp-compare-wrap">
                <table className="pp-compare">
                    <thead>
                        <tr><th scope="col">Capability</th>{cols.map((c) => <th scope="col" key={c} className={c === 'GenSend' ? 'pp-col-gen' : ''}>{c}</th>)}</tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => (
                            <tr key={r.cap}>
                                <th scope="row" className="pp-cap">{r.cap}</th>
                                {r.cells.map((c, j) => <td key={j} className={cols[j] === 'GenSend' ? 'pp-col-gen' : ''}>{cell(c)}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile: stacked per-capability cards, no horizontal scroll */}
            <div className="pp-compare-stack">
                {rows.map((r) => (
                    <div key={r.cap} className="pp-compare-card">
                        <div className="pp-compare-card-cap">{r.cap}</div>
                        <div className="pp-compare-card-cells">
                            {r.cells.map((c, j) => (
                                <div key={j} className="pp-compare-card-cell"><span className="pp-compare-card-tool">{cols[j]}</span>{cell(c)}</div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <p className="pp-compare-foot">Reflects core product capability. We don&apos;t list competitor prices — their plans vary by seat and add-on; check their sites.</p>
        </section>
    );
}

function Faq() {
    const items = [
        { q: 'Why per workspace, not per seat?', a: 'Outbound is run per program, not per person. A workspace is one outbound program — its own ICP, mailboxes, and campaigns. You can invite your whole team to a workspace at no extra cost, and run as many workspaces as you like, each billed on its own.' },
        { q: 'What changes when I upgrade to Pro?', a: 'Free runs one campaign at five emails a day so you can see the agent work. Pro removes the ceilings — unlimited campaigns, unlimited daily sends (with per-mailbox caps for safety) — and provisions sending infrastructure for you: domains and mailboxes, warmed and rotated automatically, with deliverability that self-heals.' },
        { q: 'How is this different from Instantly, Smartlead, or Apollo?', a: 'Those are tools you operate — you still build the list, write the copy, and work the replies. GenSend is an agent that runs the whole loop from one brief: it finds and validates leads, writes in your voice, sends and rotates mailboxes, and triages every reply. Different category.' },
        { q: 'Can you just run it for me?', a: 'Yes — that\'s our done-for-you engagement. Our team runs the entire program on GenSend and is priced on outcomes (booked calls or closed sales), agreed up front. It\'s a managed service, not a self-serve plan. Talk to us.' },
        { q: 'Will Pro hurt my domain?', a: 'No. Every mailbox is warmed before it sends, daily caps throttle volume, bounce rates are monitored continuously, and any mailbox that starts to hurt your reputation is auto-paused before damage compounds.' },
        { q: 'Do you store my email password?', a: 'Never. You connect Google or Outlook over OAuth — we never see a password, and you can disconnect any time.' },
    ];
    const [open, setOpen] = useState<number | null>(0);
    return (
        <section className="pp-section">
            <div className="pp-section-head"><h2>Questions, answered.</h2></div>
            <div className="pp-faq">
                {items.map((it, i) => {
                    const isOpen = open === i;
                    return (
                        <div key={it.q} className={`pp-faq-item ${isOpen ? 'is-open' : ''}`}>
                            <button type="button" className="pp-faq-row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                                <span className="pp-faq-q">{it.q}</span>
                                <span className="pp-faq-chevron" aria-hidden>⌄</span>
                            </button>
                            <div className="pp-faq-answer-wrap"><div className="pp-faq-answer"><p>{it.a}</p></div></div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function ClosingCta({ signupHref }: { signupHref: string }) {
    return (
        <section className="pp-closing">
            <h2>See the agent work.<br />Send for real when you&apos;re ready.</h2>
            <p>Live campaign in two minutes. Pay when you&apos;re ready.</p>
            <Link href={signupHref} className="m-btn-primary m-btn-lg"><CtaLabel rest="Start free" hover="Zero friction. Zero cost." /></Link>
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
                        <p className="m-footer-tag">An outbound agent. Not a tool you operate.</p>
                        <Link href={signupHref} className="m-btn-primary" style={{ marginTop: 14 }}><CtaLabel rest="Start free" hover="Zero friction. Zero cost." /></Link>
                    </div>
                    <div><div className="m-footer-h">Product</div><Link href="/#loop">How it works</Link><Link href="/#features">Features</Link><Link href="/pricing">Pricing</Link></div>
                    <div><div className="m-footer-h">Resources</div><Link href="/blog">Blog</Link><a href="mailto:adam@gensend.ai">Talk to us</a></div>
                    <div><div className="m-footer-h">Company</div><a href="mailto:adam@gensend.ai">Contact</a><a href="https://app.gensend.ai/login">Login</a></div>
                </div>
                <div className="m-footer-watermark">GENSEND</div>
                <div className="m-footer-legal">© {new Date().getFullYear()} GenSend.&nbsp;&nbsp;adam@gensend.ai</div>
            </div>
        </footer>
    );
}
