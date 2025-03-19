import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useSessions } from "./sessions-provider"
import { Send } from "lucide-react"
import Spinner from "./spinner"
import { useRef } from "react"

export default function MessageForm() {
  const { activeSession, loading, updateSessionMessages, addSession } = useSessions()
  const form = useRef<HTMLFormElement | null>(null)

  function sendMessage(message: string) {
    if (form.current) {
      form.current.reset()
    }

    if (!activeSession) {
      addSession({ role: 'user', content: message, timestamp: Date.now() })
      return
    }

    updateSessionMessages(activeSession.id, message)
  }

  function handleSendMessageFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message") as string
    sendMessage(message)
  }

  return (

    <div className="flex-none py-4 w-2/3 max-w-md mx-auto">
      {loading && (
        <div className="flex items-center text-lg">
          <Spinner /><p>Pensando</p>
        </div>
      )}
      <form ref={form} className="flex gap-2 items-center" onSubmit={handleSendMessageFormSubmit}>
        <Textarea
          name="message"
          data-testid="message-input"
          placeholder="Ask a question or share some code..."
          className="min-h-12 resize-none"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              if (e.currentTarget.value.trim() === "") {
                return
              }
              sendMessage(e.currentTarget.value)
            }
          }}
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
