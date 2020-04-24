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
    onUpload: (?File) => void,
}

const AvatarUploadDialog = ({ originalImage, onClose, onUpload }: Props) => (
    <ModalPortal>
        <Dialog
            contentClassName={styles.content}
            title={originalImage ? I18n.t('modal.avatar.updateTitle') : I18n.t('modal.avatar.defaultTitle')}
            onClose={onClose}
        >
            <ImageUpload
                className={styles.upload}
                setImageToUpload={onUpload}
                onUploadError={(error: string) => console.warn(error)}
                originalImage={originalImage}
                dropzoneClassname={styles.dropzone}
            />
        </Dialog>
    </ModalPortal>
)

export default AvatarUploadDialog
