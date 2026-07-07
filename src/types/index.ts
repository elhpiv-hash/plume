/**
 * Domain types for Plume.
 *
 * These describe the shape of the data exactly as a real backend would return
 * it, so the in-memory data layer can later be swapped for network calls with
 * no change to the UI. Entities reference each other by id (normalized), never
 * by nesting — the same discipline a server/cache boundary imposes.
 */

export type ID = string;

/** ISO calendar day, e.g. "2026-06-26". Used to scope the daily Signal limit. */
export type CalendarDay = string;

export type Theme = 'dark' | 'light';

export interface User {
  id: ID;
  /** Display name — shown in bold display type. */
  name: string;
  /** Handle without the leading "@". Unique, lowercase, [a-z0-9_]. */
  username: string;
  bio: string;
  createdAt: number;
  // Profile 2.0 — all optional and additive; absent fields render nothing.
  location?: string;
  links?: ProfileLink[];
  birthday?: Birthday | null;
  work?: string;
  education?: string;
  /** Free-text school name (no global directory exists). */
  school?: string;
  /** Resized data URL; null/undefined → initials fallback. */
  avatarUrl?: string | null;
  coverUrl?: string | null;
  /** Placeholder for a future "profile anthem" (e.g. Spotify). Not persisted via patch. */
  anthem?: AnthemTrack | null;
}

/** An external link shown on the profile. */
export interface ProfileLink {
  label: string;
  url: string;
}

/** Birthday with an explicit privacy choice for the year. */
export interface Birthday {
  /** ISO calendar day, YYYY-MM-DD. */
  date: string;
  showYear: boolean;
}

/** Feature stub for a future "profile anthem". */
export interface AnthemTrack {
  title: string;
  artist: string;
  coverUrl?: string;
  previewUrl?: string;
}

/**
 * Mutation input mirroring what a PATCH /me request would carry. `anthem` is
 * intentionally excluded — it's a stub feature and must not be persisted.
 */
export type ProfilePatch = Partial<
  Pick<
    User,
    'name' | 'bio' | 'location' | 'links' | 'birthday' | 'work' | 'education' | 'school' | 'avatarUrl' | 'coverUrl'
  >
>;

/**
 * An image attached to a feather. `url` is a compact resized dataURL today; the
 * shape is future-proof — with a backend it simply becomes an uploaded file URL,
 * the type unchanged.
 */
export interface PostMedia {
  url: string;
  width: number;
  height: number;
  alt?: string;
}

export interface Post {
  id: ID;
  authorId: ID;
  text: string;
  createdAt: number;
  /** Set when this post is a reply to another post; null for top-level posts. */
  parentId: ID | null;
  /** User ids who liked the post. Source of truth for the like count + state. */
  likedBy: ID[];
  /** User ids who reposted. */
  repostedBy: ID[];
  /**
   * The calendar day on which the author marked this as their Signal of the
   * day, or null. At most one post per author may hold a given day.
   */
  signalDay: CalendarDay | null;
  /** Set when the author has edited the feather. Absent = never edited. */
  editedAt?: number;
  /** Attached images. Absent/empty = a text-only feather (back-compatible). */
  media?: PostMedia[];
}

/** A directed follow edge. */
export interface Follow {
  followerId: ID;
  followingId: ID;
}

/** A private user↔post bookmark edge (only its owner can see it). */
export interface Bookmark {
  userId: ID;
  postId: ID;
}

/** The authenticated session — only ever references a user id. */
export interface Session {
  userId: ID;
}

/**
 * Result envelope used by every fallible data operation. Keeps the UI free of
 * thrown exceptions and gives the form layer typed, branded error messages.
 */
export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export const ok = <T>(value: T): Result<T> => ({ ok: true, value });
export const err = <T = never>(error: string): Result<T> => ({ ok: false, error });

/** Input payloads for mutations — mirrors what a POST body would carry. */
export interface RegisterInput {
  name: string;
  username: string;
  password: string;
}

export interface CreatePostInput {
  authorId: ID;
  text: string;
  parentId?: ID | null;
  media?: PostMedia[];
}

/** A post hydrated with everything the UI needs to render one card. */
export interface PostView extends Post {
  author: User;
  likeCount: number;
  repostCount: number;
  replyCount: number;
  likedByMe: boolean;
  repostedByMe: boolean;
  /** True when the viewer has bookmarked this feather. */
  bookmarkedByMe: boolean;
  /** True when signalDay equals today — drives the premium treatment. */
  isSignalToday: boolean;
}
