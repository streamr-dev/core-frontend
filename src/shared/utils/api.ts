import { RequestParams } from '~/shared/utils/request'
import request from '~/shared/utils/request'
export const get = (args: RequestParams): Promise<any> =>
    request({ ...args, method: 'get' })
export const post = (args: RequestParams): Promise<any> =>
    request({ ...args, method: 'post' })
export const put = (args: RequestParams): Promise<any> =>
    request({ ...args, method: 'put' })
export const del = (args: RequestParams): Promise<any> =>
    request({ ...args, method: 'delete' })
