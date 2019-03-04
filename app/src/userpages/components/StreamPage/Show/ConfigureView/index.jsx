// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Col, Row, Button } from 'reactstrap'
import copy from 'copy-to-clipboard'
import { arrayMove } from 'react-sortable-hoc'
import { Translate } from 'react-redux-i18n'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import FieldList from '$shared/components/FieldList'
import FieldItem from '$shared/components/FieldList/FieldItem'
import Dropdown from '$shared/components/Dropdown'
import { updateEditStreamField } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import TextInput from '$shared/components/TextInput'
import Toggle from '$shared/components/Toggle'

import { leftColumn, rightColumn, fieldTypes } from '../../constants'

import styles from './configureView.pcss'
import NewFieldEditor from './NewFieldEditor'

type StateProps = {
    stream: ?Stream,
}

type DispatchProps = {
    copyStreamId: (string) => void,
    editField: (string, any) => void,
}

type Props = StateProps & DispatchProps

type State = {
    isAddingField: boolean,
    alwaysTryToAutoConfigure: boolean,
    requireSignedMessages: boolean,
}

export class ConfigureView extends Component<Props, State> {
    state = {
        isAddingField: false,
        alwaysTryToAutoConfigure: true,
        requireSignedMessages: false,
    }

    getStreamFields = () => {
        const { stream } = this.props
        return (stream && stream.config && stream.config.fields) || []
    }

    onSortEnd = ({ newIndex, oldIndex }: { newIndex: number, oldIndex: number }) => {
        const { editField } = this.props
        const fields = [...this.getStreamFields()]
        const sortedFields = arrayMove(fields, oldIndex, newIndex)
        editField('config.fields', sortedFields)
    }

    onFieldNameChange = (fieldName: string, value: string) => {
        const { editField } = this.props
        const fields = this.getStreamFields()
        const index = fields.findIndex((field) => field.name === fieldName)
        editField(`config.fields[${index}].name`, value)
    }

    onFieldTypeChange = (fieldName: string, value: string) => {
        const { editField } = this.props
        const fields = this.getStreamFields()
        const index = fields.findIndex((field) => field.name === fieldName)
        editField(`config.fields[${index}].type`, value)
    }

    addNewField = () => {
        this.setState({
            isAddingField: true,
        })
    }

    confirmAddField = (name: string, type: string) => {
        const { editField } = this.props
        const fields = [
            ...this.getStreamFields(),
            {
                name,
                type,
            },
        ]
        editField('config.fields', fields)

        this.setState({
            isAddingField: false,
        })
    }

    cancelAddField = () => {
        this.setState({
            isAddingField: false,
        })
    }

    deleteField = (name: string) => {
        const { editField } = this.props
        const fields = this.getStreamFields().filter((field) => field.name !== name)
        editField('config.fields', fields)
    }

    onAutoConfigureChange = (checked: boolean) => {
        this.setState({
            alwaysTryToAutoConfigure: checked,
        })
    }

    onRequireSignedChange = (checked: boolean) => {
        this.setState({
            requireSignedMessages: checked,
        })
    }

    render() {
        const { stream } = this.props
        const { isAddingField, alwaysTryToAutoConfigure, requireSignedMessages } = this.state

        return (
            <div>
                <Row className={styles.helpText}>
                    <Col {...leftColumn}>
                        <Translate value="userpages.streams.edit.configure.help" tag="p" className={styles.longText} />
                    </Col>
                </Row>
                {stream && stream.config && stream.config.fields &&
                    <Fragment>
                        <Row>
                            <Col {...leftColumn}>
                                <Translate value="userpages.streams.edit.configure.fieldName" />
                            </Col>
                            <Col {...rightColumn}>
                                <Translate value="userpages.streams.edit.configure.dataType" />
                            </Col>
                        </Row>
                        <FieldList onSortEnd={this.onSortEnd}>
                            {/* eslint-disable react/no-array-index-key */}
                            {stream.config.fields.map((field, index) => (
                                <FieldItem key={index} name={field.name}>
                                    <Row>
                                        <Col {...leftColumn}>
                                            <TextInput
                                                label=""
                                                value={field.name}
                                                onChange={(e) => this.onFieldNameChange(field.name, e.target.value)}
                                            />
                                        </Col>
                                        <Col {...rightColumn}>
                                            <Dropdown
                                                title=""
                                                defaultSelectedItem={field.type}
                                                onChange={(val) => this.onFieldTypeChange(field.name, val)}
                                                className={styles.permissionsDropdown}
                                            >
                                                {fieldTypes.map((t) => (
                                                    <Dropdown.Item
                                                        key={t}
                                                        value={t}
                                                    >
                                                        {t}
                                                    </Dropdown.Item>
                                                ))}
                                            </Dropdown>
                                            <Button
                                                outline
                                                className={`grey-outline ${styles.deleteFieldButton}`}
                                                onClick={() => this.deleteField(field.name)}
                                            >
                                                <Translate value="userpages.streams.edit.configure.delete" />
                                            </Button>
                                        </Col>
                                    </Row>
                                </FieldItem>
                            ))}
                        </FieldList>
                    </Fragment>
                }
                {!isAddingField &&
                    <Button className={`grey-outline ${styles.addFieldButton}`} outline onClick={this.addNewField}>
                        <Translate value="userpages.streams.edit.configure.addField" />
                    </Button>
                }
                {isAddingField &&
                    <NewFieldEditor
                        previousFields={this.getStreamFields()}
                        onConfirm={this.confirmAddField}
                        onCancel={this.cancelAddField}
                    />
                }
                <div className={styles.settings}>
                    {/* eslint-disable jsx-a11y/label-has-associated-control */}
                    <Row>
                        <Col {...leftColumn}>
                            <label htmlFor="auto-configure">
                                <Translate value="userpages.streams.edit.configure.autoConfigure" />
                            </label>
                        </Col>
                        <Col {...rightColumn} className={styles.toggle}>
                            <Toggle id="auto-configure" value={alwaysTryToAutoConfigure} onChange={this.onAutoConfigureChange} />
                        </Col>
                    </Row>
                    <Row>
                        <Col {...leftColumn}>
                            <label htmlFor="require-signed">
                                <Translate value="userpages.streams.edit.configure.requireSignedMessages" />
                            </label>
                        </Col>
                        <Col {...rightColumn} className={styles.toggle}>
                            <Toggle id="require-signed" value={requireSignedMessages} onChange={this.onRequireSignedChange} />
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectEditedStream(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    copyStreamId: (id) => dispatch(copy(id)),
    editField: (field: string, data: any) => dispatch(updateEditStreamField(field, data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureView)
