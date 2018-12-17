// @flow

import React from 'react'

import AvatarUploadDialog from '../AvatarUploadDialog'
import CropAvatarDialog from '../CropAvatarDialog'
import type { UploadedFile } from '$shared/flowtype/common-types'

type Props = {
    originalImage: string,
    onClose: () => void,
    onSave: (?UploadedFile) => void,
}

const editorPhases = {
    UPLOAD: 'upload',
    CROP: 'crop',
    PREVIEW: 'preview',
}

type State = {
    phase: $Values<typeof editorPhases>,
    image: ?UploadedFile,
}

class EditAvatarDialog extends React.Component<Props, State> {
    state = {
        phase: editorPhases.UPLOAD,
        image: null,
    }

    onSave = () => {
        const { image } = this.state
        this.props.onSave(image)
    }

    onUpload = (image: ?UploadedFile) => {
        this.setState({
            image,
            phase: editorPhases.CROP,
        })
    }

    onCrop = () => {
        this.setState({
            phase: editorPhases.PREVIEW,
        })
    }

    render() {
        const { onClose, originalImage } = this.props
        switch (this.state.phase) {
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
                        originalImage={(this.state.image && this.state.image.preview) || ''}
                    />
                )

            default:
                return null
        }
    }
}

export default EditAvatarDialog
