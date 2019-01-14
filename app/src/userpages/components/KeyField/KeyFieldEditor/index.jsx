// @flow

import React from 'react'

import TextInput from '$shared/components/TextInput'
import Buttons from '$shared/components/Buttons'
import { I18n } from 'react-redux-i18n'

import styles from './keyFieldEditor.pcss'

type Props = {
    keyName?: string,
    value?: string,
    createNew?: boolean,
    editValue?: boolean,
    onCancel?: () => void,
    onSave: (string, string) => void,
    waiting?: boolean,
    error?: ?string,
}

type State = {
    keyName: string,
    value: string,
}

class KeyFieldEditor extends React.Component<Props, State> {
    state = {
        keyName: this.props.keyName || '',
        value: this.props.value || '',
    }

    onKeyNameChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            keyName: e.target.value,
        })
    }

    onValueChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            value: e.target.value,
        })
    }

    onSave = () => {}

    render = () => {
        const { keyName, value } = this.state
        const {
            onSave,
            onCancel,
            createNew,
            editValue,
            waiting,
            error,
        } = this.props
        const filled = !!keyName && (createNew || !!value)
        return (
            <div className={styles.editor}>
                <div className={styles.keyName}>
                    <TextInput
                        label={I18n.t('userpages.keyFieldEditor.keyName')}
                        value={keyName}
                        onChange={this.onKeyNameChange}
                        preserveLabelSpace
                        error={(createNew && error) || undefined}
                    />
                </div>
                {(!createNew || editValue) && (
                    <div className={styles.keyValue}>
                        <TextInput
                            label={I18n.t('userpages.keyFieldEditor.apiKey')}
                            value={value}
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
                            color: 'primary',
                            onClick: () => onSave(keyName, value),
                            disabled: !filled || waiting,
                            spinner: waiting,
                        },
                        cancel: {
                            title: I18n.t('userpages.keyFieldEditor.cancel'),
                            outline: true,
                            onClick: onCancel,
                        },
                    }}
                />
            </div>
        )
    }
}

export default KeyFieldEditor
