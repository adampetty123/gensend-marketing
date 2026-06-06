import type { MetadataRoute } from 'next';

/**
 * Sitemap is generated from the route list. Add routes here as new
 * marketing pages ship (/pricing, /about, /blog/*).
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();
    return [
        {
            url: 'https://www.gensend.ai/',
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1,
        },
    ];
}
