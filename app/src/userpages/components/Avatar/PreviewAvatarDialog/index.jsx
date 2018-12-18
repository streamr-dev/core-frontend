// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'
import AvatarCircle from '$shared/components/AvatarCircle'

import styles from './previewAvatarDialog.pcss'

type Props = {
    image: ?string,
    onClose: () => void,
    onSave: () => void,
}

class PreviewAvatarDialog extends React.Component<Props> {
    render() {
        const { image, onClose, onSave } = this.props
        return (
            <Dialog
                title={I18n.t('modal.avatar.preview')}
                onClose={onClose}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        outline: true,
                        onClick: onClose,
                    },
                    save: {
                        title: I18n.t('modal.avatar.saveAvatar'),
                        color: 'primary',
                        onClick: onSave,
                    },
                }}
            >
                {image && (
                    <div className={styles.container}>
                        <AvatarCircle
                            name=""
                            imageUrl={image}
                            className={styles.avatar}
                        />
                    </div>
                )}
            </Dialog>
        )
    }
}

export default PreviewAvatarDialog
