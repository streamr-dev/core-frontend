import React from 'react'
import { I18n } from 'react-redux-i18n'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { selectRelatedProductList } from '$mp/modules/relatedProducts/selectors'
import { SM, LG } from '$shared/utils/styled'

import Products, { MarketplaceProductCol } from '$mp/components/Products'

const RelatedProductsContainer = styled(Products)`
    @media (min-width: ${SM}px) and (max-width: ${LG}px) {
        ${MarketplaceProductCol}:last-child {
            display: none;
        }
    }
`

const RelatedProducts = () => {
    const relatedProducts = useSelector(selectRelatedProductList)

    if (!relatedProducts || relatedProducts.length < 1) {
        return null
    }

    const products = relatedProducts.slice(0, 3)

    return (
        <RelatedProductsContainer
            header={I18n.t('productPage.relatedProducts')}
            products={products}
            type="relatedProducts"
        />
    )
}

export default RelatedProducts
