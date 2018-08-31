// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Col, Label, Form, FormGroup, Button } from 'reactstrap'
import Select from 'react-select'
import serialize from 'form-serialize'
import { confirmCsvFileUpload } from '../../../modules/stream/actions'

import type { CSVImporterSchema, Stream } from '../../../flowtype/stream-types'
import type { StreamState } from '../../../flowtype/states/stream-state'
import type { OnSubmitEvent } from '../../../flowtype/common-types'
import links from '../../../links'
import styles from './csvImportView.pcss'

type StateProps = {
    stream: ?Stream
}

type RouterProps = {
    location: {
        path: string,
        state?: {
            schema: ?CSVImporterSchema,
            fileUrl: ?string
        }
    },
    history: {
        push: (location: string, data?: {}) => void,
        replace: (location: string) => void
    }
}

type DispatchProps = {
    confirmCsvUpload: (id: $ElementType<Stream, 'id'>, fileUrl: string, dateFormat: string, timestampColumnIndex: number) => Promise<void>
}

type Props = StateProps & DispatchProps & RouterProps

type State = {
    dateFormat: ?string,
    timestampColumnIndex: number,
    fileUrl: ?string,
    schema: ?CSVImporterSchema
}

export class ConfirmCsvImportView extends Component<Props, State> {
    state = {
        dateFormat: null,
        timestampColumnIndex: 0,
        fileUrl: null,
        schema: null,
    }

    componentWillMount() {
        if (this.props.location.state && this.props.location.state.fileUrl) {
            this.setState({
                fileUrl: this.props.location.state && this.props.location.state.fileUrl,
                schema: this.props.location.state && this.props.location.state.schema,
            })
        } else if (this.props.stream) {
            this.props.history.push(`${links.streamShow}/${this.props.stream.id}`)
        }
    }

    onSubmit = (e: OnSubmitEvent) => {
        e.preventDefault()
        const { timestampColumnIndex, dateFormat } = serialize(e.target, {
            hash: true,
        })
        if (this.state.fileUrl && this.props.stream) {
            this.props.confirmCsvUpload(this.props.stream.id, this.state.fileUrl, dateFormat, timestampColumnIndex)
                .then(() => {
                    const id = this.props.stream ? this.props.stream.id : ''
                    this.props.history.replace(this.props.location.path)
                    this.props.history.push(`${links.streamShow}/${id}`)
                })
        }
    }

    onTimestampColumnIndexChange = (index: number) => {
        this.setState({
            timestampColumnIndex: index,
        })
    }

    onDateFormatChange = (value: string) => {
        this.setState({
            dateFormat: value,
        })
    }

    render() {
        const headers = (this.state.schema && this.state.schema.headers) || []
        return (
            <div className={styles.csvImportView}>
                <span>Streams - Import CSV Data</span>
                <Col md={6} mdOffset={3} lg={4} lgOffset={4}>
                    <span>Configure csv file</span>
                    <Form onSubmit={this.onSubmit}>
                        <FormGroup>
                            <Label>The column of the timestamp</Label>
                            <Select
                                name="timestampColumnIndex"
                                value={this.state.timestampColumnIndex}
                                onChange={this.onTimestampColumnIndexChange}
                                options={headers.map((h, i) => ({
                                    value: i,
                                    label: `${i}: ${h}`,
                                }))}
                                searchable={false}
                                clearable={false}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Date format</Label>
                            <Select.Creatable
                                name="dateFormat"
                                value={this.state.dateFormat}
                                onChange={this.onDateFormatChange}
                                options={Object.entries({
                                    'dd-MM-yyyy HH:mm:ss.SSS': 'dd/MM/yyyy HH:mm:ss.SSS',
                                    'MM-dd-yyyy HH:mm:ss.SSS': 'MM/dd/yyyy HH:mm:ss.SSS',
                                    unix: 'Java timestamp (milliseconds since January 1st 1970 UTC)',
                                    'unix-s': 'Unix timestamp (seconds since January 1st 1970 UTC)',
                                }).map(([value, label]) => ({
                                    value,
                                    label,
                                }))}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            Select from the list or type your own
                            (must be in
                            <a
                                href="https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html"
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                            >
                                Java SimpleDateFormat pattern syntax
                            </a>)
                        </FormGroup>
                        <Button
                            type="submit"
                            color="primary"
                        >
                            Send
                        </Button>
                    </Form>
                </Col>
            </div>
        )
    }
}

const mapStateToProps = ({ stream }: {stream: StreamState}): StateProps => ({
    stream: stream.openStream.id ? stream.byId[stream.openStream.id] : null,
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    confirmCsvUpload(id: $ElementType<Stream, 'id'>, fileUrl: string, dateFormat: string, timestampColumnIndex: number) {
        return dispatch(confirmCsvFileUpload(id, fileUrl, dateFormat, timestampColumnIndex))
    },
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConfirmCsvImportView))
