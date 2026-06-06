import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPost, listPosts, relatedPosts } from '@/lib/blog';

/**
 * One blog post. Statically generated at build time.
 * Drop a new .md file in /content/blog and Vercel rebuild picks it up.
 */

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return listPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return { title: 'Not found' };
    return {
        title: `${post.title} — Gensend`,
        description: post.excerpt || post.title,
        openGraph: {
            title: post.title,
            description: post.excerpt || post.title,
            type: 'article',
            images: post.hero ? [post.hero] : undefined,
            authors: post.author ? [post.author] : undefined,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || post.title,
            images: post.hero ? [post.hero] : undefined,
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) notFound();
    const related = relatedPosts(slug, 3);
    return (
        <>
            <BlogNav />

            <article className="m-post">
                <header className="m-post-head">
                    <Link href="/blog" className="m-post-back">← All posts</Link>
                    <div className="m-post-meta">
                        <span>{formatDate(post.date)}</span>
                        {post.reading_minutes && <span>· {post.reading_minutes} min read</span>}
                        {post.author && <span>· {post.author}</span>}
                    </div>
                    <h1 className="m-post-title">{post.title}</h1>
                    {post.excerpt && <p className="m-post-excerpt">{post.excerpt}</p>}
                    {post.hero && (
                        <div className="m-post-hero">
                            <Image
                                src={post.hero}
                                alt={post.title}
                                width={1200}
                                height={630}
                                priority
                                style={{ width: '100%', height: 'auto', borderRadius: 14 }}
                            />
                        </div>
                    )}
                </header>

                <div
                    className="m-post-body"
                    dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />

                {post.tags && post.tags.length > 0 && (
                    <div className="m-post-tags">
                        {post.tags.map((t) => (
                            <span key={t} className="m-blog-tag">{t}</span>
                        ))}
                    </div>
                )}
            </article>

            {related.length > 0 && (
                <section className="m-section m-section-features">
                    <div className="m-section-head">
                        <span className="m-section-num">[continue]</span>
                        <h2>Read next.</h2>
                    </div>
                    <div className="m-blog-grid">
                        {related.map((p) => (
                            <Link key={p.slug} href={`/blog/${p.slug}`} className="m-blog-card">
                                <div className="m-blog-card-body">
                                    <div className="m-blog-card-meta">
                                        <span>{formatDate(p.date)}</span>
                                    </div>
                                    <h2 className="m-blog-card-title">{p.title}</h2>
                                    {p.excerpt && <p className="m-blog-card-excerpt">{p.excerpt}</p>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            <section className="m-cta-banner">
                <h2>Run your first campaign in 5 minutes.</h2>
                <p>Talk to the manager. It does the rest.</p>
                <a href="https://app.gensend.ai/register" className="m-btn-primary m-btn-lg">Get Started</a>
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
        return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return iso;
    }
}
