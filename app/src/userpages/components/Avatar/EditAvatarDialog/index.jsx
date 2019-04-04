// @flow

import React from 'react'

import AvatarUploadDialog from '../AvatarUploadDialog'
import CropAvatarDialog from '../CropAvatarDialog'
import PreviewAvatarDialog from '../PreviewAvatarDialog'

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

    imageBlob: File

    componentWillUnmount() {
        this.revokeImage()
    }

    revokeImage = () => {
        if (this.state.uploadedImage) {
            URL.revokeObjectURL(this.state.uploadedImage)
        }
    }

    onSave = () => this.props.onSave(this.imageBlob)

    onUpload = (image: ?File) => {
        this.imageBlob = image

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
                        onSave={this.onCrop}
                        originalImage={uploadedImage || originalImage}
                    />
                )

            case editorPhases.PREVIEW:
                return (
                    <PreviewAvatarDialog
                        onClose={onClose}
                        onSave={this.onSave}
                        image={uploadedImage}
                    />
                )

            default:
                return null
        }
    }
}

export default EditAvatarDialog
