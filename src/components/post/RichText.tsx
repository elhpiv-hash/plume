import { Fragment } from 'react';
import { ExternalLink } from '@/components/ui/ExternalLink';
import { useNavigation } from '@/hooks/useNavigation';
import { useData } from '@/hooks/useData';
import { parseRichText } from '@/lib/richText';

interface RichTextProps {
  text: string;
  className?: string;
}

/** Entities are emphasised by weight/contrast only — never colour, never champagne. */
const ENTITY_CLASS = 'font-semibold text-fg hover:underline underline-offset-2 no-tap';

/**
 * Renders a feather's text with clickable #hashtags, @mentions and safe links.
 * Purely a display layer over `text` (see lib/richText). Whitespace and line
 * breaks are preserved by the surrounding element's `whitespace-pre-wrap`.
 */
export function RichText({ text, className }: RichTextProps) {
  const { navigate } = useNavigation();
  const data = useData();
  const tokens = parseRichText(text);

  return (
    <span className={className}>
      {tokens.map((token, i) => {
        switch (token.type) {
          case 'text':
            return <Fragment key={i}>{token.value}</Fragment>;

          case 'hashtag':
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ name: 'hashtag', tag: token.tag });
                }}
                className={ENTITY_CLASS}
              >
                {token.value}
              </button>
            );

          case 'mention': {
            // Unknown handles degrade to plain emphasis — no navigation, no crash.
            const exists = data.getUserByUsername(token.username) !== undefined;
            if (!exists) {
              return (
                <span key={i} className="font-semibold text-fg">
                  {token.value}
                </span>
              );
            }
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate({ name: 'profile', username: token.username });
                }}
                className={ENTITY_CLASS}
              >
                {token.value}
              </button>
            );
          }

          case 'url':
            // No label → ExternalLink shows the friendly host (never the raw URL).
            return <ExternalLink key={i} url={token.href} />;
        }
      })}
    </span>
  );
}
