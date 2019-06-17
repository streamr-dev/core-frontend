// @flow

import React, { Fragment } from 'react'
import { Button } from 'reactstrap'
import { Translate } from 'react-redux-i18n'

import Modal from '$shared/components/Modal'
import AddIdentityDialog from '$userpages/components/ProfilePage/IdentityHandler/AddIdentityDialog'

import styles from './addIdentityButton.pcss'

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
                    className={styles.button}
                    color="userpages"
                    type="button"
                    outline
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
