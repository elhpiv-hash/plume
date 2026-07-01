/**
 * The single source of truth for primary navigation.
 *
 * Both the desktop Sidebar and the mobile MobileNav render from this one array —
 * add a section here and it appears in both layouts (no duplicated lists). The
 * order below is the fixed skeleton: Stream, Search, Compose (center action),
 * Mind, Profile, with Settings kept as a desktop-sidebar secondary entry.
 */
import type { IconName } from '@/components/ui/Icon';
import type { Route } from '@/context/NavigationContext';
import type { TranslationKey } from '@/i18n/types';

/** Where a navigation entry shows up. */
export type NavPlacement = 'primary' | 'secondary';

/** A tab that navigates to a route. */
export interface NavRouteItem {
  id: string;
  kind: 'route';
  i18nKey: TranslationKey;
  icon: IconName;
  /** Static target; the profile tab's username is resolved at render time. */
  route: Route;
  isActive: (route: Route, username: string) => boolean;
  placement: NavPlacement;
  enabled: boolean;
}

/** The central compose action — opens the composer instead of routing. */
export interface NavActionItem {
  id: string;
  kind: 'action';
  i18nKey: TranslationKey;
  icon: IconName;
  placement: NavPlacement;
  enabled: boolean;
}

export type NavItem = NavRouteItem | NavActionItem;

export const NAV_ITEMS: readonly NavItem[] = [
  {
    id: 'feed',
    kind: 'route',
    i18nKey: 'route.feed',
    icon: 'home',
    route: { name: 'feed' },
    isActive: (r) => r.name === 'feed',
    placement: 'primary',
    enabled: true,
  },
  {
    id: 'search',
    kind: 'route',
    i18nKey: 'route.search',
    icon: 'search',
    route: { name: 'search' },
    isActive: (r) => r.name === 'search',
    placement: 'primary',
    enabled: true,
  },
  {
    id: 'compose',
    kind: 'action',
    i18nKey: 'nav.compose',
    icon: 'plus',
    placement: 'primary',
    enabled: true,
  },
  {
    id: 'mind',
    kind: 'route',
    i18nKey: 'route.mind',
    icon: 'mind',
    route: { name: 'mind' },
    isActive: (r) => r.name === 'mind',
    placement: 'primary',
    enabled: true,
  },
  {
    id: 'profile',
    kind: 'route',
    i18nKey: 'route.profile',
    icon: 'user',
    route: { name: 'profile', username: '' },
    isActive: (r, username) => r.name === 'profile' && r.username === username,
    placement: 'primary',
    enabled: true,
  },
  {
    id: 'settings',
    kind: 'route',
    i18nKey: 'route.settings',
    icon: 'settings',
    route: { name: 'settings' },
    isActive: (r) => r.name === 'settings',
    placement: 'secondary',
    enabled: true,
  },
];
