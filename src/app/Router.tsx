import { Feed } from '@/components/feed/Feed';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import { EditProfileScreen } from '@/features/profile/EditProfileScreen';
import { HashtagScreen } from '@/features/hashtag/HashtagScreen';
import { SearchScreen } from '@/features/search/SearchScreen';
import { ThreadScreen } from '@/features/thread/ThreadScreen';
import { ComingSoon } from '@/components/common/ComingSoon';
import { useNavigation } from '@/hooks/useNavigation';

/**
 * Maps the current in-memory route to a screen. The exhaustive switch means a
 * new Route variant won't compile until it's handled here.
 */
export function Router() {
  const { route } = useNavigation();

  switch (route.name) {
    case 'feed':
      return <Feed />;
    case 'search':
      return <SearchScreen />;
    case 'mind':
      return <ComingSoon icon="mind" titleKey="route.mind" descKey="mind.soon" />;
    case 'hashtag':
      return <HashtagScreen tag={route.tag} />;
    case 'post':
      return <ThreadScreen postId={route.postId} />;
    case 'profile':
      return <ProfileScreen username={route.username} />;
    case 'settings':
      return <SettingsScreen />;
    case 'edit-profile':
      return <EditProfileScreen />;
    default: {
      const _exhaustive: never = route;
      return _exhaustive;
    }
  }
}
