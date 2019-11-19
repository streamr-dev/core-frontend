// @flow

import React, { Component } from 'react'

import Toolbar from '$shared/components/Toolbar'
import ImageUpload from '$shared/components/ImageUpload'
import Hero from '$mp/components/Hero'
import BackButton from '$shared/components/BackButton'
import type { Product } from '$mp/flowtype/product-types'
import type { ButtonActions } from '$shared/components/Buttons'
import type { Address } from '$shared/flowtype/web3-types'
import type { PropertySetter } from '$shared/flowtype/common-types'
import type { CategoryList, Category } from '$mp/flowtype/category-types'
import type { User } from '$shared/flowtype/user-types'

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
    ownerAddress: ?Address,
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
            ownerAddress,
            isPriceEditable,
            user,
        } = this.props

        return !!product && (
            <div className={styles.productPage}>
                <Toolbar actions={toolbarActions} left={<BackButton />} />
                <Hero
                    product={product}
                    leftContent={<ImageUpload
                        setImageToUpload={setImageToUpload}
                        originalImage={product.imageUrl}
                    />}
                    rightContent={<ProductDetailsEditor
                        product={product}
                        onEdit={onEdit}
                        ownerAddress={ownerAddress}
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
                    className={styles.section}
                />
            </div>
        )
    }
}
