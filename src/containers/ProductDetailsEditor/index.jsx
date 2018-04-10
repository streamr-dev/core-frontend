// @flow

import { connect } from 'react-redux'
import { showModal } from '../../modules/modals/actions'
import ProductDetailsEditor, { type StateProps, type DispatchProps } from '../../components/ProductPageEditor/ProductDetailsEditor'
import type { Product } from '../../flowtype/product-types'
import type { Address } from '../../flowtype/web3-types'
import type { PropertySetter } from '../../flowtype/common-types'
import type { StoreState } from '../../flowtype/store-state'
import { selectAccountId } from '../../modules/web3/selectors'

const mapStateToProps = (state: StoreState): StateProps => ({
    ownerAddress: selectAccountId(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    openPriceDialog: (product: Product, ownerAddress: ?Address, setProperty: PropertySetter<string | number>) => dispatch(showModal('SET_PRICE', {
        product,
        ownerAddress,
        setProperty,
    })),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailsEditor)
