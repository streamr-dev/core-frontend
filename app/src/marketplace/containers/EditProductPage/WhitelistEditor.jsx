// @flow

import React, { useCallback } from 'react'

import useModal from '$shared/hooks/useModal'
import useWhitelist from '$mp/modules/contractProduct/hooks/useWhitelist'
import type { Address } from '$shared/flowtype/web3-types'
import WhitelistEditorComponent from '$mp/components/WhitelistEditor'

import useContractProduct from '$mp/containers/ProductController/useContractProduct'
import useEditableProduct from '$mp/containers/ProductController/useEditableProduct'
import useEditableProductActions from '$mp/containers/ProductController/useEditableProductActions'
import useIsMounted from '$shared/hooks/useIsMounted'

export const WhitelistEditor = () => {
    const product = useEditableProduct()
    const contractProduct = useContractProduct()
    const { items } = useWhitelist()
    const { updateRequiresWhitelist } = useEditableProductActions()
    const isMounted = useIsMounted()
    const isEnabled = !!product.requiresWhitelist
    const actionsEnabled = !!contractProduct && isEnabled

    const { api: whitelistEditDialog } = useModal('whitelistEdit')

    const productId = product.id

    const onAdd = useCallback(async () => {
        const { didEnableWhitelist } = await whitelistEditDialog.open({
            productId,
        })

        // reset white list enabled marker in nav if it was updated to contract
        if (didEnableWhitelist && isMounted()) {
            updateRequiresWhitelist(true, false)
        }
    }, [productId, whitelistEditDialog, updateRequiresWhitelist, isMounted])

    const onRemove = useCallback(async (removedAddress: Address) => {
        const { didEnableWhitelist } = await whitelistEditDialog.open({
            productId,
            removedAddress,
        })

        // reset white list enabled marker in nav if it was updated to contract
        if (didEnableWhitelist && isMounted()) {
            updateRequiresWhitelist(true, false)
        }
    }, [productId, whitelistEditDialog, updateRequiresWhitelist, isMounted])

    // TODO: Email address must be provided when we enable whitelist!
    // Add this validation when we have contact email for products.

    return (
        <WhitelistEditorComponent
            items={items}
            enabled={isEnabled}
            onEnableChanged={(value) => updateRequiresWhitelist(value)}
            onAdd={onAdd}
            onRemove={onRemove}
            actionsEnabled={actionsEnabled}
        />
    )
}

export default WhitelistEditor
