'use client';

import GenFace from './GenFace';

/**
 * Composite Gensend logo — animated face + "Gensend" serif wordmark.
 *
 * Matches the final brand mark Adam shipped: rounded magenta face on
 * the left, "Gensend" wordmark in the inherited serif font on the
 * right, vertically centred. Uses the live GenFace component so the
 * face keeps breathing/blinking — the wordmark stays static.
 *
 * Size controls the face height; wordmark autoscales to match the
 * cap height ratio from the source PNG (face ≈ wordmark ascender +
 * descender, with ~12% gap between them).
 */
type Props = {
    size?: number;
    className?: string;
    /** Wordmark colour — defaults to dark (matches the source). Pass
     *  "#fff" or any colour for inverted contexts (dark footers). */
    color?: string;
};

export default function Logo({ size = 40, className = '', color = '#0a0a0a' }: Props) {
    // Wordmark sits at ~78% of the face height — matches the source
    // PNG's optical balance. The serif font's cap height is about
    // 0.72 of font-size, so we set font-size = size * 0.78 / 0.72.
    const fontSize = Math.round(size * 0.78 / 0.72);
    return (
        <span className={`inline-flex items-center ${className}`} style={{ gap: Math.round(size * 0.16), lineHeight: 0 }}>
            <GenFace size={size} />
            <span
                style={{
                    fontFamily: 'var(--font-serif, "F37 Zagma Serif", "Tiempos Headline", Georgia, serif)',
                    fontSize,
                    lineHeight: 1,
                    color,
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                }}
            >
                GenSend
            </span>
        </span>
    );
}
