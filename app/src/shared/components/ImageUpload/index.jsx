// @flow

import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'

import { maxFileSizeForImageUpload } from '$shared/utils/constants'

import SvgIcon from '$shared/components/SvgIcon'
import styles from './imageUpload.pcss'

export type OnUploadError = (errorMessage: string) => void

type DropzoneFile = File & {
    preview?: string,
}

type Props = {
    setImageToUpload?: (File) => void,
    onUploadError: OnUploadError,
    originalImage?: ?string,
    dropzoneClassname?: string,
}

type State = {
    file: ?DropzoneFile,
    hover: ?boolean,
    imageUploading: ?boolean,
    imageUploaded: ?boolean,
}

class ImageUpload extends Component<Props, State> {
    state = {
        file: null,
        hover: false,
        imageUploading: false,
        imageUploaded: false,
    }

    componentWillUnmount() {
        this.unmounted = true
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
        })
    }

    onDropRejected = ([file]: any) => {
        if (this.unmounted) {
            return
        }

        const { onUploadError } = this.props

        if (file.size > maxFileSizeForImageUpload) {
            onUploadError(I18n.t('imageUpload.fileSize.error', {
                limit: Math.floor(maxFileSizeForImageUpload / 1e6),
            }))
        }
        this.setState({
            imageUploading: false,
            imageUploaded: false,
        })
    }

    setDropzoneHover = (hoverState: boolean) => {
        this.setState({
            hover: hoverState,
        })
    }

    getPreviewImage = () => this.state.file && this.state.file.preview

    unmounted = false

    determineStyles = (hasImage: boolean) => {
        const { imageUploaded, hover } = this.state
        if ((hasImage && hover) || (imageUploaded && hover) || (!hasImage && !imageUploaded)) {
            return styles.dropzoneAdvice
        }

        return styles.hide
    }

    render() {
        const { originalImage, dropzoneClassname } = this.props
        const { imageUploading, imageUploaded, hover } = this.state
        const srcImage = this.getPreviewImage() || originalImage
        return (
            <div
                onMouseEnter={() => this.setDropzoneHover(true)}
                onMouseLeave={() => this.setDropzoneHover(false)}
                className={styles.container}
            >
                <Dropzone
                    multiple={false}
                    className={cx(styles.dropzone, dropzoneClassname)}
                    onDrop={this.onDrop}
                    onDropAccepted={this.onDropAccepted}
                    onDropRejected={this.onDropRejected}
                    accept="image/jpeg, image/png"
                    maxSize={maxFileSizeForImageUpload}
                >
                    <div
                        className={imageUploading
                            ? styles.dropzoneAdviceImageLoading
                            : this.determineStyles(!!srcImage)
                        }
                    >
                        <SvgIcon name="imageUpload" color={hover ? '#303030' : '#A6A6A6'} />
                        <p>
                            {(imageUploaded || !!srcImage) ? (
                                <Translate value="imageUpload.coverImage.replace" dangerousHTML />
                            ) : (
                                <Translate value="imageUpload.coverImage.upload" dangerousHTML />
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
