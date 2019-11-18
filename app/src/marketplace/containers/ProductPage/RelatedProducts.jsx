// @flow

import React from 'react'
import MediaQuery from 'react-responsive'
import { I18n } from 'react-redux-i18n'
import { useSelector } from 'react-redux'

import breakpoints from '$app/scripts/breakpoints'
import { selectRelatedProductList } from '$mp/modules/relatedProducts/selectors'

import Products from '$mp/components/Products'

const { md } = breakpoints

const RelatedProducts = () => {
    const relatedProducts = useSelector(selectRelatedProductList)

    if (!relatedProducts || relatedProducts.length < 1) {
        return null
    }

    return (
        <MediaQuery minDeviceWidth={md.max}>
            {(matches) => (
                <Products
                    header={I18n.t('productPage.relatedProducts')}
                    products={matches ? relatedProducts : relatedProducts.slice(0, 2)}
                    type="relatedProducts"
                />
            )}
        </MediaQuery>
    )
}

export default RelatedProducts
