// @flow

import React from 'react'

import AvatarUploadDialog from '../AvatarUploadDialog'
import CropAvatarDialog from '../CropAvatarDialog'

type Props = {
    originalImage: string,
    onClose: () => void,
    onSave: (?File) => Promise<void>,

}

const editorPhases = {
    UPLOAD: 'upload',
    CROP: 'crop',
    PREVIEW: 'preview',
}

type State = {
    phase: $Values<typeof editorPhases>,
    uploadedImage: ?string,
}

class EditAvatarDialog extends React.Component<Props, State> {
    state = {
        phase: editorPhases.UPLOAD,
        uploadedImage: null,
    }

    imageFile: File

    componentWillUnmount() {
        this.revokeImage()
    }

    revokeImage = () => {
        if (this.state.uploadedImage) {
            URL.revokeObjectURL(this.state.uploadedImage)
        }
    }

    onSave = () => this.props.onSave(this.imageFile)

    onUpload = (image: ?File) => {
        if (image) {
            this.imageFile = image
        }

        this.setState({
            uploadedImage: image ? URL.createObjectURL(image) : null,
            phase: editorPhases.CROP,
        })
    }

    onCrop = (image: string) => {
        this.revokeImage()
        this.setState({
            uploadedImage: image,
            phase: editorPhases.PREVIEW,
        })
    }

    cropAndSave = (imageFile: File) => this.props.onSave(imageFile)

    render() {
        const { onClose, originalImage } = this.props
        const { phase, uploadedImage } = this.state

        switch (phase) {
            case editorPhases.UPLOAD:
                return (
                    <AvatarUploadDialog
                        onClose={onClose}
                        onSave={this.onUpload}
                        originalImage={originalImage}
                    />
                )

            case editorPhases.CROP:
                return (
                    <CropAvatarDialog
                        onClose={onClose}
                        cropAndSave={this.cropAndSave}
                        onSave={this.onCrop}
                        originalImage={uploadedImage || originalImage}
                    />
                )

            default:
                return null
        }
    }
}

export default EditAvatarDialog
