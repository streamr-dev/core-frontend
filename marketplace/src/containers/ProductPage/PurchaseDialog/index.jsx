// @flow

import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import { selectStep, selectStepParams, selectProduct, selectPurchaseData } from '../../../modules/purchaseDialog/selectors'
import { setAccessPeriod, setAllowance, initPurchase, approvePurchase } from '../../../modules/purchaseDialog/actions'
import { purchaseFlowSteps } from '../../../utils/constants'
import { getAllowance, resetAllowanceState as resetAllowanceStateAction } from '../../../modules/allowance/actions'
import {
    selectGettingAllowance,
    selectSettingAllowance,
    selectResettingAllowance,
    selectSetAllowanceError,
    selectResetAllowanceError,
} from '../../../modules/allowance/selectors'
import { selectPurchaseTransaction, selectPurchaseStarted } from '../../../modules/purchase/selectors'
import SetAllowanceDialog from '../../../components/Modal/SetAllowanceDialog'
import ReplaceAllowanceDialog from '../../../components/Modal/ReplaceAllowanceDialog'
import PurchaseSummaryDialog from '../../../components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '../../../components/Modal/CompletePurchaseDialog'
import ErrorDialog from '../../../components/Modal/ErrorDialog'
import NoBalanceDialog from '../../../components/Modal/NoBalanceDialog'
import { formatPath } from '../../../utils/url'
import links from '../../../links'
import { selectAccountId } from '../../../modules/web3/selectors'
import { selectWeb3Accounts } from '../../../modules/user/selectors'
import type { StoreState, PurchaseStep } from '../../../flowtype/store-state'
import type { Product, ProductId, SmartContractProduct } from '../../../flowtype/product-types'
import type { TimeUnit, Purchase, NumberString, ErrorInUi } from '../../../flowtype/common-types'
import type { Address, Web3AccountList, TransactionEntity } from '../../../flowtype/web3-types'
import withContractProduct, { type Props as WithContractProductProps } from '../../WithContractProduct'
import withI18n from '../../WithI18n'
import { selectContractProduct } from '../../../modules/contractProduct/selectors'
import { areAddressesEqual } from '../../../utils/smartContract'
import { fetchLinkedWeb3Accounts } from '../../../modules/user/actions'
import ChooseAccessPeriodDialog from './ChooseAccessPeriodDialog'

type StateProps = {
    step: ?PurchaseStep,
    stepParams: any,
    product: ?Product,
    contractProduct: ?SmartContractProduct,
    purchase: ?Purchase,
    gettingAllowance: boolean,
    settingAllowance: boolean,
    setAllowanceError: ?ErrorInUi,
    resettingAllowance: boolean,
    resetAllowanceError: ?ErrorInUi,
    purchaseStarted: boolean,
    purchaseTransaction: ?TransactionEntity,
    accountId: ?Address,
    web3Accounts: ?Web3AccountList,
}

type DispatchProps = {
    getAllowance: () => void,
    initPurchase: (ProductId) => void,
    onCancel: () => void,
    onSetAccessPeriod: (time: NumberString, timeUnit: TimeUnit) => void,
    onSetAllowance: () => void,
    onApprovePurchase: () => void,
    resetAllowanceState: () => void,
    getWeb3Accounts: () => void,
}

export type OwnProps = {
    productId: ProductId,
    translate: (key: string, options: any) => string,
}

type Props = WithContractProductProps & StateProps & DispatchProps & OwnProps

export class PurchaseDialog extends React.Component<Props> {
    componentDidMount() {
        const { productId } = this.props

        this.props.initPurchase(productId)
        this.props.resetAllowanceState()
        this.props.getAllowance()
        this.props.getContractProduct(productId)
        this.props.getWeb3Accounts()
    }

