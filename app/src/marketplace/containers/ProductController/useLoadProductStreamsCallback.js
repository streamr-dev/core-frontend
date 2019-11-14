// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import usePending from '$shared/hooks/usePending'

import type { ProductId } from '$mp/flowtype/product-types'
import { getStreamsByProductId } from '$mp/modules/product/actions'

export default function useLoadProductStreamsCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('product.LOAD_STREAMS')

    return useCallback(async (productId: ProductId) => (
        wrap(async () => {
            await dispatch(getStreamsByProductId(productId))
        })
    ), [wrap, dispatch])
}
