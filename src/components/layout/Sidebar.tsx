import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { cn } from '@/lib/cn';
import type { Route } from '@/context/NavigationContext';

interface SidebarProps {
  onCompose: () => void;
}

interface NavLink {
  icon: IconName;
  label: string;
  route: Route;
  isActive: (route: Route, username: string) => boolean;
}

const LINKS: NavLink[] = [
  {
    icon: 'home',
    label: 'Лента',
    route: { name: 'feed' },
    isActive: (r) => r.name === 'feed',
  },
  {
    icon: 'user',
    label: 'Профиль',
    route: { name: 'profile', username: '' },
    isActive: (r, username) => r.name === 'profile' && r.username === username,
  },
  {
    icon: 'settings',
    label: 'Настройки',
    route: { name: 'settings' },
    isActive: (r) => r.name === 'settings',
  },
];

export function Sidebar({ onCompose }: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const { route, navigate } = useNavigation();
  if (!currentUser) return null;

  return (
    <aside className="sticky top-0 hidden h-screen w-[88px] flex-col items-center gap-1 border-r border-border px-3 py-5 lg:flex xl:w-64 xl:items-stretch">
      <button
        type="button"
        onClick={() => navigate({ name: 'feed' })}
        className="mb-4 self-center xl:self-start xl:pl-3"
        aria-label="Plume — на главную"
      >
        <Logo />
      </button>

      <nav className="flex flex-1 flex-col gap-1">
        {LINKS.map((link) => {
          const active = link.isActive(route, currentUser.username);
          const target: Route =
            link.route.name === 'profile'
              ? { name: 'profile', username: currentUser.username }
              : link.route;
          return (
            <button
              key={link.label}
              type="button"
              onClick={() => navigate(target)}
              className={cn(
                'group flex items-center gap-4 rounded-full px-3 py-2.5 transition-colors duration-200',
                'justify-center xl:justify-start hover:bg-surface-hover',
                active ? 'text-fg' : 'text-muted hover:text-fg',
              )}
            >
              <Icon name={link.icon} size={24} filled={active && link.icon === 'home'} />
              <span className={cn('hidden text-lg xl:inline font-display', active ? 'font-bold' : 'font-medium')}>
                {link.label}
              </span>
            </button>
          );
        })}

        <Button onClick={onCompose} className="mt-3 xl:w-full" aria-label="Создать пост">
          <span className="xl:hidden">
            <Icon name="plus" size={20} />
          </span>
          <span className="hidden xl:inline">Новое перо</span>
        </Button>
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
          aria-label="Выйти"
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
