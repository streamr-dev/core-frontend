// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import CreateProductPageComponent from '../../components/CreateProductPage'
import { selectAllCategories, selectFetchingCategories } from '../../modules/categories/selectors'
import { getCategories } from '../../modules/categories/actions'
import { selectFetchingStreams, selectStreams as selectAvailableStreams } from '../../modules/streams/selectors'
import { getStreams } from '../../modules/streams/actions'
import {
    updateProductField,
    initProduct,
    resetProduct,
    setImageToUpload,
    createProductAndRedirect,
} from '../../modules/createProduct/actions'
import { selectProduct, selectProductStreams, selectCategory, selectImageToUpload } from '../../modules/createProduct/selectors'
import { selectFetchingProduct } from '../../modules/product/selectors'
import { formatPath } from '../../utils/url'
import { showModal } from '../../modules/modals/actions'
import { SET_PRICE, CONFIRM_NO_COVER_IMAGE } from '../../utils/modals'

import type { PriceDialogProps } from '../../components/Modal/SetPriceDialog'
import type { Address } from '../../flowtype/web3-types'
import type { CategoryList, Category } from '../../flowtype/category-types'
import type { StreamList } from '../../flowtype/stream-types'
import type { Product } from '../../flowtype/product-types'
import type { StoreState } from '../../flowtype/store-state'
import { selectAccountId } from '../../modules/web3/selectors'

import links from '../../links'

export type OwnProps = {
    ownerAddress: ?Address,
}

type StateProps = {
    categories: CategoryList,
    category: ?Category,
    fetchingCategories: boolean,
    streams: StreamList,
    fetchingStreams: boolean,
    availableStreams: StreamList,
    product: ?Product,
    fetchingProduct: boolean,
    imageUpload: ?File,
}

type DispatchProps = {
    initProduct: () => void,
    getCategories: () => void,
    getStreams: () => void,
    onEditProp: (string, any) => void,
    onCancel: () => void,
    confirmNoCoverImage: (Function) => void,
    onPublish: () => void,
    setImageToUploadProp?: (File) => void,
    onSaveAndExit: () => void,
    onReset: () => void,
    openPriceDialog: (PriceDialogProps) => void,
}

type Props = OwnProps & StateProps & DispatchProps

class CreateProductPage extends Component<Props> {
    componentDidMount() {
        if (!this.props.product) {
            this.props.initProduct()
        }

        if ((!this.props.categories || this.props.categories.length === 0) && !this.props.fetchingCategories) {
            this.props.getCategories()
        }

        if ((!this.props.streams || this.props.streams.length === 0) && !this.props.fetchingStreams) {
            this.props.getStreams()
        }
    }

    componentWillUnmount() {
        this.props.onReset()
    }

    confirmCoverImageBeforeSaving = (nextAction: Function) => {
        const { product, imageUpload, confirmNoCoverImage } = this.props

        if (product) {
            if (!product.imageUrl && !imageUpload) {
                confirmNoCoverImage(nextAction)
            } else {
                nextAction()
            }
        }
    }

    render() {
        const {
            product,
            categories,
            category,
            streams,
            availableStreams,
            fetchingStreams,
            fetchingProduct,
            onPublish,
            onSaveAndExit,
            openPriceDialog,
            setImageToUploadProp,
            onEditProp,
            ownerAddress,
            onCancel,
        } = this.props

        const isProductValid = (p: Product) => p.category && p.name && p.description

        return !!product && !!categories && (
            <CreateProductPageComponent
                product={product}
                categories={categories}
                category={category}
                streams={streams}
                availableStreams={availableStreams}
                fetchingStreams={fetchingProduct || fetchingStreams}
                toolbarActions={{
                    saveAndExit: {
                        title: 'Save & Exit',
                        onClick: () => this.confirmCoverImageBeforeSaving(onSaveAndExit),
                        disabled: !isProductValid(product),
                    },
                    publish: {
                        title: 'Publish',
                        color: 'primary',
                        onClick: () => this.confirmCoverImageBeforeSaving(onPublish),
                        disabled: !isProductValid(product),
                    },
                }}
                setImageToUpload={setImageToUploadProp}
                openPriceDialog={openPriceDialog}
                onEdit={onEditProp}
                ownerAddress={ownerAddress}
                onCancel={onCancel}
            />
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    categories: selectAllCategories(state),
    category: selectCategory(state),
    fetchingCategories: selectFetchingCategories(state),
    streams: selectProductStreams(state),
    availableStreams: selectAvailableStreams(state),
    fetchingStreams: selectFetchingStreams(state),
    product: selectProduct(state),
    fetchingProduct: selectFetchingProduct(state),
    ownerAddress: selectAccountId(state),
    imageUpload: selectImageToUpload(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    initProduct: () => dispatch(initProduct()),
    getCategories: () => dispatch(getCategories()),
    getStreams: () => dispatch(getStreams()),
    onEditProp: (field: string, value: any) => dispatch(updateProductField(field, value)),
    setImageToUploadProp: (image: File) => dispatch(setImageToUpload(image)),
    confirmNoCoverImage: (onContinue: Function) => dispatch(showModal(CONFIRM_NO_COVER_IMAGE, {
        onContinue,
    })),
    onPublish: () => {
        dispatch(createProductAndRedirect((id) => formatPath(links.products, id, 'publish'), 'PUBLISH'))
    },
    onSaveAndExit: () => {
        dispatch(createProductAndRedirect((id) => formatPath(links.products, id), 'SAVE'))
    },
    openPriceDialog: (props: PriceDialogProps) => dispatch(showModal(SET_PRICE, {
        ...props,
        ownerAddressReadOnly: true,
    })),
    onReset: () => {
        dispatch(resetProduct())
    },
    onCancel: () => {
        dispatch(resetProduct())
        dispatch(push(links.myProducts))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductPage)
