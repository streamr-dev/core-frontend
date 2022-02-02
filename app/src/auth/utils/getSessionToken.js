import StreamrClient from 'streamr-client'
import getClientConfig from '$app/src/getters/getClientConfig'

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

export default async (auth) => {
    try {
        return await new StreamrClient(getClientConfig({
            auth,
        })).session.getSessionToken()
    } catch (e) {
        throw parseError(e)
    }
}
