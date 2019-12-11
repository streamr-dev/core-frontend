// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Translate, I18n } from 'react-redux-i18n'
import cx from 'classnames'

import type { Stream, StreamId, Range } from '$shared/flowtype/stream-types'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { CsvUploadState } from '$userpages/flowtype/states/stream-state'
import { getRange, deleteDataUpTo, uploadCsvFile, confirmCsvFileUpload, updateEditStream } from '$userpages/modules/userPageStreams/actions'
import { selectDeleteDataError, selectUploadCsvState, selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import Button from '$shared/components/Button'
import TextInput from '$shared/components/TextInput'
import FileUpload from '$shared/components/FileUpload'
import DatePicker from '$shared/components/DatePicker'
import SvgIcon from '$shared/components/SvgIcon'
import ConfirmCsvImportDialog from '$userpages/components/StreamPage/ConfirmCsvImportDialog'
import Spinner from '$shared/components/Spinner'
import CsvSchemaError from '$shared/errors/CsvSchemaError'
import SplitControl from '$userpages/components/SplitControl'

import styles from './historyView.pcss'

type OwnProps = {
    streamId: ?StreamId,
    disabled: boolean,
}

type StateProps = {
    stream: ?Stream,
    deleteDataError: ?ErrorInUi,
    csvUploadState: ?CsvUploadState,
}

type DispatchProps = {
    deleteDataUpTo: (streamId: StreamId, date: Date) => Promise<any>,
    getRange: (streamId: StreamId) => Promise<Range>,
    uploadCsvFile: (streamId: StreamId, file: File) => Promise<any>,
    confirmCsvUpload: (id: StreamId, fileId: string, dateFormat: string, timestampColumnIndex: number) => Promise<void>,
    updateEditStream: (data: Stream) => void,
}

type Props = OwnProps & StateProps & DispatchProps

type State = {
    range: ?Range,
    deleteDate: ?Date,
    isModalOpen: boolean,
    csvFile: ?File,
    confirmError: ?string,
    deleteInProgress: boolean,
}

const DropTarget = ({ mouseOver }: { mouseOver: boolean }) => (
    <div className={styles.dropTarget}>
        <div className={styles.dropTargetContent}>
            <SvgIcon
                name="csvUpload"
                className={cx(styles.icon, {
                    [styles.hover]: mouseOver,
                })}
            />
            <Translate value="userpages.streams.edit.history.uploadCsv" />
        </div>
    </div>
)

class HistoryView extends Component<Props, State> {
    state = {
        range: undefined,
        deleteDate: undefined,
        isModalOpen: false,
        csvFile: undefined,
        confirmError: undefined,
        deleteInProgress: false,
    }

    mounted = false
    fileUploadRef = React.createRef()

    componentDidMount() {
        this.mounted = true
    }

    componentWillUnmount() {
        this.mounted = false
    }

    async componentDidUpdate(prevProps) {
        const { streamId } = this.props
        const { streamId: prevStreamId } = prevProps

        // Load data if stream changes
        if (streamId && streamId !== prevStreamId) {
            await this.loadData()
        }
    }

    async loadData() {
        const { getRange, streamId } = this.props

        if (streamId) {
            const range = await getRange(streamId)
            if (this.mounted && range) {
                this.setState({
                    range,
                })
            }
        }
    }

    onDeleteDateChanged = (date) => {
        this.setState({
            deleteDate: date,
        })
    }

    onStoragePeriodChange = (e: SyntheticInputEvent<EventTarget>) => {
        // $FlowFixMe `updateEditStream` not in OwnProps or StateProps.
        const { updateEditStream, stream } = this.props
        const days = Number(e.target.value)

        updateEditStream({
            ...stream,
            storageDays: days,
        })
    }

    deleteDataUpTo = async (streamId: StreamId, date: ?Date) => {
        if (date) {
            if (this.mounted) {
                this.setState({
                    deleteInProgress: true,
                })
            }

            try {
                await this.props.deleteDataUpTo(streamId, date)
                await this.loadData()
            } finally {
                if (this.mounted) {
                    this.setState({
                        deleteInProgress: false,
                    })
                }
            }
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

    uploadCsv = async () => {
        const { streamId, uploadCsvFile } = this.props
        const { csvFile } = this.state

        if (streamId && csvFile) {
            try {
                await uploadCsvFile(streamId, csvFile)

                // Old API would accept the file as it is but now we
                // have to confirm the fields
                this.openConfigurationModal()
            } catch (error) {
                if (error instanceof CsvSchemaError) {
                    this.openConfigurationModal()
                }
            }
        }
    }

    openConfigurationModal = () => {
        this.setState({
            isModalOpen: true,
        })
    }

    closeConfigurationModal = () => {
        this.loadData()

        this.setState({
            isModalOpen: false,
            confirmError: null,
        })
    }

    onConfirmFields = (format: string, timestampColumnIndex: number): Promise<void> => {
        const { streamId, csvUploadState } = this.props
        if (streamId && csvUploadState && csvUploadState.fileUrl) {
            return this.props.confirmCsvUpload(streamId, csvUploadState.fileUrl, format, timestampColumnIndex)
                .then(() => {
                    this.closeConfigurationModal()
                })
                .catch(() => {
                    if (this.mounted) {
                        this.setState({
                            confirmError: I18n.t('userpages.streams.edit.history.parseError'),
                        })
                    }
                    // Backend will destroy file reference on error
                    // so we need to upload the file again
                    this.uploadCsv()
                })
        }

        return Promise.resolve()
    }

    handleBrowseFilesClick = () => {
        const { current: uploader } = this.fileUploadRef

        if (uploader) {
            uploader.open()
        }
    }

    render() {
        const {
            range,
            deleteDate,
            isModalOpen,
            confirmError,
            deleteInProgress,
        } = this.state
        const {
            streamId,
            deleteDataError,
            csvUploadState,
            stream,
            disabled,
        } = this.props
        const storedEventsText = (range && range.beginDate && range.endDate) ?
            I18n.t('userpages.streams.edit.history.events', {
                start: range && new Date(range.beginDate).toLocaleDateString(),
                end: range && new Date(range.endDate).toLocaleDateString(),
            }) :
            I18n.t('userpages.streams.edit.history.noEvents')

        return (
            <div className={styles.historyView}>
                {streamId && (
                    <Fragment>
                        <SplitControl>
                            <Translate value="userpages.streams.edit.history.upload.description" tag="p" className={styles.longText} />
                        </SplitControl>
                        <SplitControl>
                            <FileUpload
                                ref={this.fileUploadRef}
                                className={styles.fileUpload}
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
                                disabled={disabled}
                            />
                            <Button
                                kind="secondary"
                                className={styles.browseFiles}
                                onClick={() => this.handleBrowseFilesClick()}
                                disabled={disabled}
                            >
                                <Translate value="userpages.streams.edit.history.uploadCsvButton" />
                            </Button>
                        </SplitControl>
                    </Fragment>
                )}
                {!streamId && (
                    <SplitControl>
                        <Translate value="userpages.streams.edit.history.saveFirst" tag="p" className={styles.longText} />
                    </SplitControl>
                )}
                {streamId && range && (
                    <SplitControl>
                        <div className={styles.storedEventsContainer}>
                            <DatePicker
                                label={I18n.t('userpages.streams.edit.history.deleteEvents')}
                                openOnFocus
                                onChange={this.onDeleteDateChanged}
                                error={(deleteDataError && deleteDataError.message) || ''}
                                value={deleteDate || 'Select date'}
                                preserveLabelSpace
                                preserveErrorSpace
                                className={styles.storedEvents}
                                disabled={disabled}
                            />
                        </div>
                        <Button
                            kind="secondary"
                            className={styles.deleteButton}
                            onClick={() => this.deleteDataUpTo(streamId, deleteDate)}
                            disabled={deleteDate == null || disabled}
                        >
                            <Translate value="userpages.streams.edit.history.deleteRange" />
                            {deleteInProgress &&
                                <Fragment>
                                    <span>&nbsp;</span>
                                    <Spinner size="small" color="white" />
                                </Fragment>
                            }
                        </Button>
                    </SplitControl>
                )}
                {stream && stream.storageDays !== undefined &&
                    <Fragment>
                        <label htmlFor="storage-period">
                            <Translate
                                value="userpages.streams.edit.configure.historicalStoragePeriod.description"
                                className={cx(styles.longText, styles.historicalStoragePeriod)}
                                tag="p"
                            />
                        </label>
                        <TextInput
                            id="storage-period"
                            type="number"
                            label={I18n.t('userpages.streams.edit.configure.historicalStoragePeriod.label')}
                            value={stream.storageDays}
                            onChange={this.onStoragePeriodChange}
                            preserveLabelSpace
                            disabled={disabled}
                        />
                    </Fragment>}
                {isModalOpen && (
                    <ConfirmCsvImportDialog
                        streamId={streamId}
                        csvUploadState={csvUploadState}
                        onConfirm={this.onConfirmFields}
                        onClose={this.closeConfigurationModal}
                        errorMessage={confirmError || ''}
                    />
                )}
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    deleteDataError: selectDeleteDataError(state),
    csvUploadState: selectUploadCsvState(state),
    stream: selectEditedStream(state),
})

const mapDispatchToProps = (dispatch): DispatchProps => ({
    deleteDataUpTo: (streamId: StreamId, date: Date) => dispatch(deleteDataUpTo(streamId, date)),
    getRange: (streamId: StreamId) => dispatch(getRange(streamId)),
    uploadCsvFile: (streamId: StreamId, file: File) => dispatch(uploadCsvFile(streamId, file)),
    confirmCsvUpload: (id: StreamId, fileId: string, dateFormat: string, timestampColumnIndex: number) =>
        dispatch(confirmCsvFileUpload(id, fileId, dateFormat, timestampColumnIndex)),
    updateEditStream: (data: Stream) => dispatch(updateEditStream(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoryView)
