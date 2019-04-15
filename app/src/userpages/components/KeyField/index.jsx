// @flow

import React from 'react'
import copy from 'copy-to-clipboard'
import cx from 'classnames'
import { I18n, Translate } from 'react-redux-i18n'
import { Row, Col } from 'reactstrap'

import type { ResourcePermission } from '$shared/flowtype/resource-key-types'
import TextInput from '$shared/components/TextInput'
import Meatball from '$shared/components/Meatball'
import DropdownActions from '$shared/components/DropdownActions'
import { leftColumn, rightColumn } from '$userpages/components/StreamPage/constants'

import KeyFieldEditor from './KeyFieldEditor'
import styles from './keyField.pcss'

type Props = {
    keyName: string,
    value?: string,
    hideValue?: boolean,
    className?: string,
    allowEdit?: boolean,
    onSave?: (?string, ?string, ?ResourcePermission) => Promise<void>,
    allowDelete?: boolean,
    disableDelete?: boolean,
    onDelete?: () => void,
    showPermissionType?: boolean,
    permission?: ResourcePermission,
}

type State = {
    hidden: boolean,
    editing: boolean,
    menuOpen: boolean,
    error: ?string,
    permission: ?ResourcePermission,
}

class KeyField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
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

    onEdit = () => {
        if (this.props.allowEdit) {
            this.setState({
                editing: true,
                menuOpen: false,
            })
        }
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
                onSave(keyName, value, permission)
                    .then(() => {
                        if (!this.unmounted) {
                            this.setState({
                                editing: false,
                                menuOpen: false,
                                error: null,
                            })
                        }
                    }, (error) => {
                        if (!this.unmounted) {
                            this.setState({
                                error: error.message,
                            })
                        }
                    })
            } else {
                this.setState({
                    editing: false,
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

    render = () => {
        const {
            hideValue,
            keyName,
            value,
            className,
            allowEdit,
            allowDelete,
            disableDelete,
            showPermissionType,
        } = this.props
        const {
            hidden,
            editing,
            menuOpen,
            error,
            permission,
        } = this.state
        const leftCol = showPermissionType ? leftColumn : { xs: 12 }

        return !editing ? (
            <Row>
                <Col {...leftCol}>
                    <div
                        className={cx(styles.container, className, {
                            [styles.withMenu]: menuOpen,
                        })}
                    >
                        <TextInput label={keyName} value={value} readOnly type={hidden ? 'password' : 'text'} />
                        <div className={styles.actions}>
                            <DropdownActions
                                onMenuToggle={this.onMenuToggle}
                                title={<Meatball alt={I18n.t('userpages.keyField.options')} blue />}
                                noCaret
                            >
                                {!!hideValue && (
                                    <DropdownActions.Item onClick={this.toggleHidden}>
                                        <Translate value={`userpages.keyField.${hidden ? 'reveal' : 'conceal'}`} />
                                    </DropdownActions.Item>
                                )}
                                <DropdownActions.Item onClick={this.onCopy}>
                                    <Translate value="userpages.keyField.copy" />
                                </DropdownActions.Item>
                                {!!allowEdit && (
                                    <DropdownActions.Item onClick={this.onEdit}>
                                        <Translate value="userpages.keyField.edit" />
                                    </DropdownActions.Item>
                                )}
                                {!!allowDelete && (
                                    <DropdownActions.Item onClick={this.onDelete} disabled={disableDelete}>
                                        <Translate value="userpages.keyField.delete" />
                                    </DropdownActions.Item>
                                )}
                            </DropdownActions>
                        </div>
                    </div>
                </Col>
                {!showPermissionType && (
                    <Col {...rightColumn}>
                        <div className={styles.permissionDropdown}>
                            {permission}
                        </div>
                    </Col>
                )}
            </Row>
        ) : (
            <KeyFieldEditor
                keyName={keyName}
                value={value}
                onCancel={this.onCancel}
                onSave={this.onSave}
                error={error}
                showPermissionType={showPermissionType}
                permission={permission}
            />
        )
    }
}

export default KeyField
