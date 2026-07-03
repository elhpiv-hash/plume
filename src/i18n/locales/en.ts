/**
 * English interface dictionary. Typed as `Dict`, so it must cover exactly the
 * keys defined by the canonical `ru` dictionary — no more, no fewer. Copy keeps
 * the same light, warm product voice rather than a literal machine translation.
 */
import type { Dict } from '@/i18n/types';

export const en: Dict = {
  // ── Locale meta ──
  'locale.name.ru': 'Русский',
  'locale.name.en': 'English',

  // ── Brand / auth ──
  'auth.brand.title': 'A lighter social network.',
  'auth.brand.subtitle':
    'No clutter — just your voice. Write your first feather and raise the Signal of the day.',
  'auth.brand.footer': 'A prototype. Everything lives in session memory — a clean slate every time.',
  'auth.start.title': 'Welcome to Plume',
  'auth.start.subtitle': 'Sign in or create an account in half a minute.',
  'auth.start.create': 'Create account',
  'auth.start.login': 'Sign in',
  'auth.start.or': 'or',
  'auth.provider.apple': 'Continue with Apple',
  'auth.provider.phone': 'Continue with phone',
  'auth.provider.soon': "We'll add this sign-in later. For now — use your @username.",
  'auth.login.title': 'Welcome back',
  'auth.login.subtitle': 'Sign in with your @username.',
  'auth.register.title': 'Create your account',
  'auth.register.subtitle': 'A couple of fields — and you’re airborne.',
  'auth.back': '← Back',

  // ── Auth forms ──
  'field.username': '@username',
  'field.username.placeholder': 'you',
  'field.username.hint': 'Latin letters, digits, _. Visible to everyone.',
  'field.password': 'Password',
  'field.password.placeholder': 'at least 6 characters',
  'field.name': 'Name',
  'field.name.placeholder': 'What should we call you',
  'login.submit': 'Sign in',
  'login.switchPrompt': 'No account yet?',
  'login.switchAction': 'Create one',
  'register.submit': 'Create account',
  'register.switchPrompt': 'Already have an account?',
  'register.switchAction': 'Sign in',

  // ── Validation ──
  'validate.name.required': 'What should we call you? A name, please.',
  'validate.name.tooLong': 'That name is a bit long — up to 40 characters.',
  'validate.username.required': 'Pick an @username — it’s your address on Plume.',
  'validate.username.tooShort': 'A little short. At least 3 characters.',
  'validate.username.tooLong': 'A little long. 20 characters max.',
  'validate.username.charset': 'Latin letters, digits and underscore only.',
  'validate.username.startsWithLetter': 'Let it start with a letter.',
  'validate.password.required': 'A password, please — even a token one.',
  'validate.password.tooShort': 'At least 6 characters — safer that way.',
  'validate.post.empty': 'An empty feather won’t fly.',
  'validate.post.tooLong': 'Too long — {over} characters over the limit.',
  'validate.url.scheme': 'A link should start with http(s).',
  'validate.url.invalid': 'That doesn’t look like a link. Check the address.',

  // ── Data-layer results ──
  'error.username.taken': '@{username} is already taken. Try another.',
  'error.auth.failed': 'That doesn’t match. Check your @username and password.',
  'error.signal.alreadyChosen': 'Signal of the day is already set. One a day — that’s the ritual.',

  // ── Profanity ──
  'profanity.blocked': 'Let’s keep it clean — drop the strong words and try again.',

  // ── Feed ──
  'feed.end': 'You’ve reached the end of the Stream.',
  'feed.empty.title': 'All quiet here',
  'feed.empty.desc': 'The air is clear and open. Write your first feather — the Stream will come alive.',

  // ── Composer ──
  'composer.placeholder': 'What’s the thought?',
  'composer.replyPlaceholder': 'Reply with a feather…',
  'composer.hint': '⌘↵ to publish',
  'composer.replyContext': 'Reply shown on your profile',
  'composer.publish': 'Publish',
  'composer.reply': 'Reply',

  // ── Post actions / card ──
  'action.reply': 'Reply',
  'action.repost': 'Uplift',
  'action.like': 'Spark',
  'signal.raise': 'Make it the Signal of the day',
  'signal.chosen': 'Signal of the day already set',
  'post.authorProfile': '{name}’s profile',
  'post.reply.title': 'Reply',
  'toast.repost.removed': 'Uplift removed.',
  'toast.repost.done': 'Uplifted — the feather flies on.',
  'toast.signal.raised': 'Signal of the day raised. Today it’s your feather.',

  // ── Signal badge ──
  'signal.badge': 'Signal of the day',
  'signal.badge.today': 'Signal of the day · today',

  // ── Shell / nav ──
  'route.feed': 'Stream',
  'route.search': 'Search',
  'route.mind': 'Mind',
  'route.profile': 'Profile',
  'route.settings': 'Settings',
  'route.editProfile': 'Edit profile',
  'nav.back': 'Back',
  'nav.logoHome': 'Plume — home',
  'nav.compose': 'New feather',
  'nav.composeAria': 'Create a feather',
  'nav.logout': 'Sign out',
  'compose.title': 'New feather',
  'rightRail.desc':
    'Once a day you can raise one feather as the Signal of the day — it glows in the Stream and pins to your profile.',
  'rightRail.free': 'Today’s signal is still open.',
  'rightRail.used': 'Today’s signal is already raised.',
  'rightRail.tagline': 'Plume — a lighter social network. Prototype: everything lives in session memory.',

  // ── Modal ──
  'modal.close': 'Close',

  // ── Settings ──
  'settings.section.appearance': 'Appearance',
  'settings.theme.title': 'Theme',
  'settings.theme.desc': 'Currently {theme}. Both are crafted with equal care.',
  'settings.theme.light': 'light',
  'settings.theme.dark': 'dark',
  'settings.theme.toggle': 'Toggle theme',
  'settings.section.language': 'Language',
  'settings.language.title': 'Interface language',
  'settings.language.desc': 'Switches instantly — in either theme.',
  'settings.language.select': 'Choose language',
  'settings.section.account': 'Account',
  'settings.account.title': 'Profile & data',
  'settings.account.label': 'Account',
  'settings.privacy.title': 'Privacy',
  'settings.privacy.desc': 'Who sees your feathers',
  'settings.notifications.title': 'Notifications',
  'settings.notifications.desc': 'Signals, replies, uplifts',
  'settings.logout': 'Sign out',
  'settings.soon': '{what} — section in progress.',

  // ── Edit profile ──
  'edit.cancel': 'Cancel',
  'edit.save': 'Save',
  'edit.avatar': 'Avatar',
  'edit.cover': 'Cover',
  'edit.name.placeholder': 'What should we call you',
  'edit.bio': 'About you',
  'edit.bio.placeholder': 'Who are you, what moves you?',
  'edit.location': 'Location',
  'edit.location.placeholder': 'Where you are on the map',
  'edit.links': 'Links',
  'edit.link.label': 'Title',
  'edit.link.labelPlaceholder': 'E.g. Portfolio',
  'edit.link.url': 'Link',
  'edit.link.urlPlaceholder': 'plume.app',
  'edit.link.remove': 'Remove link',
  'edit.link.add': 'Add link',
  'edit.birthday': 'Birthday',
  'edit.showYear': 'Show year',
  'edit.showYear.aria': 'Show birth year',
  'edit.work': 'Work',
  'edit.work.placeholder': 'Where and as what',
  'edit.education': 'University',
  'edit.education.placeholder': 'Start typing — pick from the list',
  'edit.school': 'School',
  'edit.school.placeholder': 'Where you studied',
  'edit.anthem.title': 'Profile anthem',
  'edit.anthem.desc': 'We’ll attach a track to your profile later.',
  'edit.anthem.cta': 'Coming soon',
  'edit.checkFields': 'Check the highlighted fields.',
  'edit.saved': 'Profile updated.',

  // ── Profile header ──
  'profile.edit': 'Edit',
  'profile.following': 'Following',
  'profile.follow': 'Follow',
  'profile.addBio': 'Add a few words about yourself',
  'profile.joined': 'On Plume since {date}',
  'profile.count.following': 'following',
  'profile.count.followers.one': 'follower',
  'profile.count.followers.many': 'followers',
  'profile.bio.title': 'About you',

  // ── Profile screen ──
  'profile.notFound.title': 'Account not found',
  'profile.notFound.desc': '@{username} doesn’t exist on Plume yet.',
  'profile.notFound.cta': 'To the Stream',
  'profile.empty.own.title': 'Your profile awaits its first feather',
  'profile.empty.own.desc': 'Your feathers will live here. Start now — it takes a second.',
  'profile.empty.other.title': 'Nothing here yet',
  'profile.empty.other.desc': '{name} hasn’t written a single feather yet.',
  'profile.replies.empty.title': 'No replies',
  'profile.replies.empty.own': 'Reply to someone — they’ll show up here.',
  'profile.replies.empty.other': '{name} hasn’t replied to anyone yet.',
  'tab.posts': 'Posts',
  'tab.replies': 'Replies',

  // ── Image picker ──
  'picker.replace': 'Replace',
  'picker.upload': 'Upload',
  'picker.remove': 'Remove',
  'picker.replaceAria': '{label}: replace',
  'picker.uploadAria': '{label}: upload',
  'picker.error': 'Couldn’t load the photo.',

  // ── Institution picker ──
  'institution.noResults': 'Nothing found — pick from the list.',
  'institution.clear': 'Clear',

  // ── External link interstitial ──
  'external.title': 'Leaving for an external site',
  'external.body': 'You’re heading to an external site: {host}. Plume isn’t responsible for its content.',
  'external.proceed': 'Continue',
  'external.cancel': 'Cancel',

  // ── Common ──
  'common.soon': 'Soon',

  // ── Reserved nav slots (premium "coming soon") ──
  'search.soon': 'Soon you’ll search feathers, people and Signals — the whole Stream at your fingertips.',
  'mind.soon': 'This is where your Mind comes alive — a map of thoughts and the links between feathers. Soon.',

  // ── Hashtag screen ──
  'hashtag.subtitle': 'Feathers with this tag',
  'hashtag.empty.title': 'This tag awaits its first feather',
  'hashtag.empty.desc': 'No feather carries #{tag} yet. Be the first.',
};
