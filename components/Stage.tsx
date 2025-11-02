
'use client'

import React, { useEffect, useRef } from 'react'
import { sanitizeHtml, injectHtmlIntoIframe } from '../lib/htmlService'
import { useSelection } from '../hooks/useSelection'
import { useHistory } from '../lib/historyService'

interface StageProps {
  htmlContent: string
  iframeRef: React.RefObject<HTMLIFrameElement>
}

export default function Stage({ htmlContent, iframeRef }: StageProps) {
  const initialized = useRef(false)
  const { selectElementById, selectedElementId } = useSelection()
  const { pushState, undo, redo } = useHistory()

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return

   
    if (!initialized.current || !doc.body.innerHTML.trim()) {
      const safe = sanitizeHtml(htmlContent)
      injectHtmlIntoIframe(iframe, safe)
      initialized.current = true
      pushState(safe) 
    }

  
    assignDataIds(doc.body)
    attachClickSelection(doc, selectElementById)
    attachInlineTextEditing(doc, pushState)
    enableDragging(doc, pushState)


    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        undo(iframe)
      } else if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        redo(iframe)
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [htmlContent, selectElementById, iframeRef, pushState, undo, redo])

  return (
    <div className="border border-gray-300 p-2 bg-gray-50 rounded-lg shadow-inner">
      <iframe
        ref={iframeRef}
        sandbox="allow-same-origin allow-scripts allow-forms"
        className="stage"
        style={{ width: 720, height: 720 }}
        title="Poster Stage"
      />
    </div>
  )
}


function assignDataIds(root: HTMLElement | null) {
  if (!root) return
  let counter = 0
  const walk = (el: Element) => {
    if (!el.getAttribute('data-id')) {
      el.setAttribute('data-id', `el-${counter++}`)
    }
    for (const child of Array.from(el.children)) walk(child)
  }
  walk(root)
}

function attachClickSelection(doc: Document, selectFn: (id: string | null) => void) {
  doc.addEventListener(
    'click',
    (e) => {
      e.preventDefault()
      e.stopPropagation()

      const target = e.target as HTMLElement
      if (!target) return

      let el: HTMLElement | null = target
      while (el && !el.dataset.id) el = el.parentElement

      const id = el?.dataset.id ?? null
      selectFn(id ?? null)

      clearOutlines(doc)
      if (el) el.style.outline = '3px solid rgba(59,130,246,0.6)'
    },
    true
  )
}

function clearOutlines(doc: Document) {
  doc.querySelectorAll('[data-id]').forEach((n) => ((n as HTMLElement).style.outline = ''))
}


function attachInlineTextEditing(doc: Document, pushState: (html: string) => void) {
  doc.addEventListener(
    'dblclick',
    (e) => {
      const target = e.target as HTMLElement
      if (!target) return

      const editableTags = ['p', 'h1', 'h2', 'h3', 'div', 'span', 'strong', 'em']
      if (editableTags.includes(target.tagName.toLowerCase())) {
        target.contentEditable = 'true'
        target.focus()

        const onBlur = () => {
          target.contentEditable = 'false'
          target.removeEventListener('blur', onBlur)
          pushState(doc.body.innerHTML) 
        }

        target.addEventListener('blur', onBlur)
      }
    },
    true
  )
}



function enableDragging(doc: Document, pushState: (html: string) => void) {
  let draggingEl: HTMLElement | null = null
  let startX = 0,
    startY = 0,
    origLeft = 0,
    origTop = 0

  doc.addEventListener('pointerdown', (ev) => {
    const target = ev.target as HTMLElement
    if (!target || !target.dataset.id) return

    const styles = getComputedStyle(target)
    if (styles.position !== 'absolute' && styles.position !== 'relative' && styles.position !== '') {
      target.style.position = 'absolute'
    }

    draggingEl = target
    startX = ev.clientX
    startY = ev.clientY
    origLeft = parseFloat(target.style.left || '0') || 0
    origTop = parseFloat(target.style.top || '0') || 0
    ev.preventDefault()
  })

  doc.addEventListener('pointermove', (ev) => {
    if (!draggingEl) return
    const dx = ev.clientX - startX
    const dy = ev.clientY - startY
    draggingEl.style.left = origLeft + dx + 'px'
    draggingEl.style.top = origTop + dy + 'px'
  })

  doc.addEventListener('pointerup', () => {
    if (draggingEl) {
      pushState(doc.body.innerHTML) 
    }
    draggingEl = null
  })
}
