import type jsPDF from "jspdf";

// Served from /public/images/logo.png
const LOGO_URL = "/images/logo.png";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Draws the platform logo in the top-right corner of the PDF's first page.
 * Reusable across all report exports. Safe no-op if the logo can't load, so
 * an export never fails just because of the image.
 */
export async function addReportLogo(doc: jsPDF): Promise<void> {
  try {
    const img = await loadImage(LOGO_URL);
    const pageWidth = (doc as any).internal.pageSize.getWidth() as number;

    const targetH = 10; // mm
    const ratio =
      img.naturalWidth && img.naturalHeight
        ? img.naturalWidth / img.naturalHeight
        : 4;
    const targetW = targetH * ratio;

    const x = pageWidth - targetW - 14; // 14mm right margin
    const y = 8;
    doc.addImage(img, "PNG", x, y, targetW, targetH);
  } catch {
    // Logo unavailable — export without it rather than failing.
  }
}
