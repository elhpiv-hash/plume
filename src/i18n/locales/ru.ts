/**
 * Russian interface dictionary — the canonical source of translation keys.
 *
 * This object is the single place that *defines* the set of keys (`as const`,
 * so `keyof typeof ru` becomes the `TranslationKey` union). Every other locale
 * must satisfy `Dict = Record<TranslationKey, string>`, which keeps the
 * dictionaries provably in sync at compile time.
 *
 * Copy is written in the same product voice as the original UI — warm, light,
 * never scolding. `{name}`-style placeholders are interpolated by `t()`.
 */
export const ru = {
  // ── Locale meta ──
  'locale.name.ru': 'Русский',
  'locale.name.en': 'English',

  // ── Brand / auth ──
  'auth.brand.title': 'Лёгкая социальная сеть.',
  'auth.brand.subtitle':
    'Никаких лишних деталей — только твой голос. Напиши первое перо и подними Сигнал дня.',
  'auth.brand.footer': 'Прототип. Всё работает в памяти сессии — старт с чистого листа.',
  'auth.start.title': 'Добро в Plume',
  'auth.start.subtitle': 'Заходи или заводи аккаунт за полминуты.',
  'auth.start.create': 'Создать аккаунт',
  'auth.start.login': 'Войти',
  'auth.start.or': 'или',
  'auth.provider.apple': 'Войти через Apple',
  'auth.provider.phone': 'Продолжить по номеру',
  'auth.provider.soon': 'Этот вход добавим позже. Пока — через @юзернейм.',
  'auth.login.title': 'С возвращением',
  'auth.login.subtitle': 'Войди под своим @юзернеймом.',
  'auth.register.title': 'Создай аккаунт',
  'auth.register.subtitle': 'Пара полей — и ты в воздухе.',
  'auth.back': '← Назад',

  // ── Auth forms ──
  'field.username': '@юзернейм',
  'field.username.placeholder': 'ты',
  'field.username.hint': 'Латиница, цифры, _. Виден всем.',
  'field.password': 'Пароль',
  'field.password.placeholder': 'минимум 6 символов',
  'field.name': 'Имя',
  'field.name.placeholder': 'Как тебя звать',
  'login.submit': 'Войти',
  'login.switchPrompt': 'Ещё без аккаунта?',
  'login.switchAction': 'Создать',
  'register.submit': 'Создать аккаунт',
  'register.switchPrompt': 'Уже есть аккаунт?',
  'register.switchAction': 'Войти',

  // ── Validation ──
  'validate.name.required': 'Как тебя звать? Без имени никак.',
  'validate.name.tooLong': 'Имя длинновато — до 40 символов.',
  'validate.username.required': 'Придумай @юзернейм — это твой адрес в Plume.',
  'validate.username.tooShort': 'Коротковато. Минимум 3 символа.',
  'validate.username.tooLong': 'Длинновато. Максимум 20 символов.',
  'validate.username.charset': 'Только латиница, цифры и нижнее подчёркивание.',
  'validate.username.startsWithLetter': 'Пусть начинается с буквы.',
  'validate.password.required': 'Нужен пароль — хотя бы для виду.',
  'validate.password.tooShort': 'Минимум 6 символов, так надёжнее.',
  'validate.post.empty': 'Пустое перо не взлетит.',
  'validate.post.tooLong': 'Слишком длинно — на {over} символов больше нормы.',
  'validate.url.scheme': 'Ссылка должна начинаться с http(s).',
  'validate.url.invalid': 'Похоже, это не ссылка. Проверь адрес.',

  // ── Data-layer results ──
  'error.username.taken': '@{username} уже занят. Попробуй другой.',
  'error.auth.failed': 'Не сходится. Проверь @юзернейм и пароль.',
  'error.signal.alreadyChosen': 'Сигнал дня уже выбран. Один в сутки — таков ритуал.',

  // ── Profanity ──
  'profanity.blocked': 'Так не пойдёт — уберём крепкое словцо и попробуем ещё раз.',

  // ── Feed ──
  'feed.end': 'Ты долетел до конца Потока.',
  'feed.empty.title': 'Тут пока тихо',
  'feed.empty.desc': 'Воздух чист и ничей. Напиши первое перо — и Поток оживёт.',
  'feed.tab.forYou': 'Для тебя',
  'feed.tab.following': 'Подписки',
  'feed.following.empty.title': 'Ты ещё ни за кем не следуешь',
  'feed.following.empty.desc': 'Найди тех, чьи мысли хочется ловить.',
  'feed.following.empty.cta': 'Найти людей',

  // ── Composer ──
  'composer.placeholder': 'Что за мысль?',
  'composer.replyPlaceholder': 'Ответь пером…',
  'composer.hint': '⌘↵ чтобы опубликовать',
  'composer.replyContext': 'Ответ виден в профиле',
  'composer.publish': 'Опубликовать',
  'composer.reply': 'Ответить',

  // ── Media ──
  'media.attach': 'Добавить фото',
  'media.remove': 'Убрать фото',
  'media.open': 'Открыть фото',
  'media.error': 'Не удалось добавить фото.',
  'media.limit': 'Максимум {max} фото на перо.',

  // ── Post actions / card ──
  'action.reply': 'Ответить',
  'action.repost': 'Подхватить',
  'action.like': 'Отклик',
  'action.bookmark': 'Сохранить',
  'action.bookmarked': 'Убрать из сохранённых',
  'signal.raise': 'Сделать сигналом дня',
  'signal.chosen': 'Сигнал дня уже выбран',
  'post.authorProfile': 'Профиль {name}',
  'post.reply.title': 'Ответ',
  'post.menu': 'Ещё',
  'post.edited': 'изменено',
  'post.edit.action': 'Редактировать',
  'post.edit.title': 'Редактировать перо',
  'post.delete.action': 'Удалить',
  'post.delete.title': 'Удалить перо?',
  'post.delete.body': 'Это навсегда — перо и ответы к нему исчезнут.',
  'post.delete.confirm': 'Удалить',
  'toast.repost.removed': 'Подхват убран.',
  'toast.repost.done': 'Подхвачено — перо полетело дальше.',
  'toast.signal.raised': 'Сигнал дня поднят. Сегодня это твоё перо.',
  'toast.bookmark.added': 'Сохранено',
  'toast.bookmark.removed': 'Убрано из сохранённых',
  'toast.post.edited': 'Перо обновлено',
  'toast.post.deleted': 'Перо удалено',

  // ── Signal badge ──
  'signal.badge': 'Сигнал дня',
  'signal.badge.today': 'Сигнал дня · сегодня',

  // ── Shell / nav ──
  'route.feed': 'Поток',
  'route.search': 'Поиск',
  'route.mind': 'Разум',
  'route.post': 'Перо',
  'route.profile': 'Профиль',
  'route.settings': 'Настройки',
  'route.editProfile': 'Редактировать профиль',
  'nav.back': 'Назад',
  'nav.logoHome': 'Plume — на главную',
  'nav.compose': 'Новое перо',
  'nav.composeAria': 'Создать перо',
  'nav.logout': 'Выйти',
  'compose.title': 'Новое перо',
  'rightRail.desc':
    'Раз в сутки ты можешь поднять одно перо как Сигнал дня — оно засветится в Потоке и закрепится в профиле.',
  'rightRail.free': 'Сегодня сигнал ещё свободен.',
  'rightRail.used': 'На сегодня сигнал уже поднят.',
  'rightRail.tagline': 'Plume — лёгкая социальная сеть. Прототип: всё живёт в памяти сессии.',

  // ── Modal ──
  'modal.close': 'Закрыть',

  // ── Settings ──
  'settings.section.appearance': 'Оформление',
  'settings.theme.title': 'Тема',
  'settings.theme.desc': 'Сейчас {theme}. Обе сделаны одинаково дорого.',
  'settings.theme.light': 'светлая',
  'settings.theme.dark': 'тёмная',
  'settings.theme.toggle': 'Переключить тему',
  'settings.section.language': 'Язык',
  'settings.language.title': 'Язык интерфейса',
  'settings.language.desc': 'Переключается сразу — в любой теме.',
  'settings.language.select': 'Выбрать язык',
  'settings.section.account': 'Аккаунт',
  'settings.account.title': 'Профиль и данные',
  'settings.account.label': 'Аккаунт',
  'settings.privacy.title': 'Приватность',
  'settings.privacy.desc': 'Кто видит твои перья',
  'settings.notifications.title': 'Уведомления',
  'settings.notifications.desc': 'Сигналы, ответы, подхваты',
  'settings.logout': 'Выйти из аккаунта',
  'settings.soon': '{what} — раздел в работе.',

  // ── Edit profile ──
  'edit.cancel': 'Отмена',
  'edit.save': 'Сохранить',
  'edit.avatar': 'Аватар',
  'edit.cover': 'Обложка',
  'edit.name.placeholder': 'Как тебя звать',
  'edit.bio': 'О себе',
  'edit.bio.placeholder': 'Кто ты, чем дышишь?',
  'edit.location': 'Место',
  'edit.location.placeholder': 'Где ты на карте',
  'edit.links': 'Ссылки',
  'edit.link.label': 'Название',
  'edit.link.labelPlaceholder': 'Например, Портфолио',
  'edit.link.url': 'Ссылка',
  'edit.link.urlPlaceholder': 'plume.app',
  'edit.link.remove': 'Удалить ссылку',
  'edit.link.add': 'Добавить ссылку',
  'edit.birthday': 'Дата рождения',
  'edit.showYear': 'Показывать год',
  'edit.showYear.aria': 'Показывать год рождения',
  'edit.work': 'Работа',
  'edit.work.placeholder': 'Где и кем',
  'edit.education': 'Университет',
  'edit.education.placeholder': 'Начни вводить — выбери из списка',
  'edit.school': 'Школа',
  'edit.school.placeholder': 'Где училась/учился',
  'edit.anthem.title': 'Музыка профиля',
  'edit.anthem.desc': 'Привяжем трек к профилю позже.',
  'edit.anthem.cta': 'В разработке',
  'edit.checkFields': 'Проверь подсвеченные поля.',
  'edit.saved': 'Профиль обновлён.',

  // ── Profile header ──
  'profile.edit': 'Редактировать',
  'profile.following': 'Вы следуете',
  'profile.follow': 'Следовать',
  'profile.addBio': 'Добавь пару слов о себе',
  'profile.joined': 'В Plume с {date}',
  'profile.count.following': 'в полёте',
  'profile.count.followers.one': 'читатель',
  'profile.count.followers.many': 'читателей',
  'profile.bio.title': 'О себе',

  // ── Profile screen ──
  'profile.notFound.title': 'Аккаунт не найден',
  'profile.notFound.desc': '@{username} пока не существует в Plume.',
  'profile.notFound.cta': 'В Поток',
  'profile.empty.own.title': 'Профиль ждёт первого пера',
  'profile.empty.own.desc': 'Здесь будут жить твои перья. Начни прямо сейчас — это займёт секунду.',
  'profile.empty.other.title': 'Здесь пока пусто',
  'profile.empty.other.desc': '{name} ещё не написал(а) ни одного пера.',
  'profile.replies.empty.title': 'Ответов нет',
  'profile.replies.empty.own': 'Ответишь кому-нибудь — появятся здесь.',
  'profile.replies.empty.other': '{name} пока никому не отвечал(а).',
  'profile.saved.empty.title': 'Пока пусто',
  'profile.saved.empty.desc': 'Сохранённые перья появятся здесь. Видишь их только ты.',
  'tab.posts': 'Посты',
  'tab.replies': 'Ответы',
  'tab.saved': 'Сохранённые',

  // ── Image picker ──
  'picker.replace': 'Заменить',
  'picker.upload': 'Загрузить',
  'picker.remove': 'Удалить',
  'picker.replaceAria': '{label}: заменить',
  'picker.uploadAria': '{label}: загрузить',
  'picker.error': 'Не удалось загрузить фото.',

  // ── Institution picker ──
  'institution.noResults': 'Ничего не нашлось — выбери из списка.',
  'institution.clear': 'Очистить',

  // ── External link interstitial ──
  'external.title': 'Переход на внешний сайт',
  'external.body': 'Вы переходите на внешний сайт: {host}. Plume не отвечает за его содержимое.',
  'external.proceed': 'Перейти',
  'external.cancel': 'Отмена',

  // ── Common ──
  'common.soon': 'Скоро',

  // ── Reserved nav slots (premium "coming soon") ──
  'search.soon': 'Скоро здесь можно будет искать перья, людей и Сигналы — весь Поток под рукой.',
  'mind.soon': 'Здесь оживёт твой Разум — карта мыслей и связей между перьями. Скоро.',

  // ── Hashtag screen ──
  'hashtag.subtitle': 'Перья с этим тегом',
  'hashtag.empty.title': 'Тег ждёт первого пера',
  'hashtag.empty.desc': 'Пока ни одно перо не носит #{tag}. Стань первым.',

  // ── Search ──
  'search.label': 'Поиск',
  'search.placeholder': 'Люди, перья, теги',
  'search.prompt.title': 'Что ищем?',
  'search.prompt.desc': 'Люди, перья, теги — начни печатать.',
  'search.empty.title': 'Ничего не нашлось',
  'search.empty.desc': 'Попробуй другой запрос.',
  'search.section.people': 'Люди',
  'search.section.posts': 'Перья',
  'search.section.tags': 'Теги',

  // ── Thread ──
  'thread.empty.title': 'Пока тишина',
  'thread.empty.desc': 'Ответь первым — начни разговор.',
  'thread.notFound.title': 'Перо не найдено',
  'thread.notFound.desc': 'Возможно, оно улетело.',
} as const;
