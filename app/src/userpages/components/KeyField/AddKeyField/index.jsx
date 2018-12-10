// @flow

import React from 'react'
import { Button } from 'reactstrap'

import KeyFieldEditor from '../KeyFieldEditor'

type Props = {
    label: string,
    onSave: (keyName: string) => void,
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

    render = () => {
        const { editing } = this.state
        const { label, onSave } = this.props
        return !editing ? (
            <Button type="button" onClick={this.onEdit}>{label}</Button>
        ) : (
            <KeyFieldEditor
                createNew
                onCancel={this.onCancel}
                onSave={onSave}
            />
        )
    }
}

export default AddKeyField
