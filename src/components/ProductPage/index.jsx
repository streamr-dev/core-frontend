// @flow

import React, { Component } from 'react'
import Toolbar from '../Toolbar'
import Holder from '../Holder'
import ProductDetails from './ProductDetails'
import Hero from '../Hero'
import StreamListing from './StreamListing'
import RelatedProducts from './RelatedProducts'
import { Link } from 'react-router-dom'
import { formatPath } from '../../utils/url'
import links from '../../links'
import { Button } from '@streamr/streamr-layout'
import ImageUpload from '../../components/ImageUpload'

import type { Product } from '../../flowtype/product-types'
import type { StreamList } from '../../flowtype/stream-types'
import styles from './productPage.pcss'

export type Props = {
    fetchingStreams: boolean,
    streams: StreamList,
    product: ?Product,
    showRelated?: boolean,
    toggleProductPublishState?: () => void,
    isUserOwner?: boolean,
    setImageToUpload?: (File) => void,
}

const leftToolbar = (product) => (
    !!product && (
        <div>
            <Link to={formatPath(links.products, product.id || '', 'edit')}>
                <Button color="secondary">Edit</Button>
            </Link>
        </div>
    )
)

const rightToolbar = (product, toggleProductPublishState) => {
    let productState = product ? product.state : 'Unknown'

    if (productState === 'new') {
        productState = 'Published'
        // TODO product state -> readable names
    }

    return (
        <div>
            <Button color="primary" onClick={() => (!!toggleProductPublishState && toggleProductPublishState())}>{productState}</Button>
        </div>
    )
}

const image = () => (
    <Holder width="100p" height={400} text="Preview" />
)

const imageEditor = (setImageToUpload) => (
    <ImageUpload setImageToUpload={setImageToUpload} />
)

export default class ProductPage extends Component<Props> {
    static defaultProps = {
        fetchingStreams: false,
        showRelated: true,
        setImageToUpload: () => {},
    }

    render() {
        const {
            product,
            streams,
            fetchingStreams,
            showRelated,
            toggleProductPublishState,
            isUserOwner,
            setImageToUpload,
        } = this.props
        const leftToolbarButtons = leftToolbar(product)
        const rightToolbarButtons = rightToolbar(product, toggleProductPublishState)
        const imageComponent = isUserOwner ? image() : imageEditor(setImageToUpload)

        return !!product && (
            <div className={styles.productPage}>
                {isUserOwner && (
                    <Toolbar leftContent={leftToolbarButtons} rightContent={rightToolbarButtons} />
                )}
                <Hero
                    product={product}
                    leftContent={imageComponent}
                    rightContent={<ProductDetails product={product} />}
                />
                <StreamListing streams={streams} fetchingStreams={fetchingStreams} />
                {showRelated && (
                    <RelatedProducts />
                )}
            </div>
        )
    }
}
