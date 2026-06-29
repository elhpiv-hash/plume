import { useState, type ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Modal } from '@/components/ui/Modal';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { SignalBadge } from '@/components/post/SignalBadge';
import { PostComposer } from '@/components/post/PostComposer';
import { useNavigation } from '@/hooks/useNavigation';
import { usePosts } from '@/hooks/usePosts';

const ROUTE_TITLE: Record<string, string> = {
  feed: 'Лента',
  profile: 'Профиль',
  settings: 'Настройки',
  'edit-profile': 'Редактировать профиль',
};

/** The right rail: a quiet explainer for the Signal ritual + live availability. */
function RightRail() {
  const { signalAvailable } = usePosts();
  return (
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0 flex-col gap-4 px-5 py-6 xl:flex">
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="flex items-center justify-between">
          <SignalBadge />
        </div>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Раз в сутки ты можешь поднять одно перо как{' '}
          <span className="text-fg">Сигнал дня</span> — оно засветится в ленте и закрепится в профиле.
        </p>
        <p className="mt-3 text-sm text-faint">
          {signalAvailable ? 'Сегодня сигнал ещё свободен.' : 'На сегодня сигнал уже поднят.'}
        </p>
      </div>
      <p className="px-2 text-xs leading-relaxed text-faint">
        Plume — лёгкая социальная сеть. Прототип: всё живёт в памяти сессии.
      </p>
    </aside>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { route, back, canGoBack } = useNavigation();
  const [composeOpen, setComposeOpen] = useState(false);
  const title = ROUTE_TITLE[route.name] ?? 'Plume';

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
              aria-label="Назад"
              className="grid h-9 w-9 place-items-center rounded-full text-fg hover:bg-surface-hover transition-colors"
            >
              <Icon name="back" size={20} />
            </button>
          ) : (
            <span className="lg:hidden">
              <Logo variant="mark" size={20} />
            </span>
          )}
          <h1 className="font-display text-lg font-bold tracking-tight">{title}</h1>
        </header>

        <div className="pb-24 lg:pb-10">{children}</div>
      </main>

      <RightRail />

      <MobileNav onCompose={() => setComposeOpen(true)} />

      <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title="Новое перо">
        <PostComposer autoFocus onPublished={() => setComposeOpen(false)} />
      </Modal>
    </div>
  );
}
