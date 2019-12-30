// @flow

import React from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import { selectStep, selectStepParams, selectProduct, selectPurchaseData } from '$mp/modules/deprecated/purchaseDialog/selectors'
import { setAccessPeriod, setAllowance, initPurchase, approvePurchase } from '$mp/modules/deprecated/purchaseDialog/actions'
import { purchaseFlowSteps } from '$mp/utils/constants'
import { getDataAllowance, resetDataAllowanceState as resetDataAllowanceStateAction } from '$mp/modules/allowance/actions'
import {
    selectGettingDataAllowance,
    selectSettingDataAllowance,
    selectResettingDataAllowance,
    selectSetDataAllowanceError,
    selectResetDataAllowanceError,
} from '$mp/modules/allowance/selectors'
import { selectPurchaseTransaction, selectPurchaseStarted } from '$mp/modules/purchase/selectors'
import SetAllowanceDialog from '$mp/components/Modal/SetAllowanceDialog'
import ReplaceAllowanceDialog from '$mp/components/Modal/ReplaceAllowanceDialog'
import PurchaseSummaryDialog from '$mp/components/deprecated/PurchaseSummaryDialog'
import CompletePurchaseDialog from '$mp/components/Modal/CompletePurchaseDialog'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'
import { selectAccountId } from '$mp/modules/web3/selectors'
import { selectEthereumIdentities } from '$shared/modules/integrationKey/selectors'
import type { PurchaseStep } from '$mp/flowtype/store-state'
import type { StoreState } from '$shared/flowtype/store-state'
import type { Product, ProductId, SmartContractProduct } from '$mp/flowtype/product-types'
import type { ErrorInUi, TimeUnit, NumberString } from '$shared/flowtype/common-types'
import type { Purchase } from '$mp/flowtype/common-types'
import type { Address, TransactionEntity } from '$shared/flowtype/web3-types'
import type { IntegrationKeyList } from '$shared/flowtype/integration-key-types'
import withContractProduct, { type Props as WithContractProductProps } from '$mp/containers/deprecated/WithContractProduct'
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
    onSetAccessPeriod: (time: NumberString, timeUnit: TimeUnit) => void,
    onSetAllowance: () => void,
    onApprovePurchase: () => void,
    resetDataAllowanceState: () => void,
    getIntegrationKeys: () => void,
}

export type OwnProps = {
    productId: ProductId,
    onCancel: () => void,
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
        this.props.resetDataAllowanceState()
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
                if (step === purchaseFlowSteps.RESET_DATA_ALLOWANCE) {
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

                if (step === purchaseFlowSteps.DATA_ALLOWANCE) {
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
                            paymentCurrency="DATA"
                        />
                    )
                }

                if (step === purchaseFlowSteps.NO_BALANCE) {
                    const requiredEthBalance = getStepParamField(stepParams, 'requiredEthBalance')
                    const currentEthBalance = getStepParamField(stepParams, 'currentEthBalance')
                    const requiredDataBalance = getStepParamField(stepParams, 'requiredDataBalance')
                    const currentDataBalance = getStepParamField(stepParams, 'currentDataBalance')

                    return ( // $FlowFixMe
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
    gettingAllowance: selectGettingDataAllowance(state),
    settingAllowance: selectSettingDataAllowance(state),
    setAllowanceError: selectSetDataAllowanceError(state),
    resettingAllowance: selectResettingDataAllowance(state),
    resetAllowanceError: selectResetDataAllowanceError(state),
    step: selectStep(state),
    stepParams: selectStepParams(state),
    ethereumIdentities: selectEthereumIdentities(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getAllowance: () => dispatch(getDataAllowance()),
    getIntegrationKeys: () => dispatch(fetchIntegrationKeys()),
    initPurchase: (id: ProductId) => dispatch(initPurchase(id)),
    onApprovePurchase: () => dispatch(approvePurchase()),
    onSetAccessPeriod: (time: NumberString, timeUnit: TimeUnit) => dispatch(setAccessPeriod(time, timeUnit)),
    onSetAllowance: () => dispatch(setAllowance()),
    resetDataAllowanceState: () => dispatch(resetDataAllowanceStateAction()),
})

export const UnwrappedPurchaseDialog = connect(mapStateToProps, mapDispatchToProps)(withContractProduct(PurchaseDialog))

export default (props: {}) => (
    <ModalPortal>
        <UnwrappedPurchaseDialog {...props} />
    </ModalPortal>
)
