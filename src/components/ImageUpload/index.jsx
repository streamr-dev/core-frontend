// @flow

import React, { Component } from 'react'
import Dropzone from 'react-dropzone'

import styles from './imageUpload.pcss'

type DropzoneFile = File & {
    preview?: string,
}

type Props = {
    setImageToUpload?: (File) => void,
    originalImage?: ?string,
}

type State = {
    file: ?DropzoneFile,
}

export default class ImageUpload extends Component<Props, State> {
    state = {
        file: null,
    }

    onDrop = (files: Array<DropzoneFile>) => {
        if (files && files.length > 0) {
            const image = files[0]

            // Save image to the state also so that a preview can be shown
            this.setState({
                file: image,
            })

            if (this.props.setImageToUpload) {
                this.props.setImageToUpload(image)
            }
        }
    }

    getPreviewImage = () => this.state.file && this.state.file.preview

    render() {
        const { originalImage } = this.props
        const srcImage = this.getPreviewImage() || originalImage
        return (
            <div>
                <Dropzone
                    multiple={false}
                    className={styles.dropzone}
                    onDrop={this.onDrop}
                    accept="image/jpeg, image/png"
                    maxSize={10e6}
                >
                    <p className={styles.helpText}>Drag & drop to upload a cover image or click to browse for one</p>
                    {srcImage && (
                        <img
                            className={styles.previewImage}
                            src={srcImage}
                            alt="To be uploaded"
                        />
                    )}
                </Dropzone>
            </div>
        )
    }
}
