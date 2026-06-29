/**
 * Field validation with messages written in the product voice. Returns either
 * null (valid) or a human, non-scolding error string.
 */

export const POST_MAX = 280;

export interface FieldRule {
  validate: (value: string) => string | null;
}

export function validateName(value: string): string | null {
  const v = value.trim();
  if (!v) return 'Как тебя звать? Без имени никак.';
  if (v.length > 40) return 'Имя длинновато — до 40 символов.';
  return null;
}

/** Normalizes a handle to its canonical form before validation/storage. */
export function normalizeUsername(value: string): string {
  return value.trim().replace(/^@+/, '').toLowerCase();
}

export function validateUsername(value: string): string | null {
  const v = normalizeUsername(value);
  if (!v) return 'Придумай @юзернейм — это твой адрес в Plume.';
  if (v.length < 3) return 'Коротковато. Минимум 3 символа.';
  if (v.length > 20) return 'Длинновато. Максимум 20 символов.';
  if (!/^[a-z0-9_]+$/.test(v)) return 'Только латиница, цифры и нижнее подчёркивание.';
  if (/^[0-9]/.test(v)) return 'Пусть начинается с буквы.';
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return 'Нужен пароль — хотя бы для виду.';
  if (value.length < 6) return 'Минимум 6 символов, так надёжнее.';
  return null;
}

export function validatePostText(value: string): string | null {
  const v = value.trim();
  if (!v) return 'Пустое перо не взлетит.';
  if (value.length > POST_MAX) return `Слишком длинно — на ${value.length - POST_MAX} символов больше нормы.`;
  return null;
}

/** Adds a default scheme so bare domains («plume.app») становятся валидными. */
export function normalizeUrl(value: string): string {
  const v = value.trim();
  if (!v) return '';
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
}

/** URL валиден или пуст (поле опционально). Сообщение — в голосе интерфейса. */
export function validateUrl(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  try {
    const url = new URL(normalizeUrl(v));
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return 'Ссылка должна начинаться с http(s).';
    }
    if (!url.hostname.includes('.')) return 'Похоже, это не ссылка. Проверь адрес.';
    return null;
  } catch {
    return 'Похоже, это не ссылка. Проверь адрес.';
  }
}
