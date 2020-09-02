import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { I18n } from 'react-redux-i18n'
import { useSelector } from 'react-redux'

import { selectRelatedProductList } from '$mp/modules/relatedProducts/selectors'
import { XL } from '$shared/utils/styled'

import Products from '$mp/components/Products'

const RelatedProducts = () => {
    const isLargeScreen = useMediaQuery({
        minWidth: XL,
    })

    const relatedProducts = useSelector(selectRelatedProductList)

    if (!relatedProducts || relatedProducts.length < 1) {
        return null
    }

    const products = isLargeScreen ? relatedProducts : relatedProducts.slice(0, 2)

    return (
        <Products
            header={I18n.t('productPage.relatedProducts')}
            products={products}
            type="relatedProducts"
        />
    )
}

export default RelatedProducts
