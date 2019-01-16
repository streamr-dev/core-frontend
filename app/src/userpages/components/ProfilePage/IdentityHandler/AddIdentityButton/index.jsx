// @flow

import React, { Fragment } from 'react'
import { Button } from 'reactstrap'
import { Translate } from 'react-redux-i18n'

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

    onSave = () => {}

    render() {
        const { modalOpen } = this.state
        return (
            <Fragment>
                <Button
                    className={styles.button}
                    color="secondary"
                    type="button"
                    outline
                    disabled={modalOpen}
                    onClick={this.onShowModal}
                >
                    <Translate value="userpages.profilePage.ethereumAddress.addNewAddress" />
                </Button>
                {!!modalOpen && (
                    <AddIdentityDialog
                        onSave={this.onSave}
                        onClose={this.onModalClose}
                    />
                )}
            </Fragment>
        )
    }
}

export default AddIdentityButton
