import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@monaco-editor/react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Demo({ component }) {
  const [code, setCode] = useState(component.mainFile)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    try {
      const iframe = document.createElement('iframe')
      iframe.style.width = '100%'
      iframe.style.height = '100%'
      iframe.style.border = 'none'
      
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/react@18/umd/react.development.js'
      script.async = true
      
      const scriptDOM = document.createElement('script')
      scriptDOM.src = 'https://unpkg.com/react-dom@18/umd/react-dom.development.js'
      scriptDOM.async = true

      const renderScript = document.createElement('script')
      renderScript.textContent = `
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(React.createElement(${component.alias}));
      `

      iframe.onload = () => {
        iframe.contentWindow.document.body.appendChild(script)
        script.onload = () => {
          iframe.contentWindow.document.body.appendChild(scriptDOM)
          scriptDOM.onload = () => {
            iframe.contentWindow.document.body.appendChild(renderScript)
          }
        }
      }

      const componentScript = document.createElement('script')
      componentScript.textContent = code
      iframe.contentWindow.document.body.appendChild(componentScript)

      const rootDiv = document.createElement('div')
      rootDiv.id = 'root'
      iframe.contentWindow.document.body.appendChild(rootDiv)

      setPreview(iframe)
      setError(null)
    } catch (err) {
      setError(err.message)
      setPreview(null)
    }
  }, [code, component.alias])

  return (
    <div className="flex h-full w-full flex-col">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Code Editor</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <EditorContent
            value={code}
            onChange={(value) => {
              setCode(value || '')
            }}
            language="javascript"
            theme="vs-dark"
            height="400px"
          />
        </CardContent>
      </Card>

      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {preview ? (
            preview
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <div>Loading preview...</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
