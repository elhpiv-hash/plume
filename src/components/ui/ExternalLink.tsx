import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Modal } from '@/components/ui/Modal';
import { useI18n } from '@/hooks/useI18n';
import { sanitizeUrl } from '@/lib/sanitizeUrl';
import { cn } from '@/lib/cn';

interface ExternalLinkProps {
  /** Raw, user-supplied URL. Sanitized before anything is rendered/opened. */
  url: string;
  /** Optional display label; the real host is always shown alongside it. */
  label?: string;
  className?: string;
}

/**
 * A safe outbound link. Unsafe schemes never render as clickable. The visible
 * text always exposes the real host (labels can lie), and following the link
 * goes through an interstitial confirmation — the front-end anti-phishing step.
 */
export function ExternalLink({ url, label, className }: ExternalLinkProps) {
  const { t } = useI18n();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const result = sanitizeUrl(url);

  // Refuse to render a dangerous/invalid URL as a link — show inert text.
  if (!result.ok) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-sm text-muted', className)}>
        <Icon name="link" size={15} className="text-faint" />
        <span className="truncate">{label || url}</span>
      </span>
    );
  }

  const { safeUrl, host } = result.value;
  const showLabel = label && label.trim() && label.trim() !== host;

  const proceed = () => {
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
    setConfirmOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setConfirmOpen(true);
        }}
        className={cn(
          'inline-flex max-w-[16rem] items-center gap-1.5 text-sm text-fg underline-offset-2 hover:underline',
          className,
        )}
      >
        <Icon name="link" size={15} className="text-muted" />
        <span className="truncate">{showLabel ? label : host}</span>
        {showLabel ? <span className="shrink-0 text-faint">· {host}</span> : null}
      </button>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title={t('external.title')}>
        <p className="text-base leading-relaxed text-muted">
          {t('external.body', { host })}
        </p>
        <div className="mt-5 flex items-center justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={() => setConfirmOpen(false)}>
            {t('external.cancel')}
          </Button>
          <Button size="sm" onClick={proceed}>
            {t('external.proceed')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
