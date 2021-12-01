export default function getClientConfig(options = {}) {
    const config = Object.assign({
        autoConnect: true,
        autoDisconnect: false,
        restUrl: process.env.STREAMR_API_URL,
        url: process.env.STREAMR_WS_URL,
        verifySignatures: 'never',
        auth: {
            privateKey: '5e98cce00cff5dea6b454889f359a4ec06b9fa6b88e9d69b86de8e1c81887da0',
        },
    }, options)

    return config
}
