// @flow

import { connect } from 'react-redux'
import ProductPage from '../../components/ProductPage'
import type { OwnProps, StateProps, DispatchProps } from '../../components/ProductPage'
import type { StoreState } from '../../flowtype/store-state'
import type { Product } from '../../flowtype/product-types'

import { getProductById } from '../Products/actions'
import { selectError } from '../Products/selectors'
import { selectProductById } from './selectors'

const mapStateToProps = (state: StoreState, ownProps: OwnProps): StateProps => ({
    product: selectProductById(state, ownProps),
    error: selectError(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getProductById: (id: $ElementType<Product, 'id'>) => dispatch(getProductById(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductPage)
