// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Col, Row, Button } from 'reactstrap'
import copy from 'copy-to-clipboard'
import { arrayMove } from 'react-sortable-hoc'

import type { Stream } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import FieldList from '$shared/components/FieldList'
import FieldItem from '$shared/components/FieldList/FieldItem'
import Dropdown from '$shared/components/Dropdown'
import { updateEditStreamField } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import TextInput from '$shared/components/TextInput'

import { leftColumn, rightColumn, fieldTypes } from '../../constants'

import styles from './fieldView.pcss'
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
}

export class FieldView extends Component<Props, State> {
    state = {
        isAddingField: false,
    }

    getStreamFields = () => {
        const { stream } = this.props
        const fields = (stream && stream.config && stream.config.fields) || []
        return fields
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
        const fields = [...this.getStreamFields()]

        fields.push({
            name,
            type,
        })
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
        const fields = [...this.getStreamFields()]
        const index = fields.findIndex((field) => field.name === name)
        fields.splice(index, 1)
        editField('config.fields', fields)
    }

    render() {
        const { stream } = this.props
        const { isAddingField } = this.state

        return (
            <div>
                {stream && stream.config && stream.config.fields &&
                    <Fragment>
                        <Row>
                            <Col {...leftColumn}>
                                Field name
                            </Col>
                            <Col {...rightColumn}>
                                Data type
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
                                        </Col>
                                        <Button
                                            className={styles.deleteFieldButton}
                                            onClick={() => this.deleteField(field.name)}
                                        >
                                            Delete
                                        </Button>
                                    </Row>
                                </FieldItem>
                            ))}
                        </FieldList>
                    </Fragment>
                }
                {!isAddingField &&
                    <Button className={styles.addFieldButton} onClick={this.addNewField}>
                        + Add field
                    </Button>
                }
                {isAddingField &&
                    <NewFieldEditor
                        previousFields={this.getStreamFields()}
                        onConfirm={this.confirmAddField}
                        onCancel={this.cancelAddField}
                    />
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(FieldView)
