// @flow

import React, { useCallback } from 'react'

import Toggle from '$shared/components/Toggle'

import useProduct from '../ProductController/useProduct'
import useProductActions from '../ProductController/useProductActions'

const ProductTypeSelectorForTesting = () => {
    const product = useProduct()
    const { updateType } = useProductActions()

    const isCommunity = product.type === 'COMMUNITY'
    const onFixPriceChange = useCallback((checked) => {
        updateType(checked ? 'COMMUNITY' : 'NORMAL')
    }, [updateType])

    return (
        <div>
            <h1>Product type (test purposes only)</h1>
            Is Community Product? <Toggle
                value={isCommunity}
                onChange={onFixPriceChange}
            />
        </div>
    )
}

export default ProductTypeSelectorForTesting
