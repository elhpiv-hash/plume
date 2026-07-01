import { EmptyState } from '@/components/ui/EmptyState';
import { useI18n } from '@/hooks/useI18n';

/** Shown when the global timeline has no posts yet. */
export function FeedEmptyState() {
  const { t } = useI18n();
  return (
    <EmptyState
      icon="feather"
      title={t('feed.empty.title')}
      description={t('feed.empty.desc')}
    />
  );
}
