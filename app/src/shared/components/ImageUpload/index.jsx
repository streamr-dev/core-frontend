// @flow

import React, { Component, Fragment } from 'react'
import Dropzone from 'react-dropzone'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'
import MediaQuery from 'react-responsive'

import breakpoints from '$app/scripts/breakpoints'
import { maxFileSizeForImageUpload } from '$shared/utils/constants'
import PngIcon from '$shared/components/PngIcon'

import Notification from '$shared/utils/Notification'
import styles from './imageUpload.pcss'

const { lg } = breakpoints

export type OnUploadError = (errorMessage: string) => void

type DropzoneFile = File & {
    preview?: string,
}

type Props = {
    setImageToUpload?: (File) => void,
    originalImage?: ?string,
    dropzoneClassname?: string,
    className?: string,
    disabled?: boolean,
}

type State = {
    file: ?DropzoneFile,
    imageUploading: ?boolean,
    imageUploaded: ?boolean,
    dragEntered: boolean,
}

class ImageUpload extends Component<Props, State> {
    state = {
        file: null,
        imageUploading: false,
        imageUploaded: false,
        dragEntered: false,
    }

    componentWillUnmount() {
        this.unmounted = true
    }

    onDragEnter = () => {
        this.setState({
            dragEntered: true,
        })
    }

    onDragLeave = () => {
        this.setState({
            dragEntered: false,
        })
    }

    onDrop = (files: Array<File>) => {
        if (this.unmounted) {
            return
        }

        if (files && files.length > 0) {
            const image = files[0]

            // Save image to the state also so that a preview can be shown
            this.setState({
                file: image,
                imageUploading: true,
                imageUploaded: false,
            })

            if (this.props.setImageToUpload) {
                this.props.setImageToUpload(image)
            }
        }
    }

    onDropAccepted = () => {
        if (this.unmounted) {
            return
        }

        this.setState({
            imageUploading: false,
            imageUploaded: true,
            dragEntered: false,
        })
    }

    onDropRejected = ([file]: any) => {
        if (this.unmounted) {
            return
        }

        if (file.size > maxFileSizeForImageUpload) {
            Notification.push({
                title: I18n.t('imageUpload.fileSize.error', {
                    limit: Math.floor(maxFileSizeForImageUpload / 1e6),
                }),
            })
        }
        this.setState({
            imageUploading: false,
            imageUploaded: false,
            dragEntered: false,
        })
    }

    getPreviewImage = () => this.state.file && this.state.file.preview

    unmounted = false

    render() {
        const { originalImage, dropzoneClassname, className, disabled } = this.props
        const { imageUploading, imageUploaded, dragEntered } = this.state
        const srcImage = this.getPreviewImage() || originalImage
        return (
            <div
                className={cx(styles.container, className)}
            >
                <Dropzone
                    multiple={false}
                    className={cx(
                        styles.dropzone,
                        dropzoneClassname, {
                            [styles.dropzoneAdviceImageLoading]: !!imageUploading,
                            [styles.imageUploaded]: !imageUploading && (!!srcImage || imageUploaded),
                            [styles.dragEntered]: dragEntered,
                        },
                    )}
                    onDrop={this.onDrop}
                    onDragEnter={this.onDragEnter}
                    onDragLeave={this.onDragLeave}
                    onDropAccepted={this.onDropAccepted}
                    onDropRejected={this.onDropRejected}
                    accept="image/jpeg, image/png"
                    maxSize={maxFileSizeForImageUpload}
                    disabled={!!disabled}
                >
                    <div className={styles.dropzoneAdvice}>
                        <PngIcon
                            className={styles.icon}
                            name="imageUpload"
                            alt={I18n.t('imageUpload.coverImage.upload')}
                        />
                        <p>
                            {(imageUploaded || !!srcImage) ? (
                                <Translate value="imageUpload.coverImage.replace" dangerousHTML />
                            ) : (
                                <Fragment>
                                    <MediaQuery minWidth={lg.min}>
                                        <Translate value="imageUpload.coverImage.upload" className={styles.uploadAdvice} dangerousHTML />
                                    </MediaQuery>
                                    <MediaQuery maxWidth={lg.min}>
                                        <Translate value="imageUpload.coverImage.tabletUpload" className={styles.uploadAdvice} dangerousHTML />
                                    </MediaQuery>
                                </Fragment>
                            )}
                        </p>
                    </div>
                    {srcImage && (
                        <img
                            className={styles.previewImage}
                            src={srcImage}
                            alt={I18n.t('imageUpload.imageCaption')}
                        />
                    )}
                </Dropzone>
            </div>
        )
    }
}

export default ImageUpload
