// @flow

import React, { Component } from 'react'
import Toolbar from '../Toolbar'
import StreamSelector from './StreamSelector'
import ImageUpload from '../ImageUpload'
import Hero from '../Hero'
import ProductDetailsEditor from './ProductDetailsEditor'
import styles from './productPageEditor.pcss'
import type { Props as DetailProps } from './StreamSelector'
import type { Product } from '../../flowtype/product-types'
import { Button } from '@streamr/streamr-layout'

export type Props = DetailProps & {
    fetchingProduct: boolean,
    product: ?Product,
    toggleProductPublishState: ?() => void,
    onSaveExit: ?() => void,
    setImageToUpload?: (File) => void,
}

const rightToolbar = (product, toggleProductPublishState, onSaveExit) => {
    let productState = product ? product.state : 'Unknown'

    if (productState === 'new') {
        productState = 'Published'
        // TODO product state -> readable names
    }

    return (
        <div>
            <Button color="secondary" onClick={() => (!!onSaveExit && onSaveExit())}>Save & Exit</Button>
            <Button color="primary" onClick={() => (!!toggleProductPublishState && toggleProductPublishState())}>{productState}</Button>
        </div>
    )
}

export default class ProductPage extends Component<Props> {
    static defaultProps = {
        fetchingProduct: false,
        fetchingStreams: false,
    }

    render() {
        const {
            product,
            streams,
            fetchingStreams,
            onSaveExit,
            toggleProductPublishState,
            setImageToUpload,
        } = this.props
        const rightToolbarButtons = rightToolbar(product, onSaveExit, toggleProductPublishState)

        return !!product && (
            <div className={styles.productPage}>
                <Toolbar rightContent={rightToolbarButtons} />
                <Hero
                    product={product}
                    leftContent={<ImageUpload setImageToUpload={setImageToUpload} />}
                    rightContent={<ProductDetailsEditor product={product} />}
                />
                <StreamSelector streams={streams} fetchingStreams={fetchingStreams} />
            </div>
        )
    }
}
