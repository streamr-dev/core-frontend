// @flow

import React from 'react'
import MediaQuery from 'react-responsive'
import { I18n } from 'react-redux-i18n'
import { useSelector } from 'react-redux'

import breakpoints from '$app/scripts/breakpoints'
import { selectRelatedProductList } from '$mp/modules/relatedProducts/selectors'
import ProductContainer from '$shared/components/Container/Product'
import { isMobile } from '$shared/utils/platform'

import Products from '$mp/components/Products'

import styles from './relatedProducts.pcss'

const { md } = breakpoints

const RelatedProducts = () => {
    const relatedProducts = useSelector(selectRelatedProductList)

    if (!relatedProducts || relatedProducts.length < 1) {
        return null
    }

    return (
        <MediaQuery minDeviceWidth={md.max}>
            {(matches) => (
                <ProductContainer className={styles.relatedProducts}>
                    <Products
                        header={I18n.t('productPage.relatedProducts')}
                        products={matches && !isMobile() ? relatedProducts : relatedProducts.slice(0, 2)}
                        type="relatedProducts"
                    />
                </ProductContainer>
            )}
        </MediaQuery>
    )
}

export default RelatedProducts
