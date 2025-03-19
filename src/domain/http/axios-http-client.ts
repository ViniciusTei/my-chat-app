import { HttpClient, HttpPostParam, HttpResponse } from '@/types'
import axios from 'axios'

export default class AxiosHttpClient implements HttpClient<unknown> {
  async post<P, R>({ url, body }: HttpPostParam<P>): Promise<HttpResponse<R>> {
    const res = await axios.post(url, body)
    return {
      statusCode: res.status,
      body: res.data
    }
  }
}

