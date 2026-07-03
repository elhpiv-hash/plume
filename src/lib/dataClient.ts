/**
 * The data layer.
 *
 * Everything that mutates or reads application data lives behind this module:
 * a normalized in-memory store, a pure reducer, and pure selectors. The React
 * `DataContext` binds these into an imperative API (createPost, toggleLike,
 * follow, setSignal …). To move to a real backend you reimplement that thin
 * binding with fetch calls — the reducer/selectors and the entire UI stay put.
 *
 * Discipline: the reducer is pure and total. All impurity (id generation,
 * Date.now, today's calendar day) happens at the binding boundary and is passed
 * in via action payloads, so state transitions are fully deterministic.
 */

import type {
  CalendarDay,
  Follow,
  ID,
  Post,
  PostView,
  ProfilePatch,
  User,
} from '@/types';
import { extractHashtags } from '@/lib/richText';

// ──────────────────────────────── State ────────────────────────────────

export interface DataState {
  users: Record<ID, User>;
  /** username → userId, for O(1) uniqueness checks and handle lookups. */
  usernameIndex: Record<string, ID>;
  /** userId → password. Prototype-only; a server would never expose this. */
  passwords: Record<ID, string>;
  posts: Record<ID, Post>;
  /** Insertion order, newest first. Authoritative ordering for the feed. */
  postIds: ID[];
  follows: Follow[];
}

export const initialDataState: DataState = {
  users: {},
  usernameIndex: {},
  passwords: {},
  posts: {},
  postIds: [],
  follows: [],
};

// ──────────────────────────────── Actions ───────────────────────────────

export type DataAction =
  | { type: 'REGISTER'; user: User; password: string }
  | { type: 'UPDATE_BIO'; userId: ID; bio: string }
  | { type: 'UPDATE_PROFILE'; userId: ID; patch: ProfilePatch }
  | { type: 'CREATE_POST'; post: Post }
  | { type: 'TOGGLE_LIKE'; postId: ID; userId: ID }
  | { type: 'TOGGLE_REPOST'; postId: ID; userId: ID }
  | { type: 'SET_FOLLOW'; followerId: ID; followingId: ID; following: boolean }
  | { type: 'SET_SIGNAL'; postId: ID; userId: ID; day: CalendarDay };

// ──────────────────────────────── Reducer ───────────────────────────────

