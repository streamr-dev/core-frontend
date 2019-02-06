// @flow

import React, { Component, type Element } from 'react'
import Dropzone from 'react-dropzone'

import styles from './fileUpload.pcss'

export type DropzoneFile = File & {
    preview?: string,
}

export const fileUploadErrors = {
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    INVALID_MIME_TYPE: 'INVALID_MIME_TYPE',
}
export type FileUploadError = $Keys<typeof fileUploadErrors>

type Props = {
    component: Element<any>,
    dropTargetComponent: Element<any>,
    dragOverComponent?: Element<any>,
    onFilesAccepted: (Array<File>) => void,
    onError?: (error: FileUploadError) => void,
    acceptMime: Array<string>,
    maxFileSizeInMB: number,
}

type State = {
    isDragActive: boolean,
    isDragOver: boolean,
}

class FileUpload extends Component<Props, State> {
    constructor() {
        super()
        window.addEventListener('dragenter', this.onWindowDragEnter)
        window.addEventListener('dragleave', this.onWindowDragLeave)
        window.addEventListener('drop', this.onWindowDrop)
    }

    state = {
        isDragActive: false,
        isDragOver: false,
    }

    componentWillUnmount() {
        window.removeEventListener('dragenter', this.onWindowDragEnter)
        window.removeEventListener('dragleave', this.onWindowDragLeave)
        window.removeEventListener('drop', this.onWindowDrop)
    }

    onDrop = (files: Array<DropzoneFile>) => {
        const { onFilesAccepted } = this.props

        if (files && files.length > 0) {
            onFilesAccepted(files)
        }
    }

    onDropRejected = ([file]: any) => {
        const { onError, acceptMime, maxFileSizeInMB } = this.props

        if (onError) {
            if (file.size > this.megabytesToBytes(maxFileSizeInMB)) {
                onError(fileUploadErrors.FILE_TOO_LARGE)
            }

            if (!acceptMime.includes(file.type)) {
                onError(fileUploadErrors.INVALID_MIME_TYPE)
            }
        }
    }

    onDragOver = () => {
        this.setState({
            isDragOver: true,
        })
    }

    onDragLeave = () => {
        this.setState({
            isDragOver: false,
        })
    }

    onWindowDragEnter = (event: DragEvent) => {
        this.lastTarget = event.target
        this.setState({
            isDragActive: true,
        })
    }

    onWindowDragLeave = (event: DragEvent) => {
        if (this.lastTarget === event.target || event.target === document) {
            this.setState({
                isDragActive: false,
                isDragOver: false,
            })
        }
    }

    onWindowDrop = () => {
        this.setState({
            isDragActive: false,
            isDragOver: false,
        })
    }

    lastTarget = null

    megabytesToBytes = (mb: number) => mb * 1024 * 1024

    renderChildren() {
        const { component, dropTargetComponent, dragOverComponent } = this.props
        const { isDragActive, isDragOver } = this.state

        if (isDragActive && (!isDragOver || dragOverComponent == null)) {
            return dropTargetComponent
        } else if (isDragOver && dragOverComponent != null) {
            return dragOverComponent
        }

        return component
    }

    render() {
        const {
            component,
            dropTargetComponent,
            dragOverComponent,
            onFilesAccepted,
            onError,
            acceptMime,
            maxFileSizeInMB,
            ...rest
        } = this.props

        return (
            <Dropzone
                className={styles.dropzone}
                onDrop={this.onDrop}
                onDropRejected={this.onDropRejected}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                accept={acceptMime.join(', ')}
                maxSize={this.megabytesToBytes(maxFileSizeInMB)}
                {...rest}
            >
                {this.renderChildren()}
            </Dropzone>
        )
    }
}

export default FileUpload
