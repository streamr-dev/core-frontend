// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'

import EditAvatarDialog from '../EditAvatarDialog'
import Button from '$shared/components/Button'

import styles from './avatarUpload.pcss'

export type Props = {
    image: string,
    onImageChange: (?File) => Promise<void>,
}

type State = {
    modalOpen: boolean,
}

class AvatarUpload extends React.Component<Props, State> {
    state = {
        modalOpen: false,
    }

    onShowModal = () => {
        this.setState({
            modalOpen: true,
        })
    }

    onModalClose = () => {
        this.setState({
            modalOpen: false,
        })
    }

    onSave = (image: ?File) => this.props.onImageChange(image)

    render() {
        const { modalOpen } = this.state
        const { image } = this.props
        return (
            <div className={styles.upload}>
                <Button
                    type="secondary"
                    disabled={modalOpen}
                    onClick={this.onShowModal}
                >
                    <Translate value={image ? 'userpages.profile.settings.update' : 'userpages.profile.settings.upload'} />
                </Button>
                <div className={styles.uploadHelpText}>
                    <Translate value="userpages.profile.settings.uploadHelpText" />
                </div>
                {!!modalOpen && (
                    <EditAvatarDialog
                        originalImage={image}
                        onSave={this.onSave}
                        onClose={this.onModalClose}
                    />
                )}
            </div>
        )
    }
}

export default AvatarUpload
