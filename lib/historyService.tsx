
'use client'
import React, { createContext, useContext, useState } from 'react'

type HistoryContextType = {
  pushState: (html: string) => void
  undo: (iframe: HTMLIFrameElement | null) => void
  redo: (iframe: HTMLIFrameElement | null) => void
}

const HistoryContext = createContext<HistoryContextType | null>(null)

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])

  const pushState = (html: string) => {
    setUndoStack(prev => [...prev, html])
    setRedoStack([]) 
  }

  const undo = (iframe: HTMLIFrameElement | null) => {
    if (!iframe || undoStack.length === 0) return
    const doc = iframe.contentDocument
    if (!doc) return
    const current = doc.body.innerHTML
    const prev = undoStack[undoStack.length - 1]
    setUndoStack(prevStack => prevStack.slice(0, -1))
    setRedoStack(r => [...r, current])
    doc.body.innerHTML = prev
  }

  const redo = (iframe: HTMLIFrameElement | null) => {
    if (!iframe || redoStack.length === 0) return
    const doc = iframe.contentDocument
    if (!doc) return
    const current = doc.body.innerHTML
    const next = redoStack[redoStack.length - 1]
    setRedoStack(r => r.slice(0, -1))
    setUndoStack(u => [...u, current])
    doc.body.innerHTML = next
  }

  return (
    <HistoryContext.Provider value={{ pushState, undo, redo }}>
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = () => {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistory must be used inside HistoryProvider')
  return ctx
}
