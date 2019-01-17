// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'
import { Row, Col } from 'reactstrap'

import TextInput from '$shared/components/TextInput'
import Buttons from '$shared/components/Buttons'
import Dropdown from '$shared/components/Dropdown'
import { leftColumn, rightColumn } from '$userpages/components/StreamPage/constants'

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
    permissionTypeVisible?: boolean,
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

    onSave = () => {
        const { keyName, value } = this.state
        const { onSave } = this.props

        onSave(keyName, value)
    }

    render = () => {
        const { keyName, value } = this.state
        const {
            onCancel,
            createNew,
            editValue,
            waiting,
            error,
            permissionTypeVisible,
        } = this.props
        const filled = !!keyName && (createNew || !!value)
        const leftCol = permissionTypeVisible ? leftColumn : { xs: 12 }

        return (
            <div className={styles.editor}>
                <Row>
                    <Col {...leftCol}>
                        <div className={styles.keyName}>
                            <TextInput
                                label={I18n.t('userpages.keyFieldEditor.keyName')}
                                value={keyName}
                                onChange={this.onKeyNameChange}
                                preserveLabelSpace
                                error={(createNew && !editValue && error) || undefined}
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
                    </Col>
                    {permissionTypeVisible && (
                        <Col {...rightColumn}>
                            <Dropdown
                                title=""
                                onChange={() => {}}
                                defaultSelectedItem="read"
                                className={styles.permissionDropdown}
                            >
                                <Dropdown.Item key="read" value="read">
                                    Read
                                </Dropdown.Item>
                                <Dropdown.Item key="write" value="write">
                                    Write
                                </Dropdown.Item>
                            </Dropdown>
                        </Col>
                    )}
                    <Col>
                        <Buttons
                            className={styles.buttons}
                            actions={{
                                save: {
                                    title: I18n.t(`userpages.keyFieldEditor.${createNew ? 'add' : 'save'}`),
                                    color: 'primary',
                                    onClick: this.onSave,
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
                    </Col>
                </Row>
            </div>
        )
    }
}

export default KeyFieldEditor
