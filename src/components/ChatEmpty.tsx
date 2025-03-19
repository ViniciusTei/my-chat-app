import { Bot } from "lucide-react"
import { useSessions } from "./sessions-provider"

export default function ChatEmpty() {
  const { activeSession } = useSessions()
  if (activeSession) {
    return null
  }
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="h-full flex items-center justify-center flex-col gap-2 text-center">
        <Bot className="h-12 w-12 text-muted-foreground" />
        <h3 className="text-xl font-semibold">How can I help you today?</h3>
        <p className="text-muted-foreground max-w-md">
          Ask me to explain code, write functions, or help debug issues. I can provide code examples and
          explanations.
        </p>
      </div>
    </div>
  )
}
