/**
 * Renders a structured document into a hidden iframe and opens the browser's
 * print dialog on it.
 *
 * Why an iframe rather than `window.print()`:
 *   - `window.print()` prints whatever is on screen, so the output inherits the
 *     app shell — sidebar, tab strip, sticky headers, dark mode, scroll
 *     clipping — and reads like a screenshot rather than a record.
 *   - An iframe document carries none of the app's CSS, so the print layout is
 *     exactly what's defined here and nothing else.
 *   - Unlike `window.open()`, an iframe isn't subject to popup blocking.
 *
 * The iframe is removed once printing finishes.
 */

export type PrintSection =
  /** Two-column label/value grid — the default for record fields. */
  | { title: string; type: "fields"; rows: { label: string; value: string }[] }
  /** Bordered table, for repeating rows like phone numbers. */
  | { title: string; type: "table"; columns: string[]; rows: string[][] }
  /** Bulleted list, e.g. notes. */
  | { title: string; type: "list"; items: string[] }
  /** Free text paragraph(s); newlines are preserved. */
  | { title: string; type: "text"; text: string };

export interface PrintDocumentOptions {
  /** Document title. Most browsers use it as the default filename when saving to PDF. */
  title: string;
  /** Large heading at the top of the page. */
  heading: string;
  /** Smaller line under the heading. */
  subheading?: string;
  sections: PrintSection[];
  /** Optional logo, same-origin path or absolute URL. Skipped silently if it fails to load. */
  logoUrl?: string;
  /** Footer note, printed alongside the generated-on date. */
  footerNote?: string;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Preserves author-entered line breaks inside an escaped string. */
const withLineBreaks = (value: string): string =>
  escapeHtml(value).replace(/\r?\n/g, "<br />");

const EMPTY_CELL = '<span class="empty">&mdash;</span>';

const PRINT_STYLES = `
  /* Brand palette, mirroring the tokens in src/index.css. That file carries an
     accessibility rule this document has to respect:

       --brand-yellow: #FFCA06  "fill on white, text on black - never text on white"
       --yellow-text:  #8A6600  "5.3:1 - yellow-family text on white"

     A printed page IS text on white, so the brand yellow is used only for
     fills, rules and accents, and anything yellow-toned that has to be READ
     uses the darker #8A6600 instead. Values and body copy stay near-black.

     Yellow is also kept to rules and light tints rather than large blocks:
     big saturated fills drink ink and print washed out on many printers. */
  :root {
    --brand-yellow: #FFCA06;
    --brand-yellow-text: #8A6600;
    --brand-yellow-tint: #FFF7DB;
    --ink: #111827;
    --ink-muted: #6b7280;
    --rule: #e5e7eb;
  }
  @page { size: A4; margin: 14mm; }
  * { box-sizing: border-box; }
  /* This is a paper document: pin it to light regardless of the viewer's OS or
     browser theme. Without color-scheme + an explicit background, a dark-mode
     browser paints a dark ground behind the frame while the text keeps its
     near-black colour, so the values render black-on-black in print preview
     and in some save-to-PDF paths. */
  html { color-scheme: light; background: #ffffff; }
  html, body { margin: 0; padding: 0; }
  body {
    background: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.45;
    color: var(--ink);
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  header.doc-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    border-bottom: 3px solid var(--brand-yellow);
    padding-bottom: 10px;
    margin-bottom: 18px;
  }
  .doc-head .title-block {
    border-left: 4px solid var(--brand-yellow);
    padding-left: 10px;
  }
  /* The name itself stays near-black — it is the most-read text on the page. */
  .doc-head h1 { font-size: 19pt; margin: 0 0 2px; letter-spacing: -0.01em; color: var(--ink); }
  .doc-head .sub { font-size: 9.5pt; color: var(--brand-yellow-text); margin: 0; font-weight: 600; }
  .doc-head img { max-height: 34px; max-width: 150px; object-fit: contain; }

  section {
    margin-bottom: 15px;
    /* Keep a section with its heading on one page wherever it fits. */
    break-inside: avoid;
    page-break-inside: avoid;
  }
  section > h2 {
    font-size: 8.5pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.09em;
    color: var(--brand-yellow-text);
    margin: 0 0 7px;
    padding: 0 0 3px 8px;
    border-left: 3px solid var(--brand-yellow);
    border-bottom: 1px solid var(--rule);
  }

  dl.fields {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px 22px;
    margin: 0;
  }
  dl.fields > div { break-inside: avoid; min-width: 0; }
  dl.fields dt {
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ink-muted);
  }
  dl.fields dd { margin: 0; font-size: 10.5pt; word-break: break-word; color: var(--ink); }

  table { width: 100%; border-collapse: collapse; font-size: 10pt; }
  th, td { text-align: left; padding: 5px 8px; border: 1px solid #d1d5db; vertical-align: top; word-break: break-word; }
  th {
    background: var(--brand-yellow-tint);
    border-bottom-color: var(--brand-yellow);
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--brand-yellow-text);
  }
  thead { display: table-header-group; }

  ul.items { margin: 0; padding-left: 18px; }
  ul.items li { margin-bottom: 4px; font-size: 10.5pt; }

  p.text { margin: 0; font-size: 10.5pt; white-space: pre-wrap; word-break: break-word; }

  footer.doc-foot {
    margin-top: 22px;
    padding-top: 8px;
    border-top: 2px solid var(--brand-yellow);
    font-size: 8.5pt;
    color: var(--ink-muted);
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  .empty { color: #9ca3af; }
`;

function renderSection(section: PrintSection): string {
  const heading = `<h2>${escapeHtml(section.title)}</h2>`;

  switch (section.type) {
    case "fields": {
      if (section.rows.length === 0) return "";
      const cells = section.rows
        .map(
          (row) =>
            `<div><dt>${escapeHtml(row.label)}</dt><dd>${
              row.value ? withLineBreaks(row.value) : EMPTY_CELL
            }</dd></div>`,
        )
        .join("");
      return `<section>${heading}<dl class="fields">${cells}</dl></section>`;
    }
    case "table": {
      if (section.rows.length === 0) return "";
      const head = section.columns.map((c) => `<th>${escapeHtml(c)}</th>`).join("");
      const body = section.rows
        .map(
          (row) =>
            `<tr>${row
              .map((cell) => `<td>${cell ? withLineBreaks(cell) : EMPTY_CELL}</td>`)
              .join("")}</tr>`,
        )
        .join("");
      return `<section>${heading}<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></section>`;
    }
    case "list": {
      if (section.items.length === 0) return "";
      const items = section.items.map((i) => `<li>${withLineBreaks(i)}</li>`).join("");
      return `<section>${heading}<ul class="items">${items}</ul></section>`;
    }
    case "text": {
      if (!section.text.trim()) return "";
      return `<section>${heading}<p class="text">${withLineBreaks(section.text)}</p></section>`;
    }
  }
}

/** Resolves once every image in the document has loaded or failed. */
function imagesSettled(doc: Document): Promise<void> {
  const images = Array.from(doc.images);
  if (images.length === 0) return Promise.resolve();
  return Promise.all(
    images.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }),
    ),
  ).then(() => undefined);
}

