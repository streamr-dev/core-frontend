// @flow

import React, { Component, type Element } from 'react'
import Dropzone from 'react-dropzone'

import styles from './fileUpload.pcss'

type DropzoneFile = File & {
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
}

type State = {
    isDragActive: boolean,
    isDragOver: boolean,
}

const MaxFileSize = 5242880

class ImageUpload extends Component<Props, State> {
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
        const { onError, acceptMime } = this.props

        if (onError) {
            if (file.size > MaxFileSize) {
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
        return (
            <Dropzone
                multiple={false}
                className={styles.dropzone}
                onDrop={this.onDrop}
                onDropRejected={this.onDropRejected}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                accept={this.props.acceptMime.join(', ')}
                maxSize={MaxFileSize}
                disablePreview
            >
                <div>
                    {this.renderChildren()}
                </div>
            </Dropzone>
        )
    }
}

export default ImageUpload
