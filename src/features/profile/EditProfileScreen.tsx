import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { Icon } from '@/components/ui/Icon';
import { ImagePicker } from '@/components/profile/ImagePicker';
import { InstitutionPicker } from '@/components/profile/InstitutionPicker';
import { useAuth } from '@/hooks/useAuth';
import { useData } from '@/hooks/useData';
import { useNavigation } from '@/hooks/useNavigation';
import { useToast } from '@/hooks/useToast';
import { useI18n } from '@/hooks/useI18n';
import { normalizeUrl, validateName, validateUrl } from '@/lib/validators';
import { containsProfanity } from '@/lib/profanity';
import { cn } from '@/lib/cn';
import type { ProfileLink, ProfilePatch } from '@/types';

const BIO_MAX = 160;
const LINKS_MAX = 3;

/**
 * Full profile editor (Profile 2.0). Local form state is collected from the
 * signed-in user and committed in a single `updateProfile` on save. Reachable
 * only from one's own profile via the edit button.
 */
export function EditProfileScreen() {
  const { currentUser } = useAuth();
  const data = useData();
  const { back } = useNavigation();
  const { notify } = useToast();
  const { t } = useI18n();

  const [name, setName] = useState(currentUser?.name ?? '');
  const [bio, setBio] = useState(currentUser?.bio ?? '');
  const [location, setLocation] = useState(currentUser?.location ?? '');
  const [work, setWork] = useState(currentUser?.work ?? '');
  const [education, setEducation] = useState(currentUser?.education ?? '');
  const [school, setSchool] = useState(currentUser?.school ?? '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUser?.avatarUrl ?? null);
  const [coverUrl, setCoverUrl] = useState<string | null>(currentUser?.coverUrl ?? null);
  const [links, setLinks] = useState<ProfileLink[]>(currentUser?.links ?? []);
  const [birthdayDate, setBirthdayDate] = useState(currentUser?.birthday?.date ?? '');
  const [showYear, setShowYear] = useState(currentUser?.birthday?.showYear ?? true);

  const [nameError, setNameError] = useState<string | null>(null);
  const [schoolError, setSchoolError] = useState<string | null>(null);
  const [linkErrors, setLinkErrors] = useState<(string | null)[]>([]);

  // Route guard — only an authenticated user can reach this screen.
  if (!currentUser) return null;

  const bioOver = bio.length > BIO_MAX;

  const setLinkAt = (index: number, field: keyof ProfileLink, value: string) =>
    setLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  const addLink = () => setLinks((prev) => [...prev, { label: '', url: '' }]);
  const removeLink = (index: number) => setLinks((prev) => prev.filter((_, i) => i !== index));

  const save = () => {
    // Validation + profanity gate produce i18n keys; resolve them for display.
    const nameKey = validateName(name) ?? (containsProfanity(name) ? 'profanity.blocked' : null);
    const schoolKey = containsProfanity(school) ? 'profanity.blocked' : null;
    const linkKeys = links.map((l) => (l.url.trim() ? validateUrl(l.url) : null));

    setNameError(nameKey ? t(nameKey) : null);
    setSchoolError(schoolKey ? t(schoolKey) : null);
    setLinkErrors(linkKeys.map((k) => (k ? t(k) : null)));

    if (nameKey || schoolKey || bioOver || linkKeys.some((k) => k !== null)) {
      notify(t('edit.checkFields'), 'danger');
      return;
    }

    // Drop empty rows, normalize URLs (add scheme if missing).
    const cleanedLinks: ProfileLink[] = links
      .map((l) => ({ label: l.label.trim(), url: l.url.trim() }))
      .filter((l) => l.url !== '')
      .map((l) => ({ label: l.label, url: normalizeUrl(l.url) }));

    const patch: ProfilePatch = {
      name: name.trim(),
      bio: bio.trim(),
      location: location.trim(),
      work: work.trim(),
      education: education.trim(),
      school: school.trim(),
      links: cleanedLinks,
      birthday: birthdayDate ? { date: birthdayDate, showYear } : null,
      avatarUrl,
      coverUrl,
    };

    data.updateProfile(currentUser.id, patch);
    notify(t('edit.saved'));
    back();
  };

  return (
    <div className="animate-fade-in">
      {/* Sticky action bar under the app header. */}
      <div className="sticky top-14 z-20 flex items-center justify-between border-b border-border bg-bg/80 px-4 py-2.5 backdrop-blur-lg">
        <Button variant="ghost" size="sm" onClick={back}>
          {t('edit.cancel')}
        </Button>
        <Button size="sm" onClick={save}>
          {t('edit.save')}
        </Button>
      </div>

      <div className="flex flex-col gap-6 px-4 py-5">
        <ImagePicker
          label={t('edit.avatar')}
          value={avatarUrl}
          onChange={setAvatarUrl}
          shape="square"
          maxW={400}
          maxH={400}
          placeholderIcon="user"
        />
        <ImagePicker
          label={t('edit.cover')}
          value={coverUrl}
          onChange={setCoverUrl}
          shape="wide"
          maxW={1280}
          maxH={480}
          placeholderIcon="image"
        />

        <Input
          label={t('field.name')}
          value={name}
          error={nameError}
          onChange={(e) => {
            setName(e.target.value);
            setNameError(null);
          }}
          placeholder={t('edit.name.placeholder')}
        />

        <div className="flex flex-col gap-1.5">
          <label htmlFor="edit-bio" className="text-sm font-medium text-muted">
            {t('edit.bio')}
          </label>
          <textarea
            id="edit-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder={t('edit.bio.placeholder')}
            className={cn(
              'w-full resize-none rounded-md border bg-elevated p-3 text-base text-fg',
              'outline-none placeholder:text-faint focus:border-border-strong',
              bioOver ? 'border-danger' : 'border-border',
            )}
          />
          <span className={cn('self-end text-xs tabular-nums', bioOver ? 'text-danger' : 'text-faint')}>
            {BIO_MAX - bio.length}
          </span>
        </div>

        <Input
          label={t('edit.location')}
          leading={<Icon name="pin" size={16} />}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t('edit.location.placeholder')}
        />

        {/* Links — dynamic list, 0..3 */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted">{t('edit.links')}</span>
            <span className="text-xs text-faint tabular-nums">
              {links.length}/{LINKS_MAX}
            </span>
          </div>
          {links.map((link, i) => (
            <div key={i} className="flex items-start gap-2 rounded-md border border-border p-3">
              <div className="flex flex-1 flex-col gap-2">
                <Input
                  label={t('edit.link.label')}
                  value={link.label}
                  onChange={(e) => setLinkAt(i, 'label', e.target.value)}
                  placeholder={t('edit.link.labelPlaceholder')}
                />
                <Input
                  label={t('edit.link.url')}
                  leading={<Icon name="link" size={16} />}
                  value={link.url}
                  error={linkErrors[i]}
                  onChange={(e) => {
                    setLinkAt(i, 'url', e.target.value);
                    setLinkErrors((prev) => prev.map((err, idx) => (idx === i ? null : err)));
                  }}
                  placeholder={t('edit.link.urlPlaceholder')}
                />
              </div>
              <button
                type="button"
                onClick={() => removeLink(i)}
                aria-label={t('edit.link.remove')}
                className="mt-7 grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-hover hover:text-fg"
              >
                <Icon name="close" size={18} />
              </button>
            </div>
          ))}
          {links.length < LINKS_MAX ? (
            <Button type="button" variant="secondary" size="sm" onClick={addLink} className="self-start">
              <Icon name="plus" size={16} /> {t('edit.link.add')}
            </Button>
          ) : null}
        </div>

        {/* Birthday */}
        <div className="flex flex-col gap-2">
          <label htmlFor="edit-bday" className="text-sm font-medium text-muted">
            {t('edit.birthday')}
          </label>
          <input
            id="edit-bday"
            type="date"
            value={birthdayDate}
            onChange={(e) => setBirthdayDate(e.target.value)}
            className={cn(
              'h-11 w-full rounded-md border border-border bg-elevated px-3.5 text-base text-fg',
              'outline-none focus:border-border-strong',
            )}
          />
          {birthdayDate ? (
            <div className="flex items-center justify-between pt-0.5">
              <span className="text-sm text-muted">{t('edit.showYear')}</span>
              <Toggle checked={showYear} onChange={setShowYear} label={t('edit.showYear.aria')} />
            </div>
          ) : null}
        </div>

        <Input
          label={t('edit.work')}
          leading={<Icon name="briefcase" size={16} />}
          value={work}
          onChange={(e) => setWork(e.target.value)}
          placeholder={t('edit.work.placeholder')}
        />

        {/* University — directory-backed: a value is only confirmed by picking. */}
        <InstitutionPicker
          label={t('edit.education')}
          leading={<Icon name="cap" size={16} />}
          value={education}
          onChange={setEducation}
          placeholder={t('edit.education.placeholder')}
        />

        {/* School — free text (no global directory), profanity-checked on save. */}
        <Input
          label={t('edit.school')}
          leading={<Icon name="cap" size={16} />}
          value={school}
          error={schoolError}
          onChange={(e) => {
            setSchool(e.target.value);
            setSchoolError(null);
          }}
          placeholder={t('edit.school.placeholder')}
        />

        {/* Anthem — feature stub, disabled, never saved. */}
        <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border text-faint">
              <Icon name="sparkle" size={18} />
            </span>
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-muted">{t('edit.anthem.title')}</p>
              <p className="truncate text-xs text-faint">{t('edit.anthem.desc')}</p>
            </div>
          </div>
          <Button type="button" variant="secondary" size="sm" disabled className="shrink-0">
            {t('edit.anthem.cta')}
          </Button>
        </div>
      </div>
    </div>
  );
}
