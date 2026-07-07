import { useEffect, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui/Icon';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/cn';
import type { PostMedia } from '@/types';

interface PostMediaGridProps {
  media: PostMedia[];
}

/** Dark, quiet full-screen viewer for a single image. Closes on Esc / outside click. */
function Lightbox({ item, onClose }: { item: PostMedia; onClose: () => void }) {
  const { t } = useI18n();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label={t('modal.close')}
        onClick={onClose}
        className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <Icon name="close" size={22} />
      </button>
      <img
        src={item.url}
        alt={item.alt ?? ''}
        className="max-h-[90vh] max-w-[92vw] rounded-md object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>,
    document.body,
  );
}

/**
 * The image grid under a feather's text: one image runs large, 2–4 tile into a
 * neat mosaic. Tapping an image opens the lightbox; clicks never bubble up to
 * open the thread. Layout only — the data lives on the post's `media`.
 */
export function PostMediaGrid({ media }: PostMediaGridProps) {
  const { t } = useI18n();
  const [lightbox, setLightbox] = useState<number | null>(null);
  if (media.length === 0) return null;

  const open = (i: number) => (e: MouseEvent) => {
    e.stopPropagation();
    setLightbox(i);
  };

  const tile = (item: PostMedia, i: number, className?: string) => (
    <button
      key={i}
      type="button"
      aria-label={t('media.open')}
      onClick={open(i)}
      className={cn('group relative block overflow-hidden bg-surface no-tap', className)}
    >
      <img
        src={item.url}
        alt={item.alt ?? ''}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 ease-plume group-hover:scale-[1.02]"
      />
    </button>
  );

  const active = lightbox !== null ? media[lightbox] : undefined;

  return (
    <>
      {media.length === 1 ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-border">
          <button
            type="button"
            aria-label={t('media.open')}
            onClick={open(0)}
            className="group block w-full no-tap"
          >
            <img
              src={media[0]!.url}
              alt={media[0]!.alt ?? ''}
              loading="lazy"
              className="max-h-[34rem] w-full object-cover"
            />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            'mt-3 grid h-72 gap-0.5 overflow-hidden rounded-lg border border-border bg-border sm:h-80',
            media.length === 2 ? 'grid-cols-2' : 'grid-cols-2 grid-rows-2',
          )}
        >
          {media.length === 3
            ? media.map((m, i) => tile(m, i, i === 0 ? 'row-span-2 h-full' : 'h-full'))
            : media.map((m, i) => tile(m, i, 'h-full'))}
        </div>
      )}

      {active ? <Lightbox item={active} onClose={() => setLightbox(null)} /> : null}
    </>
  );
}
