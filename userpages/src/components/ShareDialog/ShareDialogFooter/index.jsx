// @flow

import React, { Component } from 'react'
import { Button, ModalFooter } from 'reactstrap'

type Props = {
    save: Function,
    closeModal: Function
}

import styles from './shareDialogFooter.pcss'

export default class ShareDialogFooter extends Component<Props> {
    render() {
        return (
            <ModalFooter>
                <Button
                    color="default"
                    onClick={this.props.closeModal}
                    className={styles.cancelButton}
                >
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={this.props.save}
                    className={styles.saveButton}
                >
                    Save
                </Button>
            </ModalFooter>
        )
    }
}
