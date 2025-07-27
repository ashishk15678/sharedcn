import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatMetric } from "@/lib/utils"

interface ComponentDocsProps {
  component: {
    alias: string
    description: string
    metrics: {
      installations: number
      uploads: number
      views: number
      copyClicks: number
    }
  }
}

export function ComponentDocs({ component }: ComponentDocsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(component.description)

  const handleSave = async () => {
    try {
      await fetch(`/api/components/${component.alias}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      })
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving description:", error)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{component.alias}</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
              {isEditing && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                >
                  Save
                </Button>
              )}
            </div>
          </div>
          {isEditing ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[100px] p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter component description..."
            />
          ) : (
            <p className="text-muted-foreground">{component.description}</p>
          )}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Installations</p>
              <p className="text-2xl font-bold">{formatMetric(component.metrics.installations)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Views</p>
              <p className="text-2xl font-bold">{formatMetric(component.metrics.views)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Uploads</p>
              <p className="text-2xl font-bold">{formatMetric(component.metrics.uploads)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Copies</p>
              <p className="text-2xl font-bold">{formatMetric(component.metrics.copyClicks)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
