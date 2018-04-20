// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'

import ProductPageEditorComponent from '../../components/ProductPageEditor'
import type { Props as ProductPageEditorProps } from '../../components/ProductPage'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'
import type { Address } from '../../flowtype/web3-types'
import type { PriceDialogProps } from '../../components/SetPriceDialog'
import type { StreamList } from '../../flowtype/stream-types'
import type { CategoryList, Category } from '../../flowtype/category-types'

import { getProductById } from '../../modules/product/actions'
import { initEditProduct, updateEditProductField, updateEditProductAndRedirect } from '../../modules/editProduct/actions'
import { getStreams } from '../../modules/streams/actions'
import { formatPath } from '../../utils/url'
import { setImageToUpload } from '../../modules/createProduct/actions'
import { showModal } from '../../modules/modals/actions'
import { getCategories } from '../../modules/categories/actions'

import {
    selectFetchingProduct,
    selectCategory,
    selectProduct,
    selectProductError,
    selectStreams,
    selectFetchingStreams,
    selectStreamsError,
} from '../../modules/product/selectors'
import { selectAccountId } from '../../modules/web3/selectors'
import { selectAllCategories } from '../../modules/categories/selectors'
import { selectProductSharePermission } from '../../modules/user/selectors'

import links from '../../links'
import { SET_PRICE } from '../../utils/modals'

import { selectStreams as selectAvailableStreams } from '../../modules/streams/selectors'

export type OwnProps = {
    match: Match,
    ownerAddress: ?Address,
}

export type StateProps = ProductPageEditorProps & {
    availableStreams: StreamList,
    productError: ?ErrorInUi,
    streamsError: ?ErrorInUi,
    fetchingProduct: boolean,
    categories: CategoryList,
    category: ?Category,
    editPermission: boolean,
}

export type DispatchProps = {
    getProductById: (ProductId) => void,
    onPublish: () => void,
    onSaveAndExit: () => void,
    setImageToUploadProp: (File) => void,
    openPriceDialog: (PriceDialogProps) => void,
    onEditProp: (string, any) => void,
    initEditProductProp: () => void,
    getStreamsProp: () => void,
    getCategoriesProp: () => void,
}

type Props = OwnProps & StateProps & DispatchProps

class EditProductPage extends Component<Props> {
    componentDidMount() {
        this.props.getProductById(this.props.match.params.id)
        this.props.getStreamsProp()
        this.props.getCategoriesProp()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.product) {
            this.props.initEditProductProp()
        }
    }

    render() {
        const {
            product,
            category,
            streams,
            availableStreams,
            fetchingProduct,
            fetchingStreams,
            onPublish,
            onSaveAndExit,
            setImageToUploadProp,
            openPriceDialog,
            onEditProp,
            ownerAddress,
            categories,
            editPermission,
        } = this.props

        return !!product && !!editPermission && (
            <ProductPageEditorComponent
                product={product}
                streams={streams}
                category={category}
                categories={categories}
                availableStreams={availableStreams}
                fetchingStreams={fetchingProduct || fetchingStreams}
                toolbarActions={{
                    saveAndExit: {
                        title: 'Save & Exit',
                        onClick: onSaveAndExit,
                    },
                    publish: {
                        title: 'Publish',
                        color: 'primary',
                        onClick: onPublish,
                    },
                }}
                setImageToUpload={setImageToUploadProp}
                openPriceDialog={(props) => openPriceDialog({
                    ...props, disableOwnerAddress: true,
                })}
                onEdit={onEditProp}
                ownerAddress={ownerAddress}
            />
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    streams: selectStreams(state),
    availableStreams: selectAvailableStreams(state),
    fetchingProduct: selectFetchingProduct(state),
    productError: selectProductError(state),
    fetchingStreams: selectFetchingStreams(state),
    streamsError: selectStreamsError(state),
    ownerAddress: selectAccountId(state),
    isLoggedIn: false, // TODO: this is not needed when the new edit view is ready
    isProductSubscriptionValid: false, // TODO: this is not needed when the new edit view is ready
    categories: selectAllCategories(state),
    category: selectCategory(state),
    editPermission: selectProductSharePermission(state),
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    onPublish: () => dispatch(updateEditProductAndRedirect(formatPath(links.products, ownProps.match.params.id, 'publish'))),
    onSaveAndExit: () => dispatch(updateEditProductAndRedirect(formatPath(links.myProducts))),
    setImageToUploadProp: (image: File) => dispatch(setImageToUpload(image)),
    openPriceDialog: (props: PriceDialogProps) => dispatch(showModal(SET_PRICE, props)),
    onEditProp: (field: string, value: any) => dispatch(updateEditProductField(field, value)),
    initEditProductProp: () => dispatch(initEditProduct()),
    getStreamsProp: () => dispatch(getStreams()),
    getCategoriesProp: () => dispatch(getCategories()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProductPage)
