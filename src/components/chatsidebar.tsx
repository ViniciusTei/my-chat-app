import { useState } from "react"
import { format } from "date-fns"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search, Settings, Trash2 } from "lucide-react"

import { useSessions } from "./sessions-provider"

export function ChatSidebar() {
  const { sessions } = useSessions()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSessions = sessions?.filter((session) => session.title.toLowerCase().includes(searchQuery.toLowerCase())) ?? []

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-2">
          <h2 className="text-lg font-semibold">Code Chat</h2>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-2 pb-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2">
            <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
            <Button variant="ghost" size="icon" className="h-8 w-8" >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-180px)]">
              <SidebarMenu>
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <SidebarMenuItem key={session.id}>
                      <SidebarMenuButton
                        className="justify-between group"
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-medium truncate w-full">{session.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(session.lastUpdated), "MMM d, h:mm a")}
                          </span>
                        </div>
                        <div
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer mt-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            alert("Delete conversation")
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-muted-foreground">No conversations found</div>
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <Button variant="outline" className="w-full flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

