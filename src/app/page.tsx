'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Gensend landing page. Port of the Webflow design — same copy, same
 * sectioning, same visual language. Single file because it's a static
 * marketing page and there's nothing here that needs splitting yet.
 */
export default function Landing() {
    // Marketing lives at www.gensend.ai; the product surface lives at
    // app.gensend.ai. Hard-code the app subdomain on every nav link so
    // clicking Login or Get Started crosses domains correctly instead
    // of staying on www and serving the auth pages from there.
    // localStorage isn't available on the server, so default routes
    // assume unauthed and overwrite on mount if a token is present.
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
    // In-page CTA buttons + the prompt-input echo all route into the
    // same flow as Get Started.
    const appHref = signupHref;

    return (
        <>
            {/* === Navbar === */}
            <header className="m-nav">
                <div className="m-nav-inner">
                    <Link href="/" aria-label="Gensend home">
                        <Image
                            src="/images/logo-full.svg"
                            alt="Gensend"
                            width={120}
                            height={32}
                            priority
                        />
                    </Link>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={loginHref} className="m-btn-secondary">
                            Login
                        </Link>
                        <Link href={signupHref} className="m-btn-primary">
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            {/* === Hero === */}
            <section className="m-hero">
                <div className="m-hero-inner">
                    <div className="m-hero-copy">
                        <span className="m-pill">
                            <span className="dot" /> Accepting slots for May
                        </span>
                        <h1>Agentic Cold Email</h1>
                        <p>
                            Done-for-you cold email — strategy, infrastructure, copy,
                            and campaigns — so you can focus on building.
                        </p>
                    </div>

                    {/* Faux prompt input — visually echoes the in-app manager UI */}
                    <Link href={appHref} className="m-prompt" aria-label="Try a prompt">
                        <span>Email every YC25 founder, asking for a meeting</span>
                        <span aria-hidden style={{ flex: 'none' }}>
                            <Image
                                src="/images/pencil.webp"
                                alt=""
                                width={28}
                                height={28}
                                style={{ borderRadius: 9999 }}
                            />
                        </span>
                    </Link>

                    <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={appHref} className="m-btn-primary">
                            Get Started
                        </Link>
                        <a href="mailto:adam@gensend.ai" className="m-btn-secondary">
                            Email Sales
                        </a>
                    </div>
                </div>
            </section>

            {/* === Social proof === */}
            <section className="m-social">
                <div className="m-social-title">
                    Loved <span style={{ opacity: 0.4 }}>—</span> by leading AI software companies.
                </div>
                <div className="m-logos">
                    {/* Placeholder text-mark logos. Swap in real client logos
                        when we have permission — for now this keeps the
                        section honest instead of inventing logos. */}
                    <span className="l">Cignara</span>
                    <span className="l">Outset</span>
                    <span className="l">Flowjam</span>
                    <span className="l">Stride</span>
                    <span className="l">Atlas</span>
                    <span className="l">+ hundreds more</span>
                </div>
            </section>

            {/* === Dark value-prop === */}
            <section className="m-dark">
                <div className="m-dark-inner">
                    <h2>We book calls with your perfect customers.</h2>
                    <p>
                        Gensend asks a few questions about what you sell, figures out
                        who to contact, finds the right people, and emails them for
                        you. You choose the volume. It starts small, sends daily, and
                        handles the busy work so you don&apos;t have to.
                    </p>
                    <Link href={appHref} className="m-btn-primary" style={{ marginTop: 12 }}>
                        Get Started
                    </Link>
                </div>
            </section>

            {/* === Footer === */}
            <footer className="m-footer">
                <div className="m-footer-inner">
                    <div className="m-footer-top">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Image
                                src="/images/logo-full.svg"
                                alt="Gensend"
                                width={120}
                                height={32}
                                style={{ filter: 'invert(1)' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                            <a
                                href="mailto:adam@gensend.ai"
                                className="m-footer-meta"
                                style={{ textDecoration: 'none' }}
                            >
                                adam@gensend.ai
                            </a>
                            <Link href={appHref} className="m-btn-primary">
                                Get Started
                            </Link>
                        </div>
                    </div>
                    <div className="m-footer-watermark">GENSEND</div>
                    <div className="m-footer-meta" style={{ textAlign: 'center', marginTop: 16 }}>
                        © {new Date().getFullYear()} Gensend.
                    </div>
                </div>
            </footer>
        </>
    );
}
