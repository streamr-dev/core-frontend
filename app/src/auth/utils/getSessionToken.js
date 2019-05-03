// @flow

import StreamrClient from 'streamr-client'

export default async (auth: Object): Promise<?string> => (
    new StreamrClient({
        restUrl: process.env.STREAMR_API_URL,
        auth,
    }).session.getSessionToken()
)
