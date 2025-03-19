import MessageForm from "./messageform"
import ChatMessages from "./chatmessages"
import ChatEmpty from "./ChatEmpty"

export default function SessionsContainer() {

  return (
    <div className="flex flex-col flex-1 overflow-hidden px-2">
      <ChatEmpty />

      <ChatMessages />

      <MessageForm />
    </div>
  )
}
