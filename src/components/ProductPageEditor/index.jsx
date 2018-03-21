// @flow

import React, { Component } from 'react'
import ActionPanel from '../ProductPage/ActionPanel'
import styles from './productPageEditor.pcss'
import type { Props as DetailProps } from '../ProductPage/Details'
import type { Product } from '../../flowtype/product-types'

export type Props = DetailProps & {
    fetchingProduct: boolean,
    product: ?Product,
}

export default class ProductPage extends Component<Props> {
    static defaultProps = {
        fetchingProduct: false,
        fetchingStreams: false,
    }

    render() {
        const { product, streams, fetchingStreams } = this.props
        const isOwner = true //until proper auth process is ready..

        return !!product && (
            <div className={styles.productPage}>
                {isOwner &&
                    <div>
                        <ActionPanel />
                    </div>
                }
                {!isOwner &&
                    <div>
                        <h1>You are not authorised to see this page.</h1>
                    </div>
                }
            </div>
        )
    }
}
