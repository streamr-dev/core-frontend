// @flow

import { useCallback } from 'react'

import usePending from '$shared/hooks/usePending'

import type { ProductId } from '$mp/flowtype/product-types'
import { getStreamsByProductId } from '$mp/modules/product/services'

export default function useLoadProductStreamsCallback({ setProductStreams }: { setProductStreams: Function }) {
    const { wrap } = usePending('product.LOAD_PRODUCT_STREAMS')

    return useCallback(async (productId: ProductId, useAuthorization: boolean = true) => (
        wrap(async () => {
            try {
                const streams = await getStreamsByProductId(productId, useAuthorization)

                setProductStreams(streams)
            } catch (e) {
                console.warn(e)
            }
        })
    ), [wrap, setProductStreams])
}
