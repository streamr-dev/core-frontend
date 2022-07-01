// @flow

import { useCallback } from 'react'

import useIsMounted from '$shared/hooks/useIsMounted'
import usePending from '$shared/hooks/usePending'
import { canHandleLoadError, handleLoadError } from '$auth/utils/loginInterceptor'

import type { ProductId } from '$mp/flowtype/product-types'
import { getProductById } from '$mp/modules/product/services'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { isPaidProduct, isDataUnionProduct } from '$mp/utils/product'
import { timeUnits, DEFAULT_CURRENCY, productStates } from '$shared/utils/constants'
import { getChainIdFromApiString } from '$shared/utils/chains'
import { priceForTimeUnits } from '$mp/utils/price'
import { isEthereumAddress } from '$mp/utils/validate'
import { getAdminFee } from '$mp/modules/dataUnion/services'
import ResourceNotFoundError, { ResourceType } from '$shared/errors/ResourceNotFoundError'
import useFailure from '$shared/hooks/useFailure'
import useEditableState from '$shared/contexts/Undo/useEditableState'

import * as State from '../EditProductPage/state'
import { useController } from '.'

type LoadProps = {
    productId: ProductId,
    ignoreUnauthorized?: boolean,
    requirePublished?: boolean,
    useAuthorization?: boolean,
}

export default function useProductLoadCallback() {
    const productUpdater = useEditableState()
    const { wrap } = usePending('product.LOAD')
    const isMounted = useIsMounted()
    const fail = useFailure()
    const { setProduct } = useController()

    const load = useCallback(async ({ productId, ignoreUnauthorized, requirePublished, useAuthorization = true }: LoadProps) => (
        wrap(async () => {
            let product
            try {
                product = await getProductById(productId, useAuthorization)
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

            const chainId = getChainIdFromApiString(product.chain)

            // bail if the product is not actually published - this is an edge case
            // because this should only happen with user's own products, otherwise
            // the product load will fail due to permissions
            if (!!requirePublished && product.state !== productStates.DEPLOYED) {
                throw new ResourceNotFoundError(ResourceType.PRODUCT, product.id)
            }

            // fetch admin fee from data union contract
            let currentAdminFee
            let dataUnionDeployed = false
            if (isDataUnionProduct(product) && isEthereumAddress(product.beneficiaryAddress)) {
                try {
                    currentAdminFee = await getAdminFee(product.beneficiaryAddress, chainId, true)
                    dataUnionDeployed = true
                } catch (e) {
                    // ignore error, assume contract has not been deployed
                }
            }
            if (!isMounted()) { return }

            // Fetch whitelist status from contract product
            let requiresWhitelist = false
            try {
                const contractProduct = await getProductFromContract(productId, true, chainId)
                // eslint-disable-next-line prefer-destructuring
                requiresWhitelist = contractProduct.requiresWhitelist

                // remove from pending changes if whitelist setting is correct
                if (product.pendingChanges && requiresWhitelist === product.pendingChanges.requiresWhitelist) {
                    delete product.pendingChanges.requiresWhitelist
                }
            } catch (e) {
                // ignore error, assume product is not published
                // eslint-disable-next-line prefer-destructuring
                requiresWhitelist = product && product.pendingChanges && product.pendingChanges.requiresWhitelist
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
                requiresWhitelist,
            }

            setProduct({
                ...nextProduct,
                pendingChanges: null,
            })

            productUpdater.replaceState(() => State.withPendingChanges(nextProduct))
        })
    ), [wrap, setProduct, productUpdater, isMounted])

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
