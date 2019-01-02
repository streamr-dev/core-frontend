// @flow

import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'
import { I18n } from 'react-redux-i18n'

import Modal from '$shared/components/Modal'
import { selectStep, selectStepParams, selectProduct, selectPurchaseData } from '$mp/modules/purchaseDialog/selectors'
import { setAccessPeriod, setAllowance, initPurchase, approvePurchase } from '$mp/modules/purchaseDialog/actions'
import { purchaseFlowSteps } from '$mp/utils/constants'
import { getAllowance, resetAllowanceState as resetAllowanceStateAction } from '$mp/modules/allowance/actions'
import {
    selectGettingAllowance,
    selectSettingAllowance,
    selectResettingAllowance,
    selectSetAllowanceError,
    selectResetAllowanceError,
} from '$mp/modules/allowance/selectors'
import { selectPurchaseTransaction, selectPurchaseStarted } from '$mp/modules/purchase/selectors'
import SetAllowanceDialog from '$mp/components/Modal/SetAllowanceDialog'
import ReplaceAllowanceDialog from '$mp/components/Modal/ReplaceAllowanceDialog'
import PurchaseSummaryDialog from '$mp/components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '$mp/components/Modal/CompletePurchaseDialog'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'
import { formatPath } from '$shared/utils/url'
import links from '$mp/../links'
import { selectAccountId } from '$mp/modules/web3/selectors'
import { selectEthereumIdentities } from '$shared/modules/integrationKey/selectors'
import type { PurchaseStep } from '$mp/flowtype/store-state'
import type { StoreState } from '$shared/flowtype/store-state'
import type { Product, ProductId, SmartContractProduct } from '$mp/flowtype/product-types'
import type { ErrorInUi, TimeUnit, NumberString } from '$shared/flowtype/common-types'
import type { Purchase } from '$mp/flowtype/common-types'
import type { Address, TransactionEntity } from '$shared/flowtype/web3-types'
import type { IntegrationKeyList } from '$shared/flowtype/integration-key-types'
import withContractProduct, { type Props as WithContractProductProps } from '../../WithContractProduct'
import { selectContractProduct } from '$mp/modules/contractProduct/selectors'
import { areAddressesEqual } from '$mp/utils/smartContract'
import { fetchIntegrationKeys } from '$shared/modules/integrationKey/actions'
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
    ethereumIdentities: ?IntegrationKeyList,
}

type DispatchProps = {
    getAllowance: () => void,
    initPurchase: (ProductId) => void,
    onCancel: () => void,
    onSetAccessPeriod: (time: NumberString, timeUnit: TimeUnit) => void,
    onSetAllowance: () => void,
    onApprovePurchase: () => void,
    resetAllowanceState: () => void,
    getIntegrationKeys: () => void,
}

export type OwnProps = {
    productId: ProductId,
}

type Props = WithContractProductProps & StateProps & DispatchProps & OwnProps

const getStepParamField = (stepParams: any, field: string) => {
    if (stepParams && Object.prototype.hasOwnProperty.call(stepParams, field)) {
        return stepParams[field]
    }

    throw new Error(`Invalid step parameters. Missing key '${field}'.`)
}

export class PurchaseDialog extends React.Component<Props> {
    componentDidMount() {
        const { productId } = this.props

        this.props.initPurchase(productId)
        this.props.resetAllowanceState()
        this.props.getAllowance()
        this.props.getContractProduct(productId)
        this.props.getIntegrationKeys()
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
            ethereumIdentities,
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
                                title={I18n.t('purchaseDialog.errorTitle')}
                                message={resetAllowanceError.message}
                                onClose={onCancel}
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
                                title={I18n.t('purchaseDialog.errorTitle')}
                                message={setAllowanceError.message}
                                onClose={onCancel}
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
                    const requiredEthBalance = getStepParamField(stepParams, 'requiredEthBalance')
                    const currentEthBalance = getStepParamField(stepParams, 'currentEthBalance')
                    const requiredDataBalance = getStepParamField(stepParams, 'requiredDataBalance')
                    const currentDataBalance = getStepParamField(stepParams, 'currentDataBalance')

                    return (
                        <NoBalanceDialog
                            onCancel={onCancel}
                            requiredEthBalance={requiredEthBalance}
                            currentEthBalance={currentEthBalance}
                            requiredDataBalance={requiredDataBalance}
                            currentDataBalance={currentDataBalance}
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
                    const accountLinked = !!(ethereumIdentities &&
                        accountId &&
                        ethereumIdentities.find((account) =>
                            account.json && account.json.address && areAddressesEqual(account.json.address, accountId))
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
    ethereumIdentities: selectEthereumIdentities(state),
})

export const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getAllowance: () => dispatch(getAllowance()),
    getIntegrationKeys: () => dispatch(fetchIntegrationKeys()),
    initPurchase: (id: ProductId) => dispatch(initPurchase(id)),
    onApprovePurchase: () => dispatch(approvePurchase()),
    onCancel: () => dispatch(replace(formatPath(links.products, ownProps.productId))),
    onSetAccessPeriod: (time: NumberString, timeUnit: TimeUnit) => dispatch(setAccessPeriod(time, timeUnit)),
    onSetAllowance: () => dispatch(setAllowance()),
    resetAllowanceState: () => dispatch(resetAllowanceStateAction()),
})

export const UnwrappedPurchaseDialog = connect(mapStateToProps, mapDispatchToProps)(withContractProduct(PurchaseDialog))

export default (props: {}) => (
    <Modal>
        <UnwrappedPurchaseDialog {...props} />
    </Modal>
)
