// @flow

import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'connected-react-router'

import ReadyToPublishDialog from '$mp/components/Modal/ReadyToPublishDialog'
import CompleteContractProductPublishDialog from '$mp/components/deprecated/CompleteContractProductPublishDialog'
import CompletePublishDialog from '$mp/components/deprecated/CompletePublishDialog'
import NoStreamsWarningDialog from '$mp/components/deprecated/NoStreamsWarningDialog'
import { formatPath } from '$shared/utils/url'
import { publishFlowSteps } from '$mp/utils/constants'
import { transactionStates } from '$shared/utils/constants'
import { selectStep } from '$mp/modules/deprecated/publishDialog/selectors'
import { publishOrCreateProduct } from '$mp/modules/deprecated/publishDialog/actions'
import { selectFetchingContractProduct } from '$mp/modules/contractProduct/selectors'
import {
    selectFreeProductState as selectPublishFreeProductState,
    selectContractTransaction as selectPublishContractTransaction,
    selectContractError as selectPublishContractError,
} from '$mp/modules/publish/selectors'
import { selectCreateContractProductTransaction, selectCreateContractProductError } from '$mp/modules/createContractProduct/selectors'
import links from '$mp/../links'
import { selectFetchingProduct } from '$mp/modules/product/selectors'
import type { StoreState, PublishStep } from '$mp/flowtype/store-state'
import type { Product, ProductId } from '$mp/flowtype/product-types'
import type { TransactionEntity } from '$shared/flowtype/web3-types'
import type { ErrorInUi, TransactionState } from '$shared/flowtype/common-types'

type StateProps = {
    step: PublishStep,
    publishContractProductTransaction: ?TransactionEntity,
    publishContractProductError: ?ErrorInUi,
    createContractProductTransaction: ?TransactionEntity,
    createContractProductError: ?ErrorInUi,
    publishFreeProductState: ?TransactionState,
    fetchingContractProduct: boolean,
    fetchingProduct: boolean,
}

type DispatchProps = {
    onPublish: () => void,
    onCancel: () => void,
    redirectToEditProduct: () => void,
}

export type OwnProps = {
    productId: ProductId,
    product: Product,
}

type Props = StateProps & DispatchProps & OwnProps

export const PublishDialog = ({
    step,
    publishContractProductTransaction,
    publishContractProductError,
    createContractProductTransaction,
    createContractProductError,
    publishFreeProductState,
    fetchingContractProduct,
    onPublish,
    onCancel,
    fetchingProduct,
    product,
    redirectToEditProduct,
}: Props) => {
    switch (step) {
        case publishFlowSteps.CONFIRM: {
            const fetching = !!(fetchingProduct || fetchingContractProduct)

            if (!fetching && product && product.streams.length <= 0) {
                return (
                    <NoStreamsWarningDialog
                        onClose={onCancel}
                        onContinue={redirectToEditProduct}
                    />
                )
            }

            return (
                <ReadyToPublishDialog
                    waiting={fetching}
                    onContinue={onPublish}
                    onCancel={onCancel}
                />
            )
        }

        case publishFlowSteps.CREATE_CONTRACT_PRODUCT: {
            let transactionState = transactionStates.STARTED

            if (createContractProductError) {
                transactionState = transactionStates.FAILED
            } else if (createContractProductTransaction) {
                transactionState = createContractProductTransaction.state
            }

            return (
                <CompleteContractProductPublishDialog
                    publishState={transactionState}
                    onCancel={onCancel}
                />
            )
        }

        case publishFlowSteps.PUBLISH_CONTRACT_PRODUCT: {
            let transactionState = transactionStates.STARTED

            if (publishContractProductError) {
                transactionState = transactionStates.FAILED
            } else if (publishContractProductTransaction) {
                transactionState = publishContractProductTransaction.state
            }

            return (
                <CompleteContractProductPublishDialog
                    publishState={transactionState}
                    onCancel={onCancel}
                />
            )
        }

        case publishFlowSteps.PUBLISH_FREE_PRODUCT:
            return (
                <CompletePublishDialog
                    publishState={publishFreeProductState}
                    onCancel={onCancel}
                />
            )

        default:
            return null
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    step: selectStep(state),
    publishContractProductTransaction: selectPublishContractTransaction(state),
    publishContractProductError: selectPublishContractError(state),
    createContractProductTransaction: selectCreateContractProductTransaction(state),
    createContractProductError: selectCreateContractProductError(state),
    publishFreeProductState: selectPublishFreeProductState(state),
    fetchingContractProduct: selectFetchingContractProduct(state),
    fetchingProduct: selectFetchingProduct(state),
})

export const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    onPublish: () => dispatch(publishOrCreateProduct()),
    onCancel: () => {
        dispatch(replace(formatPath(links.marketplace.products, ownProps.productId)))
    },
    redirectToEditProduct: () => dispatch(replace(formatPath(links.marketplace.products, ownProps.productId, 'edit'))),
})

export default connect(mapStateToProps, mapDispatchToProps)(PublishDialog)
