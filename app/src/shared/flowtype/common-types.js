// @flow

export type ErrorInUi = {
    message: string,
    statusCode?: ?number,
    code?: ?string
}

export type RequestMethod = 'get' | 'post' | 'put' | 'delete'

export type PropertySetter<T> = (string, T) => void

export type ApiResult<T> = Promise<T>
