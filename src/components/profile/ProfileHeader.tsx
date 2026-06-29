import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Icon } from '@/components/ui/Icon';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { useNavigation } from '@/hooks/useNavigation';
import { formatBirthday, formatJoinDate } from '@/lib/formatTime';
import { normalizeUrl } from '@/lib/validators';
import { cn } from '@/lib/cn';
import type { User } from '@/types';

interface ProfileHeaderProps {
  user: User;
}

/** Хост ссылки как запасной заголовок, если label не задан. */
function linkHost(url: string): string {
  try {
    return new URL(normalizeUrl(url)).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
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
            Редактировать
          </Button>
        ) : (
          <Button variant={isFollowing ? 'secondary' : 'primary'} size="sm" onClick={onFollow}>
            {isFollowing ? 'Вы подписаны' : 'Подписаться'}
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
          <Icon name="plus" size={16} /> Добавь пару слов о себе
        </button>
      ) : null}

      {(user.location || user.work || user.education || user.birthday) ? (
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
            <a
              key={`${link.url}-${i}`}
              href={normalizeUrl(link.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-[16rem] items-center gap-1.5 text-sm text-fg underline-offset-2 hover:underline"
            >
              <Icon name="link" size={15} className="text-muted" />
              <span className="truncate">{link.label || linkHost(link.url)}</span>
            </a>
          ))}
        </div>
      ) : null}

      <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
        <Icon name="feather" size={15} />В Plume с {formatJoinDate(user.createdAt)}
      </p>

      <div className="mt-3 flex items-center gap-5">
        <Count value={following} label="в подписках" />
        <Count value={followers} label={followers === 1 ? 'подписчик' : 'подписчиков'} />
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="О себе">
        <textarea
          value={bioDraft}
          maxLength={BIO_MAX}
          autoFocus
          onChange={(e) => setBioDraft(e.target.value)}
          rows={3}
          placeholder="Кто ты, чем дышишь?"
          className={cn(
            'w-full resize-none rounded-md border border-border bg-surface p-3 text-base text-fg',
            'outline-none placeholder:text-faint focus:border-border-strong',
          )}
        />
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-faint tabular-nums">{BIO_MAX - bioDraft.length}</span>
          <Button size="sm" onClick={saveBio}>
            Сохранить
          </Button>
        </div>
      </Modal>
    </header>
  );
}
