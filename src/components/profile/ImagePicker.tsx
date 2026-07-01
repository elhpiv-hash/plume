import { useRef, useState, type ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Icon, type IconName } from '@/components/ui/Icon';
import { useToast } from '@/hooks/useToast';
import { useI18n } from '@/hooks/useI18n';
import { fileToResizedDataUrl } from '@/lib/imageResize';
import { cn } from '@/lib/cn';

interface ImagePickerProps {
  label: string;
  /** Current image as a data URL, or null when empty. */
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  /** 'square' → круглое превью (аватар); 'wide' → баннер (обложка). */
  shape: 'square' | 'wide';
  maxW: number;
  maxH: number;
  placeholderIcon?: IconName;
}

/**
 * Reusable picker for avatar and cover. Hidden file input behind a clickable,
 * keyboard-accessible preview. Resizes on pick via fileToResizedDataUrl and
 * lifts the result up — nothing is persisted until the form saves.
 */
export function ImagePicker({
  label,
  value,
  onChange,
  shape,
  maxW,
  maxH,
  placeholderIcon = 'image',
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { notify } = useToast();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);

  const pick = () => inputRef.current?.click();

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Allow re-picking the same file later.
    e.target.value = '';
    if (!file) return;
    setLoading(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file, {
        maxW,
        maxH,
        square: shape === 'square',
      });
      onChange(dataUrl);
    } catch (err) {
      notify(err instanceof Error ? err.message : t('picker.error'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  const preview = (
    <button
      type="button"
      onClick={pick}
      aria-label={value ? t('picker.replaceAria', { label }) : t('picker.uploadAria', { label })}
      className={cn(
        'group relative grid place-items-center overflow-hidden border border-border bg-elevated',
        'transition-colors duration-200 hover:border-border-strong focus-visible:shadow-focus',
        shape === 'square' ? 'h-20 w-20 rounded-full' : 'h-28 w-full rounded-lg',
      )}
    >
      {value ? (
        <img src={value} alt="" className="h-full w-full object-cover" />
      ) : (
        <Icon name={placeholderIcon} size={shape === 'square' ? 22 : 26} className="text-faint" />
      )}
      <span
        className={cn(
          'absolute inset-0 grid place-items-center bg-bg/55 text-fg transition-opacity duration-200',
          loading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        )}
      >
        <Icon name={loading ? 'feather' : 'camera'} size={18} className={loading ? 'animate-signal-pulse' : ''} />
      </span>
    </button>
  );

  const controls = (
    <div className="flex items-center gap-3">
      <Button type="button" variant="secondary" size="sm" onClick={pick} disabled={loading}>
        {value ? t('picker.replace') : t('picker.upload')}
      </Button>
      {value ? (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-sm text-muted transition-colors hover:text-fg"
        >
          {t('picker.remove')}
        </button>
      ) : null}
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted">{label}</span>
      {shape === 'square' ? (
        <div className="flex items-center gap-4">
          {preview}
          {controls}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {preview}
          {controls}
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
    </div>
  );
}
