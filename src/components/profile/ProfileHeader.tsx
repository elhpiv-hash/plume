import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Icon } from '@/components/ui/Icon';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { useNavigation } from '@/hooks/useNavigation';
import { useI18n } from '@/hooks/useI18n';
import { formatBirthday, formatJoinDate } from '@/lib/formatTime';
import { cn } from '@/lib/cn';
import type { User } from '@/types';

interface ProfileHeaderProps {
  user: User;
}

interface CountProps {
  value: number;
  label: string;
}

/** Zero is a valid, well-dressed state here — never "0 подписчиков" as failure. */
function Count({ value, label }: CountProps) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="font-display font-semibold tabular-nums text-fg">{value}</span>
      <span className="text-sm text-muted">{label}</span>
    </span>
  );
}

const BIO_MAX = 160;

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const { currentUser } = useAuth();
  const data = useData();
  const { navigate } = useNavigation();
  const { t } = useI18n();
  const [editOpen, setEditOpen] = useState(false);
  const [bioDraft, setBioDraft] = useState(user.bio);

  const isOwn = currentUser?.id === user.id;
  const isFollowing = currentUser ? data.isFollowing(currentUser.id, user.id) : false;
  const followers = data.followerCount(user.id);
  const following = data.followingCount(user.id);

  const onFollow = () => {
    if (!currentUser || isOwn) return;
    data.setFollow(currentUser.id, user.id, !isFollowing);
  };

  const saveBio = () => {
    data.updateBio(user.id, bioDraft);
    setEditOpen(false);
  };

  return (
    <header className="px-4 pt-5 pb-4">
      {user.coverUrl ? (
        <div className="-mx-4 -mt-5 mb-4 h-28 overflow-hidden border-b border-border sm:h-36">
          <img src={user.coverUrl} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}

      <div className="flex items-start justify-between">
        <Avatar user={user} size="xl" className="ring-2 ring-border" />
        {isOwn ? (
          <Button variant="secondary" size="sm" onClick={() => navigate({ name: 'edit-profile' })}>
            {t('profile.edit')}
          </Button>
        ) : (
          <Button variant={isFollowing ? 'secondary' : 'primary'} size="sm" onClick={onFollow}>
            {isFollowing ? t('profile.following') : t('profile.follow')}
          </Button>
        )}
      </div>

      <div className="mt-3">
        <h1 className="font-display text-2xl font-bold tracking-tight">{user.name}</h1>
        <p className="text-base text-muted">@{user.username}</p>
      </div>

      {user.bio ? (
        <p className="mt-3 whitespace-pre-wrap text-[0.95rem] leading-relaxed text-fg">{user.bio}</p>
      ) : isOwn ? (
        <button
          type="button"
          onClick={() => setEditOpen(true)}
          className="mt-3 inline-flex items-center gap-1.5 text-[0.95rem] text-muted hover:text-fg transition-colors"
        >
          <Icon name="plus" size={16} /> {t('profile.addBio')}
        </button>
      ) : null}

      {(user.location || user.work || user.education || user.school || user.birthday) ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
          {user.location ? (
            <span className="inline-flex max-w-[14rem] items-center gap-1.5">
              <Icon name="pin" size={15} />
              <span className="truncate">{user.location}</span>
            </span>
          ) : null}
          {user.work ? (
            <span className="inline-flex max-w-[14rem] items-center gap-1.5">
              <Icon name="briefcase" size={15} />
              <span className="truncate">{user.work}</span>
            </span>
          ) : null}
          {user.education ? (
            <span className="inline-flex max-w-[14rem] items-center gap-1.5">
              <Icon name="cap" size={15} />
              <span className="truncate">{user.education}</span>
            </span>
          ) : null}
          {user.school ? (
            <span className="inline-flex max-w-[14rem] items-center gap-1.5">
              <Icon name="cap" size={15} />
              <span className="truncate">{user.school}</span>
            </span>
          ) : null}
          {user.birthday ? (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="cake" size={15} />
              {formatBirthday(user.birthday.date, user.birthday.showYear)}
            </span>
          ) : null}
        </div>
      ) : null}

      {user.links && user.links.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
          {user.links.map((link, i) => (
            <ExternalLink key={`${link.url}-${i}`} url={link.url} label={link.label} />
          ))}
        </div>
      ) : null}

      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
        <Icon name="feather" size={15} />
        {t('profile.joined', { date: formatJoinDate(user.createdAt) })}
      </p>

      <div className="mt-3 flex items-center gap-5">
        <Count value={following} label={t('profile.count.following')} />
        <Count
          value={followers}
          label={followers === 1 ? t('profile.count.followers.one') : t('profile.count.followers.many')}
        />
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title={t('profile.bio.title')}>
        <textarea
          value={bioDraft}
          maxLength={BIO_MAX}
          autoFocus
          onChange={(e) => setBioDraft(e.target.value)}
          rows={3}
          placeholder={t('edit.bio.placeholder')}
          className={cn(
            'w-full resize-none rounded-md border border-border bg-surface p-3 text-base text-fg',
            'outline-none placeholder:text-faint focus:border-border-strong',
          )}
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-faint tabular-nums">{BIO_MAX - bioDraft.length}</span>
          <Button size="sm" onClick={saveBio}>
            {t('edit.save')}
          </Button>
        </div>
      </Modal>
    </header>
  );
}
