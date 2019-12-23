// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import ImageUpload from '$shared/components/ImageUpload'

import styles from './avatarUpload.pcss'

type Props = {
    originalImage: string,
    onClose: () => void,
    onSave: (?File) => void,
}

type State = {
    image: ?File,
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

    onUpload = (image: File) => {
        this.setState({
            image,
            uploadError: null,
        }, () => {
            this.onSave()
        })
    }

    onUploadError = (error: string) => {
        this.setState({
            uploadError: error,
        })
    }

    render() {
        const { originalImage, onClose } = this.props
        const { image } = this.state
        return (
            <ModalPortal>
                <Dialog
                    contentClassName={styles.content}
                    title={originalImage ? I18n.t('modal.avatar.updateTitle') : I18n.t('modal.avatar.defaultTitle')}
                    onClose={onClose}
                    actions={image
                        ? {
                            cancel: {
                                title: I18n.t('modal.common.cancel'),
                                outline: true,
                                kind: 'link',
                                onClick: onClose,
                            },
                            save: {
                                title: I18n.t('modal.common.apply'),
                                kind: 'primary',
                                onClick: this.onSave,
                                disabled: (!originalImage && !this.state.image),
                            },
                        }
                        : {}
                    }
                >
                    <ImageUpload
                        className={styles.upload}
                        setImageToUpload={this.onUpload}
                        onUploadError={this.onUploadError}
                        originalImage={originalImage}
                        dropzoneClassname={styles.dropzone}
                    />
                </Dialog>
            </ModalPortal>
        )
    }
}

export default AvatarUploadDialog
