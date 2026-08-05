"use client";

import CharacterCount from "@tiptap/extension-character-count";
import TiptapLink from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  Eye,
  EyeOff,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from "lucide-react";
import { useId, useState } from "react";
import { useEffect } from "react";
import { RichTextView } from "@/components/ui/rich-text";
import type { Align, RichText } from "@/lib/sanitize-html";
import { ALIGN_VALUES } from "@/lib/sanitize-html";
import { isSafeUrl } from "@/lib/validation";
import { cn } from "@/lib/utils";

/**
 * Editor de texto enriquecido del panel (TipTap), pensado para cargarse
 * SOLO dentro de `src/components/admin` y páginas de `mi-estudio` — nunca
 * desde el sitio público (ver `next/dynamic` en los llamadores, con
 * `ssr: false`, para que no entre en el bundle público).
 *
 * Permite exactamente: negrita, cursiva, listas con viñetas/numeradas,
 * enlaces seguros y las 4 alineaciones — nada de tamaños, colores, fuentes
 * ni HTML libre. El HTML que produce se vuelve a sanear en el servidor
 * antes de guardarse (`src/lib/sanitize-html.ts`).
 */

const ALIGN_META: Record<Align, { label: string; Icon: typeof AlignLeft }> = {
  left: { label: "Izquierda", Icon: AlignLeft },
  center: { label: "Centrado", Icon: AlignCenter },
  right: { label: "Derecha", Icon: AlignRight },
  justify: { label: "Justificado", Icon: AlignJustify },
};

function isLikelyValidHref(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (/^mailto:/i.test(trimmed)) {
    return /^mailto:[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(trimmed);
  }
  return isSafeUrl(trimmed);
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 flex-none items-center justify-center rounded-xl text-muted transition-colors hover:bg-sand-100 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lavender-500 disabled:pointer-events-none disabled:opacity-30",
        active && "bg-lavender-100 text-lavender-700 hover:bg-lavender-100",
      )}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  maxLength = 20000,
  ariaLabel,
}: {
  value: RichText;
  onChange: (next: RichText) => void;
  maxLength?: number;
  ariaLabel: string;
}) {
  const id = useId();
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkDraft, setLinkDraft] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      TiptapLink.configure({
        openOnClick: false,
        autolink: false,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      CharacterCount.configure({ limit: maxLength }),
    ],
    content: value.html || "<p></p>",
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-label": ariaLabel,
        "aria-multiline": "true",
        class:
          "rich-content min-h-[10rem] rounded-b-2xl border border-t-0 border-sand-200 bg-white px-4 py-3 text-sm text-ink focus:outline-none",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange({ html: ed.isEmpty ? "" : ed.getHTML(), align: value.align });
    },
    immediatelyRender: false,
  });

  // Sincroniza cambios externos (ej.: "Restaurar contenido predeterminado"),
  // sin pisar lo que la persona está escribiendo: solo actúa si el HTML
  // entrante es distinto del que ya tiene el editor.
  useEffect(() => {
    if (!editor) return;
    const incoming = value.html || "<p></p>";
    if (incoming !== editor.getHTML()) {
      editor.commands.setContent(incoming, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.html, editor]);

  if (!editor) {
    return (
      <div
        aria-hidden
        className="h-48 animate-pulse rounded-2xl border border-sand-200 bg-sand-50"
      />
    );
  }

  const charCount = editor.storage.characterCount.characters() as number;
  const overLimit = charCount > maxLength;

  function applyLink() {
    if (!editor) return;
    if (!linkDraft.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setShowLinkInput(false);
      setLinkError(null);
      return;
    }
    if (!isLikelyValidHref(linkDraft)) {
      setLinkError(
        "Ese enlace no parece válido. Usá http://, https:// o mailto:.",
      );
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkDraft.trim() })
      .run();
    setShowLinkInput(false);
    setLinkError(null);
  }

  return (
    <div>
      <div
        role="toolbar"
        aria-label={`Formato de texto — ${ariaLabel}`}
        className="flex flex-wrap items-center gap-1 rounded-t-2xl border border-sand-200 bg-sand-50 p-1.5"
      >
        <ToolbarButton
          label="Negrita (Ctrl+B)"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={15} aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="Cursiva (Ctrl+I)"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} aria-hidden />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px flex-none bg-sand-300" aria-hidden />

        <ToolbarButton
          label="Lista con viñetas"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={15} aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="Lista numerada"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} aria-hidden />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px flex-none bg-sand-300" aria-hidden />

        <ToolbarButton
          label="Enlace"
          active={editor.isActive("link") || showLinkInput}
          onClick={() => {
            setLinkDraft((editor.getAttributes("link").href as string) ?? "");
            setLinkError(null);
            setShowLinkInput((s) => !s);
          }}
        >
          <Link2 size={15} aria-hidden />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px flex-none bg-sand-300" aria-hidden />

        {ALIGN_VALUES.map((v) => {
          const { label, Icon } = ALIGN_META[v];
          return (
            <ToolbarButton
              key={v}
              label={`Alinear: ${label}`}
              active={value.align === v}
              onClick={() => onChange({ html: value.html, align: v })}
            >
              <Icon size={15} aria-hidden />
            </ToolbarButton>
          );
        })}

        <span className="mx-1 h-5 w-px flex-none bg-sand-300" aria-hidden />

        <ToolbarButton
          label="Deshacer (Ctrl+Z)"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 size={15} aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="Rehacer (Ctrl+Shift+Z)"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 size={15} aria-hidden />
        </ToolbarButton>
        <ToolbarButton
          label="Limpiar formato"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
        >
          <Eraser size={15} aria-hidden />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px flex-none bg-sand-300" aria-hidden />

        <ToolbarButton
          label={showPreview ? "Ocultar vista previa" : "Vista previa"}
          active={showPreview}
          onClick={() => setShowPreview((s) => !s)}
        >
          {showPreview ? (
            <EyeOff size={15} aria-hidden />
          ) : (
            <Eye size={15} aria-hidden />
          )}
        </ToolbarButton>
      </div>

      {showLinkInput && (
        <div className="flex flex-wrap items-center gap-2 border-x border-sand-200 bg-lavender-50/60 px-3 py-2 text-sm">
          <label htmlFor={`${id}-link`} className="sr-only">
            URL del enlace
          </label>
          <input
            id={`${id}-link`}
            type="text"
            value={linkDraft}
            onChange={(e) => setLinkDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setShowLinkInput(false);
              }
            }}
            placeholder="https://… · mailto:… · /pagina-interna"
            className="min-w-0 flex-1 rounded-full border border-sand-300 bg-white px-3 py-1.5 text-xs focus:border-lavender-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={applyLink}
            className="flex-none rounded-full bg-lavender-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-lavender-700"
          >
            Aplicar
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="flex-none rounded-full px-3 py-1.5 text-xs text-muted hover:text-ink"
          >
            Cancelar
          </button>
          {linkError && (
            <p role="alert" className="w-full text-xs text-red-600">
              {linkError}
            </p>
          )}
        </div>
      )}

      <EditorContent editor={editor} />

      <div className="mt-1.5 flex items-center justify-between text-xs text-muted">
        <span className={cn(overLimit && "font-medium text-red-600")}>
          {charCount.toLocaleString("es-AR")} /{" "}
          {maxLength.toLocaleString("es-AR")} caracteres
        </span>
      </div>

      {showPreview && (
        <div className="mt-3 rounded-2xl border border-dashed border-sand-300 bg-sand-50/60 p-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Vista previa
          </p>
          <RichTextView html={value.html} align={value.align} />
        </div>
      )}
    </div>
  );
}
