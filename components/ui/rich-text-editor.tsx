"use client";

import { useEffect } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type RichTextEditorProps = {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
};

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "start writing…",
  disabled = false,
  autoFocus = false,
  className,
  contentClassName,
  "aria-label": ariaLabel = "Rich text editor",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        link: { openOnClick: false, autolink: true },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editable: !disabled,
    autofocus: autoFocus ? "end" : false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": ariaLabel,
        class: cn(
          "rich-text min-h-[12rem] px-4 py-3 text-sm leading-relaxed text-foreground focus:outline-none",
          contentClassName,
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.isEmpty ? "" : editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && editor.isEditable === disabled) {
      editor.setEditable(!disabled);
    }
  }, [editor, disabled]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-input bg-transparent shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring",
        disabled && "opacity-50",
        className,
      )}
    >
      <Toolbar editor={editor} disabled={disabled} />
      <EditorContent editor={editor} />
    </div>
  );
}

type ToolbarProps = { editor: Editor | null; disabled: boolean };

function Toolbar({ editor, disabled }: ToolbarProps) {
  // `useEditorState` must never be handed a null editor: if it starts with
  // null it doesn't refresh when the editor appears, leaving the toolbar empty
  // until the first transaction (e.g. clicking into the editor). So only mount
  // it once the editor exists.
  if (!editor) {
    // Reserve the toolbar's height so the layout doesn't jump on mount.
    return <div className="h-[2.8125rem] border-b border-border/70" aria-hidden />;
  }
  return <ToolbarButtons editor={editor} disabled={disabled} />;
}

function ToolbarButtons({
  editor,
  disabled,
}: {
  editor: Editor;
  disabled: boolean;
}) {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      h2: editor.isActive("heading", { level: 2 }),
      bulletList: editor.isActive("bulletList"),
      orderedList: editor.isActive("orderedList"),
      blockquote: editor.isActive("blockquote"),
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
    }),
  });

  const run = () => editor.chain().focus();

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex flex-wrap items-center gap-0.5 border-b border-border/70 px-2 py-1.5"
    >
      <ToolButton
        label="Bold"
        active={state.bold}
        disabled={disabled}
        onClick={() => run().toggleBold().run()}
      >
        <Bold />
      </ToolButton>
      <ToolButton
        label="Italic"
        active={state.italic}
        disabled={disabled}
        onClick={() => run().toggleItalic().run()}
      >
        <Italic />
      </ToolButton>
      <ToolButton
        label="Underline"
        active={state.underline}
        disabled={disabled}
        onClick={() => run().toggleUnderline().run()}
      >
        <Underline />
      </ToolButton>
      <ToolButton
        label="Strikethrough"
        active={state.strike}
        disabled={disabled}
        onClick={() => run().toggleStrike().run()}
      >
        <Strikethrough />
      </ToolButton>

      <Divider />

      <ToolButton
        label="Heading"
        active={state.h2}
        disabled={disabled}
        onClick={() => run().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 />
      </ToolButton>
      <ToolButton
        label="Bulleted list"
        active={state.bulletList}
        disabled={disabled}
        onClick={() => run().toggleBulletList().run()}
      >
        <List />
      </ToolButton>
      <ToolButton
        label="Numbered list"
        active={state.orderedList}
        disabled={disabled}
        onClick={() => run().toggleOrderedList().run()}
      >
        <ListOrdered />
      </ToolButton>
      <ToolButton
        label="Quote"
        active={state.blockquote}
        disabled={disabled}
        onClick={() => run().toggleBlockquote().run()}
      >
        <Quote />
      </ToolButton>

      <Divider />

      <ToolButton
        label="Undo"
        disabled={disabled || !state.canUndo}
        onClick={() => run().undo().run()}
      >
        <Undo2 />
      </ToolButton>
      <ToolButton
        label="Redo"
        disabled={disabled || !state.canRedo}
        onClick={() => run().redo().run()}
      >
        <Redo2 />
      </ToolButton>
    </div>
  );
}

type ToolButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolButton({
  label,
  active = false,
  disabled,
  onClick,
  children,
}: ToolButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4",
        active && "bg-primary/10 text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-border" />;
}
