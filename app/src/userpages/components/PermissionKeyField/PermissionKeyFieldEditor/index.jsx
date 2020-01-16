// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'
import cx from 'classnames'

import type { ResourcePermission } from '$shared/flowtype/resource-key-types'
import TextInput from '$shared/components/TextInput'
import Buttons from '$shared/components/Buttons'
import SelectInput from '$shared/components/SelectInput'
import SplitControl from '$userpages/components/SplitControl'

import styles from './permissionKeyFieldEditor.pcss'

type Props = {
    keyName?: string,
    value?: string,
    createNew?: boolean,
    editValue?: boolean,
    onCancel?: () => void,
    onSave: (keyName: string, value: string, keyPermission: ?ResourcePermission) => void,
    waiting?: boolean,
    error?: ?string,
    permission?: ?ResourcePermission,
    valueLabel: 'apiKey' | 'privateKey' | 'address',
    className?: string,
}

type State = {
    keyName: string,
    keyId: string,
    permission: ?ResourcePermission,
}

class PermissionKeyFieldEditor extends React.Component<Props, State> {
    static defaultProps = {
        valueLabel: 'apiKey',
    }

    state = {
        keyName: this.props.keyName || '',
        keyId: this.props.value || '',
        permission: this.props.permission || 'read',
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

    onPermissionChange = (value: string) => {
        // Value needs to be checked to satisfy Flow
        const permission: ?ResourcePermission = ['read', 'write', 'share'].find((p) => p === value)
        if (permission) {
            this.setState({
                permission,
            })
        }
    }

    onSave = () => {
        const { keyName, keyId, permission } = this.state
        const { onSave } = this.props

        onSave(keyName, keyId, permission)
    }

    render = () => {
        const { keyName, keyId, permission } = this.state
        const {
            onCancel,
            createNew,
            editValue,
            waiting,
            error,
            valueLabel,
            className,
        } = this.props
        const filled = !!keyName && (createNew || !!keyId)

        const permissionOptions = [
            {
                value: 'read',
                label: 'Read',
            },
            {
                value: 'write',
                label: 'Write',
            },
        ]

        return (
            <div className={cx(styles.editor, className)}>
                <SplitControl>
                    <div className={styles.keyName}>
                        <TextInput
                            label={I18n.t('userpages.keyFieldEditor.keyName')}
                            value={keyName}
                            onChange={this.onKeyNameChange}
                            preserveLabelSpace
                            error={(createNew && !editValue && error) || undefined}
                        />
                    </div>
                    <SelectInput
                        label="Permission"
                        options={permissionOptions}
                        value={permissionOptions.find((t) => t.value === permission)}
                        onChange={(o) => this.onPermissionChange(o.value)}
                        preserveLabelSpace
                    />
                </SplitControl>
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

export default PermissionKeyFieldEditor
