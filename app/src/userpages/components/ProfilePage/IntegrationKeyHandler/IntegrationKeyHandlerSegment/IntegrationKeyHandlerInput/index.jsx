// @flow

import React, { Component } from 'react'
import { Input, InputGroup, FormGroup, Button } from 'reactstrap'
import serialize from 'form-serialize'

import { titleCase } from 'change-case'

import type { IntegrationKey } from '../../../../../flowtype/integration-key-types'
import styles from './integrationKeyHandlerInput.pcss'

export type Props = {
    inputFields?: Array<string>,
    onNew: (integrationKey: IntegrationKey) => void
}

export default class IntegrationKeyHandlerInput extends Component<Props> {
    onSubmit = (e: {
        preventDefault: Function,
        target: HTMLFormElement
    }) => {
        e.preventDefault()
        const form: HTMLFormElement = e.target
        const data = serialize(form, {
            hash: true,
        })
        this.props.onNew(data)
        form.reset()
    }

    form: ?HTMLFormElement

    render() {
        return (
            <form className={styles.integrationKeyInputForm} onSubmit={this.onSubmit}>
                <FormGroup>
                    <InputGroup className={styles.integrationKeyInputGroup}>
                        {['name', ...(this.props.inputFields || [])].map((field) => (
                            <Input
                                key={field}
                                name={field}
                                type="text"
                                className={styles.integrationKeyInput}
                                placeholder={titleCase(field)}
                                required
                            />
                        ))}
                        <div className={styles.buttonContainer}>
                            <Button color="primary" type="submit">
                                Add
                            </Button>
                        </div>
                    </InputGroup>
                </FormGroup>
            </form>
        )
    }
}
