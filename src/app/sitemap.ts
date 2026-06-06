import type { MetadataRoute } from 'next';
import { listPosts } from '@/lib/blog';

/**
 * Sitemap is generated from the route list + the markdown blog files.
 * Add static routes here as new marketing pages ship.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    const base = 'https://www.gensend.ai';
    const posts = listPosts();
    return [
        {
            url: `${base}/`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${base}/pricing`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
        },
        {
            url: `${base}/blog`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...posts.map((p) => ({
            url: `${base}/blog/${p.slug}`,
            lastModified: p.date ? new Date(p.date) : now,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ];
}
