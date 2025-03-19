import AxiosHttpClient from './axios-http-client'

import type { ChatMessage } from '@/types'

type ChatParams = {
  model: string
  messages: Omit<ChatMessage, 'id' | 'timestamp'>[]
  stream: boolean
}

type ChatResponse = {
  model: string
  message: ChatMessage
  created_at: string
  done: boolean
  total_duration: number
  load_duration: number
}

interface OllamaHttp {
  chat: (params: Omit<ChatParams, 'stream'>) => void
}

export default class OllamaHttpClient implements OllamaHttp {
  private httpClient: AxiosHttpClient
  private baseUrl: string

  constructor(axiosHttpClient: AxiosHttpClient) {
    this.baseUrl = 'http://localhost:11434/api'
    this.httpClient = axiosHttpClient
  }

  chat = async ({ model, messages }: Omit<ChatParams, 'stream'>) => {
    return this.httpClient.post<ChatParams, ChatResponse>({ url: `${this.baseUrl}/chat`, body: { model, messages, stream: false } })
  }
}
