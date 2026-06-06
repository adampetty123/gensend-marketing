'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Landing page — structure ported from conduit.ai. Same layout, same
 * sectioning, same visual rhythm — Gensend's copy + story.
 *
 * Sections:
 *   - Nav
 *   - Hero (headline + sub + CTAs + product preview)
 *   - Trust strip (logos)
 *   - 01 — Three pillars (find / write / send + reply)
 *   - 02 — Production grid (six capability cards)
 *   - 03 — Numbered feature carousel
 *   - 04 — Customer stories
 *   - 05 — Security / privacy
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
            <PillarsSection signupHref={signupHref} />
            <ProductionGrid />
            <FeatureCarousel />
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
                <Link href="/" className="m-nav-brand" aria-label="Gensend home">
                    <Image src="/images/logo-full.svg" alt="Gensend" width={120} height={32} priority />
                </Link>
                <nav className="m-nav-links">
                    <a href="#product">Product</a>
                    <a href="#features">Features</a>
                    <a href="#customers">Customers</a>
                    <a href="#security">Security</a>
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
// HERO
// ====================================================================

function Hero({ signupHref }: { signupHref: string }) {
    return (
        <section className="m-hero">
            <div className="m-hero-inner">
                <span className="m-pill"><span className="dot" /> Accepting slots for May</span>
                <h1>Agentic cold email<br />for AI companies</h1>
                <p className="m-hero-sub">
                    Find your perfect customers, write the email, send it, handle the reply.
                    Gensend does outbound the way a senior operator would, except it remembers everything and never sleeps.
                </p>
                <div className="m-hero-cta">
                    <Link href={signupHref} className="m-btn-primary m-btn-lg">Get Started</Link>
                    <div className="m-rating">
                        <span className="m-stars">★★★★★</span>
                        <span className="m-rating-text">Loved by AI founders</span>
                    </div>
                </div>
                <div className="m-product-shot">
                    <div className="m-product-shot-chrome">
                        <span className="dot-r" />
                        <span className="dot-y" />
                        <span className="dot-g" />
                        <span className="m-product-shot-url">app.gensend.ai</span>
                    </div>
                    <div className="m-product-shot-body">
                        <div className="m-product-shot-chat">
                            <div className="m-chat-bubble">
                                <span className="m-chat-label">You</span>
                                <span>find 20 founders of YC Spring 2026 companies</span>
                            </div>
                            <div className="m-chat-bubble m-chat-bubble-ai">
                                <span className="m-chat-label">Gen</span>
                                <span>got it. scraping the YC directory now. drafts will land in the leads table as they&apos;re verified.</span>
                            </div>
                            <div className="m-chat-bubble m-chat-bubble-ai">
                                <span className="m-chat-label">Gen</span>
                                <span>✓ 20 leads + drafts ready. want to review the first 3 emails before i send the rest?</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
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
// 01 — THREE PILLARS
// ====================================================================

function PillarsSection({ signupHref }: { signupHref: string }) {
    const pillars = [
        {
            badge: 'Find',
            title: 'Find your perfect customers',
            body: 'Tell Gensend who you sell to. It searches the open web, named directories, conference rosters, and your own customer list to surface accounts that look exactly like the ones already paying you.',
        },
        {
            badge: 'Write',
            title: 'Write the email — in your voice',
            body: 'Trained on a corpus of cold emails that actually convert plus your founder voice. No "hope this finds you well" filler. Personal, specific, short enough to read on a phone.',
        },
        {
            badge: 'Send + reply',
            title: 'Send, throttle, triage',
            body: 'Multi-mailbox rotation, deliverability self-healing, customer-list blocks so you never email someone you already sold. When replies come back, Gensend classifies intent and queues the follow-up.',
        },
    ];
    return (
        <section className="m-section" id="product">
            <div className="m-section-head">
                <span className="m-section-num">[01]</span>
                <h2>End-to-end. Not just a tool.</h2>
                <p>Most cold email products give you a sequencer and call it done. Gensend handles the whole loop — finding, writing, sending, and learning from every reply.</p>
            </div>
            <div className="m-pillars">
                {pillars.map((p) => (
                    <div key={p.badge} className="m-pillar">
                        <span className="m-pillar-badge">{p.badge}</span>
                        <h3>{p.title}</h3>
                        <p>{p.body}</p>
                    </div>
                ))}
            </div>
            <div className="m-section-foot">
                <Link href={signupHref} className="m-btn-primary">Get Started</Link>
            </div>
        </section>
    );
}

// ====================================================================
// 02 — PRODUCTION GRID
// ====================================================================

function ProductionGrid() {
    const caps = [
        { title: 'Deliverability self-healing', body: 'Per-mailbox warmup, throttling, and rotation based on bounce signals. We pause weak mailboxes before they hurt your domain.' },
        { title: 'Customer-list block', body: 'Upload your existing customers. We never cold-email anyone already on the list — across every campaign, automatically.' },
        { title: 'ICP distillation', body: 'Drop in your customer list. Gensend reads it, finds the real ICP patterns, and proposes lookalike campaigns you can launch in one click.' },
        { title: 'Reply triage (soon)', body: 'Every reply classified by intent — positive, not now, objection, referral. The right follow-up gets queued; you only see what needs a human.' },
        { title: 'Multi-mailbox', body: 'Round-robin across as many sending mailboxes as you connect. Per-campaign restrictions, per-row overrides, no daily-cap drama.' },
        { title: 'Persistent memory', body: 'Every campaign remembers its preferences, every workspace remembers what worked. The brain compounds across runs.' },
    ];
    return (
        <section className="m-section m-section-dark" id="features">
            <div className="m-section-head">
                <span className="m-section-num">[02]</span>
                <h2>Built for production outbound.</h2>
                <p>Not a demo. Not a prototype. Six things every serious cold email operation needs — and most tools skip.</p>
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
// 03 — NUMBERED FEATURE CAROUSEL
// ====================================================================

function FeatureCarousel() {
    const features = [
        { num: '01', title: 'Routes the right tool per brief', body: 'Tell it "find every YC P26 founder" — it uses a structured scraper on the canonical directory, not an open-web search. Tell it "UK car meet organisers on Instagram" — it uses an agentic crawler. The brain picks based on what you asked for.' },
        { num: '02', title: 'Learns your voice', body: 'Every email draws on your knowledge file plus a corpus of winning cold emails as few-shot examples. Set a subject template once and it persists. Add a campaign note ("always reference the seed raise") and every future compose follows it.' },
        { num: '03', title: 'Auto-tags every campaign', body: 'Slicing keywords in the brief ("Spring 2026", "London", "Q1 raise") become columns on every row automatically. Add more leads later? Same tags carry forward without you re-saying them.' },
        { num: '04', title: 'Honest about what it dropped', body: 'Every lead the system rejects gets recorded with the reason. Ask the brain "why did you drop one" and it tells you the specific company plus the validator\'s judgement — never guesses.' },
    ];
    return (
        <section className="m-section m-section-features">
            <div className="m-section-head">
                <span className="m-section-num">[03]</span>
                <h2>An operator, not a tool.</h2>
                <p>Gensend keeps decisions transparent — every routing choice, every rejection, every memory.</p>
            </div>
            <div className="m-features">
                {features.map((f) => (
                    <div key={f.num} className="m-feature">
                        <span className="m-feature-num">[{f.num}]</span>
                        <h3>{f.title}</h3>
                        <p>{f.body}</p>
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
        { brand: 'AI startup (NDA)', quote: 'Booked four discovery calls in the first week with companies we\'d been trying to crack for months. The reply rate is genuinely higher.', who: 'Head of Growth' },
        { brand: 'Solo operator', quote: 'I used to spend 6 hours a week writing cold emails. Now I spend 20 minutes reviewing what Gensend wrote and approving the sends.', who: 'Indie SaaS founder' },
    ];
    return (
        <section className="m-section" id="customers">
            <div className="m-section-head">
                <span className="m-section-num">[04]</span>
                <h2>Built by founders. Used by founders.</h2>
                <p>Gensend started because we couldn&apos;t find a cold email tool that actually thought about the problem like a human operator. So we built one.</p>
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
            <h2>Stop running cold email by hand.</h2>
            <p>Spin up your first campaign in 5 minutes. Free to try, no credit card required.</p>
            <Link href={signupHref} className="m-btn-primary m-btn-lg">Get Started</Link>
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
                        <a href="#product">Find leads</a>
                        <a href="#features">Features</a>
                        <a href="#security">Security</a>
                    </div>
                    <div>
                        <div className="m-footer-h">Customers</div>
                        <a href="#customers">Stories</a>
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
