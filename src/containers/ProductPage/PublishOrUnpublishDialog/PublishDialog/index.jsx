// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import ReadyToPublishDialog from '../../../../components/Modal/ReadyToPublishDialog'
import CompletePublishDialog from '../../../../components/Modal/CompletePublishDialog'
import { formatPath } from '../../../../utils/url'
import { publishFlowSteps } from '../../../../utils/constants'
import { selectStep } from '../../../../modules/publishDialog/selectors'
import { publishOrCreateProduct } from '../../../../modules/publishDialog/actions'
import { selectFetchingContractProduct } from '../../../../modules/contractProduct/selectors'
import { selectTransactionState as selectPublishTransactionState } from '../../../../modules/publish/selectors'
import { selectTransactionState as selectCreateProductTransactionState } from '../../../../modules/createContractProduct/selectors'
import links from '../../../../links'
import type { StoreState, PublishStep } from '../../../../flowtype/store-state'
import type { TransactionState } from '../../../../flowtype/common-types'
import type { Product, ProductId } from '../../../../flowtype/product-types'

type StateProps = {
    step: PublishStep,
    createProductTransactionState: ?TransactionState,
    publishTransactionState: ?TransactionState,
    fetchingContractProduct: boolean,
}

type DispatchProps = {
    onPublish: () => void,
    onCancel: () => void,
}

export type OwnProps = {
    productId: ProductId,
    redirectOnCancel: boolean,
    product: Product,
}

type Props = StateProps & DispatchProps & OwnProps

export const PublishDialog = ({
    step,
    createProductTransactionState,
    publishTransactionState,
    fetchingContractProduct,
    onPublish,
    onCancel,
}: Props) => {
    switch (step) {
        case publishFlowSteps.CONFIRM:
            return (
                <ReadyToPublishDialog
                    waiting={fetchingContractProduct}
                    onPublish={onPublish}
                    onCancel={onCancel}
                />
            )

        case publishFlowSteps.CREATE_PRODUCT:
            return (
                <CompletePublishDialog
                    publishState={createProductTransactionState}
                    onCancel={onCancel}
                />
            )

        case publishFlowSteps.PUBLISH:
            return (
                <CompletePublishDialog
                    publishState={publishTransactionState}
                    onCancel={onCancel}
                />
            )

        default:
            return null
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    step: selectStep(state),
    createProductTransactionState: selectCreateProductTransactionState(state),
    publishTransactionState: selectPublishTransactionState(state),
    fetchingContractProduct: selectFetchingContractProduct(state),
})

export const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    onPublish: () => dispatch(publishOrCreateProduct()),
    onCancel: () => {
        dispatch(push(formatPath(links.products, ownProps.productId)))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(PublishDialog)
