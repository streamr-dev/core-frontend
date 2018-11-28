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
    onSave?: (?string, ?string) => void,
    onDelete?: () => void,
}

type State = {
    hidden: boolean,
    editing: boolean,
}

class KeyField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            hidden: !!props.hideValue,
            editing: false,
        }
    }

    toggleHidden = () => {
        this.setState({
            hidden: !this.state.hidden,
        })
    }

    onCopy = () => {
        copy(this.props.value)
    }

    onEdit = () => {
        this.setState({
            editing: true,
        })
    }

    onCancel = () => {
        this.setState({
            editing: false,
        })
    }

    onSave = (keyName: ?string, value: ?string) => {
        if (this.props.onSave) {
            this.props.onSave(keyName, value)
        }
        this.setState({
            editing: false,
        })
    }

    onDelete = () => {
        if (this.props.onDelete) {
            this.props.onDelete()
        }
    }

    render = () => {
        const { keyName, value, className } = this.props
        const { hidden, editing } = this.state
        return !editing ? (
            <div className={cx(styles.container, className)}>
                <TextInput label={keyName} value={value} readOnly type={hidden ? 'password' : 'text'} />
                <div className={styles.actions}>
                    <DropdownActions
                        title={<Meatball alt={I18n.t('userpages.keyField.options')} blue />}
                        noCaret
                    >
                        <DropdownActions.Item onClick={this.toggleHidden}>
                            <Translate value={`userpages.keyField.${hidden ? 'reveal' : 'hide'}`} />
                        </DropdownActions.Item>
                        <DropdownActions.Item onClick={this.onCopy}>
                            <Translate value="userpages.keyField.copy" />
                        </DropdownActions.Item>
                        <DropdownActions.Item onClick={this.onEdit}>
                            <Translate value="userpages.keyField.edit" />
                        </DropdownActions.Item>
                        <DropdownActions.Item onClick={this.onDelete}>
                            <Translate value="userpages.keyField.delete" />
                        </DropdownActions.Item>
                    </DropdownActions>
                </div>
            </div>
        ) : (
            <KeyFieldEditor
                keyName={keyName}
                value={value}
                onCancel={this.onCancel}
                onSave={this.onSave}
            />
        )
    }
}

export default KeyField
