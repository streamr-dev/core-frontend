// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'

import TextInput from '$shared/components/TextInput'
import Buttons from '$shared/components/Buttons'

import styles from './keyFieldEditor.pcss'

export type ValueLabel = 'apiKey' | 'privateKey' | 'address'

type Props = {
    keyName?: string,
    value?: string,
    createNew?: boolean,
    editValue?: boolean,
    onCancel?: () => void,
    onSave: (keyName: string, value: string) => void,
    waiting?: boolean,
    error?: ?string,
    valueLabel: ValueLabel,
}

type State = {
    keyName: string,
    keyId: string,
}

class KeyFieldEditor extends React.Component<Props, State> {
    static defaultProps = {
        valueLabel: 'apiKey',
    }

    state = {
        keyName: this.props.keyName || '',
        keyId: this.props.value || '',
    }

    onKeyNameChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            keyName: e.target.value,
        })
    }

    onValueChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            keyId: e.target.value,
        })
    }

    onSave = () => {
        const { keyName, keyId } = this.state
        const { onSave } = this.props

        onSave(keyName, keyId)
    }

    render = () => {
        const { keyName, keyId } = this.state
        const {
            onCancel,
            createNew,
            editValue,
            waiting,
            error,
            valueLabel,
        } = this.props
        const filled = !!keyName && (createNew || !!keyId)

        return (
            <div className={styles.editor}>
                <div className={styles.keyName}>
                    <TextInput
                        label={I18n.t('userpages.keyFieldEditor.keyName')}
                        value={keyName}
                        onChange={this.onKeyNameChange}
                        preserveLabelSpace
                        error={(createNew && !editValue && error) || undefined}
                    />
                </div>
                {(!createNew || editValue) && (
                    <div className={styles.keyValue}>
                        <TextInput
                            label={I18n.t(`userpages.keyFieldEditor.keyValue.${valueLabel}`)}
                            value={keyId}
                            onChange={this.onValueChange}
                            preserveLabelSpace
                            readOnly={!editValue}
                            error={error || undefined}
                        />
                    </div>
                )}
                <Buttons
                    className={styles.buttons}
                    actions={{
                        save: {
                            title: I18n.t(`userpages.keyFieldEditor.${createNew ? 'add' : 'save'}`),
                            kind: 'secondary',
                            onClick: this.onSave,
                            disabled: !filled || waiting,
                            spinner: waiting,
                        },
                        cancel: {
                            kind: 'link',
                            className: 'grey-container',
                            title: I18n.t('userpages.keyFieldEditor.cancel'),
                            outline: true,
                            onClick: () => onCancel && onCancel(),
                        },
                    }}
                />
            </div>
        )
    }
}

export default KeyFieldEditor
