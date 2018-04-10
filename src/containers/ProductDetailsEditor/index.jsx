// @flow

import { connect } from 'react-redux'
import { showModal } from '../../modules/modals/actions'
import ProductDetailsEditor, { type StateProps, type DispatchProps } from '../../components/ProductPageEditor/ProductDetailsEditor'
import type { Address } from '../../flowtype/web3-types'
import type { PropertySetter, Currency } from '../../flowtype/common-types'
import type { StoreState } from '../../flowtype/store-state'
import { selectAccountId } from '../../modules/web3/selectors'
import { selectEditProduct } from '../../modules/editProduct/selectors'

const mapStateToProps = (state: StoreState): StateProps => ({
    ownerAddress: selectAccountId(state),
    draft: selectEditProduct(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    openPriceDialog: (
        pricePerSecond: ?number,
        currency: Currency,
        beneficiaryAddress: ?Address,
        ownerAddress: ?Address,
        setProperty: PropertySetter<string | number>,
    ) => dispatch(showModal('SET_PRICE', {
        pricePerSecond,
        currency,
        beneficiaryAddress,
        ownerAddress,
        setProperty,
    })),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetailsEditor)
