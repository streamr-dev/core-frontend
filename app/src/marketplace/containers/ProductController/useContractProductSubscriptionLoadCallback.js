// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import usePending from '$shared/hooks/usePending'

import type { ProductId } from '$mp/flowtype/product-types'
import { loadSubscriptionDataFromContract } from '$mp/modules/contractProduct/actions'

export default function useContractProductSubscriptionLoadCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('contractProduct.LOAD_SUBSCRIPTION')

    return useCallback(async (productId: ProductId, chainId: number) => (
        wrap(async () => {
            await dispatch(loadSubscriptionDataFromContract(productId, chainId))
        })
    ), [wrap, dispatch])
}
