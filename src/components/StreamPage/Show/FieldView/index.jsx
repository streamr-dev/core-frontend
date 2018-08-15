// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Panel, Table, Button, FormControl, Alert } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
import serialize from 'form-serialize'
import { error } from 'react-notification-system-redux'
import _ from 'lodash'
import { saveFields } from '../../../../modules/stream/actions'

import type { Stream, StreamField } from '../../../../flowtype/stream-types'
import type { StreamState } from '../../../../flowtype/states/stream-state'

type StateProps = {
    stream: ?Stream
}

type DispatchProps = {
    showError: (err: {title: string, message?: string}) => void,
    saveFields: (id: $ElementType<Stream, 'id'>, fields: Array<StreamField>) => Promise<Array<StreamField>>
}

type Props = StateProps & DispatchProps

type State = {
    editing: boolean,
    fields: Array<StreamField>,
    duplicateFieldIndexes: Array<number>,
    newField: ?{
        name: string,
        type: string
    }
}

import styles from './fieldView.pcss'

const config = require('../../streamConfig')

export class FieldView extends Component<Props, State> {
    static defaultProps = {
        stream: {
            name: '',
        },
    }

    state = {
        editing: false,
        newField: null,
        fields: [],
        duplicateFieldIndexes: [],
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onBeforeUnload)
    }

    componentWillReceiveProps(props: Props) {
        if (!this.state.editing) {
            this.setState(({ fields }) => ({
                fields: (props.stream && props.stream.config && props.stream.config.fields && props.stream.config.fields) || fields || [],
            }))
        }
    }

    onBeforeUnload = (e: Event & { returnValue: ?string }): ?string => {
        const o = (this.props.stream && this.props.stream.config && this.props.stream.config.fields) || []
        const n = this.state.fields || []
        const changed = o.length !== n.length || _.differenceWith(o, n, _.isEqual).length > 0
        if (changed) {
            const message = 'You have unsaved changes in the field editor. Are you sure you want to leave?'
            e.returnValue = message
            return message
        }
    }

    onChange = () => {
        this.parseFormAndSetState()
    }

    onSubmit = (e: Event) => {
        e.preventDefault()
        this.parseFormAndSetState(true)
    }

    static getNameForInput(type: string, i: number | string): string {
        return `${type}_${i}`
    }

    form: ?HTMLFormElement

    startEditing = () => {
        this.setState({
            editing: true,
        })
    }

    save = () => {
        if (this.state.duplicateFieldIndexes.length === 0) {
            if (this.props.stream && this.state.fields) {
                this.props.saveFields(this.props.stream.id, this.state.fields)
                    .then(() => {
                        this.setState({
                            editing: false,
                        })
                    })
            }
        } else {
            const duplicateField = this.state.fields && this.state.fields[this.state.duplicateFieldIndexes[0]]
            const duplicateFieldName = (duplicateField && duplicateField.name) || ''
            this.props.showError({
                title: `Duplicate field names: ${duplicateFieldName}`,
            })
        }
    }

    cancelEditing = () => {
        this.setState({
            editing: false,
            fields: this.props.stream ? this.props.stream.config.fields : [],
        })
    }

    findDuplicatesFromFields = (fields: ?Array<StreamField>) => {
        if (fields) {
            const duplicates = []
            fields.reduce((existingFieldsWithIndexes, currentField, i) => {
                if (currentField && currentField.name) {
                    if (existingFieldsWithIndexes[currentField.name] !== undefined) {
                        duplicates.push(existingFieldsWithIndexes[currentField.name], i)
                    } else {
                        existingFieldsWithIndexes[currentField.name] = i
                    }
                }
                return existingFieldsWithIndexes
            }, {})
            this.setState({
                duplicateFieldIndexes: duplicates,
            })
        }
    }

    parseFormAndSetState = (addNew: boolean = false) => {
        const data = serialize(this.form, {
            hash: true,
            empty: true,
        })
        const fields: Array<{
            name: string,
            type: string,
            remove?: ?string
        }> = []
        let newField: StreamField
        Object.keys(data).forEach((key) => {
            const typeOfField = key.replace(/_(\w|\d)+/, '')
            const i = parseFloat(key.replace(/(\w+)_/, ''))
            const value = data[key]
            if (!Number.isNaN(i)) {
                fields[i] = {
                    ...(fields[i] || {}),
                    [typeOfField]: value,
                }
            }
        })
        const newFieldName = data[FieldView.getNameForInput('name', 'new')]
        const newFieldType = data[FieldView.getNameForInput('type', 'new')]
        if (addNew) {
            if (newFieldName && newFieldType) {
                fields.push({
                    name: newFieldName,
                    type: newFieldType,
                })
            }
        } else {
            newField = {
                name: newFieldName,
                type: newFieldType,
            }
        }
        const newFields = fields.filter((f) => !f.remove).map((f) => ({
            name: f.name,
            type: f.type,
        }))
        this.setState({
            fields: newFields,
            newField: addNew ? null : newField,
        })
        this.findDuplicatesFromFields(newFields)
    }

    render() {
        const NameField = (props: {inputName: string, value?: ?string}) => (
            <FormControl
                bsSize="sm"
                placeholder="Name"
                name={props.inputName}
                defaultValue={props.value}
                onBlur={this.onChange}
            />
        )
        const TypeField = (props: {inputName: string, value?: ?string}) => (
            <FormControl
                componentClass="select"
                placeholder="select"
                bsSize="sm"
                name={props.inputName}
                defaultValue={props.value}
                onChange={this.onChange}
            >
                {config.fieldTypes.map((t) => (
                    <option
                        key={t}
                        value={t}
                    >
                        {t}
                    </option>
                ))}
            </FormControl>
        )
        const RemoveField = (props: {inputName: string}) => (
            <Button
                bsSize="sm"
                bsStyle="danger"
                className={styles.removeFieldButton}
            >
                <input
                    type="checkbox"
                    name={props.inputName}
                    className={styles.removeFieldInput}
                    onChange={this.onChange}
                />
                <FontAwesome
                    name="minus"
                />
            </Button>
        )
        return (
            <Panel className={styles.fieldView}>
                <Panel.Heading>
                    Fields
                    {this.state.editing ? (
                        <div className="panel-heading-controls">
                            <Button
                                bsSize="sm"
                                onClick={this.save}
                                bsStyle="primary"
                            >
                                Save
                            </Button>
                            <Button
                                bsSize="sm"
                                onClick={this.cancelEditing}
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <div className="panel-heading-controls">
                            <Button id="configure-fields-button" bsSize="sm" onClick={this.startEditing}>Configure Fields</Button>
                        </div>
                    )}
                </Panel.Heading>
                <Panel.Body>
                    {(this.state.fields.length || this.state.editing) ? (
                        <form
                            id="configure-fields-form"
                            ref={(f) => { this.form = f }}
                            onSubmit={this.onSubmit}
                        >
                            <Table striped condensed hover className={this.state.editing && styles.editing}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        {this.state.editing && <th />}
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.fields.map(({ name, type }: {name: string, type: string}, i: number) => (this.state.editing ? (
                                        <tr key={name} className={this.state.duplicateFieldIndexes.includes(i) ? styles.duplicate : ''}>
                                            <td>
                                                <NameField
                                                    inputName={FieldView.getNameForInput('name', i)}
                                                    value={name}
                                                />
                                            </td>
                                            <td>
                                                <TypeField
                                                    inputName={FieldView.getNameForInput('type', i)}
                                                    value={type}
                                                />
                                            </td>
                                            <td>
                                                <RemoveField
                                                    inputName={FieldView.getNameForInput('remove', i)}
                                                />
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={name}>
                                            <td>{name}</td>
                                            <td>{type}</td>
                                        </tr>
                                    )))}
                                    {this.state.editing && (
                                        <tr className={styles.newFieldRow}>
                                            <td>
                                                <NameField
                                                    inputName={FieldView.getNameForInput('name', 'new')}
                                                    value={this.state.newField && this.state.newField.name}
                                                />
                                            </td>
                                            <td>
                                                <TypeField
                                                    inputName={FieldView.getNameForInput('type', 'new')}
                                                    value={this.state.newField && this.state.newField.type}
                                                />
                                            </td>
                                            <td style={{
                                                width: 0,
                                            }}
                                            >
                                                <Button
                                                    bsSize="sm"
                                                    bsStyle="success"
                                                    type="submit"
                                                    id="configure-new-field-button"
                                                >
                                                    <FontAwesome name="plus" />
                                                </Button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </form>
                    ) : (
                        <Alert>
                            <FontAwesome name="exclamation-mark" />
                            The fields for this stream are not yet configured. Click the button above to configure them.
                        </Alert>
                    )}
                </Panel.Body>
            </Panel>
        )
    }
}

const mapStateToProps = ({ stream }: { stream: StreamState }): StateProps => ({
    stream: stream.openStream.id ? stream.byId[stream.openStream.id] : null,
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    showError(err: {title: string, message?: string}) {
        dispatch(error(err))
    },
    saveFields(id: $ElementType<Stream, 'id'>, fields: Array<StreamField>) {
        return dispatch(saveFields(id, fields))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(FieldView)
