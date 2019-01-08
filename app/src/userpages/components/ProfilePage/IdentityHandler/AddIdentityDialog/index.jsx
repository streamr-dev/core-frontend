// @flow

import React from 'react'
import { connect } from 'react-redux'

import withWeb3 from '$shared/utils/withWeb3'
import { createIdentity } from '$shared/modules/integrationKey/actions'
import type { ApiResult } from '$shared/flowtype/common-types'
import type { IntegrationKey } from '$shared/flowtype/integration-key-types'

import IdentityNameDialog from '../IdentityNameDialog'
import IdentityChallengeDialog from '../IdentityChallengeDialog'

type OwnProps = {
    onClose: () => void,
}

type DispatchProps = {
    createIdentity: (name: string) => ApiResult<IntegrationKey>,
}

type Props = OwnProps & DispatchProps

const identityPhases = {
    NAME: 'name',
    CHALLENGE: 'challenge',
    COMPLETE: 'complete',
}

type State = {
    phase: $Values<typeof identityPhases>,
}

class AddIdentityDialog extends React.Component<Props, State> {
    state = {
        phase: identityPhases.NAME,
    }

    onSetName = (name: string) => {
        this.setState({
            phase: identityPhases.CHALLENGE,
        })

        try {
            this.props.createIdentity(name)
        } catch (e) {
            console.warn(e)
        }
    }

    render() {
        const { onClose } = this.props

        switch (this.state.phase) {
            case identityPhases.NAME:
                return (
                    <IdentityNameDialog
                        onClose={onClose}
                        onSave={this.onSetName}
                    />
                )

            case identityPhases.CHALLENGE:
                return (
                    <IdentityChallengeDialog
                        onClose={onClose}
                    />
                )
            default:
                return null
        }
    }
}

const mapDispatchToProps = (dispatch: Function) => ({
    createIdentity: (name: string) => dispatch(createIdentity(name)),
})

export default withWeb3(connect(null, mapDispatchToProps)(AddIdentityDialog))