export async function printDocument(options: PrintDocumentOptions): Promise<void> {
  const { title, heading, subheading, sections, logoUrl, footerNote } = options;

  const generatedOn = new Date().toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const body = `
    <header class="doc-head">
      <div class="title-block">
        <h1>${escapeHtml(heading)}</h1>
        ${subheading ? `<p class="sub">${escapeHtml(subheading)}</p>` : ""}
      </div>
      ${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="" />` : ""}
    </header>
    ${sections.map(renderSection).join("")}
    <footer class="doc-foot">
      <span>${escapeHtml(footerNote ?? "")}</span>
      <span>Printed ${escapeHtml(generatedOn)}</span>
    </footer>
  `;

  const html =
    `<!doctype html><html><head><meta charset="utf-8" />` +
    `<title>${escapeHtml(title)}</title><style>${PRINT_STYLES}</style></head>` +
    `<body>${body}</body></html>`;

  const iframe = document.createElement("iframe");
  // Positioned off-screen rather than `display: none` — a fully hidden frame
  // produces no printable content at all in some browsers.
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "210mm";
  iframe.style.height = "297mm";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";

  document.body.appendChild(iframe);

  let removed = false;
  const cleanUp = () => {
    if (removed) return;
    removed = true;
    if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
  };

  try {
    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) throw new Error("Could not open a print document.");

    doc.open();
    doc.write(html);
    doc.close();

    await imagesSettled(doc);

    // Tear the frame down only after the dialog closes — removing it while the
    // dialog is still open cancels the print in some browsers. `afterprint`
    // isn't fired everywhere, hence the timeout as a backstop.
    win.addEventListener("afterprint", cleanUp, { once: true });
    setTimeout(cleanUp, 60000);

    win.focus();
    win.print();
  } catch (err) {
    cleanUp();
    throw err;
  }
}
