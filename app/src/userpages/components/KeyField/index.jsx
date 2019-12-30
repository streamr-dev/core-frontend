// @flow

import React from 'react'
import copy from 'copy-to-clipboard'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import TextInput from '$shared/components/TextInput'
import DropdownActions from '$shared/components/DropdownActions'
import { truncate } from '$shared/utils/text'
import KeyFieldEditor, { type ValueLabel } from './KeyFieldEditor'

import styles from './keyField.pcss'

type Props = {
    keyName: string,
    value?: string,
    hideValue?: boolean,
    truncateValue?: boolean,
    className?: string,
    keyFieldClassName?: string,
    allowEdit?: boolean,
    onSave?: (?string, ?string) => Promise<void>,
    allowDelete?: boolean,
    disableDelete?: boolean,
    onDelete?: () => Promise<void>,
    valueLabel?: ValueLabel,
}

type State = {
    waiting: boolean,
    hidden: boolean,
    editing: boolean,
    error: ?string,
}

const useIf = (condition: boolean, elements: Array<any>) => (condition ? elements : [])

class KeyField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            waiting: false,
            hidden: !!props.hideValue,
            editing: false,
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

    onCancel = () => {
        this.setState({
            editing: false,
        })
    }

    onSave = (keyName: ?string, value: ?string) => {
        const { allowEdit, onSave } = this.props

        if (allowEdit) {
            if (onSave) {
                this.setState({
                    waiting: true,
                    error: null,
                })
                onSave(keyName, value)
                    .then(() => {
                        if (!this.unmounted) {
                            this.setState({
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
                className={cx(styles.keyFieldContainer, keyFieldClassName)}
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
        const { keyName, value, className, valueLabel } = this.props
        const { waiting, editing, error } = this.state

        return (
            <div className={cx(styles.root, styles.KeyField, className)}>
                {!editing ? (
                    this.renderInput()
                ) : (
                    <KeyFieldEditor
                        keyName={keyName}
                        value={value}
                        onCancel={this.onCancel}
                        onSave={this.onSave}
                        waiting={waiting}
                        error={error}
                        valueLabel={valueLabel}
                    />
                )}
            </div>
        )
    }
}

export default KeyField
