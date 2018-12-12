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
    onCancel?: () => void,
    onSave: (string) => void,
}

type State = {
    keyName: string,
}

class KeyFieldEditor extends React.Component<Props, State> {
    state = {
        keyName: this.props.keyName || '',
    }

    onKeyNameChange = (e: SyntheticInputEvent<EventTarget>) => {
        this.setState({
            keyName: e.target.value,
        })
    }

    render = () => {
        const { keyName } = this.state
        const { onSave, onCancel, createNew, value } = this.props
        const filled = !!keyName && (createNew || !!value)
        return (
            <div className={styles.editor}>
                <div className={styles.keyName}>
                    <TextInput
                        label={I18n.t('userpages.keyFieldEditor.keyName')}
                        value={keyName}
                        onChange={this.onKeyNameChange}
                        preserveLabelSpace
                    />
                </div>
                {!createNew && (
                    <div className={styles.keyValue}>
                        <TextInput
                            label={I18n.t('userpages.keyFieldEditor.apiKey')}
                            value={value}
                            preserveLabelSpace
                            readOnly
                        />
                    </div>
                )}
                <Buttons
                    className={styles.buttons}
                    actions={{
                        save: {
                            title: I18n.t(`userpages.keyFieldEditor.${createNew ? 'add' : 'save'}`),
                            color: 'primary',
                            onClick: () => onSave(keyName),
                            disabled: !filled,
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
