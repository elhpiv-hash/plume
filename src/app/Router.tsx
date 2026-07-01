import { Feed } from '@/components/feed/Feed';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { SettingsScreen } from '@/features/settings/SettingsScreen';
import { EditProfileScreen } from '@/features/profile/EditProfileScreen';
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
      return <ComingSoon icon="search" titleKey="route.search" descKey="search.soon" />;
    case 'mind':
      return <ComingSoon icon="mind" titleKey="route.mind" descKey="mind.soon" />;
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
