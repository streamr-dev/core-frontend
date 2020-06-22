// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import useIsMounted from '$shared/hooks/useIsMounted'
import usePending from '$shared/hooks/usePending'
import { canHandleLoadError, handleLoadError } from '$auth/utils/loginInterceptor'

import type { ProductId } from '$mp/flowtype/product-types'
import { getProductById } from '$mp/modules/product/services'
import { getProductByIdRequest, getProductByIdSuccess } from '$mp/modules/product/actions'
import { isPaidProduct, isDataUnionProduct } from '$mp/utils/product'
import { timeUnits, DEFAULT_CURRENCY } from '$shared/utils/constants'
import { priceForTimeUnits } from '$mp/utils/price'
import { isEthereumAddress } from '$mp/utils/validate'
import { getAdminFee } from '$mp/modules/dataUnion/services'
import { handleEntities } from '$shared/utils/entities'
import { productSchema } from '$shared/modules/entities/schema'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import useFailure from '$shared/hooks/useFailure'

import * as State from '../EditProductPage/state'
import useEditableProductUpdater from './useEditableProductUpdater'

type LoadProps = {
    productId: ProductId,
    ignoreUnauthorized?: boolean,
}

export default function useProductLoadCallback() {
    const productUpdater = useEditableProductUpdater()
    const { wrap } = usePending('product.LOAD')
    const isMounted = useIsMounted()
    const dispatch = useDispatch()
    const fail = useFailure()

    const load = useCallback(async ({ productId, ignoreUnauthorized }: LoadProps) => (
        wrap(async () => {
            dispatch(getProductByIdRequest(productId))
            let product
            try {
                product = await getProductById(productId)
            } catch (error) {
                if (!isMounted()) { return }
                if (canHandleLoadError(error)) {
                    await handleLoadError({
                        error,
                        ignoreUnauthorized,
                    })
                }

                throw error
            }
            if (!isMounted()) { return }

            // fetch admin fee from data union contract
            let currentAdminFee
            let dataUnionDeployed = false
            if (isDataUnionProduct(product) && isEthereumAddress(product.beneficiaryAddress)) {
                try {
                    currentAdminFee = await getAdminFee(product.beneficiaryAddress, true)
                    dataUnionDeployed = true
                } catch (e) {
                    // ignore error, assume contract has not been deployed
                }
            }
            if (!isMounted()) { return }

            const nextProduct = {
                ...product,
                isFree: !!product.isFree || !isPaidProduct(product),
                timeUnit: timeUnits.hour,
                priceCurrency: product.priceCurrency || DEFAULT_CURRENCY,
                price: product.price || priceForTimeUnits(product.pricePerSecond || '0', 1, timeUnits.hour),
                adminFee: currentAdminFee,
                dataUnionDeployed,
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
    ), [wrap, dispatch, productUpdater, isMounted])

    return useCallback(async (props: LoadProps) => {
        try {
            await load(props)
        } catch (e) {
            if (e instanceof ResourceNotFoundError) {
                fail(e)
                return
            }

            throw e
        }
    }, [load, fail])
}
