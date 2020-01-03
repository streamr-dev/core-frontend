// @flow

import React from 'react'

import Button from '$shared/components/Button'
import type { ResourcePermission } from '$shared/flowtype/resource-key-types'
import PermissionKeyFieldEditor from '../PermissionKeyFieldEditor'

type Props = {
    label: string,
    createWithValue?: boolean,
    onSave: (keyName: string, permission: ?ResourcePermission) => Promise<void>,
    addKeyFieldAllowed: boolean,
}

type State = {
    editing: boolean,
    waiting: boolean,
    error: ?string,
}

class AddPermissionKeyField extends React.Component<Props, State> {
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
                await this.props.onSave(keyName, permission)

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
        const { label, createWithValue, addKeyFieldAllowed } = this.props
        return !editing ? (
            <Button
                kind="secondary"
                onClick={this.onEdit}
                disabled={!addKeyFieldAllowed}
            >
                {label}
            </Button>
        ) : (
            <PermissionKeyFieldEditor
                createNew
                onCancel={this.onCancel}
                onSave={this.onSave}
                editValue={createWithValue}
                waiting={waiting}
                error={error}
            />
        )
    }
}

export default AddPermissionKeyField
