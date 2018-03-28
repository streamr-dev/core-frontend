// @flow

import React, { Component } from 'react'
import styles from './imageupload.pcss'
import Dropzone from 'react-dropzone'

type DropzoneFile = File & {
    preview?: string,
}

type Props = {
    setImageToUpload?: (File) => void,
}

type State = {
    files: Array<DropzoneFile>,
}

export default class ImageUpload extends Component<Props, State> {
    constructor() {
        super()
        this.state = {
            files: [],
        }
    }

    onDrop(files: Array<DropzoneFile>) {
        if (files && files.length > 0 && this.props.setImageToUpload) {
            const image = files[0]
            this.props.setImageToUpload(image)
        }

        // Save image to the state also so that a preview can be shown
        this.setState({
            files
        })
    }

    render() {
        return (
            <div>
                <Dropzone
                    multiple={false}
                    className={styles.dropzone}
                    onDrop={(files) => this.onDrop(files)}
                    accept="image/jpeg, image/png"
                >
                    <p className={styles.helpText}>Drag & drop to upload a cover image or click to browse for one</p>
                    {this.state.files.map((file, index) => <img className={styles.previewImage} key={index} src={file.preview} />)}
                </Dropzone>
            </div>
        )
    }
}
