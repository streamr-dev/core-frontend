// @flow

import React, { Component } from 'react'
import { I18n, Translate } from 'react-redux-i18n'

import Button from '$shared/components/Button'
import Select from '$shared/components/Input/Select'
import Text from '$shared/components/Input/Text'
import type { StreamField } from '$shared/flowtype/stream-types'
import SplitControl from '$userpages/components/SplitControl'
import FormControlLabel from '$shared/components/FormControlLabel'
import FormControlErrors from '$shared/components/FormControlErrors'
import { fieldTypes } from '$userpages/modules/userPageStreams/selectors'
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
    typeOptions: Array<any> = fieldTypes.map((t) => ({
        value: t,
        label: I18n.t(`userpages.streams.fieldTypes.${t}`),
    }))

    state = {
        name: '',
        nameError: null,
        type: this.typeOptions[0].value,
    }

    onNameChange = (value: string) => {
        this.setState({
            name: value,
        }, this.validate)
    }

    onTypeChange = (option: any) => {
        this.setState({
            type: option.value,
        })
    }

    validate = (done?: (boolean) => void) => {
        const { name } = this.state
        const { previousFields } = this.props
        let error = null

        if (name.length === 0) {
            error = I18n.t('userpages.streams.edit.configure.newFieldEditor.error.emptyName')
        }
        if (previousFields.find((field) => field.name === name)) {
            error = I18n.t('userpages.streams.edit.configure.newFieldEditor.error.duplicateName')
        }

        this.setState({
            nameError: error,
        }, () => {
            if (done) {
                done(!error)
            }
        })
    }

    handleKeyPress = (key: string) => {
        if (key === 'Enter') {
            this.onConfirm()
        }
    }

    onConfirm = () => {
        const { name, type } = this.state
        const { onConfirm } = this.props

        this.validate((valid) => {
            if (valid) {
                onConfirm(name, type)
            }
        })
    }

    render() {
        const { onCancel } = this.props
        const { name, nameError, type } = this.state

        return (
            <div className={styles.container}>
                <SplitControl>
                    <div>
                        <FormControlLabel
                            htmlFor="newFieldName"
                            state={nameError && 'ERROR'}
                        >
                            {I18n.t('userpages.streams.edit.configure.newFieldEditor.namePlaceholder')}
                        </FormControlLabel>
                        <Text
                            id="newFieldName"
                            type="text"
                            value={name}
                            onChange={(e) => this.onNameChange(e.target.value)}
                            autoFocus
                            onKeyPress={(e) => this.handleKeyPress(e.key)}
                        />
                        <FormControlErrors overlap>
                            {nameError}
                        </FormControlErrors>
                    </div>
                    <div>
                        <FormControlLabel htmlFor="newFieldType">
                            Data type
                        </FormControlLabel>
                        <Select
                            id="newFieldType"
                            name="type"
                            className={styles.select}
                            options={this.typeOptions}
                            value={this.typeOptions.find((t) => t.value === type)}
                            onChange={this.onTypeChange}
                        />
                    </div>
                </SplitControl>
                <Button
                    kind="secondary"
                    disabled={nameError !== null}
                    className={styles.addButton}
                    onClick={this.onConfirm}
                >
                    <Translate value="userpages.streams.edit.configure.newFieldEditor.add" />
                </Button>
                <Button
                    kind="link"
                    className={styles.cancelButton}
                    onClick={onCancel}
                >
                    <Translate value="userpages.streams.edit.configure.newFieldEditor.cancel" />
                </Button>
            </div>
        )
    }
}

export default NewFieldEditor
