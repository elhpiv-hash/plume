import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import {
  normalizeUsername,
  validateName,
  validatePassword,
  validateUsername,
} from '@/lib/validators';

interface RegisterFormProps {
  onSwitch: () => void;
}

interface Errors {
  name?: string | null;
  username?: string | null;
  password?: string | null;
}

export function RegisterForm({ onSwitch }: RegisterFormProps) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {
      name: validateName(name),
      username: validateUsername(username),
      password: validatePassword(password),
    };
    setErrors(next);
    if (next.name || next.username || next.password) return;

    const result = register({
      name,
      username: normalizeUsername(username),
      password,
    });
    // The only failure left is a taken handle — surface it on the field.
    if (!result.ok) setErrors({ username: result.error });
  };

  const clear = (field: keyof Errors) =>
    setErrors((prev) => ({ ...prev, [field]: null }));

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Имя"
        autoComplete="name"
        value={name}
        error={errors.name}
        onChange={(e) => {
          setName(e.target.value);
          clear('name');
        }}
        placeholder="Как тебя звать"
      />
      <Input
        label="@юзернейм"
        leading="@"
        autoComplete="username"
        value={username}
        error={errors.username}
        hint={!errors.username ? 'Латиница, цифры, _. Виден всем.' : undefined}
        onChange={(e) => {
          setUsername(e.target.value);
          clear('username');
        }}
        placeholder="ты"
      />
      <Input
        label="Пароль"
        type="password"
        autoComplete="new-password"
        value={password}
        error={errors.password}
        onChange={(e) => {
          setPassword(e.target.value);
          clear('password');
        }}
        placeholder="минимум 6 символов"
      />
      <Button type="submit" size="lg" fullWidth className="mt-1">
        Создать аккаунт
      </Button>
      <p className="text-center text-sm text-muted">
        Уже есть аккаунт?{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-fg hover:underline">
          Войти
        </button>
      </p>
    </form>
  );
}
