// @flow

import React from 'react'
import copy from 'copy-to-clipboard'
import cx from 'classnames'
import { I18n, Translate } from 'react-redux-i18n'
import TextInput from '$shared/components/TextInput'
import Meatball from '$shared/components/Meatball'
import DropdownActions from '$shared/components/DropdownActions'

import KeyFieldEditor from './KeyFieldEditor'

import styles from './keyField.pcss'

type Props = {
    keyName: string,
    value?: string,
    hideValue?: boolean,
    className?: string,
    allowEdit?: boolean,
    onSave?: (?string, ?string) => Promise<void>,
    allowDelete?: boolean,
    onDelete?: () => void,
}

type State = {
    hidden: boolean,
    editing: boolean,
    menuOpen: boolean,
    error: ?string,
}

class KeyField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            hidden: !!props.hideValue,
            editing: false,
            menuOpen: false,
            error: undefined,
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

    onSave = (keyName: ?string, value: ?string) => {
        const { allowEdit, onSave } = this.props
        if (allowEdit) {
            if (onSave) {
                onSave(keyName, value)
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
        } = this.props
        const { hidden, editing, menuOpen, error } = this.state
        return !editing ? (
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
                            <DropdownActions.Item onClick={this.onDelete}>
                                <Translate value="userpages.keyField.delete" />
                            </DropdownActions.Item>
                        )}
                    </DropdownActions>
                </div>
            </div>
        ) : (
            <KeyFieldEditor
                keyName={keyName}
                value={value}
                onCancel={this.onCancel}
                onSave={this.onSave}
                error={error}
            />
        )
    }
}

export default KeyField
