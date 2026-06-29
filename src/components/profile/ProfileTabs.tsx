import { Tabs, type TabItem } from '@/components/ui/Tabs';

export type ProfileTab = 'posts' | 'replies';

const ITEMS: ReadonlyArray<TabItem<ProfileTab>> = [
  { id: 'posts', label: 'Посты' },
  { id: 'replies', label: 'Ответы' },
];

interface ProfileTabsProps {
  active: ProfileTab;
  onChange: (tab: ProfileTab) => void;
}

export function ProfileTabs({ active, onChange }: ProfileTabsProps) {
  return <Tabs items={ITEMS} active={active} onChange={onChange} />;
}
