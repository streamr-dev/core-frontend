// @flow

import { useCallback, useMemo } from 'react'

import type { ProductList } from '$mp/flowtype/product-types'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { getChainIdFromApiString } from '$shared/utils/chains'

export default function useContractProducts() {
    const load = useCallback(async (products: ProductList) => {
        const contractProducts = []

        await Promise.all(products.map(async (p) => {
            if (p.id) {
                try {
                    const product = await getProductFromContract(p.id, true, getChainIdFromApiString(p.chain))
                    contractProducts.push(product)
                } catch (e) {
                    console.warn('useContractProducts: Product', p.id, 'not found on chain', p.chain)
                }
            }
        }))

        return contractProducts
    }, [])

    return useMemo(() => ({
        load,
    }), [
        load,
    ])
}
