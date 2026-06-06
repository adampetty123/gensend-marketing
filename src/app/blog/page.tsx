import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { listPosts } from '@/lib/blog';

export const metadata: Metadata = {
    title: 'Blog — Gensend',
    description: 'How cold email actually works in 2026. Deliverability, sourcing, copy, reply triage. Notes from the team building Gensend.',
};

/**
 * Blog index. Static at build time. Reads markdown files from
 * /content/blog at build time. Add a post by dropping a .md file.
 */
export default function BlogIndexPage() {
    const posts = listPosts();
    return (
        <>
            <BlogNav />
            <section className="m-hero" style={{ paddingTop: 80, paddingBottom: 24 }}>
                <div className="m-hero-inner">
                    <span className="m-pill"><span className="dot" /> Notes from the team</span>
                    <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)' }}>Blog</h1>
                    <p className="m-hero-sub">
                        How cold email actually works in 2026. Deliverability, sourcing, copy that doesn't sound AI-generated, reply triage.
                    </p>
                </div>
            </section>

            <section className="m-section">
                {posts.length === 0 ? (
                    <div className="m-blog-empty">
                        <p>No posts yet. We're cooking.</p>
                    </div>
                ) : (
                    <div className="m-blog-grid">
                        {posts.map((p) => (
                            <Link key={p.slug} href={`/blog/${p.slug}`} className="m-blog-card">
                                {p.hero && (
                                    <div className="m-blog-card-hero">
                                        <Image
                                            src={p.hero}
                                            alt={p.title}
                                            width={640}
                                            height={360}
                                            style={{ width: '100%', height: 'auto' }}
                                        />
                                    </div>
                                )}
                                <div className="m-blog-card-body">
                                    <div className="m-blog-card-meta">
                                        <span>{formatDate(p.date)}</span>
                                        {p.reading_minutes && <span>· {p.reading_minutes} min read</span>}
                                    </div>
                                    <h2 className="m-blog-card-title">{p.title}</h2>
                                    {p.excerpt && <p className="m-blog-card-excerpt">{p.excerpt}</p>}
                                    {p.tags && p.tags.length > 0 && (
                                        <div className="m-blog-card-tags">
                                            {p.tags.slice(0, 3).map((t) => (
                                                <span key={t} className="m-blog-tag">{t}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <BlogFooter />
        </>
    );
}

function BlogNav() {
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
                    <a href="https://app.gensend.ai/login" className="m-btn-ghost">Login</a>
                    <a href="https://app.gensend.ai/register" className="m-btn-primary">Get Started</a>
                </div>
            </div>
        </header>
    );
}

function BlogFooter() {
    return (
        <footer className="m-footer">
            <div className="m-footer-inner">
                <div className="m-footer-watermark">GENSEND</div>
                <div className="m-footer-legal">
                    © {new Date().getFullYear()} Gensend.&nbsp;&nbsp;adam@gensend.ai
                </div>
            </div>
        </footer>
    );
}

function formatDate(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } catch {
        return iso;
    }
}
