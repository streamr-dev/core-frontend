// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'

import ProductPageEditorComponent from '../../components/ProductPageEditor'
import type { Props as ProductPageEditorProps } from '../../components/ProductPage'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { getProductById, toggleProductPublishState } from '../../modules/product/actions'
import { initEditProduct, updateEditProductField, saveAndRedirect } from '../../modules/editProduct/actions'

import { setImageToUpload } from '../../modules/createProduct/actions'
import { showModal } from '../../modules/modals/actions'
import {
    selectFetchingProduct,
    selectProduct,
    selectProductError,
    selectStreams,
    selectFetchingStreams,
    selectStreamsError,
} from '../../modules/product/selectors'

export type OwnProps = {
    match: Match,
}

export type StateProps = ProductPageEditorProps & {
    productError: ?ErrorInUi,
    streamsError: ?ErrorInUi,
    fetchingProduct: boolean
}

export type DispatchProps = {
    getProductById: (ProductId) => void,
    toggleProductPublishStateProp: () => void,
    onSaveExitProp: () => void,
    setImageToUploadProp: (File) => void,
    openPriceDialog: () => void,
    onEditProp: (field: string, value: any) => void,
    initEditProductProp: () => void,
}

type Props = OwnProps & StateProps & DispatchProps

class EditProductPage extends Component<Props> {
    componentDidMount() {
        this.props.getProductById(this.props.match.params.id)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.product) {
            this.props.initEditProductProp()
        }
    }

    render() {
        const {
            product,
            streams,
            fetchingProduct,
            fetchingStreams,
            toggleProductPublishStateProp,
            onSaveExitProp,
            setImageToUploadProp,
            openPriceDialog,
            onEditProp,
        } = this.props

        return !!product && (
            <ProductPageEditorComponent
                product={product}
                streams={streams}
                fetchingStreams={fetchingProduct || fetchingStreams}
                toggleProductPublishState={toggleProductPublishStateProp}
                onSaveExit={onSaveExitProp}
                setImageToUpload={setImageToUploadProp}
                openPriceDialog={openPriceDialog}
                isUserOwner
                onEdit={onEditProp}
            />
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
    streams: selectStreams(state),
    fetchingProduct: selectFetchingProduct(state),
    productError: selectProductError(state),
    fetchingStreams: selectFetchingStreams(state),
    streamsError: selectStreamsError(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProductById: (id: ProductId) => dispatch(getProductById(id)),
    toggleProductPublishStateProp: () => dispatch(toggleProductPublishState()),
    onSaveExitProp: () => dispatch(saveAndRedirect()),
    setImageToUploadProp: (image: File) => dispatch(setImageToUpload(image)),
    openPriceDialog: () => dispatch(showModal('SET_PRICE')),
    onEditProp: (field: string, value: any) => dispatch(updateEditProductField(field, value)),
    initEditProductProp: () => dispatch(initEditProduct()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProductPage)
