// @flow

import { useContext, useCallback } from 'react'

import { Context as RouterContext } from '$shared/components/RouterContextProvider'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import usePending from '$shared/hooks/usePending'

import type { ProductId } from '$mp/flowtype/product-types'
import { getProductById } from '$mp/modules/product/services'
import { isPaidProduct } from '$mp/utils/product'
import { timeUnits, DEFAULT_CURRENCY } from '$shared/utils/constants'
import { priceForTimeUnits } from '$mp/utils/price'

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
            productUpdater.replaceProduct(() => ({
                ...product,
                isFree: !!product.isFree || !isPaidProduct(product),
                timeUnit: product.timeUnit || timeUnits.hour,
                currency: product.priceCurrency || DEFAULT_CURRENCY,
                price: product.price || priceForTimeUnits(product.pricePerSecond || '0', 1, timeUnits.hour),
            }))
        })
    ), [wrap, productUpdater, history, isMountedRef])
}
