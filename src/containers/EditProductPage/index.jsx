// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'

import ProductPageEditorComponent from '../../components/ProductPageEditor'
import type { Props as ProductPageEditorProps } from '../../components/ProductPage'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { getProductById, toggleProductPublishState, onSaveExit } from '../../modules/product/actions'
import { updateProductField, initUpdateProduct } from '../../modules/updateProduct/actions'

import { setImageToUpload } from '../../modules/createProduct/actions'
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
}

export type DispatchProps = {
    getProductById: (ProductId) => void,
    toggleProductPublishState: () => void,
    onSaveExit: () => void,
    setImageToUpload: (File) => void,
    onEdit: (field: string, value: any) => void,
    onLoad: () => void,
}

type Props = OwnProps & StateProps & DispatchProps

class EditProductPage extends Component<Props> {
    componentDidMount() {
        this.props.getProductById(this.props.match.params.id)
        this.props.onLoad()
    }

    render() {
        const { product, streams, fetchingProduct, fetchingStreams, toggleProductPublishState, onSaveExit, setImageToUpload, onEdit } = this.props

        return !!product && (
            <ProductPageEditorComponent
                product={product}
                streams={streams}
                fetchingStreams={fetchingProduct || fetchingStreams}
                toggleProductPublishState={toggleProductPublishState}
                onSaveExit={onSaveExit}
                isUserOwner={true}
                setImageToUpload={setImageToUpload}
                onEdit={onEdit}
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
    toggleProductPublishState: () => dispatch(toggleProductPublishState()),
    onSaveExit: () => dispatch(onSaveExit()),
    setImageToUpload: (image: File) => dispatch(setImageToUpload(image)),
    onEdit: (field: string, value: any) => dispatch(updateProductField(field, value)),
    onLoad: () => dispatch(initUpdateProduct()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditProductPage)
