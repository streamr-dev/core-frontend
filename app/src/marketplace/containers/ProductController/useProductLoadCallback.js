// @flow

import { useContext, useCallback } from 'react'

import { Context as RouterContext } from '$shared/components/RouterContextProvider'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import usePending from '$shared/hooks/usePending'

import type { ProductId } from '$mp/flowtype/product-types'
import { getProductById } from '$mp/modules/product/services'

import useProductUpdater from './useProductUpdater'

export default function useProductLoadCallback() {
    const { history } = useContext(RouterContext)
    const productUpdater = useProductUpdater()
    const { wrap } = usePending('product.LOAD')
    const isMountedRef = useIsMountedRef()
    return useCallback(async (productId: ProductId) => (
        wrap(async () => {
            let product
            try {
                product = await getProductById(productId)
            } catch (err) {
                if (!isMountedRef.current) { return }
                history.replace('/404') // 404
                return
            }
            if (!isMountedRef.current) { return }
            productUpdater.replaceProduct(() => product)
        })
    ), [wrap, productUpdater, history, isMountedRef])
}
