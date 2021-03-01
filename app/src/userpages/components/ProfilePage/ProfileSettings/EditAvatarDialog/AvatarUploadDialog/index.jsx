// @flow

import React from 'react'

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
            title={originalImage ? 'Avatar update' : 'Avatar upload'}
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
