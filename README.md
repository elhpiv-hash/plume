# Plume

Лёгкая социальная сеть (тип X/Twitter) — кликабельный фронт-прототип.
React + TypeScript + Tailwind + Vite. Бэкенда нет: всё состояние живёт в памяти
сессии, но реально работает. Старт **с чистого листа** — ни аккаунтов, ни постов,
ни подписок: первый запуск = онбординг.

## Запуск

```bash
npm install
npm run dev        # http://localhost:5181
npm run build      # tsc --noEmit + production build
npm run typecheck
```

## Архитектура

Слои разделены так, чтобы потом без переписывания UI подменить in-memory слой на
реальные сетевые вызовы.

```
src/
  app/            корень, провайдеры, in-memory роутинг (App, Providers, Router)
  components/
    ui/           примитивы: Button, Input, Avatar, Modal, Toggle, Tabs, Icon,
                  Logo, EmptyState, Toaster
    post/         PostCard, PostComposer, PostActions, SignalBadge
    feed/         Feed, FeedEmptyState
    profile/      ProfileHeader, ProfileTabs, ProfileScreen
    layout/       Sidebar, MobileNav, AppShell
  features/
    auth/         AuthScreen + LoginForm/RegisterForm + логика сессии
    settings/     SettingsScreen (переключатель темы)
  context/        AuthContext, ThemeContext, DataContext, NavigationContext,
                  ToastContext  (состояние через useReducer, не useState-хаос)
  hooks/          useAuth, useTheme, useData, useFeed, usePosts, useNavigation, useToast
  lib/            dataClient (data-слой), formatTime, validators, id, cn
  types/          User, Post, Session, Theme, Result, PostView …
  styles/         tokens.css (дизайн-токены), globals.css
```

### Data-слой — единственный шов для бэкенда

`src/lib/dataClient.ts` — нормализованный in-memory store + **чистый** reducer +
чистые селекторы. `context/DataContext.tsx` связывает их в императивный API:
`registerUser`, `authenticate`, `createPost`, `toggleLike`, `toggleRepost`,
`setFollow`, `setSignal`, `updateBio`. Каждый метод 1:1 ложится на эндпоинт —
чтобы перейти на сеть, переписывается только эта тонкая прослойка.

Дисциплина: reducer чистый и тотальный. Вся «грязь» (генерация id, `Date.now`,
календарный день) живёт на границе DataContext и передаётся в action — переходы
состояния полностью детерминированы.

## Что реализовано

- **Auth**: старт «Войти / Создать аккаунт», визуальные заглушки Apple и номера
  телефона, регистрация с проверкой уникальности `@username` в пределах сессии,
  валидация с ошибками в голосе бренда.
- **Лента**: композер, PostCard (лайк/ответ/репост со счётчиками — всё работает),
  сортировка по времени, мгновенное обновление.
- **Профиль**: шапка, био (редактируется), счётчики подписок/подписчиков,
  вкладки «Посты» / «Ответы», «Подписаться» / «Вы подписаны».
- **Настройки**: переключатель темы (тёмная/светлая) + заглушки разделов.
- **Сигнал дня**: один пост в сутки можно поднять как «Сигнал дня» —
  premium-оформление (champagne-аура + метка-перо), закрепляется в профиле,
  строгий лимит 1/сутки (UI блокирует, data-слой проверяет повторно).
- **Пустые состояния** оформлены как приглашение к действию, в голосе бренда.

## Дизайн

Монохром: глубокий графит с холодным подтоном (не чистый чёрный) и чистый белый.
Акцент — контрастом и формой (инвертированные кнопки, волосяные разделители,
мягкие тени), а не цветом. Единственная теплота — едва заметный тёплый тон на
hover и сдержанный champagne, зарезервированный под «Сигнал дня».

Темы переключаются одним `data-theme` на `<html>`. Цвета — RGB-каналы в
CSS-переменных (`--c-*`), смаппленные в Tailwind как
`rgb(var(--c-x) / <alpha-value>)`, поэтому все opacity-модификаторы работают, а
границы наследуются от цвета текста и инвертируются между темами автоматически.
Типографика: гротеск **Space Grotesk** на заголовки/ник, **Inter** на body.

> Прототип. localStorage не используется — состояние только в памяти
> (Context + reducer), как и требуется средой превью.
