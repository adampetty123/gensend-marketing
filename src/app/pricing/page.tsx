'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Standalone pricing page. Three tiers + enterprise inquiry. Lifted out
 * of the landing CTA so it can rank for "Gensend pricing" and so the
 * comparison content (vs Instantly / Smartlead / Apollo) has room to
 * breathe.
 */

const APP = 'https://app.gensend.ai';

export default function PricingPage() {
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
            <PricingHero />
            <PricingTiers signupHref={signupHref} />
            <CompareTable />
            <FAQ />
            <CtaBanner signupHref={signupHref} />
            <Footer signupHref={signupHref} />
        </>
    );
}

function Nav({ loginHref, signupHref }: { loginHref: string; signupHref: string }) {
    return (
        <header className="m-nav">
            <div className="m-nav-inner">
                <Link href="/" className="m-nav-brand" aria-label="Gensend home">
                    <Image src="/images/logo-full.svg" alt="Gensend" width={120} height={32} priority />
                </Link>
                <nav className="m-nav-links">
                    <Link href="/#loop">How it works</Link>
                    <Link href="/#features">Features</Link>
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

function PricingHero() {
    return (
        <section className="m-hero" style={{ paddingTop: 80, paddingBottom: 24 }}>
            <div className="m-hero-inner">
                <span className="m-pill"><span className="dot" /> Per workspace, unlimited workspaces</span>
                <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>Pricing</h1>
                <p className="m-hero-sub">
                    One plan per workspace. Run unlimited workspaces under one account — one for your startup, one for your agency client, one for a side project. Each pays separately.
                </p>
            </div>
        </section>
    );
}

type Tier = {
    name: string;
    badge?: string;
    price: string;
    period: string;
    blurb: string;
    cta: string;
    highlighted?: boolean;
    features: string[];
};

const TIERS: Tier[] = [
    {
        name: 'Free',
        price: '$0',
        period: '/mo per workspace',
        blurb: 'Kick the tires. One workspace or many — all the same price.',
        cta: 'Start free',
        features: [
            '1 campaign at a time',
            '5 emails / day',
            'All lead sources (Apollo, YC, agentic)',
            'Agentic copy + reply triage',
            'Connect Google or Outlook',
            'Unlimited workspaces per account',
        ],
    },
    {
        name: 'Pro',
        badge: 'Most popular',
        price: '$20',
        period: '/mo per workspace',
        blurb: 'Real outbound, fully managed sending stack. Covers domains + Workspace mailboxes.',
        cta: 'Upgrade workspace',
        highlighted: true,
        features: [
            'Auto-provisioned sending infrastructure (domains + Google Workspace mailboxes)',
            'Unlimited campaigns',
            'Unlimited daily sends (per-mailbox caps apply)',
            'Everything in Free, plus:',
            'Multi-mailbox rotation + warmup',
            'Deliverability self-healing',
            'Connection column (named name-drops)',
            'Priority support',
        ],
    },
];

function PricingTiers({ signupHref }: { signupHref: string }) {
    return (
        <section className="m-section" style={{ paddingTop: 40 }}>
            <div className="m-pricing-grid">
                {TIERS.map((t) => (
                    <div
                        key={t.name}
                        className={`m-pricing-card ${t.highlighted ? 'm-pricing-card-highlight' : ''}`}
                    >
                        {t.badge && <span className="m-pricing-badge">{t.badge}</span>}
                        <h3 className="m-pricing-name">{t.name}</h3>
                        <div className="m-pricing-price">
                            <span className="m-pricing-amount">{t.price}</span>
                            <span className="m-pricing-period">{t.period}</span>
                        </div>
                        <p className="m-pricing-blurb">{t.blurb}</p>
                        <Link
                            href={signupHref}
                            className={t.highlighted ? 'm-btn-primary' : 'm-btn-secondary'}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {t.cta}
                        </Link>
                        <ul className="m-pricing-features">
                            {t.features.map((f) => (
                                <li key={f}>
                                    <Check />
                                    <span>{f}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div className="m-pricing-enterprise">
                <div>
                    <h3>Agency / Enterprise</h3>
                    <p>Running cold email for clients? Unlimited workspaces under one account at Pro — one per client, billed separately. Volume discounts at 10+ Pro workspaces. We&apos;ll tailor the contract.</p>
                </div>
                <a href="mailto:adam@gensend.ai?subject=Agency%20plan" className="m-btn-primary m-btn-lg">Talk to us</a>
            </div>
        </section>
    );
}

function Check() {
    return (
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
            <circle cx="8" cy="8" r="8" fill="#ff0095" opacity="0.15" />
            <path d="M4.5 8.5 L7 11 L11.5 6" stroke="#ff0095" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CompareTable() {
    const rows = [
        ['Lead sourcing (Apollo, YC, agentic)', true, false, true, false],
        ['Mailbox warmup + rotation', true, true, true, false],
        ['Email composer with customer-list grounding', true, false, false, false],
        ['Pattern-guess + verifier email finder', true, false, false, true],
        ['Reply triage by intent', true, false, false, false],
        ['Connection column (real customer name-drops)', true, false, false, false],
        ['One agent runs the whole loop', true, false, false, false],
    ];
    const cols = ['Gensend', 'Instantly', 'Smartlead', 'Apollo'];
    return (
        <section className="m-section m-section-features">
            <div className="m-section-head">
                <span className="m-section-num">[01]</span>
                <h2>How we compare.</h2>
                <p>The old stack ran four tools. Gensend replaces all of them.</p>
            </div>
            <div className="m-compare-wrap">
                <table className="m-compare">
                    <thead>
                        <tr>
                            <th />
                            {cols.map((c) => <th key={c}>{c}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, i) => (
                            <tr key={i}>
                                <td className="m-compare-feature">{row[0]}</td>
                                {(row.slice(1) as boolean[]).map((v, j) => (
                                    <td key={j} className={v ? 'm-compare-yes' : 'm-compare-no'}>
                                        {v ? '✓' : '—'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

function FAQ() {
    const items = [
        {
            q: 'How does per-workspace pricing work?',
            a: 'A workspace is one outreach context — one business, one ICP, one set of mailboxes. You can run as many workspaces as you want under one account. Each one is billed separately at Free or Pro. Run a workspace for your startup on Free while you experiment, upgrade your agency client workspaces to Pro.',
        },
        {
            q: 'Can I use my own mailboxes?',
            a: 'Yes. Connect Google Workspace or Outlook via OAuth, per workspace. We never see your password and you can disconnect any time. Your domain reputation stays yours.',
        },
        {
            q: 'What happens if I bounce?',
            a: 'We auto-pause mailboxes that hit a 3% bounce rate and route sends to healthier ones while the affected mailbox recovers. The send queue is preserved.',
        },
        {
            q: 'Is there a trial on Pro?',
            a: 'Free is genuinely free — 1 campaign and 5 sends a day, every workspace, forever. Upgrade a workspace to Pro when you want unlimited sends. No card required to start.',
        },
        {
            q: 'Do you offer annual discounts?',
            a: 'Yes, 2 months free on annual prepay per workspace. Reach out to adam@gensend.ai and we will switch the workspace to annual billing.',
        },
        {
            q: 'Do I own the leads?',
            a: 'Always. Export to CSV any time. Cancel and the data leaves with you — we do not lock you in.',
        },
    ];
    return (
        <section className="m-section">
            <div className="m-section-head">
                <span className="m-section-num">[02]</span>
                <h2>Common questions.</h2>
            </div>
            <div className="m-faq">
                {items.map((it) => (
                    <details key={it.q} className="m-faq-item">
                        <summary>{it.q}</summary>
                        <p>{it.a}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}

function CtaBanner({ signupHref }: { signupHref: string }) {
    return (
        <section className="m-cta-banner">
            <h2>Replace the cold-email stack.</h2>
            <p>One agent. One bill. Sub-30-min weekly review.</p>
            <Link href={signupHref} className="m-btn-primary m-btn-lg">Get Started</Link>
        </section>
    );
}

function Footer({ signupHref }: { signupHref: string }) {
    return (
        <footer className="m-footer">
            <div className="m-footer-inner">
                <div className="m-footer-cols">
                    <div className="m-footer-brand">
                        <Image
                            src="/images/logo-full.svg"
                            alt="Gensend"
                            width={120}
                            height={32}
                            style={{ filter: 'invert(1)' }}
                        />
                        <p className="m-footer-tag">Agentic cold email. Find, write, send, reply.</p>
                        <Link href={signupHref} className="m-btn-primary" style={{ marginTop: 14 }}>
                            Get Started
                        </Link>
                    </div>
                    <div>
                        <div className="m-footer-h">Product</div>
                        <Link href="/#loop">How it works</Link>
                        <Link href="/#features">Features</Link>
                        <Link href="/pricing">Pricing</Link>
                    </div>
                    <div>
                        <div className="m-footer-h">Resources</div>
                        <Link href="/blog">Blog</Link>
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
