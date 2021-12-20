export default function getClientConfig(options = {}) {
    const config = Object.assign({
        autoConnect: true,
        autoDisconnect: false,
        restUrl: process.env.STREAMR_API_URL,
        url: process.env.STREAMR_WS_URL,
        verifySignatures: 'never',
    }, options)

    return config
}
