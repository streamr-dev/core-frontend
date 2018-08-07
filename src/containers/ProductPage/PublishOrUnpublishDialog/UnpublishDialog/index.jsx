// @flow

import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import type { StoreState, PublishStep } from '../../../../flowtype/store-state'
import type { TransactionState } from '../../../../flowtype/common-types'
import type { Product, ProductId } from '../../../../flowtype/product-types'
import ReadyToUnpublishDialog from '../../../../components/Modal/ReadyToUnpublishDialog'
import CompleteUnpublishDialog from '../../../../components/Modal/CompleteUnpublishDialog'
import { formatPath } from '../../../../utils/url'
import { publishFlowSteps } from '../../../../utils/constants'
import { selectStep } from '../../../../modules/publishDialog/selectors'
import { unpublishProduct } from '../../../../modules/publishDialog/actions'
import { selectTransactionState as selectPublishTransactionState } from '../../../../modules/publish/selectors'
import links from '../../../../links'
import withContractProduct from '../../../WithContractProduct'

type StateProps = {
    step: PublishStep,
    transactionState: ?TransactionState,
}

type DispatchProps = {
    onUnpublish: () => void,
    onCancel: () => void,
}

export type OwnProps = {
    productId: ProductId,
    product: Product,
    redirectOnCancel: boolean,
}

type Props = StateProps & DispatchProps & OwnProps

export const UnpublishDialog = ({ step, transactionState, onUnpublish, onCancel }: Props) => {
    switch (step) {
        case publishFlowSteps.CONFIRM:
            return (
                <ReadyToUnpublishDialog onUnpublish={onUnpublish} onCancel={onCancel} />
            )

        case publishFlowSteps.PUBLISH:
            return (
                <CompleteUnpublishDialog onCancel={onCancel} publishState={transactionState} />
            )

        default:
            return null
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    step: selectStep(state),
    transactionState: selectPublishTransactionState(state),
})

export const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    onUnpublish: () => dispatch(unpublishProduct()),
    onCancel: () => {
        if (ownProps.redirectOnCancel === true) {
            dispatch(replace(formatPath(links.products, ownProps.productId)))
        }
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(UnpublishDialog))
