import { useEffect, useState, useMemo } from 'react'
import BN from 'bignumber.js'

import useEditableState from '$shared/contexts/Undo/useEditableState'
import type { SmartContractProduct } from '$mp/types/product-types'
import { productStates } from '$shared/utils/constants'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { getAdminFee } from '$mp/modules/dataUnion/services'
import { isContractProductUpdateRequired } from '$mp/utils/smartContract'
import { getChainIdFromApiString } from '$shared/utils/chains'
import useIsMounted from '$shared/hooks/useIsMounted'
import { getPendingChanges, withPendingChanges } from './state'

export const publishModes = {
    REPUBLISH: 'republish',
    // live product update
    REDEPLOY: 'redeploy',
    // unpublished, but published at least once
    PUBLISH: 'publish',
    // unpublished, publish for the first time
    UNPUBLISH: 'unpublish',
    ERROR: 'error',
}

export async function checkPendingChanges(
    product: Record<string, any>,
    contractProduct: SmartContractProduct,
    chainId: number,
): Promise<boolean> {
    let currentAdminFee

    try {
        currentAdminFee = await getAdminFee(product.beneficiaryAddress, chainId)
    } catch (e) {
        // ignore error, assume contract has not been deployed
    }

    const pendingChanges = getPendingChanges(product)
    const productWithPendingChanges = withPendingChanges(product)
    const { adminFee, pricePerSecond, beneficiaryAddress, priceCurrency, requiresWhitelist, pricingTokenAddress, ...productDataChanges } =
        pendingChanges || {}
    const hasAdminFeeChanged = !!currentAdminFee && adminFee && currentAdminFee !== adminFee
    const hasContractProductChanged = !!contractProduct && isContractProductUpdateRequired(contractProduct, productWithPendingChanges)
    const hasRequireWhitelistChanged = !!(
        !!contractProduct &&
        requiresWhitelist !== undefined &&
        contractProduct.requiresWhitelist !== requiresWhitelist
    )
    const hasPendingChanges =
        Object.keys(productDataChanges).length > 0 || hasAdminFeeChanged || hasContractProductChanged || hasRequireWhitelistChanged

    return hasPendingChanges
}

export function getNextMode(
    productState: string,
    contractProduct: SmartContractProduct,
    hasPendingChanges: boolean,
): string {
    let nextMode

    // is published and has pending changes?
    if (productState === productStates.DEPLOYED) {
        nextMode = hasPendingChanges ? publishModes.REPUBLISH : publishModes.UNPUBLISH
    } else if (productState === productStates.NOT_DEPLOYED) {
        nextMode = contractProduct ? publishModes.REDEPLOY : publishModes.PUBLISH
    } else {
        // product is either being deployed to contract or being undeployed
        throw new Error('Invalid product state')
    }

    return nextMode
}

export default function usePendingChanges() {
    const isMounted = useIsMounted()
    const { state: product } = useEditableState()
    const [mode, setMode] = useState(null)

    useEffect(() => {
        const load = async () => {
            if (!product) {
                throw new Error('no product')
            }

            const chainId = getChainIdFromApiString(product.chain)

            // load contract product
            let contractProduct: SmartContractProduct

            try {
                contractProduct = await getProductFromContract(product.id || '', true, chainId)
            } catch (e) {
                // don't need to do anything with this error necessarily,
                // it just means that the product wasn't deployed
            }

            const { state: productState } = product
            const hasPendingChanges = await checkPendingChanges(product, contractProduct, chainId)
            const nextMode = getNextMode(productState, contractProduct, hasPendingChanges)

            if (isMounted()) {
                setMode(nextMode)
            }
        }
        load()
    }, [product, isMounted])

    return useMemo(() => ({
        nextMode: mode,
    }), [
        mode
    ])
}
