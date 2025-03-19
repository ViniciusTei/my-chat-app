import { ChatSidebar } from "@/components/chatsidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeProvider } from "./components/theme-provider"
import { SessionProvider } from "./components/sessions-provider"
import SessionsContainer from "./components/sessionscontainer"

function App() {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="system" storageKey="my-chat-app-theme">
        <SidebarProvider>
          <ChatSidebar />
          <main className="flex-1 flex flex-col h-screen max-h-screen">
            <div className="border-b p-2 flex items-center">
              <SidebarTrigger className="mr-2 cursor-pointer" />
              <h1 className="text-lg font-semibold">Code Chat Assistant</h1>
            </div>
            <SessionsContainer />
          </main>
        </SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

export default App
