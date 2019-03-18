// @flow

import React from 'react'
import { Button } from 'reactstrap'

import type { ResourcePermission } from '$shared/flowtype/resource-key-types'
import KeyFieldEditor from '../KeyFieldEditor'

import styles from './addKeyField.pcss'

type Props = {
    label: string,
    createWithValue?: boolean,
    onSave: (keyName: string, value: string, permission: ?ResourcePermission) => Promise<void>,
    showPermissionType?: boolean,
    addKeyFieldAllowed: boolean,
}

type State = {
    editing: boolean,
    waiting: boolean,
    error: ?string,
}

class AddKeyField extends React.Component<Props, State> {
    state = {
        editing: false,
        waiting: false,
        error: undefined,
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    unmounted: boolean = false

    onEdit = (e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
        this.setState({
            editing: true,
        })
    }

    onCancel = () => {
        this.setState({
            editing: false,
            waiting: false,
        })
    }

    onSave = (keyName: string, value: string, permission: ?ResourcePermission) => {
        this.setState({
            waiting: true,
            error: null,
        }, async () => {
            try {
                await this.props.onSave(keyName, value, permission)

                if (!this.unmounted) {
                    this.setState({
                        editing: false,
                        waiting: false,
                    })
                }
            } catch (error) {
                if (!this.unmounted) {
                    this.setState({
                        waiting: false,
                        error: error.message,
                    })
                }
            }
        })
    }

    render = () => {
        const { editing, waiting, error } = this.state
        const { label, createWithValue, showPermissionType, addKeyFieldAllowed } = this.props
        return !editing ? (
            <Button
                type="button"
                color="secondary"
                className={`grey-outline grey-container ${styles.button}`}
                onClick={this.onEdit}
                outline
                disabled={!addKeyFieldAllowed}
            >
                {label}
            </Button>
        ) : (
            <KeyFieldEditor
                createNew
                onCancel={this.onCancel}
                onSave={this.onSave}
                editValue={createWithValue}
                waiting={waiting}
                error={error}
                showPermissionType={showPermissionType}
            />
        )
    }
}

export default AddKeyField
