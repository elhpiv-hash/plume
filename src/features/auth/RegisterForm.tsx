import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/hooks/useI18n';
import {
  normalizeUsername,
  validateName,
  validatePassword,
  validateUsername,
} from '@/lib/validators';
import { containsProfanity } from '@/lib/profanity';

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
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Basic validity first, then the profanity gate on the human-visible fields.
    const nameKey = validateName(name) ?? (containsProfanity(name) ? 'profanity.blocked' : null);
    const usernameKey =
      validateUsername(username) ?? (containsProfanity(username) ? 'profanity.blocked' : null);
    const passwordKey = validatePassword(password);

    const next: Errors = {
      name: nameKey ? t(nameKey) : null,
      username: usernameKey ? t(usernameKey) : null,
      password: passwordKey ? t(passwordKey) : null,
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
        label={t('field.name')}
        autoComplete="name"
        value={name}
        error={errors.name}
        onChange={(e) => {
          setName(e.target.value);
          clear('name');
        }}
        placeholder={t('field.name.placeholder')}
      />
      <Input
        label={t('field.username')}
        leading="@"
        autoComplete="username"
        value={username}
        error={errors.username}
        hint={!errors.username ? t('field.username.hint') : undefined}
        onChange={(e) => {
          setUsername(e.target.value);
          clear('username');
        }}
        placeholder={t('field.username.placeholder')}
      />
      <Input
        label={t('field.password')}
        type="password"
        autoComplete="new-password"
        value={password}
        error={errors.password}
        onChange={(e) => {
          setPassword(e.target.value);
          clear('password');
        }}
        placeholder={t('field.password.placeholder')}
      />
      <Button type="submit" size="lg" fullWidth className="mt-1">
        {t('register.submit')}
      </Button>
      <p className="text-center text-sm text-muted">
        {t('register.switchPrompt')}{' '}
        <button type="button" onClick={onSwitch} className="font-semibold text-fg hover:underline">
          {t('register.switchAction')}
        </button>
      </p>
    </form>
  );
}
