// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'
import AvatarEditor from 'react-avatar-editor'

import Dialog from '$shared/components/Dialog'
import Slider from '$shared/components/Slider'

import type { UploadedFile } from '$shared/flowtype/common-types'

import styles from './cropAvatarDialog.pcss'

type Props = {
    originalImage: string,
    onClose: () => void,
    onSave: (?UploadedFile) => void,
}

type State = {
    sliderValue: number,
}

class AvatarUploadDialog extends React.Component<Props, State> {
    state = {
        sliderValue: 1,
    }

    onSliderChange = (value: number) => {
        this.setState({
            sliderValue: value,
        }, () => {
            console.log(value)
        })
    }

    render() {
        const { originalImage, onClose, onSave } = this.props
        const { sliderValue } = this.state
        return (
            <Dialog
                title={I18n.t('modal.avatar.cropYourImage')}
                onClose={onClose}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        outline: true,
                        onClick: onClose,
                    },
                    save: {
                        title: I18n.t('modal.common.apply'),
                        color: 'primary',
                        onClick: onSave,
                    },
                }}
            >
                <AvatarEditor
                    className={styles.editor}
                    image={originalImage}
                    width={200}
                    height={200}
                    border={[132, 16]}
                    borderRadius={100}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={1 + (sliderValue / 100)}
                    rotate={0}
                />
                <div>
                    <Slider
                        min={1}
                        max={200}
                        value={sliderValue}
                        onChange={this.onSliderChange}
                        className={styles.slider}
                    />
                </div>
            </Dialog>
        )
    }
}

export default AvatarUploadDialog
