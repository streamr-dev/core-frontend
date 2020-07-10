// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import copy from 'copy-to-clipboard'
import { arrayMove } from 'react-sortable-hoc'
import { I18n, Translate } from 'react-redux-i18n'
import uuid from 'uuid'

import Button from '$shared/components/Button'
import Spinner from '$shared/components/Spinner'
import type { Stream, StreamId } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import FieldList from '$shared/components/FieldList'
import FieldItem from '$shared/components/FieldList/FieldItem'
import Select from '$ui/Select'
import { updateEditStreamField, updateEditStream, streamFieldsAutodetect } from '$userpages/modules/userPageStreams/actions'
import { selectEditedStream, selectFieldsAutodetectFetching, fieldTypes } from '$userpages/modules/userPageStreams/selectors'
import Text from '$ui/Text'
import SplitControl from '$userpages/components/SplitControl'
import WithInputActions from '$shared/components/WithInputActions'

import styles from './configureView.pcss'
import NewFieldEditor from './NewFieldEditor'

type OwnProps = {
    disabled: boolean,
}

type StateProps = {
    stream: ?Stream,
    fieldsAutodetectFetching: boolean,
}

type DispatchProps = {
    copyStreamId: (string) => void,
    editField: (string, any) => void,
    updateEditStream: (data: Stream) => void,
    streamFieldsAutodetect: (id: StreamId) => Promise<void>,
}

type Props = OwnProps & StateProps & DispatchProps

type State = {
    isAddingField: boolean,
}

export class ConfigureView extends Component<Props, State> {
    typeOptions: Array<any> = fieldTypes.map((t) => ({
        value: t,
        label: I18n.t(`userpages.streams.fieldTypes.${t}`),
    }))

    state = {
        isAddingField: false,
    }

    componentDidUpdate(prevProps: Props) {
        const { config = {} } = this.props.stream || {}
        const { config: prevConfig = {} } = prevProps.stream || {}

        if (config.fields && prevConfig.fields && config.fields !== prevConfig.fields) {
            const { editField } = this.props
            const fields = this.getStreamFields()
            editField('config.fields', fields)
        }
    }

    getStreamFields = () => {
        const { stream } = this.props
        if (stream && stream.config && stream.config.fields) {
            return this.addTempIdsToStreamFields(stream)
        }
        return []
    }

    addTempIdsToStreamFields = (stream: Stream): Array<any> => (
        (stream.config.fields || []).map((field) => (
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

    autodetectFields = () => {
        if (this.props.stream && this.props.stream.id) {
            // $FlowFixMe: "streamFieldsAutodetect is missing in OwnProps or StateProps"
            return this.props.streamFieldsAutodetect(this.props.stream.id)
        }
    }

    render() {
        const { stream, disabled } = this.props
        const { isAddingField } = this.state

        return (
            <div>
                <Translate value="userpages.streams.edit.configure.help" tag="p" className={styles.longText} />
                {stream && stream.config && stream.config.fields && !!stream.config.fields.length &&
                    <Fragment>
                        <SplitControl className={styles.fieldHeaderRow}>
                            <Translate value="userpages.streams.edit.configure.fieldName" />
                            <Translate value="userpages.streams.edit.configure.dataType" />
                        </SplitControl>
                        <FieldList onSortEnd={this.onSortEnd} disabled={disabled}>
                            {stream.config.fields.map((field, index) => (
                                <div className={styles.hoverContainer} key={field.id || index} >
                                    <div className={styles.fieldItem} >
                                        <FieldItem name={field.name} onDelete={() => this.deleteField(field.name)}>
                                            <SplitControl>
                                                <WithInputActions
                                                    disabled={disabled}
                                                >
                                                    <Text
                                                        value={field.name}
                                                        onChange={(e) => this.onFieldNameChange(field.name, e.target.value)}
                                                        disabled={disabled}
                                                    />
                                                </WithInputActions>
                                                <Select
                                                    className={styles.select}
                                                    disabled={disabled}
                                                    options={this.typeOptions}
                                                    value={this.typeOptions.find((t) => t.value === field.type)}
                                                    onChange={(o) => this.onFieldTypeChange(field.name, o.value)}
                                                />
                                            </SplitControl>
                                        </FieldItem>
                                    </div>
                                </div>
                            ))}
                        </FieldList>
                    </Fragment>}
                {!isAddingField &&
                    <React.Fragment>
                        <Button
                            kind="secondary"
                            className={styles.addFieldButton}
                            onClick={this.addNewField}
                            disabled={disabled}
                        >
                            <Translate value="userpages.streams.edit.configure.addField" />
                        </Button>
                        <Button
                            kind="secondary"
                            outline
                            onClick={this.autodetectFields}
                            disabled={this.props.fieldsAutodetectFetching || disabled}
                        >
                            {!this.props.fieldsAutodetectFetching && (
                                <Translate value="userpages.streams.edit.configure.autodetect" />
                            )}
                            {this.props.fieldsAutodetectFetching && (
                                <Fragment>
                                    <Translate value="userpages.streams.edit.configure.waiting" />
                                    <Spinner size="small" className={styles.spinner} color="white" />
                                </Fragment>
                            )}
                        </Button>
                    </React.Fragment>
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
    fieldsAutodetectFetching: selectFieldsAutodetectFetching(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    copyStreamId: (id) => dispatch(copy(id)),
    editField: (field: string, data: any) => dispatch(updateEditStreamField(field, data)),
    updateEditStream: (data: Stream) => dispatch(updateEditStream(data)),
    streamFieldsAutodetect: (id: StreamId) => dispatch(streamFieldsAutodetect(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureView)
