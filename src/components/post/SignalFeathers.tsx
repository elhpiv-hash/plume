import { Icon } from '@/components/ui/Icon';

/**
 * Champagne feathers drifting down inside a "Сигнал дня" card.
 * Purely decorative — hidden from a11y tree and for reduced-motion users.
 *
 * Render it as the first child of the signal <article>, which must be
 * `relative overflow-hidden`. Keep the card's real content in a `relative`
 * wrapper so it stacks above the feathers.
 */

type Feather = {
  left: string;
  size: number;
  /** animation-duration */
  dur: string;
  /** animation-delay */
  delay: string;
  opacity: number;
};

const FEATHERS: Feather[] = [
  { left: '10%', size: 17, dur: '6.4s', delay: '0s', opacity: 0.5 },
  { left: '28%', size: 13, dur: '7.8s', delay: '1.6s', opacity: 0.4 },
  { left: '48%', size: 19, dur: '5.6s', delay: '0.7s', opacity: 0.55 },
  { left: '66%', size: 14, dur: '8.2s', delay: '2.6s', opacity: 0.42 },
  { left: '84%', size: 16, dur: '6.9s', delay: '3.4s', opacity: 0.5 },
];

export function SignalFeathers() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg motion-reduce:hidden"
    >
      {FEATHERS.map((f, i) => (
        <span
          key={i}
          className="absolute top-0 text-signal animate-feather-fall"
          style={{
            left: f.left,
            opacity: f.opacity,
            animationDuration: f.dur,
            animationDelay: f.delay,
          }}
        >
          <Icon name="feather" size={f.size} />
        </span>
      ))}
    </div>
  );
}
