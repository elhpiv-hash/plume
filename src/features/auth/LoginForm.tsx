import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { normalizeUsername } from '@/lib/validators';

interface LoginFormProps {
  onSwitch: () => void;
}

export function LoginForm({ onSwitch }: LoginFormProps) {
  const { login } = useAuth();
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
        label="@юзернейм"
        leading="@"
        autoComplete="username"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setError(null);
        }}
        placeholder="ты"
      />
      <Input
        label="Пароль"
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
        Войти
      </Button>
      <p className="text-center text-sm text-muted">
        Ещё без аккаунта?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-fg hover:underline">
          Создать
        </button>
      </p>
    </form>
  );
}
