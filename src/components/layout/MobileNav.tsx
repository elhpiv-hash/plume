import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/cn';
import { NAV_ITEMS, type NavItem } from '@/config/navigation';

interface MobileNavProps {
  onCompose: () => void;
}

export function MobileNav({ onCompose }: MobileNavProps) {
  const { currentUser } = useAuth();
  const { route, navigate } = useNavigation();
  const { t } = useI18n();
  if (!currentUser) return null;

  // Same NAV_ITEMS as the desktop Sidebar — mobile shows the primary set,
  // split around the central compose action into left/right groups.
  const primary = NAV_ITEMS.filter((item) => item.enabled && item.placement === 'primary');
  const actionIndex = primary.findIndex((item) => item.kind === 'action');
  const left = actionIndex >= 0 ? primary.slice(0, actionIndex) : primary;
  const right = actionIndex >= 0 ? primary.slice(actionIndex + 1) : [];

  const renderItem = (item: NavItem) => {
    if (item.kind !== 'route') return null;
    const active = item.isActive(route, currentUser.username);
    const target =
      item.route.name === 'profile'
        ? { name: 'profile' as const, username: currentUser.username }
        : item.route;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => navigate(target)}
        aria-label={t(item.i18nKey)}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors',
          active ? 'text-fg' : 'text-muted',
        )}
      >
        <Icon name={item.icon} size={24} filled={active && item.icon === 'home'} />
      </button>
    );
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center border-t border-border bg-bg/85 backdrop-blur-lg pb-[env(safe-area-inset-bottom)] lg:hidden">
      {left.map(renderItem)}
      <div className="flex flex-1 justify-center">
        <button
          type="button"
          onClick={onCompose}
          aria-label={t('nav.composeAria')}
          className="-mt-6 grid h-14 w-14 place-items-center rounded-full bg-invert text-invert-fg shadow-lift transition-transform active:scale-95"
        >
          <Icon name="plus" size={26} />
        </button>
      </div>
      {right.map(renderItem)}
    </nav>
  );
}
