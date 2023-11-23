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
export default function request({
    url,
    options,
    method = 'get',
    data = null,
}: RequestParams): Promise<any> {
    const defaultOptions: { headers: { [key: string]: string } } = {
        headers: {},
    }

    if (data !== null) {
        defaultOptions.headers = {
            ...defaultOptions.headers,
            'Content-Type': 'application/json',
        }
    }

    // Merge options with defaults
    const requestOptions = merge(defaultOptions, options)
    return axios
        .request({ ...requestOptions, url, method, data })
        .then((res) => getData(res))
        .catch((res: any) => {
            throw new RequestError(res)
        })
}
