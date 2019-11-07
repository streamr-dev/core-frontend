// @flow

import React, { Fragment } from 'react'
import { Translate } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import Modal from '$shared/components/Modal'
import AddIdentityDialog from '$userpages/components/ProfilePage/IdentityHandler/AddIdentityDialog'

type Props = {}

type State = {
    modalOpen: boolean,
}

class AddIdentityButton extends React.Component<Props, State> {
    state = {
        modalOpen: false,
    }

    onShowModal = () => {
        this.setState({
            modalOpen: true,
        })
    }

    onModalClose = () => {
        this.setState({
            modalOpen: false,
        })
    }

    render() {
        const { modalOpen } = this.state
        return (
            <Fragment>
                <Button
                    type="secondary"
                    disabled={modalOpen}
                    onClick={this.onShowModal}
                >
                    <Translate value="userpages.profilePage.ethereumAddress.addNewAddress" />
                </Button>
                {!!modalOpen && (
                    <Modal>
                        <AddIdentityDialog
                            onSave={this.onModalClose}
                            onClose={this.onModalClose}
                        />
                    </Modal>
                )}
            </Fragment>
        )
    }
}

export default AddIdentityButton
