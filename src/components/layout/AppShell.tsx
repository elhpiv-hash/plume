import { useState, type ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Modal } from '@/components/ui/Modal';
import { Icon } from '@/components/ui/Icon';
import { SignalBadge } from '@/components/post/SignalBadge';
import { PostComposer } from '@/components/post/PostComposer';
import { useNavigation } from '@/hooks/useNavigation';
import { usePosts } from '@/hooks/usePosts';
import { useI18n } from '@/hooks/useI18n';
import type { TranslationKey } from '@/i18n/types';

const ROUTE_TITLE: Record<string, TranslationKey> = {
  feed: 'route.feed',
  profile: 'route.profile',
  settings: 'route.settings',
  'edit-profile': 'route.editProfile',
};

/** The right rail: a quiet explainer for the Signal ritual + live availability. */
function RightRail() {
  const { signalAvailable } = usePosts();
  const { t } = useI18n();
  return (
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 flex-col gap-4 px-5 py-6 xl:flex">
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <SignalBadge />
        </div>
        <p className="mt-3 text-base leading-relaxed text-muted">{t('rightRail.desc')}</p>
        <p className="mt-3 text-sm text-faint">
          {signalAvailable ? t('rightRail.free') : t('rightRail.used')}
        </p>
      </div>
      <p className="px-2 text-xs leading-relaxed text-faint">{t('rightRail.tagline')}</p>
    </aside>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { route, back, canGoBack } = useNavigation();
  const { t } = useI18n();
  const [composeOpen, setComposeOpen] = useState(false);
  const titleKey = ROUTE_TITLE[route.name];
  const title = titleKey ? t(titleKey) : 'Plume';

  return (
    <div className="mx-auto flex w-full max-w-[1280px]">
      <Sidebar onCompose={() => setComposeOpen(true)} />

      <main className="min-h-screen w-full flex-1 border-border lg:border-x lg:max-w-[640px]">
        {/* Sticky header — back/logo on the left, screen title. */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-bg/80 px-4 backdrop-blur-lg">
          {canGoBack ? (
            <button
              type="button"
              onClick={back}
              aria-label={t('nav.back')}
              className="grid h-9 w-9 place-items-center rounded-full text-fg hover:bg-surface-hover transition-colors"
            >
              <Icon name="back" size={20} />
            </button>
          ) : null}
          <h1 className="font-display text-lg font-bold tracking-tight">{title}</h1>
          {route.name === 'feed' ? (
            <span className="ml-auto animate-float text-signal" aria-hidden>
              <Icon name="feather" size={22} />
            </span>
          ) : null}
        </header>

        <div className="pb-24 lg:pb-10">{children}</div>
      </main>

      <RightRail />

      <MobileNav onCompose={() => setComposeOpen(true)} />

      <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title={t('compose.title')}>
        <PostComposer autoFocus onPublished={() => setComposeOpen(false)} />
      </Modal>
    </div>
  );
}
