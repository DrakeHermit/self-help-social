import { cn } from "@/lib/utils";
import { type NoteFormat } from "@/lib/rich-text";

export type RichTextViewProps = {
  note: string;
  format: NoteFormat;
  className?: string;
};

// `html` notes are sanitized on write and again when they are read from the
// database (see lib/habits.ts), so they are safe to inject here.
export function RichTextView({ note, format, className }: RichTextViewProps) {
  if (format === "html") {
    return (
      <div
        className={cn("rich-text text-sm leading-relaxed text-foreground", className)}
        dangerouslySetInnerHTML={{ __html: note }}
      />
    );
  }

  return (
    <p
      className={cn(
        "whitespace-pre-line text-sm leading-relaxed text-foreground",
        className,
      )}
    >
      {note}
    </p>
  );
}
