
import DOMPurify from 'dompurify'

export function sanitizeHtml(rawHtml: string): string {
  
  return DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['style', 'data-id', 'data-editable'],
    ADD_TAGS: ['style'],
  })
}

export function injectHtmlIntoIframe(iframe: HTMLIFrameElement, html: string) {
  const doc = iframe.contentDocument!;
  doc.open();
  doc.write(html);
  doc.close();
}

export function exportIframeHtml(iframe: HTMLIFrameElement): string {
  const doc = iframe.contentDocument!;
  
  const meta = doc.createElement('meta');
  meta.setAttribute('data-generated-by', 'editable-html-poster');

  if (!doc.head) doc.documentElement.prepend(doc.createElement('head'));
  doc.head.appendChild(meta);
  return '<!doctype html>\n' + doc.documentElement.outerHTML;
}



export function downloadHtml(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
