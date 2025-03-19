export type ChatRole = "user" | "assistant" | "system"

export type ChatMessage = {
  id: number
  role: ChatRole
  content: string
  timestamp: number
}

export type ChatSession = {
  id: number
  title: string
  messages: ChatMessage[]
  createdAt: number
  lastUpdated: number
}

export type HttpPostParam<T> = {
  url: string
  body?: T
}

export type HttpResponse<T> = {
  statusCode: number
  body?: T
}

// TODO: Add type for HttpResponse
export interface HttpClient<T> {
  post(params: HttpPostParam<T>): Promise<unknown>
}

export enum HttpStatusCode {
  unauthorized = 401,
  noContent = 204,
  ok = 200,
  badRequest = 400,
  notFound = 404,
  serverError = 500,
}

