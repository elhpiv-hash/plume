import { Icon, type IconName } from '@/components/ui/Icon';
import { useAuth } from '@/hooks/useAuth';
import { useNavigation } from '@/hooks/useNavigation';
import { useI18n } from '@/hooks/useI18n';
import { cn } from '@/lib/cn';
import type { Route } from '@/context/NavigationContext';
import type { TranslationKey } from '@/i18n/types';

interface MobileNavProps {
  onCompose: () => void;
}

interface Item {
  icon: IconName;
  labelKey: TranslationKey;
  route: Route;
  active: (r: Route, username: string) => boolean;
}

export function MobileNav({ onCompose }: MobileNavProps) {
  const { currentUser } = useAuth();
  const { route, navigate } = useNavigation();
  const { t } = useI18n();
  if (!currentUser) return null;

  const left: Item[] = [
    { icon: 'home', labelKey: 'route.feed', route: { name: 'feed' }, active: (r) => r.name === 'feed' },
  ];
  const right: Item[] = [
    {
      icon: 'user',
      labelKey: 'route.profile',
      route: { name: 'profile', username: currentUser.username },
      active: (r, u) => r.name === 'profile' && r.username === u,
    },
    { icon: 'settings', labelKey: 'route.settings', route: { name: 'settings' }, active: (r) => r.name === 'settings' },
  ];

  const renderItem = (item: Item) => {
    const active = item.active(route, currentUser.username);
    return (
      <button
        key={item.labelKey}
        type="button"
        onClick={() => navigate(item.route)}
        aria-label={t(item.labelKey)}
        className={cn(
          'flex flex-1 flex-col items-center gap-0.5 py-2 transition-colors',
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
