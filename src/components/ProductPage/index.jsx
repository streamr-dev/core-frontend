// @flow

import React, { Component } from 'react'
import Hero from './Hero'
import Details from './Details'
import Preview from './Preview'
import RelatedProducts from './RelatedProducts'
import PurchaseDialog from './PurchaseDialog'

import type { Product } from '../../flowtype/product-types'
import type { Props as DetailProps } from './Details'
import styles from './productPage.pcss'

export type Props = DetailProps & {
    fetchingProduct: boolean,
    product: ?Product,
    onPurchase: () => void,
    showPurchaseDialog?: boolean,
}

export default class ProductPage extends Component<Props> {
    static defaultProps = {
        fetchingProduct: false,
        fetchingStreams: false,
        showPurchaseDialog: false,
    }

    render() {
        const { product, streams, fetchingStreams, onPurchase, showPurchaseDialog } = this.props

        return !!product && (
            <div className={styles.productPage}>
                {showPurchaseDialog && (
                    <PurchaseDialog />
                )}
                <Hero product={product} onPurchase={() => onPurchase()} />
                <Details streams={streams} fetchingStreams={fetchingStreams} />
                <Preview />
                <RelatedProducts />
            </div>
        )
    }
}
