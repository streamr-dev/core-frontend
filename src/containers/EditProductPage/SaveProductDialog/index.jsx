// @flow

import React from 'react'
import { connect } from 'react-redux'
// import { push } from 'react-router-redux'

import { arePricesEqual } from '../../../utils/price'
import { selectProduct } from '../../../modules/product/selectors'
import { selectEnabled } from '../../../modules/web3/selectors'
// import { hideModal } from '../../../modules/modals/actions'
import type { StoreState } from '../../../flowtype/store-state'
import type { Product, ProductId, EditProduct, SmartContractProduct } from '../../../flowtype/product-types'
import type { TransactionState, ErrorInUi } from '../../../flowtype/common-types'
import UnlockWalletDialog from '../../../components/Modal/UnlockWalletDialog'
import SaveProductDialogComponent from '../../../components/Modal/SaveProductDialog'
import ErrorDialog from '../../../components/Modal/ErrorDialog'
// import ApproveTransactionDialog from '../../../components/Modal/ApproveTransactionDialog'
// import { formatPath } from '../../../utils/url'
// import links from '../../../links'
// import { productStates } from '../../utils/constants'
import { selectEditProduct, selectTransactionState } from '../../../modules/editProduct/selectors'
import { updateContractProduct as updateContractProductAction } from '../../../modules/updateContractProduct/actions'
import { selectFetchingContractProduct, selectContractProduct, selectContractProductError } from '../../../modules/contractProduct/selectors'
import { getProductFromContract } from '../../../modules/contractProduct/actions'

type StateProps = {
    walletEnabled: boolean,
    product: ?Product,
    editProduct: ?EditProduct, // eslint-disable-line react/no-unused-prop-types
    contractProduct: ?SmartContractProduct, // eslint-disable-line react/no-unused-prop-types
    fetchingContractProduct: boolean,
    contractProductError: ?ErrorInUi,
    transactionState: ?TransactionState,
}

type DispatchProps = {
    getContractProduct: (ProductId) => void,
    updateContractProduct: (ProductId, SmartContractProduct) => void, // eslint-disable-line react/no-unused-prop-types
}

type OwnProps = {
    // onContinue: () => void,
    onCancel: () => void,
}

type Props = StateProps & DispatchProps & OwnProps

class SaveProductDialog extends React.Component<Props> {
    componentDidMount() {
        const { product } = this.props

        if (product && product.id) {
            this.props.getContractProduct(product.id)
        }

        this.startTransaction(this.props)
    }

    componentWillReceiveProps(nextProps: Props) {
        this.startTransaction(nextProps)
    }

    startTransaction = (props: Props) => {
        const {
            walletEnabled,
            product,
            editProduct,
            updateContractProduct,
            contractProduct,
        } = props

        if (walletEnabled && product && editProduct && contractProduct) {
            if (/* product.state === productStates.DEPLOYED && */ !arePricesEqual(product.pricePerSecond, editProduct.pricePerSecond)) {
                updateContractProduct(product.id || '', {
                    pricePerSecond: editProduct.pricePerSecond,
                    beneficiaryAddress: editProduct.beneficiaryAddress,
                    ...contractProduct,
                })
            }
        }
    }

    render() {
        const {
            walletEnabled,
            product,
            fetchingContractProduct,
            contractProduct,
            contractProductError,
            onCancel,
            transactionState,
        } = this.props

        // Check that product exists in contract
        if (!contractProduct || (!fetchingContractProduct && contractProductError)) {
            return (
                <ErrorDialog
                    title={(product && product.name) || ''}
                    message={!!contractProductError && contractProductError.message}
                    waiting={fetchingContractProduct}
                    onDismiss={onCancel}
                />)
        }

        if (product) {
            if (!walletEnabled) {
                return <UnlockWalletDialog onCancel={onCancel} />
            }

            return <SaveProductDialogComponent transactionState={transactionState} onClose={onCancel} />
        }

        return null
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    walletEnabled: selectEnabled(state),
    product: selectProduct(state),
    editProduct: selectEditProduct(state),
    contractProduct: selectContractProduct(state),
    fetchingContractProduct: selectFetchingContractProduct(state),
    contractProductError: selectContractProductError(state),
    transactionState: selectTransactionState(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getContractProduct: (id: ProductId) => dispatch(getProductFromContract(id)),
    updateContractProduct: (productId: ProductId, product: SmartContractProduct) => dispatch(updateContractProductAction(productId, product)),
})

export default connect(mapStateToProps, mapDispatchToProps)(SaveProductDialog)
