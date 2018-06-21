// @flow

import React, { Component } from 'react'

import Toolbar from '../Toolbar'
import ImageUpload from '../ImageUpload'
import type { OnUploadError } from '../ImageUpload'
import Hero from '../Hero'
import BackButton from '../Buttons/Back'
import type { Product, ProductId } from '../../flowtype/product-types'
import type { ButtonActions } from '../Buttons'
import type { PriceDialogProps } from '../Modal/SetPriceDialog'
import type { Address } from '../../flowtype/web3-types'
import type { PropertySetter } from '../../flowtype/common-types'
import type { CategoryList, Category } from '../../flowtype/category-types'
import type { User } from '../../flowtype/user-types'

import productPageStyles from '../ProductPage/productPage.pcss'
import StreamSelector from './StreamSelector'
import ProductDetailsEditor from './ProductDetailsEditor'
import styles from './productPageEditor.pcss'
import type { StateProps as DetailProps } from './StreamSelector'

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
