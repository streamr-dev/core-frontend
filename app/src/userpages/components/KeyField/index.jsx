// @flow

import React from 'react'
import copy from 'copy-to-clipboard'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'

import type { ResourcePermission } from '$shared/flowtype/resource-key-types'
import TextInput from '$shared/components/TextInput'
import DropdownActions from '$shared/components/DropdownActions'
import SelectInput from '$shared/components/SelectInput'
import SplitControl from '$userpages/components/SplitControl'
import { truncate } from '$shared/utils/text'
import KeyFieldEditor from './KeyFieldEditor'

import styles from './keyField.pcss'

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
    menuOpen: boolean,
    error: ?string,
    permission: ?ResourcePermission,
}

const useIf = (condition: boolean, elements: Array<any>) => (condition ? elements : [])

class KeyField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            waiting: false,
            hidden: !!props.hideValue,
            editing: false,
            menuOpen: false,
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
    }

    onCancel = () => {
        this.setState({
            editing: false,
            menuOpen: false,
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
                                menuOpen: false,
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
                    menuOpen: false,
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

    onMenuToggle = (menuOpen: boolean) => {
        this.setState({
            menuOpen,
        })
    }

    onEdit = () => {
        this.setState({
            editing: true,
        })
    }

    onPermissionChange = (permissionValue: string) => {
        const { value, keyName } = this.props
        // Value needs to be checked to satisfy Flow
        const permission: ?ResourcePermission = ['read', 'write', 'share'].find((p) => p === permissionValue)
        if (permission) {
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
            showPermissionType,
        } = this.props
        const { hidden, menuOpen } = this.state

        const actions = [
            ...useIf(!!hideValue, [
                <DropdownActions.Item key="reveal" onClick={this.toggleHidden}>
                    <Translate value={`userpages.keyField.${hidden ? 'reveal' : 'conceal'}`} />
                </DropdownActions.Item>,
            ]),
            <DropdownActions.Item key="copy" onClick={this.onCopy}>
                <Translate value="userpages.keyField.copy" />
            </DropdownActions.Item>,
            ...useIf(!!allowEdit, [
                <DropdownActions.Item key="edit" onClick={this.onEdit}>
                    <Translate value="userpages.keyField.edit" />
                </DropdownActions.Item>,
            ]),
            ...useIf(!!allowDelete, [
                <DropdownActions.Item key="delete" onClick={this.onDelete} disabled={disableDelete}>
                    <Translate value="userpages.keyField.delete" />
                </DropdownActions.Item>,
            ]),
        ]

        return (
            <div
                className={cx(styles.keyFieldContainer, keyFieldClassName, {
                    [styles.withMenu]: menuOpen,
                })}
            >
                <TextInput
                    label={keyName}
                    actions={actions}
                    value={value && (!truncateValue ? value : truncate(value, {
                        maxLength: 15,
                    }))}
                    readOnly
                    type={hidden ? 'password' : 'text'}
                    preserveLabelSpace
                />
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
        } = this.props
        const { waiting, editing, error, permission } = this.state

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
            <div className={cx(styles.root, styles.KeyField, className)}>
                {!editing ? (
                    <React.Fragment>
                        {!showPermissionType && this.renderInput()}
                        {showPermissionType && (
                            <SplitControl>
                                {this.renderInput()}
                                <SelectInput
                                    label={showPermissionHeader ? I18n.t('userpages.streams.edit.configure.permission') : ''}
                                    options={permissionOptions}
                                    value={permissionOptions.find((t) => t.value === permission)}
                                    onChange={(o) => this.onPermissionChange(o.value)}
                                    preserveLabelSpace
                                    className={styles.select}
                                />
                            </SplitControl>
                        )}
                    </React.Fragment>
                ) : (
                    <KeyFieldEditor
                        keyName={keyName}
                        value={value}
                        onCancel={this.onCancel}
                        onSave={this.onSave}
                        waiting={waiting}
                        error={error}
                        showPermissionType={showPermissionType}
                        permission={permission}
                    />
                )}
            </div>
        )
    }
}

export default KeyField
