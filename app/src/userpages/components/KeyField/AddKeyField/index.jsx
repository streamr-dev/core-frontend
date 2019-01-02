// @flow

import React from 'react'
import { Button } from 'reactstrap'

import KeyFieldEditor from '../KeyFieldEditor'

type Props = {
    label: string,
    createWithValue?: boolean,
    onSave: (keyName: string, value: string) => void,
}

type State = {
    editing: boolean,
}

class AddKeyField extends React.Component<Props, State> {
    state = {
        editing: false,
    }

    onEdit = (e: SyntheticInputEvent<EventTarget>) => {
        e.preventDefault()
        this.setState({
            editing: true,
        })
    }

    onCancel = () => {
        this.setState({
            editing: false,
        })
    }

    onSave = (keyName: string, value: string) => {
        this.props.onSave(keyName, value)

        this.setState({
            editing: false,
        })
    }

    render = () => {
        const { editing } = this.state
        const { label, createWithValue } = this.props
        return !editing ? (
            <Button type="button" onClick={this.onEdit}>{label}</Button>
        ) : (
            <KeyFieldEditor
                createNew
                onCancel={this.onCancel}
                onSave={this.onSave}
                editValue={createWithValue}
            />
        )
    }
}

export default AddKeyField
