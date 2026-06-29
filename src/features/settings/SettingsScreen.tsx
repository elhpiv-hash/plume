import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Toggle } from '@/components/ui/Toggle';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';

interface RowProps {
  icon: IconName;
  title: string;
  subtitle: string;
  onClick: () => void;
}

/** Forward-looking settings entries — present and styled, logic comes later. */
function SettingsRow({ icon, title, subtitle, onClick }: RowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-surface-hover"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-fg">
        <Icon name={icon} size={20} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display font-semibold">{title}</span>
        <span className="block text-sm text-muted">{subtitle}</span>
      </span>
      <span className="text-faint">
        <Icon name="back" size={18} className="rotate-180" />
      </span>
    </button>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="px-4 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-faint">
      {children}
    </h2>
  );
}

export function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  const { logout, currentUser } = useAuth();
  const { notify } = useToast();
  const isLight = theme === 'light';

  const soon = (what: string) => notify(`${what} — раздел в работе.`);

  return (
    <div className="animate-fade-in">
      <SectionTitle>Оформление</SectionTitle>
      <div className="flex items-center gap-4 px-4 py-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-fg">
          <Icon name={isLight ? 'sparkle' : 'feather'} size={20} filled />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-semibold">Тема</span>
          <span className="block text-sm text-muted">
            Сейчас {isLight ? 'светлая' : 'тёмная'}. Обе сделаны одинаково дорого.
          </span>
        </span>
        <Toggle
          checked={isLight}
          onChange={(next) => setTheme(next ? 'light' : 'dark')}
          label="Переключить тему"
        />
      </div>

      <SectionTitle>Аккаунт</SectionTitle>
      <div className="divide-y divide-border border-y border-border">
        <SettingsRow icon="user" title="Профиль и данные" subtitle={`@${currentUser?.username ?? ''}`} onClick={() => soon('Аккаунт')} />
        <SettingsRow icon="shield" title="Приватность" subtitle="Кто видит твои перья" onClick={() => soon('Приватность')} />
        <SettingsRow icon="bell" title="Уведомления" subtitle="Сигналы, ответы, репосты" onClick={() => soon('Уведомления')} />
      </div>

      <div className="px-4 py-6">
        <Button variant="danger" fullWidth onClick={logout}>
          <Icon name="logout" size={18} /> Выйти из аккаунта
        </Button>
      </div>
    </div>
  );
}
