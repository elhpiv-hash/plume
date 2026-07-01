import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Toggle } from '@/components/ui/Toggle';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from '@/hooks/useToast';
import { useI18n } from '@/hooks/useI18n';
import { LOCALES } from '@/i18n/registry';
import { cn } from '@/lib/cn';

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
        <span className="block truncate text-sm text-muted">{subtitle}</span>
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
  const { t, locale, setLocale } = useI18n();
  const isLight = theme === 'light';

  const soon = (what: string) => notify(t('settings.soon', { what }));

  return (
    <div className="animate-fade-in">
      <SectionTitle>{t('settings.section.appearance')}</SectionTitle>
      <div className="flex items-center gap-4 px-4 py-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-fg">
          <Icon name={isLight ? 'sparkle' : 'feather'} size={20} filled />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-semibold">{t('settings.theme.title')}</span>
          <span className="block text-sm text-muted">
            {t('settings.theme.desc', {
              theme: isLight ? t('settings.theme.light') : t('settings.theme.dark'),
            })}
          </span>
        </span>
        <Toggle
          checked={isLight}
          onChange={(next) => setTheme(next ? 'light' : 'dark')}
          label={t('settings.theme.toggle')}
        />
      </div>

      <SectionTitle>{t('settings.section.language')}</SectionTitle>
      <div className="flex items-center gap-4 px-4 py-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-fg">
          <Icon name="at" size={20} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display font-semibold">{t('settings.language.title')}</span>
          <span className="block text-sm text-muted">{t('settings.language.desc')}</span>
        </span>
        <div
          role="group"
          aria-label={t('settings.language.select')}
          className="inline-flex shrink-0 rounded-full border border-border-strong bg-surface p-0.5"
        >
          {LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              aria-pressed={locale === l.code}
              onClick={() => setLocale(l.code)}
              className={cn(
                'rounded-full px-3 py-1.5 text-sm font-display font-semibold transition-colors duration-200',
                locale === l.code ? 'bg-invert text-invert-fg' : 'text-muted hover:text-fg',
              )}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <SectionTitle>{t('settings.section.account')}</SectionTitle>
      <div className="divide-y divide-border border-y border-border">
        <SettingsRow
          icon="user"
          title={t('settings.account.title')}
          subtitle={`@${currentUser?.username ?? ''}`}
          onClick={() => soon(t('settings.account.label'))}
        />
        <SettingsRow
          icon="shield"
          title={t('settings.privacy.title')}
          subtitle={t('settings.privacy.desc')}
          onClick={() => soon(t('settings.privacy.title'))}
        />
        <SettingsRow
          icon="bell"
          title={t('settings.notifications.title')}
          subtitle={t('settings.notifications.desc')}
          onClick={() => soon(t('settings.notifications.title'))}
        />
      </div>

      <div className="px-4 py-6">
        <Button variant="danger" fullWidth onClick={logout}>
          <Icon name="logout" size={18} /> {t('settings.logout')}
        </Button>
      </div>
    </div>
  );
}
