// @flow

import React, { Component } from 'react'
import { Button, Modal } from 'react-bootstrap'

import type { Node } from 'react'

type Props = {
    confirmCallback: (any) => any,
    cancelCallback?: (any) => any,
    buttonRef?: Function,
    confirmTitle?: string | Component<any>,
    confirmMessage: string | Component<any>,
    children?: Node,
    modalProps?: {},
    buttonProps?: {},
    className?: string,
    id?: string
}

type State = {
    open: boolean
}

export default class ConfirmButton extends Component<Props, State> {
    static defaultProps = {
        confirmTitle: 'Are you sure?',
        cancelCallback: () => {},
    }

    state = {
        open: false,
    }

    onCancel = (event: SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        this.closeModal()
        if (this.props.cancelCallback) {
            this.props.cancelCallback()
        }
    }

    onConfirm = (event: SyntheticEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        this.closeModal()
        if (this.props.confirmCallback) {
            this.props.confirmCallback()
        }
    }

    openModal = () => {
        this.setState({
            open: true,
        })
    }

    closeModal = () => {
        this.setState({
            open: false,
        })
    }

    render() {
        /* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
        return (
            <React.Fragment>
                <Button
                    {...this.props.buttonProps}
                    ref={this.props.buttonRef}
                    className={this.props.className}
                    id={this.props.id}
                    onClick={this.openModal}
                >
                    {this.props.children}
                </Button>
                <Modal {...this.props.modalProps} show={this.state.open}>
                    <Modal.Header>
                        <Modal.Title>
                            {this.props.confirmTitle}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.confirmMessage}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.onCancel}>
                            Cancel
                        </Button>
                        <Button onClick={this.onConfirm} bsStyle="primary">
                            OK
                        </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        )
    }
}
