export default function getClientConfig(options = {}) {
    const web3 = getWeb3()

    const config = Object.assign({
        autoConnect: true,
        autoDisconnect: false,
        restUrl: process.env.STREAMR_API_URL,
        url: process.env.STREAMR_WS_URL,
        verifySignatures: 'never',
        auth: {
            ethereum: web3.metamaskProvider,
        },
        ethereum: {
            binanceRPC: {
                chainId: 56,
            },
            binanceAdapterAddress: '0x0000000000000000000000000000000000000000',
            binanceSmartChainAMBAddress: '0x0000000000000000000000000000000000000000',
            withdrawServerUrl: '',
            mainnet: {
                url: process.env.WEB3_PUBLIC_HTTP_PROVIDER,
            },
            sidechain: {
                url: process.env.DATA_UNION_SIDECHAIN_PROVIDER,
                chainId: parseInt(process.env.DATA_UNION_SIDECHAIN_ID, 10),
            },
            tokenAddress: '0x0000000000000000000000000000000000000000',
            tokenSidechainAddress: '0x0000000000000000000000000000000000000000',
        },
    }, options)

    return config
}
