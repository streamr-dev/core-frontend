// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'
import ImageUpload from '$shared/components/ImageUpload'
import type { UploadedFile } from '$shared/flowtype/common-types'

import styles from './avatarUpload.pcss'

type Props = {
    image: string,
    onClose: () => void,
    onSave: (?UploadedFile) => void,
}

type State = {
    image: ?UploadedFile,
    uploadError: ?string,
}

class AvatarUploadDialog extends React.Component<Props, State> {
    state = {
        image: null,
        uploadError: null,
    }

    onSave = () => {
        const { image, uploadError } = this.state
        if (uploadError) {
            alert(uploadError) // eslint-disable-line no-alert
        } else {
            this.props.onSave(image)
        }
    }

    onUpload = (image: UploadedFile) => {
        this.setState({
            image,
            uploadError: null,
        })
    }

    onUploadError = (error: string) => {
        this.setState({
            uploadError: error,
        })
    }

    render() {
        const { image, onClose } = this.props
        return (
            <Dialog
                contentClassName={styles.content}
                title={I18n.t('modal.avatar.defaultTitle')}
                onClose={onClose}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        outline: true,
                        onClick: onClose,
                    },
                    save: {
                        title: I18n.t('modal.common.save'),
                        color: 'primary',
                        onClick: this.onSave,
                    },
                }}
            >
                <ImageUpload
                    className={styles.upload}
                    setImageToUpload={this.onUpload}
                    onUploadError={this.onUploadError}
                    originalImage={image}
                    dropzoneClassname={styles.dropzone}
                />
            </Dialog>
        )
    }
}

export default AvatarUploadDialog
