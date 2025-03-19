import { describe, expect, test } from 'vitest'
import { HttpClientSpy } from './test/mock-http-client'
import { ChatRole } from '@/types'

import OllamaHttpClient from './ollama-http-client'

function makeSut() {
  const axiosClient = new HttpClientSpy()
  const sut = new OllamaHttpClient(axiosClient)
  return { sut, client: axiosClient }
}

describe('OllamaHttpClient', () => {
  test('Should call httpclient with correct url', async () => {
    const { sut, client } = makeSut()
    const params = {
      model: 'model',
      messages: [
        {
          role: 'user' as ChatRole,
          content: 'content'
        }
      ]
    }

    await sut.chat(params)

    expect(client.url).toBe('http://localhost:11434/api/chat')
  })
})

