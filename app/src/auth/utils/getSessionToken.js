// @flow

import StreamrClient from 'streamr-client'

const parseError = async (error) => {
    try {
        return new Error(JSON.parse(error.body).message)
    } catch (e) {
        // Noop. Will rethrow.
    }
    return error
}

export default async (auth: Object): Promise<?string> => {
    try {
        return await new StreamrClient({
            restUrl: process.env.STREAMR_API_URL,
            auth,
        }).session.getSessionToken()
    } catch (e) {
        throw await parseError(e)
    }
}
