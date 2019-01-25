// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'reactstrap'
import { I18n } from 'react-redux-i18n'

import type { StreamId } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { CsvUploadState } from '$userpages/flowtype/states/stream-state'
import { getRange, deleteDataUpTo, uploadCsvFile, confirmCsvFileUpload } from '$userpages/modules/userPageStreams/actions'
import { selectDeleteDataError, selectUploadCsvState } from '$userpages/modules/userPageStreams/selectors'
import TextInput from '$shared/components/TextInput'
import FileUpload from '$shared/components/FileUpload'
import DatePicker from '$shared/components/DatePicker'
import ConfirmCsvImportDialog from '$userpages/components/StreamPage/ConfirmCsvImportDialog'

import { leftColumn, rightColumn } from '../../constants'
import styles from './historyView.pcss'

type OwnProps = {
    streamId: ?StreamId,
}

type StateProps = {
    deleteDataError: ?ErrorInUi,
    csvUploadState: ?CsvUploadState,
}

type DispatchProps = {
    deleteDataUpTo: (streamId: StreamId, date: Date) => Promise<any>,
    getRange: (streamId: StreamId) => Promise<any>,
    uploadCsvFile: (streamId: StreamId, file: File) => Promise<any>,
    confirmCsvUpload: (id: StreamId, fileId: string, dateFormat: string, timestampColumnIndex: number) => Promise<void>
}

type Props = OwnProps & StateProps & DispatchProps

type State = {
    range: ?{
        beginDate: string,
        endDate: string,
    },
    deleteDate: ?Date,
    isModalOpen: boolean,
    csvFile: ?File,
    confirmError: ?string,
}

const DropTarget = ({ mouseOver }: { mouseOver: boolean }) => (
    mouseOver ? <span>Mouse over</span> : <span>Mouse not over</span>
)

class HistoryView extends Component<Props, State> {
    state = {
        range: undefined,
        deleteDate: undefined,
        isModalOpen: false,
        csvFile: undefined,
        confirmError: undefined,
    }

    componentDidUpdate(prevProps) {
        const { streamId } = this.props
        const { streamId: prevStreamId } = prevProps

        // Load data if stream changes
        if (streamId && streamId !== prevStreamId) {
            this.loadData(streamId)
        }
    }

    loadData(streamId: StreamId) {
        this.props.getRange(streamId).then((range) => {
            this.setState({
                range,
            })
        }, console.error)
    }

    onDeleteDateChanged = (date) => {
        this.setState({
            deleteDate: date,
        })
    }

    deleteDataUpTo = (streamId: StreamId, date: ?Date) => {
        if (date) {
            this.props.deleteDataUpTo(streamId, date)
        }
    }

    onDropAccepted = (files: Array<File>) => {
        if (files.length <= 0) {
            return
        }

        this.setState({
            csvFile: files[0],
        }, this.uploadCsv)
    }

    uploadCsv = () => {
        const { streamId, uploadCsvFile } = this.props
        const { csvFile } = this.state

        if (streamId && csvFile) {
            uploadCsvFile(streamId, csvFile)
                .then(() => {})
                .catch(() => {
                    this.openConfigurationModal()
                })
        }
    }

    openConfigurationModal = () => {
        this.setState({
            isModalOpen: true,
        })
    }

    closeConfigurationModal = () => {
        this.setState({
            isModalOpen: false,
            confirmError: null,
        })
    }

    onConfirmFields = (format: string, timestampColumnIndex: number) => {
        const { streamId, csvUploadState } = this.props
        if (streamId && csvUploadState && csvUploadState.fileUrl) {
            this.props.confirmCsvUpload(streamId, csvUploadState.fileUrl, format, timestampColumnIndex)
                .then(() => {
                    this.closeConfigurationModal()
                })
                .catch(() => {
                    this.setState({
                        confirmError: I18n.t('userpages.streams.edit.history.parseError'),
                    })
                    // Backend will destroy file reference on error
                    // so we need to upload the file again
                    this.uploadCsv()
                })
        }
    }

    render() {
        const { range, deleteDate, isModalOpen, confirmError } = this.state
        const { streamId, deleteDataError, csvUploadState } = this.props
        const storedEventsText = (range && range.beginDate && range.endDate) ?
            I18n.t('userpages.streams.edit.history.events', {
                start: range && new Date(range.beginDate).toLocaleDateString(),
                end: range && new Date(range.endDate).toLocaleDateString(),
            }) :
            I18n.t('userpages.streams.edit.history.noEvents')
        return (
            <Fragment>
                <Row>
                    <Col {...leftColumn}>
                        <FileUpload
                            className={styles.row}
                            component={
                                <TextInput
                                    label={I18n.t('userpages.streams.edit.history.storedEvents')}
                                    value={storedEventsText}
                                    readOnly
                                    preserveLabelSpace
                                />
                            }
                            dropTargetComponent={<DropTarget mouseOver={false} />}
                            dragOverComponent={<DropTarget mouseOver />}
                            onFilesAccepted={this.onDropAccepted}
                            onError={(error) => console.error(error)}
                            acceptMime={['text/csv']}
                            maxFileSizeInMB={5}
                            multiple={false}
                            disablePreview
                        />
                    </Col>
                </Row>
                {streamId && range && (
                    <Row>
                        <Col {...leftColumn}>
                            <DatePicker
                                label={I18n.t('userpages.streams.edit.history.deleteEvents')}
                                openOnFocus
                                onChange={this.onDeleteDateChanged}
                                error={(deleteDataError && deleteDataError.message) || ''}
                                value={deleteDate}
                                preserveLabelSpace
                                preserveErrorSpace
                            />
                        </Col>
                        <Col {...rightColumn}>
                            <Button
                                className={styles.deleteButton}
                                color="userpages"
                                onClick={() => this.deleteDataUpTo(streamId, deleteDate)}
                            >
                                Delete
                            </Button>
                        </Col>
                    </Row>
                )}
                {isModalOpen && (
                    <ConfirmCsvImportDialog
                        streamId={streamId}
                        csvUploadState={csvUploadState}
                        onConfirm={this.onConfirmFields}
                        onClose={this.closeConfigurationModal}
                        errorMessage={confirmError || ''}
                    />
                )}
            </Fragment>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    deleteDataError: selectDeleteDataError(state),
    csvUploadState: selectUploadCsvState(state),
})

const mapDispatchToProps = (dispatch): DispatchProps => ({
    deleteDataUpTo: (streamId: StreamId, date: Date) => dispatch(deleteDataUpTo(streamId, date)),
    getRange: (streamId: StreamId) => dispatch(getRange(streamId)),
    uploadCsvFile: (streamId: StreamId, file: File) => dispatch(uploadCsvFile(streamId, file)),
    confirmCsvUpload: (id: StreamId, fileId: string, dateFormat: string, timestampColumnIndex: number) =>
        dispatch(confirmCsvFileUpload(id, fileId, dateFormat, timestampColumnIndex)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoryView)
