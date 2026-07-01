import { Tabs, type TabItem } from '@/components/ui/Tabs';
import { useI18n } from '@/hooks/useI18n';

export type ProfileTab = 'posts' | 'replies';

interface ProfileTabsProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export function ProfileTabs({ active, onChange }: ProfileTabsProps) {
  const { t } = useI18n();
  const items: ReadonlyArray<TabItem<ProfileTab>> = [
    { id: 'posts', label: t('tab.posts') },
    { id: 'replies', label: t('tab.replies') },
  ];
  return <Tabs items={items} active={active} onChange={onChange} />;
}
