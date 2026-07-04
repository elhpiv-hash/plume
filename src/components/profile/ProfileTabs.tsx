import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { useI18n } from '@/hooks/useI18n';

export type ProfileTab = 'posts' | 'replies' | 'saved';

interface ProfileTabsProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
  /** The private "Saved" tab is only offered on one's own profile. */
  showSaved?: boolean;
}

export function ProfileTabs({ active, onChange, showSaved = false }: ProfileTabsProps) {
  const { t } = useI18n();
  const items: TabItem<ProfileTab>[] = [
    { id: 'posts', label: t('tab.posts') },
    { id: 'replies', label: t('tab.replies') },
  ];
  if (showSaved) items.push({ id: 'saved', label: t('tab.saved') });
  return <Tabs items={items} active={active} onChange={onChange} />;
}
