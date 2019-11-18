// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import usePending from '$shared/hooks/usePending'

import type { ProductId } from '$mp/flowtype/product-types'
import { getProductFromContract } from '$mp/modules/contractProduct/actions'

export default function useProductLoadCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('contractProduct.LOAD')

    return useCallback(async (productId: ProductId) => (
        wrap(async () => {
            await dispatch(getProductFromContract(productId))
        })
    ), [wrap, dispatch])
}
