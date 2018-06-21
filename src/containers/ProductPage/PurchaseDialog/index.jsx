// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { selectStep, selectProduct, selectPurchaseData } from '../../../modules/purchaseDialog/selectors'
import { setAccessPeriod, setAllowance, initPurchase, approvePurchase } from '../../../modules/purchaseDialog/actions'
import { purchaseFlowSteps } from '../../../utils/constants'
import { getAllowance, resetAllowance as resetAllowanceAction } from '../../../modules/allowance/actions'
import {
    selectAllowanceError,
    selectGettingAllowance,
    selectTransactionState as selectAllowanceTransactionState,
} from '../../../modules/allowance/selectors'
import { selectTransactionState as selectPurchaseTransactionState } from '../../../modules/purchase/selectors'
import ChooseAccessPeriodDialog from '../../../containers/ChooseAccessPeriodDialog'
import SetAllowanceDialog from '../../../components/Modal/SetAllowanceDialog'
import PurchaseSummaryDialog from '../../../components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '../../../components/Modal/CompletePurchaseDialog'
import ErrorDialog from '../../../components/Modal/ErrorDialog'
import { formatPath } from '../../../utils/url'
import links from '../../../links'
import { selectAccountId } from '../../../modules/web3/selectors'
import { selectWeb3Accounts } from '../../../modules/user/selectors'
import type { StoreState, PurchaseStep } from '../../../flowtype/store-state'
import type { Product, ProductId } from '../../../flowtype/product-types'
import type { TimeUnit, Purchase, TransactionState, NumberString, ErrorInUi } from '../../../flowtype/common-types'
import type { Address, Web3AccountList } from '../../../flowtype/web3-types'
import withContractProduct from '../../WithContractProduct'
import withI18n from '../../WithI18n'

type StateProps = {
    step: ?PurchaseStep,
    product: ?Product,
    purchase: ?Purchase,
    gettingAllowance: boolean,
    settingAllowanceState: ?TransactionState,
    purchaseState: ?TransactionState,
    allowanceError: ?ErrorInUi,
    accountId: ?Address,
    web3Accounts: ?Web3AccountList
}

type DispatchProps = {
    getAllowance: () => void,
    initPurchase: (ProductId) => void,
    onCancel: () => void,
    onSetAccessPeriod: (time: NumberString, timeUnit: TimeUnit) => void,
    onSetAllowance: () => void,
    onApprovePurchase: () => void,
    resetAllowance: () => void,
}

export type OwnProps = {
    productId: ProductId,
    translate: (key: string, options: any) => string,
}

type Props = StateProps & DispatchProps & OwnProps

class PurchaseDialog extends React.Component<Props> {
    componentDidMount() {
        const { productId } = this.props

        this.props.initPurchase(productId)
        this.props.resetAllowance()
        this.props.getAllowance()
    }

    render() {
        const {
            gettingAllowance,
            settingAllowanceState,
            step,
            product,
            purchaseState,
            purchase,
            onSetAccessPeriod,
            onSetAllowance,
            onApprovePurchase,
            onCancel,
            allowanceError,
            accountId,
            web3Accounts,
            translate,
        } = this.props

        if (product) {
            if (step === purchaseFlowSteps.ACCESS_PERIOD) {
                return (
                    <ChooseAccessPeriodDialog
                        product={product}
                        onCancel={onCancel}
                        onNext={(time: NumberString, timeUnit: TimeUnit) => (
                            onSetAccessPeriod(time, timeUnit)
                        )}
                    />
                )
            }

            if (purchase) {
                if (step === purchaseFlowSteps.ALLOWANCE) {
                    if (allowanceError) {
                        return (
                            <ErrorDialog
                                title={translate('purchaseDialog.errorTitle')}
                                message={allowanceError.message}
                                onDismiss={onCancel}
                            />
                        )
                    }
                    return (
                        <SetAllowanceDialog
                            onCancel={onCancel}
                            onSet={onSetAllowance}
                            gettingAllowance={gettingAllowance}
                            settingAllowanceState={settingAllowanceState}
                        />
                    )
                }

                if (step === purchaseFlowSteps.SUMMARY) {
                    return (
                        <PurchaseSummaryDialog
                            purchaseState={purchaseState}
                            product={product}
                            purchase={purchase}
                            onCancel={onCancel}
                            onPay={() => onApprovePurchase()}
                        />
                    )
                }

                if (step === purchaseFlowSteps.COMPLETE) {
                    const accountLinked = web3Accounts && web3Accounts.map((account) => account.address).includes(accountId)

                    return (
                        <CompletePurchaseDialog
                            onCancel={onCancel}
                            purchaseState={purchaseState}
                            accountLinked={!!accountLinked}
                        />
                    )
                }
            }
        }

        return null
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    step: selectStep(state),
    product: selectProduct(state),
    purchase: selectPurchaseData(state),
    gettingAllowance: selectGettingAllowance(state),
    settingAllowanceState: selectAllowanceTransactionState(state),
    purchaseState: selectPurchaseTransactionState(state),
    allowanceError: selectAllowanceError(state),
    accountId: selectAccountId(state),
    web3Accounts: selectWeb3Accounts(state),
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getAllowance: () => dispatch(getAllowance()),
    initPurchase: (id: ProductId) => dispatch(initPurchase(id)),
    onCancel: () => {
        dispatch(push(formatPath(links.products, ownProps.productId)))
    },
    onSetAccessPeriod: (time: NumberString, timeUnit: TimeUnit) => dispatch(setAccessPeriod(time, timeUnit)),
    onSetAllowance: () => dispatch(setAllowance()),
    onApprovePurchase: () => dispatch(approvePurchase()),
    resetAllowance: () => dispatch(resetAllowanceAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(withI18n(PurchaseDialog)))
