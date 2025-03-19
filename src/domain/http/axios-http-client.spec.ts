import axios from 'axios'
import { describe, expect, test, vi } from 'vitest'

import AxiosHttpClient from './axios-http-client'

import type { Mocked } from 'vitest'

vi.mock('axios')

export const mockAxios = (): Mocked<typeof axios> => {
  const mockedAxios = axios as Mocked<typeof axios>
  const mockedAxiosResult = {
    data: "Lorem ipsum",
    status: 200
  }

  mockedAxios.post.mockResolvedValue(mockedAxiosResult)
  return mockedAxios
}

function makeSut() {
  const sut = new AxiosHttpClient()
  return { sut, axiosClient: mockAxios() }
}

describe('AxiosHttpClient', () => {
  test('should call axios with correct URL', async () => {
    const url = 'example.com'
    const params = { url, body: {} }
    const { sut, axiosClient } = makeSut()
    await sut.post(params)
    expect(axiosClient.post).toHaveBeenCalledWith(params.url, params.body)
  })

  test('should return correct response', async () => {
    const { sut } = makeSut()
    const params = { url: 'example.com', body: {} }
    const response = await sut.post(params)
    expect(response).toEqual({ statusCode: 200, body: 'Lorem ipsum' })
  })
})

