import get from 'lodash/get'

export const getError = (res) => ({
    message: get(res, 'response.data.error') || get(res, 'response.data.message') || (res && res.message) || 'Something went wrong',
    code: get(res, 'response.data.code') || null,
    statusCode: res && res.response && res.response.status,
    response: res.response,
})

export default class RequestError extends Error {
    code = undefined
    statusCode = undefined
    response = undefined

    constructor(res, ...args) {
        const { message, code, statusCode, response } = getError(res)
        super(message, ...args)

        this.code = code
        this.statusCode = statusCode
        this.response = response

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, RequestError)
        }

        Object.setPrototypeOf(this, RequestError.prototype)
    }
}
