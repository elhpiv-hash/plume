import {
  createContext,
  useCallback,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import {
  dataReducer,
  initialDataState,
  isUsernameTaken,
  selectFeed,
  selectFollowerCount,
  selectFollowingCount,
  selectIsFollowing,
  selectSignalOfDay,
  selectUser,
  selectUserByUsername,
  selectUserPosts,
  selectUserReplies,
  toPostView,
  type DataState,
} from '@/lib/dataClient';
import { calendarDay } from '@/lib/formatTime';
import { createId } from '@/lib/id';
import { normalizeUsername } from '@/lib/validators';
import { useI18n } from '@/hooks/useI18n';
import {
  err,
  ok,
  type CreatePostInput,
  type ID,
  type Post,
  type PostView,
  type ProfilePatch,
  type RegisterInput,
  type Result,
  type User,
} from '@/types';

/**
 * The imperative data API exposed to the app. This is the single seam a real
 * backend would replace: every method below maps cleanly to an endpoint. Queries
 * read the live store; mutations are deterministic dispatches.
 */
export interface DataContextValue {
  // Queries
  getUser: (id: ID) => User | undefined;
  getUserByUsername: (username: string) => User | undefined;
  feed: (viewerId: ID | null) => PostView[];
  userPosts: (userId: ID, viewerId: ID | null) => PostView[];
  userReplies: (userId: ID, viewerId: ID | null) => PostView[];
  followerCount: (userId: ID) => number;
  followingCount: (userId: ID) => number;
  isFollowing: (followerId: ID, followingId: ID) => boolean;
  /** Whether the user has already spent today's single Signal. */
  signalUsedToday: (userId: ID) => boolean;

  // Mutations
  registerUser: (input: RegisterInput) => Result<User>;
  authenticate: (username: string, password: string) => Result<User>;
  updateBio: (userId: ID, bio: string) => void;
  updateProfile: (userId: ID, patch: ProfilePatch) => void;
  createPost: (input: CreatePostInput) => Post;
  toggleLike: (postId: ID, userId: ID) => void;
  toggleRepost: (postId: ID, userId: ID) => void;
  setFollow: (followerId: ID, followingId: ID, following: boolean) => void;
  setSignal: (postId: ID, userId: ID) => Result<void>;
}

export const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [state, dispatch] = useReducer(dataReducer, initialDataState);

  // Mutations need to read the freshest state synchronously (e.g. uniqueness
  // checks) without waiting for a re-render, so we mirror state into a ref.
  const stateRef = useRef<DataState>(state);
  stateRef.current = state;

  const mapViews = useCallback(
    (posts: Post[], viewerId: ID | null): PostView[] => {
      const today = calendarDay();
      const s = stateRef.current;
      return posts
        .map((p) => toPostView(s, p, viewerId, today))
        .filter((v): v is PostView => v !== null);
    },
    [],
  );

  const value = useMemo<DataContextValue>(() => {
    return {
      getUser: (id) => selectUser(stateRef.current, id),
      getUserByUsername: (username) =>
        selectUserByUsername(stateRef.current, normalizeUsername(username)),

      feed: (viewerId) => mapViews(selectFeed(stateRef.current), viewerId),
      userPosts: (userId, viewerId) =>
        mapViews(selectUserPosts(stateRef.current, userId), viewerId),
      userReplies: (userId, viewerId) =>
        mapViews(selectUserReplies(stateRef.current, userId), viewerId),

      followerCount: (userId) => selectFollowerCount(stateRef.current, userId),
      followingCount: (userId) => selectFollowingCount(stateRef.current, userId),
      isFollowing: (a, b) => selectIsFollowing(stateRef.current, a, b),

      signalUsedToday: (userId) =>
        selectSignalOfDay(stateRef.current, userId, calendarDay()) !== undefined,

      registerUser: (input) => {
        const username = normalizeUsername(input.username);
        if (isUsernameTaken(stateRef.current, username)) {
          return err(t('error.username.taken', { username }));
        }
        const user: User = {
          id: createId('usr'),
          name: input.name.trim(),
          username,
          bio: '',
          createdAt: Date.now(),
        };
        dispatch({ type: 'REGISTER', user, password: input.password });
        return ok(user);
      },

      authenticate: (username, password) => {
        const handle = normalizeUsername(username);
        const user = selectUserByUsername(stateRef.current, handle);
        if (!user || stateRef.current.passwords[user.id] !== password) {
          return err(t('error.auth.failed'));
        }
        return ok(user);
      },

      updateBio: (userId, bio) => dispatch({ type: 'UPDATE_BIO', userId, bio: bio.trim() }),
      updateProfile: (userId, patch) => dispatch({ type: 'UPDATE_PROFILE', userId, patch }),

      createPost: (input) => {
        const post: Post = {
          id: createId('pst'),
          authorId: input.authorId,
          text: input.text.trim(),
          createdAt: Date.now(),
          parentId: input.parentId ?? null,
          likedBy: [],
          repostedBy: [],
          signalDay: null,
        };
        dispatch({ type: 'CREATE_POST', post });
        return post;
      },

      toggleLike: (postId, userId) => dispatch({ type: 'TOGGLE_LIKE', postId, userId }),
      toggleRepost: (postId, userId) => dispatch({ type: 'TOGGLE_REPOST', postId, userId }),
      setFollow: (followerId, followingId, following) =>
        dispatch({ type: 'SET_FOLLOW', followerId, followingId, following }),

      setSignal: (postId, userId) => {
        const today = calendarDay();
        const existing = selectSignalOfDay(stateRef.current, userId, today);
        if (existing) {
          return err(t('error.signal.alreadyChosen'));
        }
        dispatch({ type: 'SET_SIGNAL', postId, userId, day: today });
        return ok(undefined);
      },
    };
    // `state` is intentionally a dependency: a fresh value object on every
    // dispatch is what propagates updates to context consumers. `t` is included
    // so freshly-produced result errors track the active locale.
  }, [state, mapViews, t]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
