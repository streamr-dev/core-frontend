// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'

import Buttons from '$shared/components/Buttons'
import Label from '$ui/Label'
import Text from '$ui/Text'
import Errors from '$ui/Errors'

import styles from './keyFieldEditor.pcss'

export type ValueLabel = 'apiKey' | 'privateKey' | 'address'

type Props = {
    keyName?: string,
    value?: string,
    createNew?: boolean,
    editValue?: boolean,
    onCancel?: () => void,
    onSave: (keyName: string, value: string) => void | Promise<void>,
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
                    <Label
                        htmlFor="keyName"
                        state={createNew && !editValue && error && 'ERROR'}
                    >
                        {I18n.t('userpages.keyFieldEditor.keyName')}
                    </Label>
                    <Text
                        value={keyName}
                        onChange={this.onKeyNameChange}
                    />
                    {createNew && !editValue && error && (
                        <Errors overlap>
                            {error}
                        </Errors>
                    )}
                </div>
                {(!createNew || editValue) && (
                    <div className={styles.keyValue}>
                        <Label
                            htmlFor="keyValue"
                            state={error && 'ERROR'}
                        >
                            {I18n.t(`userpages.keyFieldEditor.keyValue.${valueLabel}`)}
                        </Label>
                        <Text
                            id="keyValue"
                            value={keyId}
                            onChange={this.onValueChange}
                            readOnly={!editValue}
                        />
                        <Errors overlap>
                            {error}
                        </Errors>
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
