// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'

import CreateProductPageComponent from '../../components/CreateProductPage'
import { selectAllCategories, selectFetchingCategories } from '../../modules/categories/selectors'
import { getCategories } from '../../modules/categories/actions'
import { selectStreams, selectFetchingStreams } from '../../modules/streams/selectors'
import { getStreams } from '../../modules/streams/actions'
import { updateProduct } from '../../modules/createProduct/actions'
import { selectProduct } from '../../modules/createProduct/selectors'

import type { CategoryList } from '../../flowtype/category-types'
import type { StreamList } from '../../flowtype/stream-types'
import type { ProductPreview } from '../../flowtype/product-types'
import type { StoreState } from '../../flowtype/store-state'

type StateProps = {
    categories: CategoryList,
    fetchingCategories: boolean,
    streams: StreamList,
    fetchingStreams: boolean,
    product: ProductPreview,
}

type DispatchProps = {
    getCategories: () => void,
    getStreams: () => void,
    onChange: (field: string, value: any) => void,
}

type Props = StateProps & DispatchProps

class CreateProductPage extends Component<Props> {
    componentDidMount() {
        const { categories, fetchingCategories, streams, fetchingStreams, getCategories, getStreams } = this.props

        if ((!categories || categories.length == 0) && !fetchingCategories) {
            getCategories()
        }

        if ((!streams || streams.length == 0) && !fetchingStreams) {
            getStreams()
        }
    }

    render() {
        return !!this.props.categories && (
            <CreateProductPageComponent {...this.props} />
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
    getCategories: () => dispatch(getCategories()),
    getStreams: () => dispatch(getStreams()),
    onChange: (field: string, value: any) => dispatch(updateProduct(field, value)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductPage)
