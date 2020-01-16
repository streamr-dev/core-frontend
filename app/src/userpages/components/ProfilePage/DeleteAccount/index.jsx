// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'

import profileStyles from '../profilePage.pcss'

import DeleteAccountDialog from './DeleteAccountDialog'
import { deleteUserAccount } from '$shared/modules/user/actions'
import { selectDeletingUserAccount } from '$shared/modules/user/selectors'
import type { StoreState } from '$shared/flowtype/store-state'
import Button from '$shared/components/Button'

type State = {
    modalOpen: boolean,
}

type StateProps = {
    deletingUserAccount: boolean,
}
type DispatchProps = {
    deleteAccount: () => Promise<void>,
}

type Props = StateProps & DispatchProps

class DeleteAccount extends React.Component<Props, State> {
    state = {
        modalOpen: false,
    }

    unmounted: boolean = false

    componentWillUnmount() {
        this.unmounted = true
    }

    openModal = () => {
        if (!this.unmounted) {
            this.setState({
                modalOpen: true,
            })
        }
    }

    onClose = () => {
        if (!this.unmounted) {
            this.setState({
                modalOpen: false,
            })
        }
    }

    onSave = () => this.props.deleteAccount()

    render() {
        const { modalOpen } = this.state
        const { deletingUserAccount } = this.props

        return (
            <div>
                <Translate value="userpages.profilePage.deleteAccount.description" tag="p" className={profileStyles.longText} />
                <div className={profileStyles.removeAccountButton}>
                    <Button
                        kind="destructive"
                        onClick={this.openModal}
                        disabled={modalOpen}
                        aria-label={I18n.t('userpages.profilePage.deleteAccount.button')}
                    >
                        <Translate value="userpages.profilePage.deleteAccount.button" />
                    </Button>
                    {!!modalOpen && (
                        <DeleteAccountDialog
                            waiting={deletingUserAccount}
                            onClose={this.onClose}
                            onSave={this.onSave}
                        />
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    deletingUserAccount: selectDeletingUserAccount(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    deleteAccount: () => dispatch(deleteUserAccount()),
})

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount)
