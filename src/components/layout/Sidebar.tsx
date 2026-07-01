import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/cn';
import { NAV_ITEMS } from '@/config/navigation';
import type { Route } from '@/context/NavigationContext';

interface SidebarProps {
  onCompose: () => void;
}

export function Sidebar({ onCompose }: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const { route, navigate } = useNavigation();
  const { t } = useI18n();
  if (!currentUser) return null;

  return (
    <aside className="sticky top-0 hidden h-screen w-[88px] flex-col items-center gap-1 border-r border-border px-3 py-5 lg:flex xl:w-64 xl:items-stretch">
      <button
        type="button"
        onClick={() => navigate({ name: 'feed' })}
        className="mb-4 self-center xl:self-start xl:pl-3"
        aria-label={t('nav.logoHome')}
      >
        <Logo />
      </button>

      {/* Desktop shows every enabled entry (primary + secondary). Both bars are
          driven by the same NAV_ITEMS config. */}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.filter((item) => item.enabled).map((item) => {
          if (item.kind === 'action') {
            return (
              <Button
                key={item.id}
                onClick={onCompose}
                className="my-1 xl:w-full"
                aria-label={t('nav.composeAria')}
              >
                <span className="xl:hidden">
                  <Icon name={item.icon} size={20} />
                </span>
                <span className="hidden xl:inline">{t(item.i18nKey)}</span>
              </Button>
            );
          }
          const active = item.isActive(route, currentUser.username);
          const target: Route =
            item.route.name === 'profile'
              ? { name: 'profile', username: currentUser.username }
              : item.route;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(target)}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group flex items-center gap-4 rounded-full px-3 py-2.5 transition-colors duration-200',
                'justify-center xl:justify-start hover:bg-surface-hover',
                active ? 'text-fg' : 'text-muted hover:text-fg',
              )}
            >
              <Icon name={item.icon} size={24} filled={active && item.icon === 'home'} />
              <span className={cn('hidden text-lg xl:inline font-display', active ? 'font-bold' : 'font-medium')}>
                {t(item.i18nKey)}
              </span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => navigate({ name: 'profile', username: currentUser.username })}
        className="mt-2 flex items-center gap-3 rounded-full p-2 transition-colors hover:bg-surface-hover xl:pr-3"
      >
        <Avatar user={currentUser} size="sm" />
        <span className="hidden min-w-0 flex-1 text-left xl:block">
          <span className="block truncate font-display text-sm font-semibold">{currentUser.name}</span>
          <span className="block truncate text-xs text-muted">@{currentUser.username}</span>
        </span>
        <span
          role="button"
          tabIndex={0}
          aria-label={t('nav.logout')}
          onClick={(e) => {
            e.stopPropagation();
            logout();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation();
              logout();
            }
          }}
          className="hidden h-8 w-8 place-items-center rounded-full text-muted hover:bg-surface hover:text-fg xl:grid"
        >
          <Icon name="logout" size={18} />
        </span>
      </button>
    </aside>
  );
}
