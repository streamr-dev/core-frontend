// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Col, Row, Button } from 'reactstrap'
import copy from 'copy-to-clipboard'
import { arrayMove } from 'react-sortable-hoc'
import { Translate } from 'react-redux-i18n'
import uuid from 'uuid'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import FieldList from '$shared/components/FieldList'
import FieldItem from '$shared/components/FieldList/FieldItem'
import Dropdown from '$shared/components/Dropdown'
import { updateEditStreamField, updateEditStream } from '$userpages/modules/userPageStreams/actions'
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
    updateEditStream: (data: Stream) => void,
}

type Props = StateProps & DispatchProps

type State = {
    isAddingField: boolean,
}

export class ConfigureView extends Component<Props, State> {
    state = {
        isAddingField: false,
    }

    componentDidUpdate(prevProps: Props) {
        if (this.validFieldProps(prevProps) && this.validFieldProps(this.props) &&
        // $FlowFixMe
        (this.props.stream.config.fields !== prevProps.stream.config.fields)) {
            const { editField } = this.props
            const fields = this.getStreamFields()
            editField('config.fields', fields)
        }
    }

    validFieldProps = (props: Props) => props.stream && props.stream.config && props.stream.config.fields

    getStreamFields = () => {
        const { stream } = this.props
        if (stream && stream.config && stream.config.fields) {
            return this.addTempIdsToStreamFields(stream)
        }
        return []
    }

    addTempIdsToStreamFields = (stream: Stream) => (
        // $FlowFixMe
        stream.config.fields.map((field) => (
            {
                ...field,
                id: field.id ? field.id : uuid(),
            }
        ))
    )

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
        if (this.liveEditIsValid(value, fields)) {
            editField(`config.fields[${index}].name`, value)
        }
    }

    onFieldTypeChange = (fieldName: string, value: string) => {
        const { editField } = this.props
        const fields = this.getStreamFields()
        const index = fields.findIndex((field) => field.name === fieldName)
        editField(`config.fields[${index}].type`, value)
    }

    liveEditIsValid = (value: string, previousFields: any) => !(value.length === 0 || previousFields.find((field) => field.name === value))

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
                id: uuid(),
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
        const { updateEditStream, stream } = this.props

        updateEditStream({
            ...stream,
            autoConfigure: checked,
        })
    }

    onRequireSignedChange = (checked: boolean) => {
        const { updateEditStream, stream } = this.props

        updateEditStream({
            ...stream,
            requireSignedData: checked,
        })
    }

    render() {
        const { stream } = this.props
        const { isAddingField } = this.state

        return (
            <div>
                <Row className={styles.helpText}>
                    <Col xs={12}>
                        <Translate value="userpages.streams.edit.configure.help" tag="p" className={styles.longText} />
                    </Col>
                </Row>
                {stream && stream.config && stream.config.fields && !!stream.config.fields.length &&
                    <Fragment>
                        <div className={styles.fieldHeaderRow}>
                            <Row>
                                <Col {...leftColumn}>
                                    <Translate value="userpages.streams.edit.configure.fieldName" />
                                </Col>
                                <Col {...rightColumn}>
                                    <Translate value="userpages.streams.edit.configure.dataType" className={styles.dataTypeHeader} />
                                </Col>
                            </Row>
                        </div>
                        <FieldList onSortEnd={this.onSortEnd}>
                            {stream.config.fields.map((field, index) => (
                                <div className={styles.hoverContainer} key={field.id || index} >
                                    <div className={styles.fieldItem} >
                                        <FieldItem name={field.name}>
                                            <Row>
                                                <Col {...leftColumn}>
                                                    <Translate
                                                        value="userpages.streams.edit.configure.fieldName"
                                                        className={styles.tabletHeading}
                                                        tag="span"
                                                    />
                                                    <TextInput
                                                        label=""
                                                        value={field.name}
                                                        onChange={(e) => this.onFieldNameChange(field.name, e.target.value)}
                                                    />
                                                </Col>
                                                <Col {...rightColumn}>
                                                    <Translate
                                                        value="userpages.streams.edit.configure.dataType"
                                                        className={styles.tabletHeading}
                                                        tag="span"
                                                    />
                                                    <Dropdown
                                                        title=""
                                                        selectedItem={field.type}
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
                                                        color="userpages"
                                                        className={styles.deleteFieldButton}
                                                        onClick={() => this.deleteField(field.name)}
                                                    >
                                                        <Translate value="userpages.streams.edit.configure.delete" />
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </FieldItem>
                                    </div>
                                </div>
                            ))}
                        </FieldList>
                    </Fragment>}
                {!isAddingField &&
                    <Button color="userpages" className={styles.addFieldButton} outline onClick={this.addNewField}>
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
                    {stream && stream.autoConfigure !== undefined &&
                        <Fragment>
                            <Row>
                                <Col {...leftColumn}>
                                    <label htmlFor="auto-configure">
                                        <Translate value="userpages.streams.edit.configure.autoConfigure" />
                                    </label>
                                </Col>
                                <Col sm={12} md={3} className={styles.toggle}>
                                    <Toggle id="auto-configure" value={stream.autoConfigure} onChange={this.onAutoConfigureChange} />
                                </Col>
                            </Row>
                        </Fragment>}
                    <Row>
                        {stream && stream.requireSignedData !== undefined &&
                            <Fragment>
                                <Col {...leftColumn}>
                                    <label htmlFor="require-signed">
                                        <Translate value="userpages.streams.edit.configure.requireSignedData" />
                                    </label>
                                </Col>
                                <Col sm={12} md={3} className={styles.toggle}>
                                    <Toggle id="require-signed" value={stream.requireSignedData} onChange={this.onRequireSignedChange} />
                                </Col>
                            </Fragment>}
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
    updateEditStream: (data: Stream) => dispatch(updateEditStream(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureView)
