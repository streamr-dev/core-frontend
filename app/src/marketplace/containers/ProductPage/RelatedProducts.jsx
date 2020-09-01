import React from 'react'
import { useMediaQuery } from 'react-responsive'
import { I18n } from 'react-redux-i18n'
import { useSelector } from 'react-redux'

import breakpoints from '$app/scripts/breakpoints'
import { selectRelatedProductList } from '$mp/modules/relatedProducts/selectors'

import Products from '$mp/components/Products'

const { md } = breakpoints

const RelatedProducts = () => {
    const isLargeScreen = useMediaQuery({
        minDeviceWidth: md.max,
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
