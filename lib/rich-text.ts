// Pure helpers shared by client and server. Sanitizing lives in lib/sanitize.ts.

export type NoteFormat = "plain" | "html";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Turns a legacy plain-text note into HTML the editor can load.
export function plainToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((paragraph) => escapeHtml(paragraph).replace(/\n/g, "<br>"))
    .map((paragraph) => `<p>${paragraph}</p>`)
    .join("");
}

export function noteToEditorHtml(note: string, format: NoteFormat): string {
  return format === "html" ? note : plainToHtml(note);
}
