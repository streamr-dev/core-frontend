// @flow

import React, { Component } from 'react'
import { Col, Row, Button } from 'reactstrap'

import Dropdown from '$shared/components/Dropdown'
import TextInput from '$shared/components/TextInput'
import type { StreamField } from '$shared/flowtype/stream-types'

import { leftColumn, rightColumn, fieldTypes } from '../../../constants'
import styles from './newFieldEditor.pcss'

type Props = {
    previousFields: Array<StreamField>,
    onConfirm: (name: string, type: string) => void,
    onCancel: () => void,
}

type State = {
    name: string,
    nameError: ?string,
    type: string,
}

export class NewFieldEditor extends Component<Props, State> {
    state = {
        name: '',
        nameError: null,
        type: fieldTypes[0],
    }

    onNameChange = (value: string) => {
        this.setState({
            name: value,
        }, () => this.validate())
    }

    onTypeChange = (value: string) => {
        this.setState({
            type: value,
        })
    }

    validate = () => {
        const { name } = this.state
        const { previousFields } = this.props
        let error = null

        if (name.length === 0) {
            error = 'Please provide a name for the field'
        }
        if (previousFields.find((field) => field.name === name)) {
            error = 'Duplicate field name'
        }

        this.setState({
            nameError: error,
        })
        return error === null
    }

    onConfirm = () => {
        const { name, type } = this.state
        const { onConfirm } = this.props

        if (this.validate()) {
            onConfirm(name, type)
        }
    }

    render() {
        const { onCancel } = this.props
        const { name, nameError, type } = this.state

        return (
            <div className={styles.container}>
                <Row>
                    <Col {...leftColumn}>
                        <TextInput
                            label=""
                            value={name}
                            placeholder="Enter a field name"
                            onChange={(e) => this.onNameChange(e.target.value)}
                            error={nameError || ''}
                            autoFocus
                        />
                    </Col>
                    <Col {...rightColumn}>
                        <Dropdown
                            title=""
                            defaultSelectedItem={type}
                            onChange={this.onTypeChange}
                        >
                            {fieldTypes.map((t) => (
                                <Dropdown.Item
                                    key={t}
                                    value={t}
                                >
                                    {t}
                                </Dropdown.Item>
                            ))}
                        </Dropdown>
                    </Col>
                </Row>
                <Button
                    disabled={nameError !== null}
                    className={styles.addButton}
                    onClick={this.onConfirm}
                >
                    Add
                </Button>
                <Button className={styles.cancelButton} onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        )
    }
}

export default NewFieldEditor
