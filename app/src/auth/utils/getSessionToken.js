// @flow

import StreamrClient from 'streamr-client'

const parseError = ({ body }) => {
    const message = ((defaultMessage) => {
        try {
            return JSON.parse(body).message || defaultMessage
        } catch (e) {
            return defaultMessage
        }
    })('Something went wrong.')

    return new Error(message)
}

export default async (auth: Object): Promise<?string> => {
    try {
        return await new StreamrClient({
            auth,
        }).session.getSessionToken()
    } catch (e) {
        throw parseError(e)
    }
}
