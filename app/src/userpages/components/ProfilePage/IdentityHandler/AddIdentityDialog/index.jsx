// @flow

import React from 'react'

import withWeb3 from '$shared/utils/withWeb3'

import IdentityNameDialog from '../IdentityNameDialog'

type Props = {
    onClose: () => void,
    onSave: (string) => void,
}

const identityPhases = {
    NAME: 'name',
    CHALLENGE: 'challenge',
    COMPLETE: 'complete',
}

type State = {
    phase: $Values<typeof identityPhases>,
    name: string,
}

class AddIdentityDialog extends React.Component<Props, State> {
    state = {
        phase: identityPhases.NAME,
        name: '',
    }

    onSetName = (name: string) => {
        this.setState({
            name,
            phase: identityPhases.CHALLENGE,
        })
        console.log(this.state.name)
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

            default:
                return null
        }
    }
}

export default withWeb3(AddIdentityDialog)
