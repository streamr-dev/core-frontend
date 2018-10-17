// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import Dropzone from 'react-dropzone'
import { uploadCsvFile } from '$userpages/modules/userPageStreams/actions'

import type { StoreState } from '$userpages/flowtype/states/store-state'
import type { Stream, StreamId } from '$shared/flowtype/stream-types'

type StateProps = {
    stream: ?Stream,
    fileUrl: ?string,
    fetching: boolean
}

type DispatchProps = {
    uploadCsvFile: (streamId: StreamId, file: File) => Promise<any>
}

type RouterProps = {
    history: {
        push: (location: string) => void
    }
}

type Props = StateProps & DispatchProps & RouterProps

type State = {}

import styles from './csvImport.pcss'
import { selectOpenStream } from '$userpages/modules/userPageStreams/selectors'

export class CsvImport extends Component<Props, State> {
    onDropAccepted = ([file]: [File]) => {
        if (!this.props.stream) {
            return
        }

        this.props.uploadCsvFile(this.props.stream.id, file)
            .then(() => {})
            .catch(() => {
                if (this.props.fileUrl && this.props.stream) {
                    this.props.history.push(`${this.props.stream.id}/confirmCsvImport`)
                }
            })
    }

    createContent = ({ isDragReject }: {isDragReject: boolean}) => (
        <div className={styles.content}>
            <div className={styles.fileUploadIcon}>
                {this.props.fetching ? (
                    'Loading...'
                ) : (
                    'Upload'
                )}
            </div>
            <div className={styles.text}>
                {
                    (this.props.fetching && 'Uploading file')
                        || (isDragReject && 'Only .csv files are accepted')
                        || 'Drop a .csv file here to load history'
                }
            </div>
        </div>
    )

    render() {
        return (
            <Dropzone
                accept="text/csv, text/txt"
                multiple={false}
                className={styles.dropzone}
                onDropAccepted={this.onDropAccepted}
                activeClassName={styles.active}
                acceptClassName={styles.accept}
                rejectClassName={styles.reject}
                disabledClassName={styles.disabled}
                disabled={this.props.fetching}
            >
                {this.createContent}
            </Dropzone>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    stream: selectOpenStream(state),
    fetching: state.userPageStreams.csvUpload ? state.userPageStreams.csvUpload.fetching : false,
    fileUrl: state.userPageStreams.csvUpload && state.userPageStreams.csvUpload.fileUrl,
})

const mapDispatchToProps = (dispatch): DispatchProps => ({
    uploadCsvFile(streamId: StreamId, file: File) {
        return dispatch(uploadCsvFile(streamId, file))
    },
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CsvImport))
