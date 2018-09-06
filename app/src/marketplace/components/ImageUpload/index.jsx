// @flow

import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { Translate } from '@streamr/streamr-layout'

import { maxFileSizeForImageUpload } from '../../utils/constants'
import withI18n from '../../containers/WithI18n'

import UploadIcon from './ImageUploadIcon'
import styles from './imageUpload.pcss'

type DropzoneFile = File & {
    preview?: string,
}
export type OnUploadError = (errorMessage: string) => void

type Props = {
    setImageToUpload?: (File) => void,
    onUploadError: OnUploadError,
    originalImage?: ?string,
    translate: (key: string, options: any) => string,
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

    onDrop = (files: Array<DropzoneFile>) => {
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
        this.setState({
            imageUploading: false,
            imageUploaded: true,
        })
    }

    onDropRejected = ([file]: any) => {
        const { onUploadError, translate } = this.props

        if (file.size > maxFileSizeForImageUpload) {
            onUploadError(translate('imageUpload.fileSize.error', {
                limit: Math.floor(maxFileSizeForImageUpload / 1e6),
            }))
        }
        this.setState({
            imageUploading: false,
            imageUploaded: false,
        })
    }

    getPreviewImage = () => this.state.file && this.state.file.preview

    setDropzoneHover = (hoverState: boolean) => {
        this.setState({
            hover: hoverState,
        })
    }

    determineStyles = (hasImage: boolean) => {
        const { imageUploaded, hover } = this.state
        if ((hasImage && hover) || (imageUploaded && hover) || (!hasImage && !imageUploaded)) {
            return styles.dropzoneAdvice
        }

        return styles.hide
    }

    render() {
        const { originalImage } = this.props
        const { imageUploading, imageUploaded, hover } = this.state
        const srcImage = this.getPreviewImage() || originalImage
        return (
            <div
                onMouseEnter={() => this.setDropzoneHover(true)}
                onMouseLeave={() => this.setDropzoneHover(false)}
            >
                <Dropzone
                    multiple={false}
                    className={styles.dropzone}
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
                        <UploadIcon color={hover ? '#303030' : '#A6A6A6'} />
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
                            alt="Product Preview"
                        />
                    )}
                </Dropzone>
            </div>
        )
    }
}

export default withI18n(ImageUpload)
