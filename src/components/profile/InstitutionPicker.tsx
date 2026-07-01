import { useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { useI18n } from '@/hooks/useI18n';
import { searchInstitutions, type Institution } from '@/data/universities';
import { cn } from '@/lib/cn';

interface InstitutionPickerProps {
  label: string;
  /** The confirmed value — only ever set by choosing from the list. */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  leading?: ReactNode;
}

/**
 * Accessible combobox for the profile "University" field. The user types to
 * filter, but a value is only *confirmed* by picking a suggestion — free text
 * that doesn't match the directory is discarded on blur, never saved. The data
 * source (searchInstitutions) is a swappable seam for a future backend search.
 */
export function InstitutionPicker({
  label,
  value,
  onChange,
  placeholder,
  leading,
}: InstitutionPickerProps) {
  const { t } = useI18n();
  const listId = useId();
  const inputId = useId();
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo<Institution[]>(() => searchInstitutions(query), [query]);

  const commit = (name: string) => {
    onChange(name);
    setQuery(name);
    setOpen(false);
  };

  const revertToConfirmed = () => {
    // Discard any unconfirmed free text — only list picks survive.
    setQuery(value);
    setOpen(false);
  };

  const clear = () => {
    onChange('');
    setQuery('');
    setActiveIndex(0);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (open && results[activeIndex]) {
        e.preventDefault();
        commit(results[activeIndex].name);
      }
    } else if (e.key === 'Escape') {
      revertToConfirmed();
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-muted">
        {label}
      </label>
      <div className="relative">
        <div
          className={cn(
            'flex items-center gap-2 rounded-md border bg-elevated px-3.5 transition-colors duration-200',
            'focus-within:border-border-strong focus-within:shadow-focus border-border',
          )}
        >
          {leading ? <span className="text-muted select-none">{leading}</span> : null}
          <input
            id={inputId}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && results[activeIndex] ? `${listId}-${activeIndex}` : undefined}
            autoComplete="off"
            value={query}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActiveIndex(0);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              blurTimer.current = setTimeout(revertToConfirmed, 120);
            }}
            onKeyDown={onKeyDown}
            className="h-11 w-full bg-transparent text-base text-fg outline-none placeholder:text-faint"
          />
          {query ? (
            <button
              type="button"
              aria-label={t('institution.clear')}
              // Prevent the input blur from firing before the click lands.
              onMouseDown={(e) => e.preventDefault()}
              onClick={clear}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-hover hover:text-fg"
            >
              <Icon name="close" size={16} />
            </button>
          ) : null}
        </div>

        {open ? (
          <ul
            id={listId}
            role="listbox"
            className={cn(
              'absolute z-20 mt-1.5 max-h-64 w-full overflow-auto rounded-md border border-border',
              'bg-elevated py-1 shadow-lift animate-fade-in',
            )}
            onMouseDown={(e) => {
              // Keep focus on the input while clicking an option.
              e.preventDefault();
              if (blurTimer.current) clearTimeout(blurTimer.current);
            }}
          >
            {results.length > 0 ? (
              results.map((item, i) => (
                <li key={item.name} role="none">
                  <button
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => commit(item.name)}
                    className={cn(
                      'flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-base transition-colors',
                      i === activeIndex ? 'bg-surface-hover text-fg' : 'text-fg',
                    )}
                  >
                    <span className="truncate">{item.name}</span>
                    {item.country ? (
                      <span className="shrink-0 text-xs text-faint">{item.country}</span>
                    ) : null}
                  </button>
                </li>
              ))
            ) : (
              <li role="none" className="px-3.5 py-3 text-sm text-muted">
                {t('institution.noResults')}
              </li>
            )}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
