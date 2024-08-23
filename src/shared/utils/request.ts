import axios from 'axios'
import merge from 'lodash/merge'
import RequestError from '~/shared/errors/RequestError'

const getData = ({ data }: { data: any }): any => data

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
        const res = await axios.request({ ...requestOptions, url, method, data })

        return getData(res)
    } catch (e) {
        throw new RequestError(e)
    }
}
