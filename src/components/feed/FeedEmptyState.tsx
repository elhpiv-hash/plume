import { EmptyState } from '@/components/ui/EmptyState';

/** Shown when the global timeline has no posts yet. */
export function FeedEmptyState() {
  return (
    <EmptyState
      icon="feather"
      title="Тут пока тихо"
      description="Воздух чист и ничей. Напиши первое перо — и лента оживёт."
    />
  );
}
