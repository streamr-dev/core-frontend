// @flow

import React from 'react'
import { connect } from 'react-redux'

import withWeb3 from '$shared/utils/withWeb3'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { StoreState } from '$shared/flowtype/store-state'
import { selectCreatingIdentity, selectCreatingIdentityError } from '$shared/modules/integrationKey/selectors'

import IdentityChallengeSuccessDialog from '../IdentityChallengeSuccessDialog'
import Web3ErrorDialog from '$shared/components/Web3ErrorDialog'

type OwnProps = {
    onClose: () => void,
}

type StateProps = {
    creatingIdentity: boolean,
    error: ?ErrorInUi,
}

type Props = OwnProps & StateProps

class AddIdentityDialog extends React.Component<Props> {
    render() {
        const { onClose, creatingIdentity, error } = this.props

        if (creatingIdentity || !error) {
            return (
                <IdentityChallengeSuccessDialog
                    onClose={onClose}
                    waiting={creatingIdentity}
                />
            )
        }

        return (
            <Web3ErrorDialog
                error={error}
                onClose={onClose}
            />
        )
    }
}

const mapStateToProps = (state: StoreState) => ({
    creatingIdentity: selectCreatingIdentity(state),
    error: selectCreatingIdentityError(state),
})

export default withWeb3(connect(mapStateToProps)(AddIdentityDialog))
