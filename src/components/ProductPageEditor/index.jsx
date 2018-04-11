// @flow

import React, { Component, type Node } from 'react'

import Toolbar from '../Toolbar'
import StreamSelector from './StreamSelector'
import ImageUpload from '../ImageUpload'
import Hero from '../Hero'
import ProductDetailsEditor from './ProductDetailsEditor'
import type { Props as DetailProps } from './StreamSelector'
import type { Product } from '../../flowtype/product-types'
import type { ButtonActions } from '../Buttons'

import styles from './productPageEditor.pcss'

export type Props = DetailProps & {
    fetchingProduct: boolean,
    product: ?Product,
    toolbarActions?: ButtonActions,
    toolbarStatus?: Node,
    setImageToUpload?: (File) => void,
    onEdit: (field: string, value: string) => void,
    openPriceDialog: () => void,
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
            toolbarStatus,
            toolbarActions,
            setImageToUpload,
            openPriceDialog,
            onEdit,
        } = this.props

        return !!product && (
            <div className={styles.productPage}>
                <Toolbar status={toolbarStatus} actions={toolbarActions} />
                <Hero
                    product={product}
                    leftContent={<ImageUpload setImageToUpload={setImageToUpload} />}
                    rightContent={<ProductDetailsEditor product={product} onEdit={onEdit} openPriceDialog={openPriceDialog} />}
                />
                <StreamSelector streams={streams} fetchingStreams={fetchingStreams} />
            </div>
        )
    }
}
