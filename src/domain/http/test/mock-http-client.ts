import { HttpClient, HttpPostParam, HttpResponse, HttpStatusCode } from '@/types'

export class HttpClientSpy implements HttpClient<unknown> {
  url?: string
  body?: unknown
  response: HttpResponse<any> = {
    statusCode: HttpStatusCode.ok,
    body: {} as any
  }
  async post<T, R>(params: HttpPostParam<T>): Promise<HttpResponse<R>> {
    this.url = params.url
    this.body = params.body
    return Promise.resolve(this.response)
  }
}
