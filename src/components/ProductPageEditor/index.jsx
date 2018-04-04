// @flow

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@streamr/streamr-layout'

import Toolbar from '../Toolbar'
import StreamSelector from './StreamSelector'
import ImageUpload from '../ImageUpload'
import Hero from '../Hero'
import ProductDetailsEditor from './ProductDetailsEditor'
import { formatPath } from '../../utils/url'
import type { Props as DetailProps } from './StreamSelector'
import type { Product, ProductId } from '../../flowtype/product-types'

import styles from './productPageEditor.pcss'
import links from '../../links'

export type Props = DetailProps & {
    fetchingProduct: boolean,
    product: ?Product,
    toggleProductPublishState: ?() => void,
    onSaveExit: ?() => void,
    setImageToUpload?: (File) => void,
    onEdit: (field: string, value: string) => void,
}

const leftToolbar = (id: ProductId) => (
    <Button tag={Link} to={formatPath(links.products, id)}>Cancel</Button>
)

const rightToolbar = (product, onSaveExit, toggleProductPublishState) => {
    let productState = product ? product.state : 'Unknown'

    if (productState === 'new') {
        productState = 'Published'
        //TODO product state -> readable names
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
        const { product, streams, fetchingStreams, onSaveExit, toggleProductPublishState, setImageToUpload, onEdit } = this.props
        const leftToolbarButtons = leftToolbar(product && product.id || '')
        const rightToolbarButtons = rightToolbar(product, onSaveExit, toggleProductPublishState)

        return !!product && (
            <div className={styles.productPage}>
                <Toolbar leftContent={leftToolbarButtons} rightContent={rightToolbarButtons} />
                <Hero
                    product={product}
                    leftContent={<ImageUpload setImageToUpload={setImageToUpload} />}
                    rightContent={<ProductDetailsEditor product={product} onEdit={onEdit} />}
                />
                <StreamSelector streams={streams} fetchingStreams={fetchingStreams} />
            </div>
        )
    }
}
