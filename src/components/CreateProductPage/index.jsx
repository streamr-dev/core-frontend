// @flow

import React from 'react'

import Toolbar from '../Toolbar'
import Hero from '../Hero'
import ImageUpload, { type OnUploadError } from '../ImageUpload'
import ProductDetailsEditor from '../ProductPageEditor/ProductDetailsEditor'
import StreamSelector from '../ProductPageEditor/StreamSelector'
import BackButton from '../Buttons/Back'
import type { Props as DetailProps } from '../ProductPageEditor/StreamSelector'
import type { PriceDialogProps } from '../Modal/SetPriceDialog'
import type { Product } from '../../flowtype/product-types'
import type { ButtonActions } from '../Buttons'
import type { User } from '../../flowtype/user-types'
import type { Address } from '../../flowtype/web3-types'
import type { PropertySetter } from '../../flowtype/common-types'
import type { CategoryList, Category } from '../../flowtype/category-types'

import productPageStyles from '../ProductPage/productPage.pcss'
import styles from './createproductpage.pcss'

type StateProps = {
    product: Product,
    toolbarActions?: ButtonActions,
    toolbarStatus?: Node,
    categories: CategoryList,
    category: ?Category,
    user: ?User,
}

type DispatchProps = DetailProps & {
    setImageToUpload?: (File) => void,
    onEdit: PropertySetter<string | number>,
    ownerAddress: ?Address,
    openPriceDialog: (PriceDialogProps) => void,
    onUploadError: OnUploadError,
    onCancel: () => void,
}

export type Props = StateProps & DispatchProps

const CreateProductPage = (props: Props) => {
    const {
        streams,
        fetchingStreams,
        availableStreams,
        toolbarActions,
        setImageToUpload,
        openPriceDialog,
        ownerAddress,
        onEdit,
        product,
        category,
        categories,
        user,
        onUploadError,
    } = props

    return (
        <div className={styles.createProductPage}>
            <Toolbar actions={toolbarActions} status={<BackButton onClick={() => props.onCancel()} />} />
            <Hero
                leftContent={<ImageUpload setImageToUpload={setImageToUpload} onUploadError={onUploadError} />}
                rightContent={<ProductDetailsEditor
                    product={product}
                    ownerAddress={ownerAddress}
                    onEdit={onEdit}
                    openPriceDialog={openPriceDialog}
                    category={category}
                    categories={categories}
                    isPriceEditable
                    user={user}
                />}
            />
            <StreamSelector
                product={product}
                onEdit={onEdit}
                streams={streams}
                availableStreams={availableStreams}
                fetchingStreams={fetchingStreams}
                className={productPageStyles.section}
            />
        </div>
    )
}

export default CreateProductPage
