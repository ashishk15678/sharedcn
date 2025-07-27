import { Component } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ComponentListProps {
  components: Component[]
}

export function ComponentList({ components }: ComponentListProps) {
  return (
    <div className="space-y-4">
      {components.map((component) => (
        <Card key={component.id}>
          <CardHeader className="flex-row">
            <CardTitle className="text-sm font-medium">
              {component.alias}
            </CardTitle>
            <div className="ml-auto flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                href={`/dashboard/${component.id}`}
              >
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
              >
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {component.description}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">
                Created: {new Date(component.createdAt).toLocaleDateString()}
              </span>
              <span className="text-xs text-muted-foreground">
                Updated: {new Date(component.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
