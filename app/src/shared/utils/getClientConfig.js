import { getToken } from '$shared/utils/sessionToken'

export default function getClientConfig(options = {}) {
    const sessionToken = getToken()

    const auth = sessionToken == null ? {} : {
        sessionToken,
    }

    return Object.assign({
        auth,
        autoConnect: true,
        autoDisconnect: false,
        restUrl: process.env.STREAMR_API_URL,
        url: process.env.STREAMR_WS_URL,
        verifySignatures: 'never',
    }, options)
}
