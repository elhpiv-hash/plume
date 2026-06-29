/** Compact, X-style relative timestamps in the interface voice (Russian). */

const MONTHS_RU = [
  'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
  'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
];

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Short form for inline timestamps: «сейчас», «5м», «3ч», «2д», «14 мар». */
export function formatTimeShort(timestamp: number, now: number = Date.now()): string {
  const delta = Math.max(0, now - timestamp);

  if (delta < MINUTE) return 'сейчас';
  if (delta < HOUR) return `${Math.floor(delta / MINUTE)}м`;
  if (delta < DAY) return `${Math.floor(delta / HOUR)}ч`;
  if (delta < 7 * DAY) return `${Math.floor(delta / DAY)}д`;

  const date = new Date(timestamp);
  const sameYear = date.getFullYear() === new Date(now).getFullYear();
  const head = `${date.getDate()} ${MONTHS_RU[date.getMonth()]}`;
  return sameYear ? head : `${head} ${date.getFullYear()}`;
}

/** Full form for profile/meta: «14 марта 2026». */
export function formatJoinDate(timestamp: number): string {
  const long = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  const date = new Date(timestamp);
  return `${date.getDate()} ${long[date.getMonth()]} ${date.getFullYear()}`;
}

/** Birthday line for the profile: «14 марта» или «14 марта 1998» (showYear). */
export function formatBirthday(isoDate: string, showYear: boolean): string {
  const long = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  const [y, m, d] = isoDate.split('-').map((n) => Number.parseInt(n, 10));
  if (!y || !m || !d) return '';
  const head = `${d} ${long[m - 1] ?? ''}`.trim();
  return showYear ? `${head} ${y}` : head;
}

/** Calendar day key (local) used to enforce the daily Signal limit. */
export function calendarDay(timestamp: number = Date.now()): string {
  const d = new Date(timestamp);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}
