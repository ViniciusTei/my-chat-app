import { Bot, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { useSessions } from "./sessions-provider"

export default function ChatMessages() {
  const { activeSession } = useSessions()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeSession?.messages])

  if (!activeSession) {
    return null
  }
  console.log('activeSession', activeSession)

  return (
    <div className="overflow-y-auto max-w-7xl mx-auto w-full flex flex-col grow">
      <div className="p-4">
        <h2 className="text-lg font-semibold">{activeSession.title}</h2>
      </div>
      <div className="space-y-6 pb-4">
        {activeSession.messages.map((message, index) => (
          <div
            key={message.id || index}
            className={cn("flex items-start gap-4", {
              "justify-end": message.role === "user",
            })}
          >
            {message.role !== "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
            <Card
              className={cn("px-4 py-3 max-w-[85%]", {
                "bg-primary text-primary-foreground": message.role === "user",
              })}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </Card>
            {message.role === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted">
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
