// @flow

import { useMemo, useEffect, useState } from 'react'

import { getWhitelistAddresses, whitelistApprove, whitelistReject } from '$mp/modules/contractProduct/services'

import useEditableProduct from '../ProductController/useEditableProduct'
import useEditableProductActions from '../ProductController/useEditableProductActions'

export function useWhitelist() {
    const product = useEditableProduct()
    const { updateRequiresWhitelist } = useEditableProductActions()
    const isEnabled = product.requiresWhitelist
    const productId = product.id
    const [items, setItems] = useState([])

    useEffect(() => {
        const loadWhitelist = async () => {
            const whitelist = await getWhitelistAddresses(productId)
            setItems(whitelist)
        }

        loadWhitelist()
    }, [productId])

    return useMemo(() => ({
        isEnabled,
        setEnabled: updateRequiresWhitelist,
        items,
        approve: (address: string) => whitelistApprove(productId, address),
        reject: (address: string) => whitelistReject(productId, address),
    }), [
        isEnabled,
        updateRequiresWhitelist,
        productId,
        items,
    ])
}

export default useWhitelist
