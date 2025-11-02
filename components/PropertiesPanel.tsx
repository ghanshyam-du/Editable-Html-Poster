'use client'
import React, { useState, useEffect } from 'react'
import { useSelection } from '../hooks/useSelection'

interface Props {
  iframeRef: React.RefObject<HTMLIFrameElement>
}

export default function PropertiesPanel({ iframeRef }: Props) {
  const { selectedElementId } = useSelection()
  const [attrs, setAttrs] = useState<{ tagName?: string; html?: string; src?: string; alt?: string } | null>(null)

  useEffect(() => {
    if (!selectedElementId) {
      setAttrs(null)
      return
    }
    const doc = iframeRef.current?.contentDocument
    if (!doc) return
    const el = doc.querySelector(`[data-id="${selectedElementId}"]`) as HTMLElement | null
    if (!el) return
    const isImg = el.tagName.toLowerCase() === 'img'
    setAttrs({
      tagName: el.tagName,
      html: isImg ? undefined : el.innerHTML,
      src: isImg ? (el as HTMLImageElement).src : undefined,
      alt: isImg ? (el as HTMLImageElement).alt : undefined,
    })
  }, [selectedElementId, iframeRef])

  if (!selectedElementId)
    return (
      <div className="p-6 h-full bg-gray-50 border-l border-gray-200 flex items-center justify-center text-gray-400 text-sm">
        No element selected
      </div>
    )

  return (
    <div className="p-5 border-l border-gray-200 h-full bg-gray-50">
      <h3 className="font-semibold text-gray-800 text-base mb-2">Properties</h3>
      <p className="text-sm text-gray-600 mb-3">
        Selected: <span className="font-medium text-gray-800">{attrs?.tagName}</span>
      </p>

      <div className="space-y-4">
        {attrs?.src !== undefined ? (
          <ImageProperties iframeRef={iframeRef} elId={selectedElementId} />
        ) : (
          <TextProperties iframeRef={iframeRef} elId={selectedElementId} />
        )}
      </div>
    </div>
  )
}

function TextProperties({ iframeRef, elId }: { iframeRef: React.RefObject<HTMLIFrameElement>; elId: string }) {
  const [text, setText] = useState('')
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument
    const el = doc?.querySelector(`[data-id="${elId}"]`) as HTMLElement | null
    setText(el?.innerHTML ?? '')
  }, [elId, iframeRef])

  const apply = () => {
    const doc = iframeRef.current?.contentDocument
    const el = doc?.querySelector(`[data-id="${elId}"]`) as HTMLElement | null
    if (el) el.innerHTML = text
  }

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-700 font-medium">Edit Text</label>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-32 border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white resize-none"
      />
      <button
        onClick={apply}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 text-sm font-medium transition-all"
      >
        Apply Text
      </button>
    </div>
  )
}

function ImageProperties({ iframeRef, elId }: { iframeRef: React.RefObject<HTMLIFrameElement>; elId: string }) {
  const [src, setSrc] = useState('')
  const [alt, setAlt] = useState('')

  useEffect(() => {
    const doc = iframeRef.current?.contentDocument
    const el = doc?.querySelector(`[data-id="${elId}"]`) as HTMLImageElement | null
    setSrc(el?.src ?? '')
    setAlt(el?.alt ?? '')
  }, [elId, iframeRef])

  const apply = () => {
    const doc = iframeRef.current?.contentDocument
    const el = doc?.querySelector(`[data-id="${elId}"]`) as HTMLImageElement | null
    if (!el) return
    el.src = src
    el.alt = alt
  }

  return (
    <div className="space-y-3">
      <label className="text-sm text-gray-700 font-medium">Image Source</label>
      <input
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        value={src}
        onChange={(e) => setSrc(e.target.value)}
        placeholder="Enter image URL"
      />

      <label className="text-sm text-gray-700 font-medium">Alt Text</label>
      <input
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        placeholder="Describe image"
      />

      <button
        onClick={apply}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 text-sm font-medium transition-all"
      >
        Apply Changes
      </button>
    </div>
  )
}