    render() {
        const {
            accountId,
            contractProduct,
            gettingAllowance,
            onApprovePurchase,
            onCancel,
            onSetAccessPeriod,
            onSetAllowance,
            product,
            purchase,
            purchaseTransaction,
            purchaseStarted,
            settingAllowance,
            step,
            stepParams,
            translate,
            web3Accounts,
            resettingAllowance,
            setAllowanceError,
            resetAllowanceError,
        } = this.props

        if (product) {
            if (step === purchaseFlowSteps.ACCESS_PERIOD) {
                return (
                    <ChooseAccessPeriodDialog
                        contractProduct={contractProduct}
                        onCancel={onCancel}
                        onNext={onSetAccessPeriod}
                    />
                )
            }

            if (purchase) {
                if (step === purchaseFlowSteps.RESET_ALLOWANCE) {
                    if (resetAllowanceError) {
                        return (
                            <ErrorDialog
                                title={translate('purchaseDialog.errorTitle')}
                                message={resetAllowanceError.message}
                                onDismiss={onCancel}
                            />
                        )
                    }

                    return (
                        <ReplaceAllowanceDialog
                            onCancel={onCancel}
                            onSet={onSetAllowance}
                            gettingAllowance={gettingAllowance}
                            settingAllowance={resettingAllowance}
                        />
                    )
                }

                if (step === purchaseFlowSteps.ALLOWANCE) {
                    if (setAllowanceError) {
                        return (
                            <ErrorDialog
                                title={translate('purchaseDialog.errorTitle')}
                                message={setAllowanceError.message}
                                onDismiss={onCancel}
                            />
                        )
                    }

                    return (
                        <SetAllowanceDialog
                            onCancel={onCancel}
                            onSet={onSetAllowance}
                            gettingAllowance={gettingAllowance}
                            settingAllowance={settingAllowance}
                        />
                    )
                }

                if (step === purchaseFlowSteps.NO_BALANCE) {
                    const hasEthBalance = stepParams && Object.prototype.hasOwnProperty.call(stepParams, 'hasEthBalance') ?
                        stepParams.hasEthBalance : true

                    return (
                        <NoBalanceDialog
                            onCancel={onCancel}
                            hasEthBalance={hasEthBalance}
                        />
                    )
                }

                if (step === purchaseFlowSteps.SUMMARY) {
                    return (
                        <PurchaseSummaryDialog
                            purchaseStarted={purchaseStarted}
                            product={product}
                            contractProduct={contractProduct}
                            purchase={purchase}
                            onCancel={onCancel}
                            onPay={onApprovePurchase}
                        />
                    )
                }

                if (step === purchaseFlowSteps.COMPLETE) {
                    const accountLinked = !!(web3Accounts &&
                        accountId &&
                        web3Accounts.find((account) => areAddressesEqual(account.address, accountId))
                    )
                    return (
                        <CompletePurchaseDialog
                            onCancel={onCancel}
                            purchaseState={purchaseTransaction && purchaseTransaction.state}
                            accountLinked={accountLinked}
                        />
                    )
                }
            }
        }
        return null
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    accountId: selectAccountId(state),
    contractProduct: selectContractProduct(state),
    product: selectProduct(state),
    purchase: selectPurchaseData(state),
    purchaseTransaction: selectPurchaseTransaction(state),
    purchaseStarted: selectPurchaseStarted(state),
    gettingAllowance: selectGettingAllowance(state),
    settingAllowance: selectSettingAllowance(state),
    setAllowanceError: selectSetAllowanceError(state),
    resettingAllowance: selectResettingAllowance(state),
    resetAllowanceError: selectResetAllowanceError(state),
    step: selectStep(state),
    stepParams: selectStepParams(state),
    web3Accounts: selectWeb3Accounts(state),
})

export const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getAllowance: () => dispatch(getAllowance()),
    getWeb3Accounts: () => dispatch(fetchLinkedWeb3Accounts()),
    initPurchase: (id: ProductId) => dispatch(initPurchase(id)),
    onApprovePurchase: () => dispatch(approvePurchase()),
    onCancel: () => dispatch(replace(formatPath(links.products, ownProps.productId))),
    onSetAccessPeriod: (time: NumberString, timeUnit: TimeUnit) => dispatch(setAccessPeriod(time, timeUnit)),
    onSetAllowance: () => dispatch(setAllowance()),
    resetAllowanceState: () => dispatch(resetAllowanceStateAction()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(withI18n(PurchaseDialog)))
