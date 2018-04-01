// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import type { Match } from 'react-router-dom'

import ProductPageComponent from '../../components/ProductPage'
import ProductPageEditorComponent from '../../components/ProductPageEditor'
import type { Props as ProductPageProps } from '../../components/ProductPage'
import type { StoreState } from '../../flowtype/store-state'
import type { ProductId } from '../../flowtype/product-types'
import type { ErrorInUi } from '../../flowtype/common-types'

import { getProductById, toggleProductPublishState, onSaveExit } from '../../modules/product/actions'
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
    editor: boolean,
}

export type StateProps = ProductPageProps & {
    fetchingProduct?: boolean,
    productError: ?ErrorInUi,
    streamsError: ?ErrorInUi,
}

export type DispatchProps = {
    getProductById: (ProductId) => void,
    toggleProductPublishState: () => void,
    onSaveExit: () => void,
    setImageToUpload: (File) => void,
}

type Props = OwnProps & StateProps & DispatchProps

class ProductPage extends Component<Props> {
    componentDidMount() {
        this.props.getProductById(this.props.match.params.id)
    }

    render() {
        const {
            product,
            streams,
            fetchingProduct,
            fetchingStreams,
            editor,
            toggleProductPublishState: toggleProductPublishStateProp,
            onSaveExit: onSaveExitProp,
            setImageToUpload: setImageToUploadProp,
        } = this.props
        const ComponentToUse = editor ? ProductPageEditorComponent : ProductPageComponent
        return !!product && (
            <ComponentToUse
                product={product}
                streams={streams}
                fetchingStreams={fetchingProduct || fetchingStreams}
                toggleProductPublishState={toggleProductPublishStateProp}
                onSaveExit={onSaveExitProp}
                setImageToUpload={setImageToUploadProp}
                isUserOwner
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
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
