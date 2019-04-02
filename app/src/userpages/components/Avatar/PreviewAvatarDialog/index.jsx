// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'

import Dialog from '$shared/components/Dialog'
import AvatarCircle from '$shared/components/AvatarCircle'

import styles from './previewAvatarDialog.pcss'

type Props = {
    image: ?string,
    onClose: () => void,
    onSave: () => Promise<void>,
}

type State = {
    saving: boolean
}

class PreviewAvatarDialog extends React.Component<Props, State> {
    state = {
        saving: false,
    }

    onSave = () => {
        const { onClose, onSave } = this.props
        this.setState({
            saving: true,
        }, () => {
            onSave()
                .then(() => {
                    this.setState({
                        saving: false,
                    })
                    onClose()
                }, () => {
                    this.setState({
                        saving: false,
                    })
                })
        })
    }

    render() {
        const { image, onClose } = this.props
        const { saving } = this.state
        return (
            <Dialog
                className={styles.avatarButtons}
                title={I18n.t('modal.avatar.preview')}
                onClose={onClose}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        outline: true,
                        color: 'link',
                        onClick: onClose,
                    },
                    save: {
                        title: I18n.t('modal.avatar.saveAvatar'),
                        color: 'primary',
                        onClick: this.onSave,
                        disabled: saving,
                        spinner: saving,
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
