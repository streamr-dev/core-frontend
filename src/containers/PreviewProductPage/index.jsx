// @flow

import { connect } from 'react-redux'

import PreviewProductPage from '../../components/PreviewProductPage'
import { selectProduct } from '../../modules/createProduct/selectors'

import type { StoreState } from '../../flowtype/store-state'
import type { Product } from '../../flowtype/product-types'

type StateProps = {
    product: ?Product,
}

type DispatchProps = {
    onSave: () => void,
    onPublish: () => void,
}

const mapStateToProps = (state: StoreState): StateProps => ({
    product: selectProduct(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    onSave: () => alert('asd'),
    onPublish: () => alert('asd'),
})

export default connect(mapStateToProps, mapDispatchToProps)(PreviewProductPage)
