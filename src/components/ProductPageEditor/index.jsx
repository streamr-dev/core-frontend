// @flow

import React, { Component } from 'react'
import Toolbar from '../Toolbar'
import StreamSelector from './StreamSelector'
import ImageUpload from '../ImageUpload'
import Hero from '../Hero'
import EditProductDetails from './EditProductDetails'
import styles from './productPageEditor.pcss'
import type { Props as DetailProps } from './StreamSelector'
import type { Product } from '../../flowtype/product-types'
import { Button } from '@streamr/streamr-layout'

export type Props = DetailProps & {
    fetchingProduct: boolean,
    product: ?Product,
}

const rightToolbar = (publishedState) => {
    const publishDescription = publishedState ? 'Unpublish' : 'Publish'

    return (
        <div>
            <Button color="secondary">Save</Button>
            <Button color="primary">{publishDescription}</Button>
        </div>
    )
}

export default class ProductPage extends Component<Props> {
    static defaultProps = {
        fetchingProduct: false,
        fetchingStreams: false,
    }

    render() {
        const { product, streams, fetchingStreams } = this.props
        const isOwner = true //until proper auth process is ready..
        const publishedState = true // until props ready
        const rightToolbarButtons = rightToolbar(publishedState)

        return !!product && (
            <div className={styles.productPage}>
                {isOwner &&
                    <div>
                        <Toolbar rightContent={rightToolbarButtons} />
                        <Hero
                            product={product}
                            leftContent={<ImageUpload />}
                            rightContent={<EditProductDetails product={product} />}
                        />
                        <StreamSelector streams={streams} fetchingStreams={fetchingStreams} />
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
