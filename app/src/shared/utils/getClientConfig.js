import { getToken } from '$shared/utils/sessionToken'

export default function getClientConfig(options = {}) {
    const config = Object.assign({
        autoConnect: true,
        autoDisconnect: false,
        restUrl: process.env.STREAMR_API_URL,
        url: process.env.STREAMR_WS_URL,
        verifySignatures: 'never',
    }, options)

    const sessionToken = getToken()
    if (sessionToken) {
        config.auth = {
            sessionToken,
        }
    }

    return config
}
