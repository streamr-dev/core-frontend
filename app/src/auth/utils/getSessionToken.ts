import StreamrClient from 'streamr-client'
import getClientConfig from '$app/src/getters/getClientConfig'

// TODO add typing
const parseError = ({ body }: any) => {
    const message = ((defaultMessage) => {
        try {
            return JSON.parse(body).message || defaultMessage
        } catch (e) {
            return defaultMessage
        }
    })('Something went wrong.')

    return new Error(message)
}

// TODO add typing
export default async (auth: any): Promise<string> => {
    try {
        return await new StreamrClient(
            getClientConfig({
                auth,
            }),
        ).session.getSessionToken()
    } catch (e) {
        throw parseError(e)
    }
}
