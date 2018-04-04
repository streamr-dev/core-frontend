// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import CreateProductPageComponent from '../../components/CreateProductPage'
import { selectAllCategories, selectFetchingCategories } from '../../modules/categories/selectors'
import { getCategories } from '../../modules/categories/actions'
import { selectStreams, selectFetchingStreams } from '../../modules/streams/selectors'
import { getStreams } from '../../modules/streams/actions'
import { updateProductField, initProduct, resetProduct } from '../../modules/createProduct/actions'
import { selectProduct } from '../../modules/createProduct/selectors'

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
}

type DispatchProps = {
    initProduct: () => void,
    getCategories: () => void,
    getStreams: () => void,
    onChange: (field: string, value: any) => void,
    onCancel: () => void,
}

type Props = StateProps & DispatchProps

class CreateProductPage extends Component<Props> {
    componentDidMount() {
        const {
            product,
            categories,
            fetchingCategories,
            streams,
            fetchingStreams,
            initProduct: initProductProp,
            getCategories: getCategoriesProp,
            getStreams: getStreamsProp,
        } = this.props

        if (!product) {
            initProductProp()
        }

        if ((!categories || categories.length === 0) && !fetchingCategories) {
            getCategoriesProp()
        }

        if ((!streams || streams.length === 0) && !fetchingStreams) {
            getStreamsProp()
        }
    }

    render() {
        const {
            product,
            categories,
            streams,
            onChange,
            onCancel,
        } = this.props

        return !!product && !!categories && (
            <CreateProductPageComponent
                categories={categories}
                product={product}
                streams={streams}
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
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    initProduct: () => dispatch(initProduct()),
    getCategories: () => dispatch(getCategories()),
    getStreams: () => dispatch(getStreams()),
    onChange: (field: string, value: any) => dispatch(updateProductField(field, value)),
    onCancel: () => {
        dispatch(resetProduct())
        dispatch(push(links.myProducts))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductPage)
