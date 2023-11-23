import { RequestParams } from '~/shared/utils/request'
import request from '~/shared/utils/request'

export const post = (args: RequestParams): Promise<any> =>
    request({ ...args, method: 'post' })
