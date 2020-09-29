// @flow

import React from 'react'

import Button from '$shared/components/Button'
import KeyFieldEditor, { type LabelType } from '../KeyFieldEditor'

type Props = {
    label: string,
    createWithValue?: boolean,
    onSave: (keyName: string, value: string) => Promise<void>,
    addKeyFieldAllowed: boolean,
    labelType?: LabelType,
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

    onSave = (keyName: string, value: string) => {
        this.setState({
            waiting: true,
            error: null,
        }, async () => {
            try {
                await this.props.onSave(keyName, value)

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
        const { label, createWithValue, addKeyFieldAllowed, labelType } = this.props
        return !editing ? (
            <Button
                kind="secondary"
                onClick={this.onEdit}
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
                labelType={labelType}
            />
        )
    }
}

export default AddKeyField
