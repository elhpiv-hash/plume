import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';
import { normalizeUsername } from '@/lib/validators';

interface LoginFormProps {
  onSwitch: () => void;
}

export function LoginForm({ onSwitch }: LoginFormProps) {
  const { login } = useAuth();
  const { t } = useI18n();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = login(normalizeUsername(username), password);
    if (!result.ok) setError(result.error);
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label={t('field.username')}
        leading="@"
        autoComplete="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setError(null);
        }}
        placeholder={t('field.username.placeholder')}
      />
      <Input
        label={t('field.password')}
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError(null);
        }}
        placeholder="••••••"
        error={error}
      />
      <Button type="submit" size="lg" fullWidth className="mt-1">
        {t('login.submit')}
      </Button>
      <p className="text-center text-sm text-muted">
        {t('login.switchPrompt')}{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-fg hover:underline">
          {t('login.switchAction')}
        </button>
      </p>
    </form>
  );
}
