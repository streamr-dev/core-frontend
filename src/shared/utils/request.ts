import axios from 'axios'
import merge from 'lodash/merge'
import RequestError from '~/shared/errors/RequestError'

export type RequestParams = {
    url: string
    method?: 'get' | 'post' | 'put' | 'delete'
    data?: any
    options?: Record<string, any>
}
export default async function request({
    url,
    options,
    method = 'get',
    data = null,
}: RequestParams): Promise<any> {
    const defaultOptions: {
        headers: Partial<Record<'Content-Type' | (string & {}), string>>
    } = {
        headers: {},
    }

    if (data !== null) {
        defaultOptions.headers = {
            ...defaultOptions.headers,
            'Content-Type': 'application/json',
        }
    }

    const requestOptions = merge(defaultOptions, options)

    try {
        return (await axios.request({ ...requestOptions, url, method, data })).data
    } catch (e) {
        throw new RequestError(e)
    }
}
