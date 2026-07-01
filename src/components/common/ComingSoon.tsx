import { Icon, type IconName } from '@/components/ui/Icon';
import { useI18n } from '@/hooks/useI18n';
import type { TranslationKey } from '@/i18n/types';

interface ComingSoonProps {
  icon: IconName;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

/**
 * Premium placeholder for a reserved navigation slot. Monochrome (no champagne —
 * that stays exclusive to the Signal), themed via tokens, adaptive. Reads as an
 * intentional teaser rather than a dead stub.
 */
export function ComingSoon({ icon, titleKey, descKey }: ComingSoonProps) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center px-8 py-20 text-center animate-fade-in">
      <div className="relative mb-6">
        <span className="absolute inset-0 -z-10 rounded-full bg-fg/[0.04] blur-2xl" />
        <span className="grid h-20 w-20 place-items-center rounded-full border border-border bg-surface text-fg">
          <Icon name={icon} size={34} />
        </span>
      </div>
      <span className="mb-3 rounded-full border border-border-strong px-3 py-1 text-xs font-display font-semibold uppercase tracking-wider text-muted">
        {t('common.soon')}
      </span>
      <h2 className="font-display text-2xl font-bold tracking-tight text-balance">{t(titleKey)}</h2>
      <p className="mt-2 max-w-sm text-base leading-relaxed text-muted text-balance">{t(descKey)}</p>
    </div>
  );
}
