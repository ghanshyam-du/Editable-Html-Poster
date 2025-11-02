
'use client'

import React, { useRef, useState } from 'react'
import Toolbar from '../components/Toolbar'
import Stage from '../components/Stage'
import PropertiesPanel from '../components/PropertiesPanel'
import { SelectionProvider } from '../lib/selectionService'
import {HistoryProvider} from '../lib/historyService'

export default function Page() {
    
    const [html, setHtml] = useState<string>(`
    <div class="poster" style="width:720px;height:720px;position:relative;background:#f3f4f6;font-family:sans-serif;">
      <h1 style="position:absolute;top:80px;left:40px;font-size:48px;font-weight:bold;color:#111827">
        Summer Sale
      </h1>
      <p style="position:absolute;top:160px;left:40px;font-size:20px;color:#374151">
        Up to <strong>50% off</strong> on select items!
      </p>
      <img
        style="position:absolute;bottom:0;right:0;width:380px;height:380px;object-fit:cover;border-top-left-radius:16px"
        src="https://images.unsplash.com/photo-1520975922284-7bcd4290b0e1?q=80&w=1200&auto=format&fit=crop"
      />
    </div>
  `)

   
    const iframeRef = useRef<HTMLIFrameElement | null>(null)

    return (
        <HistoryProvider>
            <SelectionProvider>
                <div className="min-h-screen flex gap-4 p-4 bg-gray-50">

                  
                    <div className="w-72">
                      
                        <Toolbar iframeRef={iframeRef} onImportHtml={setHtml} />
                    </div>

                    <div className="flex-grow flex items-center justify-center">
                  
                        <Stage htmlContent={html} iframeRef={iframeRef} />
                    </div>

                 
                    <div className="w-80">
                        <PropertiesPanel iframeRef={iframeRef} />
                    </div>

                </div>
            </SelectionProvider>
        </HistoryProvider>
    )
}
