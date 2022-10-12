import routes from '$routes'

const getAddressLink = (chainId: number, address: string | null | undefined): string => {
    switch (chainId) {
        case 100: {
            return routes.gnosisAddress({
                address: address || '0x0',
            })
        }

        case 137: {
            return routes.polygonAddress({
                address: address || '0x0',
            })
        }

        default: {
            return 'https://blockexplorer-not-configured-for-this-chain.com'
        }
    }
}

const getTransactionLink = (chainId: number, txHash: string | null | undefined): string => {
    switch (chainId) {
        case 100: {
            return routes.gnosisTransaction({
                tx: txHash || '0x0',
            })
        }

        case 137: {
            return routes.polygonTransaction({
                tx: txHash || '0x0',
            })
        }

        default: {
            return 'https://blockexplorer-not-configured-for-this-chain.com'
        }
    }
}

export { getAddressLink, getTransactionLink }
