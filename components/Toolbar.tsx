'use client'
import React from 'react'
import { useSelection } from '../hooks/useSelection'
import { addTextBlock, addImageBlock } from '../lib/addElementService'
import { exportIframeHtml } from '../lib/htmlService'
import { useHistory } from '../lib/historyService'

interface ToolbarProps {
  iframeRef: React.RefObject<HTMLIFrameElement>
  onImportHtml?: (html: string) => void
}

export default function Toolbar({ iframeRef, onImportHtml }: ToolbarProps) {
  const { selectedElementId } = useSelection()
  const { undo, redo } = useHistory()

  const handleAddText = () => {
    const iframe = iframeRef.current
    if (!iframe) return
    addTextBlock(iframe, 'New Text')
  }

  const handleAddImage = () => {
    const iframe = iframeRef.current
    if (!iframe) return
    addImageBlock(iframe)
  }

  const handleDelete = () => {
    const iframe = iframeRef.current
    if (!iframe || !selectedElementId) return
    const el = iframe.contentDocument?.querySelector(`[data-id="${selectedElementId}"]`)
    el?.remove()
  }

  const handleExport = () => {
    const iframe = iframeRef.current
    if (!iframe) return
    const html = exportIframeHtml(iframe)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'poster.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const html = ev.target?.result as string
      onImportHtml?.(html)
    }
    reader.readAsText(file)
  }

  const handlePasteHtml = () => {
    const html = prompt('Paste your HTML code:')
    if (html) onImportHtml?.(html)
  }

  return (
    <div className="flex flex-col gap-4 p-5 bg-gray-50 border-r border-gray-200 min-w-[230px] rounded-tr-xl rounded-br-xl shadow-sm">
      <h2 className="font-semibold text-gray-800 text-base mb-1 flex items-center gap-2">
        <span className="text-blue-500">🧩</span> Toolbar
      </h2>

      {/* Undo / Redo */}
      <div className="flex gap-2">
        <button
          onClick={() => undo(iframeRef.current)}
          className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 rounded-md transition-all"
        >
          ↩ Undo
        </button>
        <button
          onClick={() => redo(iframeRef.current)}
          className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 rounded-md transition-all"
        >
          ↪ Redo
        </button>
      </div>

      {/* Add Elements */}
      <div className="space-y-2">
        <button
          onClick={handleAddText}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-medium transition-all"
        >
          ➕ Add Text
        </button>

        <button
          onClick={handleAddImage}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 font-medium transition-all"
        >
          🖼️ Add Image
        </button>

        <button
          onClick={handleDelete}
          disabled={!selectedElementId}
          className={`w-full rounded-md py-2 font-medium transition-all ${
            selectedElementId
              ? 'bg-gray-700 hover:bg-gray-800 text-white'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          🗑 Delete Selected
        </button>
      </div>

      <hr className="my-3 border-gray-300" />

      {/* Import / Export */}
      <div>
        <h3 className="font-medium text-gray-700 mb-2">📁 Import / Export</h3>

        <label className="bg-gray-800 hover:bg-gray-900 text-white rounded-md py-2 px-3 text-center font-medium cursor-pointer w-full block transition-all">
          Import HTML File
          <input type="file" accept=".html" onChange={handleImportFile} className="hidden" />
        </label>

        <button
          onClick={handlePasteHtml}
          className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md py-2 font-medium transition-all"
        >
          ✏️ Paste HTML Code
        </button>

        <button
          onClick={handleExport}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 font-medium transition-all"
        >
          💾 Export HTML
        </button>
      </div>
    </div>
  )
}
