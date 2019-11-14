// @flow

import { useContext, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { Context as RouterContext } from '$shared/components/RouterContextProvider'
import useIsMountedRef from '$shared/hooks/useIsMountedRef'
import usePending from '$shared/hooks/usePending'

import type { ProductId } from '$mp/flowtype/product-types'
import { getProductById } from '$mp/modules/product/services'
import { getProductByIdRequest, getProductByIdSuccess } from '$mp/modules/product/actions'
import { isPaidProduct, isCommunityProduct } from '$mp/utils/product'
import { timeUnits, DEFAULT_CURRENCY } from '$shared/utils/constants'
import { priceForTimeUnits } from '$mp/utils/price'
import { isEthereumAddress } from '$mp/utils/validate'
import { getAdminFee } from '$mp/modules/communityProduct/services'
import { handleEntities } from '$shared/utils/entities'
import { productSchema } from '$shared/modules/entities/schema'

import * as State from '../EditProductPage/state'
import useEditableProductUpdater from './useEditableProductUpdater'

export default function useProductLoadCallback() {
    const { history } = useContext(RouterContext)
    const productUpdater = useEditableProductUpdater()
    const { wrap } = usePending('product.LOAD')
    const isMountedRef = useIsMountedRef()
    const dispatch = useDispatch()

    return useCallback(async (productId: ProductId) => (
        wrap(async () => {
            dispatch(getProductByIdRequest(productId))
            let product
            try {
                product = await getProductById(productId)
            } catch (err) {
                if (!isMountedRef.current) { return }
                history.replace('/404') // 404
                return
            }
            if (!isMountedRef.current) { return }

            // fetch admin fee from community contract
            let currentAdminFee
            if (isCommunityProduct(product) && isEthereumAddress(product.beneficiaryAddress)) {
                try {
                    currentAdminFee = await getAdminFee(product.beneficiaryAddress)
                } catch (e) {
                    // ignore error, assume contract has not been deployed
                }
            }
            if (!isMountedRef.current) { return }

            const nextProduct = {
                ...product,
                isFree: !!product.isFree || !isPaidProduct(product),
                timeUnit: product.timeUnit || timeUnits.hour,
                currency: product.priceCurrency || DEFAULT_CURRENCY,
                price: product.price || priceForTimeUnits(product.pricePerSecond || '0', 1, timeUnits.hour),
                adminFee: currentAdminFee,
            }

            // update redux state, keep original product in redux
            // Set pending changes to empty to prevent merging with previous values
            const result = handleEntities(productSchema, dispatch)({
                ...nextProduct,
                pendingChanges: null,
            })
            dispatch(getProductByIdSuccess(result))

            productUpdater.replaceProduct(() => State.withPendingChanges(nextProduct))
        })
    ), [wrap, dispatch, productUpdater, history, isMountedRef])
}
