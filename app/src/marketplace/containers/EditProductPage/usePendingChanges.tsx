import { useEffect, useState, useMemo } from 'react'
import BN from 'bignumber.js'

import useEditableState from '$shared/contexts/Undo/useEditableState'
import type { Product, SmartContractProduct } from '$mp/types/product-types'
import { productStates } from '$shared/utils/constants'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { getAdminFee } from '$mp/modules/dataUnion/services'
import { isContractProductUpdateRequired } from '$mp/utils/smartContract'
import { getChainIdFromApiString } from '$shared/utils/chains'
import useIsMounted from '$shared/hooks/useIsMounted'
import { getPendingChanges, withPendingChanges } from './state'

export enum PublishMode {
    REPUBLISH = 'republish',
    // live product update
    REDEPLOY = 'redeploy',
    // unpublished, but published at least once
    PUBLISH = 'publish',
    // unpublished, publish for the first time
    UNPUBLISH = 'unpublish',
    ERROR = 'error',
}

export type PendingChangeResult = {
    hasPendingChanges: boolean,
    hasAdminFeeChanged: boolean,
    hasContractProductChanged: boolean,
    hasRequireWhitelistChanged: boolean,
    adminFee: any,
    pricePerSecond: any,
    beneficiaryAddress: any,
    priceCurrency: any,
    requiresWhitelist: any,
    pricingTokenAddress: any,
    productDataChanges: any,
}

export async function calculatePendingChanges(
    product: Product,
    contractProduct: SmartContractProduct,
    chainId: number,
): Promise<PendingChangeResult> {
    let currentAdminFee: string

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

    return {
        hasPendingChanges,
        hasAdminFeeChanged,
        hasContractProductChanged,
        hasRequireWhitelistChanged,
        adminFee,
        pricePerSecond,
        beneficiaryAddress,
        priceCurrency,
        requiresWhitelist,
        pricingTokenAddress,
        productDataChanges,
    }
}

export function getNextMode(
    productState: string,
    contractProduct: SmartContractProduct,
    hasPendingChanges: boolean,
): PublishMode {
    let nextMode: PublishMode

    // is published and has pending changes?
    if (productState === productStates.DEPLOYED) {
        nextMode = hasPendingChanges ? PublishMode.REPUBLISH : PublishMode.UNPUBLISH
    } else if (productState === productStates.NOT_DEPLOYED) {
        nextMode = contractProduct ? PublishMode.REDEPLOY : PublishMode.PUBLISH
    } else {
        // product is either being deployed to contract or being undeployed
        nextMode = PublishMode.ERROR
    }

    return nextMode
}

export default function usePendingChanges() {
    const isMounted = useIsMounted()
    const { state: product } = useEditableState()
    const [mode, setMode] = useState<PublishMode>(null)

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
            const { hasPendingChanges } = await calculatePendingChanges(product as Product, contractProduct, chainId)
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
