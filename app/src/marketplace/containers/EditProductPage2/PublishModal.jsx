// @flow

import React, { useEffect } from 'react'

import type { Product } from '$mp/flowtype/product-types'
import { isPaidProduct } from '$mp/utils/product'
import { productStates } from '$shared/utils/constants'
import useModal from '$shared/hooks/useModal'
import { getProductById } from '$mp/modules/product/services'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { isUpdateContractProductRequired } from '$mp/utils/smartContract'

import ErrorDialog from '$mp/components/Modal/ErrorDialog'

/* const steps = {
    INITIAL: 'initial',
} */

type Props = {
    product: Product,
    api: Object,
}

const modes = {
    REPUBLISH: 'republish', // live product update
    REDEPLOY: 'redeploy', // unpublished, but published at least once
    PUBLISH: 'publish', // unpublished, publish for the first time
    UNPUBLISH: 'unpublish',
}

const actionsTypes = {
    UPDATE_ADMIN_FEE: 'updateAdminFee',
    UPDATE_CONTRACT_PRODUCT: 'updateContractProduct',
    PUBLISH_PAID: 'publishPaid',
    PUBLISH_FREE: 'publishFree',
    UNDEPLOY_CONTRACT_PRODUCT: 'undeployContractProduct',
    UNPUBLISH_FREE: 'unpublishFree',
}

const PublishOrUnpublishModal = ({ product, api }: Props) => {
    // const [step, setStep] = useState(steps.INITIAL)
    // const isCommunityProduct = product.type === 'COMMUNITY'

    /* const updateAdminFee = () => {
        if (isCommunity) {
            const cp = await loadCommunityProduct()

            if (cp) {
                await updateCp()
            }
        }
    }

    const updateContractProduct = () => {
        updateContractProduct(product.id || '', {
            ...contractProduct,
            pricePerSecond: product.pricePerSecond,
            beneficiaryAddress: product.beneficiaryAddress,
            priceCurrency: product.priceCurrency,
        })
    } */

    const productId = product.id

    useEffect(() => {
        async function fetch(pId) {
            // load product
            const p = await getProductById(pId || '')

            if (!p) {
                // throw error
            }

            // load contract product
            let contractProduct
            try {
                contractProduct = await getProductFromContract(pId || '', true)
            } catch (e) {
                // no contract product
            }

            const community = null

            const { state: productState } = p

            const { adminFee } = p.pendingChanges || {}
            const hasAdminFeeChanged = !!community && (community.adminFee !== adminFee)
            const hasPriceChanged = !!contractProduct && isUpdateContractProductRequired(contractProduct, p)
            const hasPendingChanges = hasAdminFeeChanged || hasPriceChanged

            let mode
            // is published and has pending changes?
            if (productState === productStates.DEPLOYED) {
                mode = hasPendingChanges ? modes.REPUBLISH : modes.UNPUBLISH
            } else if (productState === productStates.NOT_DEPLOYED) {
                mode = contractProduct ? modes.REDEPLOY : modes.PUBLISH
            } else {
                // error
            }

            // LIVEUPDATE
            const actions = []

            if ([modes.REPUBLISH, modes.REDEPLOY, modes.PUBLISH].includes(mode)) {
                if (community && community.adminFee !== adminFee) {
                    actions.push({
                        type: actionsTypes.UPDATE_ADMIN_FEE,
                        adminFee,
                    })
                }
            }

            if ([modes.REPUBLISH, modes.REDEPLOY].includes(mode)) {
                if (hasPriceChanged) {
                    actions.push({
                        type: actionsTypes.UPDATE_CONTRACT_PRODUCT,
                        product: p,
                    })
                }
            }

            if ([modes.REDEPLOY, modes.PUBLISH].includes(mode)) {
                if (isPaidProduct(p)) {
                    actions.push({
                        type: actionsTypes.PUBLISH_PAID,
                        product: p,
                    })
                } else {
                    actions.push({
                        type: actionsTypes.PUBLISH_FREE,
                    })
                }
            }

            if (mode === modes.UNPUBLISH) {
                if (contractProduct) {
                    actions.push({
                        type: actionsTypes.UNDEPLOY_CONTRACT_PRODUCT,
                        product: p,
                    })
                } else {
                    actions.push({
                        type: actionsTypes.UNPUBLISH_FREE,
                    })
                }
            }

            console.log(actions)
            // if community, load community
            //    -> admin fee changed -> update admin fee
            // if paid, load contract product
            //    -> price / currency changed -> update price
            // update API

            // REDEPLOY
            // if community, load community
            //    -> admin fee changed -> update admin fee
            // if price / currency changed
            //    -> update product
            // redeploy
            // update API

            // PUBLISH
            // if community, load community
            //    -> require exists
            // if community, load stats
            //    -> require enough members
            // if community
            //     -> update admin fee
            // create contract product
            // update API
        }

        fetch(productId)
    }, [productId])

    return (
        <ErrorDialog
            message="error.message"
            onClose={() => api.close(false)}
        />
    )
}

export default () => {
    const { isOpen, api, value } = useModal('publish')

    if (!isOpen) {
        return null
    }

    const { product } = value || {}

    /*
    const isPaid =
    const isCommunity =
    const isPublished =
    const isDeployed = */

    // if community, check required members

    /* useEffect(() => {
        await loadProduct
        await loadContractProduct
        await loadCommunity
    }, []) */

    return (
        <PublishOrUnpublishModal
            product={product}
            api={api}
        />
    )
}
