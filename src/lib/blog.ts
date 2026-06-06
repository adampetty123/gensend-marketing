/**
 * Blog content loader. Posts are markdown files in /content/blog/*.md.
 * Each file has YAML frontmatter at the top:
 *
 *   ---
 *   title: "Cold email is broken. Here's the fix."
 *   slug: cold-email-broken
 *   date: 2026-06-06
 *   excerpt: "One-paragraph hook that shows up on the index card."
 *   author: "Adam Petty"
 *   tags: ["cold-email", "deliverability"]
 *   hero: "/blog/cold-email-broken.jpg"
 *   reading_minutes: 4
 *   ---
 *
 * To add a new post: drop a `.md` file in `/content/blog`, commit, deploy.
 * The index page lists posts newest-first, the [slug] page renders one.
 * No CMS round-trip, no DB, fully static at build time. SEO clean.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

export type PostFrontmatter = {
    title: string;
    slug: string;
    date: string; // ISO date — YYYY-MM-DD
    excerpt?: string;
    author?: string;
    tags?: string[];
    hero?: string;
    reading_minutes?: number;
};

export type Post = PostFrontmatter & {
    contentHtml: string;
    raw: string;
};

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

function ensureDir(): void {
    if (!fs.existsSync(CONTENT_DIR)) {
        // First build with no posts yet — return an empty list rather
        // than crash. The blog index renders a placeholder.
        fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }
}

function readFile(slug: string): { fm: PostFrontmatter; body: string } | null {
    ensureDir();
    const candidates = [
        path.join(CONTENT_DIR, `${slug}.md`),
        path.join(CONTENT_DIR, `${slug}.mdx`),
    ];
    const filePath = candidates.find((c) => fs.existsSync(c));
    if (!filePath) return null;
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(raw);
    const fm = parsed.data as PostFrontmatter;
    // Default slug to the filename so authors don't have to repeat it.
    if (!fm.slug) fm.slug = slug;
    return { fm, body: parsed.content };
}

/**
 * Lightweight summary used by the index page. Skips the markdown->html
 * pass for performance — index doesn't need rendered HTML.
 */
export function listPosts(): PostFrontmatter[] {
    ensureDir();
    const files = fs
        .readdirSync(CONTENT_DIR)
        .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
    const posts = files
        .map((file) => {
            const slug = file.replace(/\.mdx?$/, '');
            const parsed = readFile(slug);
            return parsed ? parsed.fm : null;
        })
        .filter(Boolean) as PostFrontmatter[];
    // Newest first.
    posts.sort((a, b) => (a.date < b.date ? 1 : -1));
    return posts;
}

/**
 * Full post — frontmatter + rendered HTML body. Used by /blog/[slug].
 */
export async function getPost(slug: string): Promise<Post | null> {
    const parsed = readFile(slug);
    if (!parsed) return null;
    const processed = await remark().use(remarkHtml).process(parsed.body);
    return {
        ...parsed.fm,
        contentHtml: processed.toString(),
        raw: parsed.body,
    };
}

/**
 * Two same-tag posts, excluding the current one. Powers the "Read next"
 * row at the bottom of /blog/[slug]. Falls back to the most-recent
 * other posts when nothing shares a tag.
 */
export function relatedPosts(slug: string, limit = 3): PostFrontmatter[] {
    const all = listPosts();
    const me = all.find((p) => p.slug === slug);
    if (!me) return all.slice(0, limit);
    const myTags = new Set(me.tags ?? []);
    const scored = all
        .filter((p) => p.slug !== slug)
        .map((p) => ({
            p,
            score: (p.tags ?? []).filter((t) => myTags.has(t)).length,
        }))
        .sort((a, b) => b.score - a.score || (a.p.date < b.p.date ? 1 : -1))
        .slice(0, limit)
        .map((s) => s.p);
    return scored;
}
