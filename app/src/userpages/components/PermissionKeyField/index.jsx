// @flow

import React from 'react'
import copy from 'copy-to-clipboard'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'

import type { ResourcePermission } from '$shared/flowtype/resource-key-types'
import Popover from '$shared/components/Popover'
import Select from '$ui/Select'
import SplitControl from '$userpages/components/SplitControl'
import { truncate } from '$shared/utils/text'
import Label from '$ui/Label'
import WithInputActions from '$shared/components/WithInputActions'
import Text from '$ui/Text'

import PermissionKeyFieldEditor from './PermissionKeyFieldEditor'

import styles from './permissionKeyField.pcss'

type Props = {
    keyName: string,
    value?: string,
    hideValue?: boolean,
    truncateValue?: boolean,
    className?: string,
    keyFieldClassName?: string,
    allowEdit?: boolean,
    onSave?: (?string, ?string, ?ResourcePermission) => Promise<void>,
    allowDelete?: boolean,
    disableDelete?: boolean,
    onDelete?: () => Promise<void>,
    showPermissionType?: boolean,
    showPermissionHeader?: boolean,
    permission?: ResourcePermission,
}

type State = {
    waiting: boolean,
    hidden: boolean,
    editing: boolean,
    error: ?string,
    permission: ?ResourcePermission,
}

const useIf = (condition: boolean, elements: Array<any>) => (condition ? elements : [])

class PermissionKeyField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            waiting: false,
            hidden: !!props.hideValue,
            editing: false,
            error: undefined,
            permission: props.permission,
        }
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    unmounted: boolean = false

    toggleHidden = () => {
        this.setState(({ hidden }) => ({
            hidden: !hidden,
        }))
    }

    onCopy = () => {
        copy(this.props.value)

        Notification.push({
            title: I18n.t('notifications.valueCopied', {
                value: I18n.t('userpages.keyFieldEditor.keyValue.apiKey'),
            }),
            icon: NotificationIcon.CHECKMARK,
        })
    }

    onCancel = () => {
        this.setState({
            editing: false,
        })
    }

    onSave = (keyName: ?string, value: ?string, permission: ?ResourcePermission) => {
        const { allowEdit, onSave } = this.props

        if (allowEdit) {
            if (onSave) {
                this.setState({
                    waiting: true,
                    error: null,
                })
                onSave(keyName, value, permission)
                    .then(() => {
                        if (!this.unmounted) {
                            this.setState({
                                permission,
                                waiting: false,
                                editing: false,
                                error: null,
                            })
                        }
                    }, (error) => {
                        if (!this.unmounted) {
                            this.setState({
                                error: error.message,
                                waiting: false,
                            })
                        }
                    })
            } else {
                this.setState({
                    editing: false,
                    waiting: false,
                    error: null,
                })
            }
        }
    }

    onDelete = () => {
        const { allowDelete, onDelete } = this.props
        if (allowDelete && onDelete) {
            onDelete()
        }
    }

    onEdit = () => {
        this.setState({
            editing: true,
        })
    }

    onPermissionChange = (permissionValue: string) => {
        const { value, keyName, allowEdit } = this.props
        // Value needs to be checked to satisfy Flow
        const permission: ?ResourcePermission = ['stream_subscribe', 'stream_publish'].find((p) => p === permissionValue)
        if (allowEdit && permission) {
            this.setState({
                permission,
            }, () => {
                this.onSave(keyName, value, permission)
            })
        }
    }

    renderInput = () => {
        const {
            hideValue,
            truncateValue,
            keyName,
            value,
            keyFieldClassName,
            allowDelete,
            allowEdit,
            disableDelete,
        } = this.props
        const { hidden } = this.state

        const actions = [
            ...useIf(!!hideValue, [
                <Popover.Item key="reveal" onClick={this.toggleHidden}>
                    <Translate value={`userpages.keyField.${hidden ? 'reveal' : 'conceal'}`} />
                </Popover.Item>,
            ]),
            <Popover.Item key="copy" onClick={this.onCopy}>
                <Translate value="userpages.keyField.copy" />
            </Popover.Item>,
            ...useIf(!!allowEdit, [
                <Popover.Item key="edit" onClick={this.onEdit}>
                    <Translate value="userpages.keyField.edit" />
                </Popover.Item>,
            ]),
            ...useIf(!!allowDelete, [
                <Popover.Item key="delete" onClick={this.onDelete} disabled={disableDelete}>
                    <Translate value="userpages.keyField.delete" />
                </Popover.Item>,
            ]),
        ]

        return (
            <div
                className={cx(styles.keyFieldContainer, keyFieldClassName)}
            >
                <Label htmlFor="keyName">
                    {keyName}
                </Label>
                <WithInputActions actions={actions}>
                    <Text
                        value={value && (!truncateValue ? value : truncate(value, {
                            maxLength: 15,
                        }))}
                        readOnly
                        type={hidden ? 'password' : 'text'}
                    />
                </WithInputActions>
            </div>
        )
    }

    render = () => {
        const {
            keyName,
            value,
            showPermissionType,
            showPermissionHeader,
            className,
            allowEdit,
        } = this.props
        const { waiting, editing, error, permission } = this.state

        const permissionOptions = [
            {
                value: 'stream_subscribe',
                label: 'Subscribe',
            },
            {
                value: 'stream_publish',
                label: 'Publish',
            },
        ]

        return (
            <div className={cx(styles.root, styles.PermissionKeyField, className)}>
                {!editing ? (
                    <SplitControl>
                        {this.renderInput()}
                        <div>
                            <Label className={styles.permissionHeader}>
                                {showPermissionHeader && I18n.t('userpages.streams.edit.configure.permission')}
                            </Label>
                            <Select
                                options={permissionOptions}
                                value={permissionOptions.find((t) => t.value === permission)}
                                onChange={(o) => this.onPermissionChange(o.value)}
                                className={styles.select}
                                disabled={!allowEdit}
                            />
                        </div>
                    </SplitControl>
                ) : (
                    <PermissionKeyFieldEditor
                        keyName={keyName}
                        value={value}
                        onCancel={this.onCancel}
                        onSave={this.onSave}
                        waiting={waiting}
                        error={error}
                        showPermissionType={showPermissionType}
                        permission={permission}
                        className={styles.editor}
                    />
                )}
            </div>
        )
    }
}

export default PermissionKeyField
