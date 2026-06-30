import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Logo } from '@/components/ui/Logo';
import { LoginForm } from '@/features/auth/LoginForm';
import { RegisterForm } from '@/features/auth/RegisterForm';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/cn';

type Mode = 'start' | 'login' | 'register';

/** Visual-only provider buttons — wired to a gentle "later" for now. */
function ProviderStub({ icon, label, onClick }: { icon: 'apple' | 'phone'; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-border-strong',
        'bg-surface text-base font-display font-semibold text-fg transition-colors hover:bg-surface-hover',
      )}
    >
      <Icon name={icon} size={20} />
      {label}
    </button>
  );
}

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>('start');
  const { notify } = useToast();

  const soon = () => notify('Этот вход добавим позже. Пока — через @юзернейм.');

  return (
    <div className="flex min-h-[100dvh] flex-col lg:flex-row">
      {/* Brand panel */}
      <section className="relative flex flex-col justify-between overflow-hidden border-b border-border bg-elevated px-7 py-10 lg:w-[46%] lg:border-b-0 lg:border-r lg:px-14 lg:py-14">
        <span className="pointer-events-none absolute -right-16 -top-10 text-fg/[0.04] lg:-right-10">
          <Icon name="feather" size={340} />
        </span>
        <Logo />
        <div className="relative mt-12 lg:mt-0">
          <h1 className="font-display text-display font-bold leading-[0.95] tracking-tight text-balance lg:text-hero">
            Лёгкая
            <br />
            социальная
            <br />
            сеть.
          </h1>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-muted text-balance">
            Никаких лишних деталей — только твой голос. Напиши первое перо и подними Сигнал дня.
          </p>
        </div>
        <p className="relative mt-12 hidden text-sm text-faint lg:block">
          Прототип. Всё работает в памяти сессии — старт с чистого листа.
        </p>
      </section>

      {/* Auth panel */}
      <section className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-sm animate-scale-in">
          {mode === 'start' ? (
            <div className="flex flex-col gap-4">
              <header className="mb-2 text-center">
                <h2 className="font-display text-2xl font-bold tracking-tight">Добро в Plume</h2>
                <p className="mt-1 text-base text-muted">Заходи или заводи аккаунт за полминуты.</p>
              </header>
              <Button size="lg" fullWidth onClick={() => setMode('register')}>
                Создать аккаунт
              </Button>
              <Button variant="secondary" size="lg" fullWidth onClick={() => setMode('login')}>
                Войти
              </Button>

              <div className="my-2 flex items-center gap-3 text-xs text-faint">
                <span className="h-px flex-1 bg-border" />
                или
                <span className="h-px flex-1 bg-border" />
              </div>

              <ProviderStub icon="apple" label="Войти через Apple" onClick={soon} />
              <ProviderStub icon="phone" label="Продолжить по номеру" onClick={soon} />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <header>
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  {mode === 'login' ? 'С возвращением' : 'Создай аккаунт'}
                </h2>
                <p className="mt-1 text-base text-muted">
                  {mode === 'login' ? 'Войди под своим @юзернеймом.' : 'Пара полей — и ты в воздухе.'}
                </p>
              </header>

              {mode === 'login' ? (
                <LoginForm onSwitch={() => setMode('register')} />
              ) : (
                <RegisterForm onSwitch={() => setMode('login')} />
              )}

              <button
                type="button"
                onClick={() => setMode('start')}
                className="self-center text-sm text-muted hover:text-fg transition-colors"
              >
                ← Назад
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
