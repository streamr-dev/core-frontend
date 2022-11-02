import React, { FunctionComponent } from 'react'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import ImageUpload from '$shared/components/ImageUpload'
import styles from './avatarUpload.pcss'

type Props = {
    originalImage: string
    onClose: (param?: any) => void
    onUpload: (arg0: File | null | undefined) => void
}

const AvatarUploadDialog: FunctionComponent<Props> = ({ originalImage, onClose, onUpload }: Props) => (
    <ModalPortal>
        <Dialog
            contentClassName={styles.content}
            title={originalImage ? 'Avatar update' : 'Avatar upload'}
            onClose={onClose}
        >
            <ImageUpload
                className={styles.upload}
                setImageToUpload={onUpload}
                originalImage={originalImage}
            />
        </Dialog>
    </ModalPortal>
)

export default AvatarUploadDialog
