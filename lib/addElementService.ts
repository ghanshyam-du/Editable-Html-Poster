
export function addTextBlock(iframe: HTMLIFrameElement, text = 'New text') {
  const doc = iframe.contentDocument!;
  const el = doc.createElement('div');
  el.textContent = text;
  el.setAttribute('data-id', `el-${Date.now()}`);
  el.style.position = 'absolute';
  el.style.left = '40px';
  el.style.top = '40px';
  el.style.fontSize = '16px';
  el.style.color = '#111827';
  el.style.cursor = 'move';
  doc.body.appendChild(el);
}


export function addImageBlock(iframe: HTMLIFrameElement, src?: string) {
  const doc = iframe.contentDocument!;
  const el = doc.createElement('img');
  el.src = src || '/placeholder.png';
  el.setAttribute('data-id', `el-${Date.now()}`);
  el.style.position = 'absolute';
  el.style.left = '60px';
  el.style.top = '60px';
  el.style.width = '200px';
  el.style.height = '200px';
  el.style.objectFit = 'cover';
  doc.body.appendChild(el);
}

