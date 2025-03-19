import IndexedDB from "@/domain/database/indexeddb"
import { AxiosHttpClient, OllamaHttpClient } from "@/domain/http"
import { ChatMessage, ChatSession } from "@/types"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type SessionsProviderState = {
  sessions: ChatSession[]
  activeSessionId: number | null
  activeSession: ChatSession | undefined
  loading: boolean
  addSession: (message: Omit<ChatMessage, 'id'>) => void
  updateSessionMessages: (sessionId: number, message: string, role?: 'user' | 'assistant' | 'system') => void
  getAssistantResponse: (currentSession: ChatSession) => void
}

type SessionsProviderProps = {
  children: React.ReactNode
}

const initialState: SessionsProviderState = {
  sessions: [],
  activeSessionId: null,
  activeSession: undefined,
  loading: false,
  addSession: () => null,
  updateSessionMessages: () => null,
  getAssistantResponse: () => null,
}

const SessionsProviderContext = createContext<SessionsProviderState>(initialState)
const AxiosClient = new AxiosHttpClient()
const OllamaClient = new OllamaHttpClient(AxiosClient)
const DatabaseInstace = new IndexedDB("chat-app", 1)

export function SessionProvider({ children }: SessionsProviderProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null)
  const [loading, setLoadging] = useState(false)

  const activeSession = useMemo(() => sessions.find((session) => session.id === activeSessionId), [sessions, activeSessionId])

  const getStoredSessions = async () => {
    const db = await DatabaseInstace.init()
    const storedSessions = await DatabaseInstace.getChatSessions(db)
    setSessions(storedSessions)
  }

  useEffect(() => {
    getStoredSessions()
  }, [])

  const addSession = async (message: Omit<ChatMessage, 'id'>) => {
    try {
      const db = await DatabaseInstace.init()
      if (!message) {
        console.error("No messages to add")
        return
      }

      let sessionId = 1
      let currSession = undefined

      const storedSession = await DatabaseInstace.createConversation(db, `Chat ${sessions.length + 1}`)
      const storedMessages = await DatabaseInstace.saveMessage(db, storedSession.id, message.role, message.content)

      setSessions((prevSessions) => {
        const newSession: ChatSession = {
          ...storedSession,
          messages: [storedMessages], // Usando os dados recebidos
        }
        currSession = newSession
        sessionId = newSession.id
        return [newSession, ...prevSessions]
      })

      setActiveSessionId(sessionId)

      if (currSession) {
        getAssistantResponse(currSession)
      }

    } catch (error) {
      console.error(`Error adding session: ${JSON.stringify(error, null, 2)}`)
    }
  }

  const getAssistantResponse = async (currentSession: ChatSession) => {
    setLoadging(true)
    const db = await DatabaseInstace.init()
    OllamaClient
      .chat({ model: 'deepseek-r1:7b', messages: currentSession.messages.map((message) => ({ content: message.content, role: message.role })) })
      .then(async (response) => {
        if (!response.body) {
          console.error("No response from server")
          return
        }

        if (!currentSession || !currentSession.id) {
          console.error("No active session")
          return
        }

        const storedMessage = await DatabaseInstace.saveMessage(db, currentSession.id, "assistant", response.body.message.content)

        const updatedSession = {
          ...currentSession,
          messages: [...currentSession.messages, storedMessage],
          lastUpdated: Date.now()
        }

        setSessions((prev) => {
          return prev.map((session) => session.id === currentSession.id ? updatedSession : session)
        })
      })
      .catch((error) => {
        console.error(error)
      })
      .finally(() => setLoadging(false))
  }

  const updateSessionMessages = useCallback(async (sessionId: number, message: string, role?: "user" | "assistant" | "system") => {
    const currentSession = sessions.find((session) => session.id === sessionId)
    const db = await DatabaseInstace.init()

    if (!currentSession) {
      console.error("No session found")
      return
    }

    const storedMessage = await DatabaseInstace.saveMessage(db, currentSession.id, role ? role : "user", message)

    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, storedMessage],
      lastUpdated: Date.now()
    }

    setSessions((prev) => {
      return prev.map((session) => session.id === sessionId ? updatedSession : session)
    })
    getAssistantResponse(updatedSession)
  }, [sessions])

  useEffect(() => {
    console.log(JSON.stringify(activeSession, null, 2))
  }, [activeSession])

  return (
    <SessionsProviderContext.Provider value={{ sessions, activeSessionId, activeSession, addSession, updateSessionMessages, loading, getAssistantResponse }}>
      {children}
    </SessionsProviderContext.Provider>
  )
}

export const useSessions = () => {
  const context = useContext(SessionsProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