function toggleMembership(list: ID[], id: ID): ID[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function dataReducer(state: DataState, action: DataAction): DataState {
  switch (action.type) {
    case 'REGISTER': {
      const { user, password } = action;
      return {
        ...state,
        users: { ...state.users, [user.id]: user },
        usernameIndex: { ...state.usernameIndex, [user.username]: user.id },
        passwords: { ...state.passwords, [user.id]: password },
      };
    }

    case 'UPDATE_BIO': {
      const user = state.users[action.userId];
      if (!user) return state;
      return {
        ...state,
        users: { ...state.users, [user.id]: { ...user, bio: action.bio } },
      };
    }

    case 'UPDATE_PROFILE': {
      const user = state.users[action.userId];
      if (!user) return state;
      // Merge only the provided keys; undefined must not clobber existing values.
      const { patch } = action;
      const next: User = { ...user };
      if (patch.name !== undefined) next.name = patch.name;
      if (patch.bio !== undefined) next.bio = patch.bio;
      if (patch.location !== undefined) next.location = patch.location;
      if (patch.links !== undefined) next.links = patch.links;
      if (patch.birthday !== undefined) next.birthday = patch.birthday;
      if (patch.work !== undefined) next.work = patch.work;
      if (patch.education !== undefined) next.education = patch.education;
      if (patch.school !== undefined) next.school = patch.school;
      if (patch.avatarUrl !== undefined) next.avatarUrl = patch.avatarUrl;
      if (patch.coverUrl !== undefined) next.coverUrl = patch.coverUrl;
      return {
        ...state,
        users: { ...state.users, [user.id]: next },
      };
    }

    case 'CREATE_POST': {
      const { post } = action;
      return {
        ...state,
        posts: { ...state.posts, [post.id]: post },
        postIds: [post.id, ...state.postIds],
      };
    }

    case 'TOGGLE_LIKE': {
      const post = state.posts[action.postId];
      if (!post) return state;
      const next: Post = { ...post, likedBy: toggleMembership(post.likedBy, action.userId) };
      return { ...state, posts: { ...state.posts, [post.id]: next } };
    }

    case 'TOGGLE_REPOST': {
      const post = state.posts[action.postId];
      if (!post) return state;
      const next: Post = { ...post, repostedBy: toggleMembership(post.repostedBy, action.userId) };
      return { ...state, posts: { ...state.posts, [post.id]: next } };
    }

    case 'SET_FOLLOW': {
      const { followerId, followingId, following } = action;
      if (followerId === followingId) return state;
      const without = state.follows.filter(
        (f) => !(f.followerId === followerId && f.followingId === followingId),
      );
      return {
        ...state,
        follows: following ? [...without, { followerId, followingId }] : without,
      };
    }

    case 'SET_SIGNAL': {
      const target = state.posts[action.postId];
      if (!target || target.authorId !== action.userId) return state;

      // Enforce one signal per author per day: clear the author's prior signal
      // for that day, then crown the chosen post.
      const posts: Record<ID, Post> = {};
      for (const [id, post] of Object.entries(state.posts)) {
        if (post.authorId === action.userId && post.signalDay === action.day) {
          posts[id] = { ...post, signalDay: null };
        } else {
          posts[id] = post;
        }
      }
      posts[target.id] = { ...posts[target.id]!, signalDay: action.day };
      return { ...state, posts };
    }

    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

// ─────────────────────────────── Selectors ──────────────────────────────

export const selectUser = (state: DataState, id: ID): User | undefined => state.users[id];

export const selectUserByUsername = (state: DataState, username: string): User | undefined => {
  const id = state.usernameIndex[username];
  return id ? state.users[id] : undefined;
};

export const isUsernameTaken = (state: DataState, username: string): boolean =>
  username in state.usernameIndex;

const byNewest = (a: Post, b: Post): number => b.createdAt - a.createdAt;

/** All top-level posts (no replies), newest first — the global timeline. */
export function selectFeed(state: DataState): Post[] {
  return state.postIds
    .map((id) => state.posts[id])
    .filter((p): p is Post => Boolean(p) && p!.parentId === null)
    .sort(byNewest);
}

export function selectUserPosts(state: DataState, userId: ID): Post[] {
  return Object.values(state.posts)
    .filter((p) => p.authorId === userId && p.parentId === null)
    .sort(byNewest);
}

export function selectUserReplies(state: DataState, userId: ID): Post[] {
  return Object.values(state.posts)
    .filter((p) => p.authorId === userId && p.parentId !== null)
    .sort(byNewest);
}

/**
 * Feathers that carry a given hashtag (case-insensitive), newest first. Entities
 * are derived from `text` via the shared parser — the store is never touched.
 * This is exactly the post ↔ tag ↔ post edge set the future Mind will walk.
 */
export function selectPostsByHashtag(state: DataState, tag: string): Post[] {
  const needle = tag.trim().toLowerCase().replace(/^#/, '');
  if (!needle) return [];
  return Object.values(state.posts)
    .filter((p) => extractHashtags(p.text).includes(needle))
    .sort(byNewest);
}

/**
 * Users whose handle starts with, or name contains, the query — for the
 * composer's @mention autocomplete. Empty query returns a small starter slice.
 */
export function selectUsersMatching(state: DataState, query: string, limit = 6): User[] {
  const q = query.trim().toLowerCase().replace(/^@/, '');
  const users = Object.values(state.users);
  if (!q) return users.slice(0, limit);
  return users
    .filter((u) => u.username.toLowerCase().startsWith(q) || u.name.toLowerCase().includes(q))
    .slice(0, limit);
}

export function selectReplies(state: DataState, postId: ID): Post[] {
  return Object.values(state.posts)
    .filter((p) => p.parentId === postId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export const selectReplyCount = (state: DataState, postId: ID): number =>
  Object.values(state.posts).reduce((n, p) => (p.parentId === postId ? n + 1 : n), 0);

export const selectFollowerCount = (state: DataState, userId: ID): number =>
  state.follows.reduce((n, f) => (f.followingId === userId ? n + 1 : n), 0);

export const selectFollowingCount = (state: DataState, userId: ID): number =>
  state.follows.reduce((n, f) => (f.followerId === userId ? n + 1 : n), 0);

export const selectIsFollowing = (state: DataState, followerId: ID, followingId: ID): boolean =>
  state.follows.some((f) => f.followerId === followerId && f.followingId === followingId);

/** The author's signal post for a given day, if any. Drives the daily limit. */
export function selectSignalOfDay(
  state: DataState,
  userId: ID,
  day: CalendarDay,
): Post | undefined {
  return Object.values(state.posts).find(
    (p) => p.authorId === userId && p.signalDay === day,
  );
}

/**
 * Hydrate a stored Post into a fully-resolved PostView for rendering, relative
 * to the viewing user and the current day.
 */
export function toPostView(
  state: DataState,
  post: Post,
  viewerId: ID | null,
  today: CalendarDay,
): PostView | null {
  const author = state.users[post.authorId];
  if (!author) return null;
  return {
    ...post,
    author,
    likeCount: post.likedBy.length,
    repostCount: post.repostedBy.length,
    replyCount: selectReplyCount(state, post.id),
    likedByMe: viewerId !== null && post.likedBy.includes(viewerId),
    repostedByMe: viewerId !== null && post.repostedBy.includes(viewerId),
    isSignalToday: post.signalDay === today,
  };
}
