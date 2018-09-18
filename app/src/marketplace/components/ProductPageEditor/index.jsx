// @flow

import React, { Component } from 'react'

import Toolbar from '../Toolbar/index'
import ImageUpload from '../ImageUpload/index'
import type { OnUploadError } from '../ImageUpload/index'
import Hero from '../Hero/index'
import BackButton from '../Buttons/Back/index'
import type { Product, ProductId } from '../../../../../marketplace/src/flowtype/product-types'
import type { ButtonActions } from '../Buttons/index'
import type { PriceDialogProps } from '../Modal/SetPriceDialog/index'
import type { Address } from '../../../../../marketplace/src/flowtype/web3-types'
import type { PropertySetter } from '../../../../../marketplace/src/flowtype/common-types'
import type { CategoryList, Category } from '../../../../../marketplace/src/flowtype/category-types'
import type { User } from '../../../../../marketplace/src/flowtype/user-types'

import productPageStyles from '../ProductPage/productPage.pcss'
import StreamSelector from './StreamSelector/index'
import ProductDetailsEditor from './ProductDetailsEditor/index'
import styles from './productPageEditor.pcss'
import type { StateProps as DetailProps } from './StreamSelector/index'

export type Props = DetailProps & {
    fetchingProduct: boolean,
    product: ?Product,
    toolbarActions?: ButtonActions,
    setImageToUpload?: (File) => void,
    onEdit: PropertySetter<string | number>,
    onCancel: (ProductId) => void,
    ownerAddress: ?Address,
    openPriceDialog: (PriceDialogProps) => void,
    onUploadError: OnUploadError,
    categories: CategoryList,
    category: ?Category,
    isPriceEditable: boolean,
    user: ?User,
}

export default class ProductPage extends Component<Props> {
    static defaultProps = {
        fetchingProduct: false,
        fetchingStreams: false,
    }

    render() {
        const {
            product,
            category,
            streams,
            availableStreams,
            fetchingStreams,
            toolbarActions,
            setImageToUpload,
            categories,
            onEdit,
            onCancel,
            ownerAddress,
            openPriceDialog,
            onUploadError,
            isPriceEditable,
            user,
        } = this.props

        return !!product && (
            <div className={styles.productPage}>
                <Toolbar actions={toolbarActions} status={<BackButton onClick={() => onCancel((product && product.id) ? product.id : '')} />} />
                <Hero
                    product={product}
                    leftContent={<ImageUpload
                        setImageToUpload={setImageToUpload}
                        originalImage={product.imageUrl}
                        onUploadError={onUploadError}
                    />}
                    rightContent={<ProductDetailsEditor
                        product={product}
                        onEdit={onEdit}
                        ownerAddress={ownerAddress}
                        openPriceDialog={openPriceDialog}
                        category={category}
                        categories={categories}
                        isPriceEditable={isPriceEditable}
                        user={user}
                    />}
                />
                <StreamSelector
                    product={product}
                    streams={streams}
                    onEdit={onEdit}
                    availableStreams={availableStreams}
                    fetchingStreams={fetchingStreams}
                    className={productPageStyles.section}
                />
            </div>
        )
    }
}
