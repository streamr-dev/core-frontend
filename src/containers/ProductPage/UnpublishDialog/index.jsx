// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import type { Match } from 'react-router-dom'
import type { StoreState, PublishStep } from '../../../flowtype/store-state'
import type { TransactionState } from '../../../flowtype/common-types'
import ReadyToUnpublishDialog from '../../../components/Modal/ReadyToUnpublishDialog'
import CompleteUnpublishDialog from '../../../components/Modal/CompleteUnpublishDialog'
import { formatPath } from '../../../utils/url'
import { publishFlowSteps } from '../../../utils/constants'
import { selectStep } from '../../../modules/publishDialog/selectors'
import { unpublishProduct } from '../../../modules/publishDialog/actions'
import { selectTransactionState as selectPublishTransactionState } from '../../../modules/publish/selectors'
import { hideModal } from '../../../modules/modals/actions'
import links from '../../../links'

type StateProps = {
    step: PublishStep,
    transactionState: ?TransactionState,
}

type DispatchProps = {
    onUnpublish: () => void,
    onCancel: () => void,
}

export type OwnProps = {
    match: Match,
}

type Props = StateProps & DispatchProps & OwnProps

const UnpublishDialog = ({ step, transactionState, onUnpublish, onCancel }: Props) => {
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

const mapStateToProps = (state: StoreState): StateProps => ({
    step: selectStep(state),
    transactionState: selectPublishTransactionState(state),
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    onUnpublish: () => dispatch(unpublishProduct()),
    onCancel: () => {
        dispatch(push(formatPath(links.products, ownProps.match.params.id)))
        dispatch(hideModal())
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(UnpublishDialog)
