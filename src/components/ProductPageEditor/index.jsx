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
import type { PriceDialogProps } from '../SetPriceDialog'
import type { Address } from '../../flowtype/web3-types'
import type { PropertySetter } from '../../flowtype/common-types'

import styles from './productPageEditor.pcss'

export type Props = DetailProps & {
    fetchingProduct: boolean,
    product: ?Product,
    toolbarActions?: ButtonActions,
    toolbarStatus?: Node,
    setImageToUpload?: (File) => void,
    onEdit: PropertySetter<string | number>,
    ownerAddress: ?Address,
    openPriceDialog: (PriceDialogProps) => void,
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
            onEdit,
            ownerAddress,
            openPriceDialog,
        } = this.props

        return !!product && (
            <div className={styles.productPage}>
                <Toolbar status={toolbarStatus} actions={toolbarActions} />
                <Hero
                    product={product}
                    leftContent={<ImageUpload setImageToUpload={setImageToUpload} />}
                    rightContent={<ProductDetailsEditor
                        product={product}
                        onEdit={onEdit}
                        ownerAddress={ownerAddress}
                        openPriceDialog={openPriceDialog}
                    />}
                />
                <StreamSelector streams={streams} fetchingStreams={fetchingStreams} />
            </div>
        )
    }
}
