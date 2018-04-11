// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import type { Match } from 'react-router-dom'

import CreateProductPageComponent from '../../components/CreateProductPage'
import { selectAllCategories, selectFetchingCategories } from '../../modules/categories/selectors'
import { getCategories } from '../../modules/categories/actions'
import { selectStreams, selectFetchingStreams } from '../../modules/streams/selectors'
import { getStreams } from '../../modules/streams/actions'
import { updateProductField, initProduct, resetProduct, setImageToUpload, createProductAndRedirect } from '../../modules/createProduct/actions'
import { selectProduct } from '../../modules/createProduct/selectors'
import { selectFetchingProduct } from '../../modules/product/selectors'
import { formatPath } from '../../utils/url'
import { showModal } from '../../modules/modals/actions'

import type { CategoryList } from '../../flowtype/category-types'
import type { StreamList } from '../../flowtype/stream-types'
import type { Product } from '../../flowtype/product-types'
import type { StoreState } from '../../flowtype/store-state'

import links from '../../links'

type StateProps = {
    categories: CategoryList,
    fetchingCategories: boolean,
    streams: StreamList,
    fetchingStreams: boolean,
    product: ?Product,
    fetchingProduct: boolean,
}

type DispatchProps = {
    initProduct: () => void,
    getCategories: () => void,
    getStreams: () => void,
    onChange: (field: string, value: string) => void,
    onCancel: () => void,
    onPublish: () => void,
    setImageToUploadProp?: (File) => void,
    onSaveAndExit: () => void,
    openPriceDialog: () => void,
}

export type OwnProps = {
    match: Match,
}

type Props = StateProps & DispatchProps

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

    render() {
        const {
            product,
            categories,
            streams,
            fetchingStreams,
            fetchingProduct,
            onPublish,
            onSaveAndExit,
            openPriceDialog,
            setImageToUploadProp,
            onChange,
            onCancel,
        } = this.props

        return !!product && !!categories && (
            <CreateProductPageComponent
                product={product}
                categories={categories}
                streams={streams}
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
                openPriceDialog={openPriceDialog}
                onChange={onChange}
                onCancel={onCancel}
            />
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    categories: selectAllCategories(state),
    fetchingCategories: selectFetchingCategories(state),
    streams: selectStreams(state),
    fetchingStreams: selectFetchingStreams(state),
    product: selectProduct(state),
    fetchingProduct: selectFetchingProduct(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    initProduct: () => dispatch(initProduct()),
    getCategories: () => dispatch(getCategories()),
    getStreams: () => dispatch(getStreams()),
    onChange: (field: string, value: any) => dispatch(updateProductField(field, value)),
    setImageToUploadProp: (image: File) => dispatch(setImageToUpload(image)),
    onPublish: () => dispatch(createProductAndRedirect(formatPath(links.myProducts))),
    onSaveAndExit: () => dispatch(createProductAndRedirect(formatPath(links.myProducts))),
    openPriceDialog: () => dispatch(showModal('SET_PRICE')),
    onCancel: () => {
        dispatch(resetProduct())
        dispatch(push(links.myProducts))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductPage)
