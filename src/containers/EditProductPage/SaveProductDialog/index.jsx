// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { arePricesEqual } from '../../../utils/price'
import { selectProduct } from '../../../modules/product/selectors'
import { selectEnabled } from '../../../modules/web3/selectors'
import { hideModal } from '../../../modules/modals/actions'
import type { StoreState } from '../../../flowtype/store-state'
import type { Product, EditProduct } from '../../../flowtype/product-types'
import UnlockWalletDialog from '../../../components/Modal/UnlockWalletDialog'
import SaveProductDialogComponent from '../../../components/Modal/SaveProductDialog'
import { formatPath } from '../../../utils/url'
import links from '../../../links'
// import { productStates } from '../../utils/constants'
import { selectEditProduct } from '../../../modules/editProduct/selectors'

type StateProps = {
    walletEnabled: boolean,
    product: ?Product,
    editProduct: ?EditProduct, // eslint-disable-line react/no-unused-prop-types
}

type DispatchProps = {
    onCancel: () => void,
    updatePrice: () => void, // eslint-disable-line react/no-unused-prop-types
}

type OwnProps = {
    // onContinue: () => void,
}

type Props = StateProps & DispatchProps & OwnProps

class SaveProductDialog extends React.Component<Props> {
    componentDidMount() {
        this.startTransaction(this.props)
    }

    componentWillReceiveProps(nextProps: Props) {
        this.startTransaction(nextProps)
    }

    startTransaction = (props: Props) => {
        const { walletEnabled, product, editProduct, updatePrice } = props

        if (walletEnabled && product && editProduct) {
            if (/* product.state === productStates.DEPLOYED && */ !arePricesEqual(product.pricePerSecond, editProduct.pricePerSecond)) {
                updatePrice()
            }
        }
    }

    render() {
        const { walletEnabled, product, onCancel } = this.props

        if (product) {
            if (!walletEnabled) {
                return <UnlockWalletDialog onCancel={onCancel} />
            }

            return <SaveProductDialogComponent onClose={onCancel} />
        }

        return null
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    walletEnabled: selectEnabled(state),
    product: selectProduct(state),
    editProduct: selectEditProduct(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    onCancel: () => {
        dispatch(push(formatPath(links.products, 1)))
        dispatch(hideModal())
    },
    updatePrice: () => alert('moi'),
})

export default connect(mapStateToProps, mapDispatchToProps)(SaveProductDialog)
