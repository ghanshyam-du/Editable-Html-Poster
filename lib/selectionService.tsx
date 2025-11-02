
'use client'
import React, { createContext, useContext, useState } from 'react'

type SelectionContextType = {
  selectedElementId: string | null
  selectElementById: (id: string | null) => void
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined)

export const SelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const selectElementById = (id: string | null) => setSelectedElementId(id)
  return <SelectionContext.Provider value={{ selectedElementId, selectElementById }}>{children}</SelectionContext.Provider>
}

export function useSelectionContext() {
  const ctx = useContext(SelectionContext)
  if (!ctx) throw new Error('useSelectionContext must be used inside SelectionProvider')
  return ctx
}
