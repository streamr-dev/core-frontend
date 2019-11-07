// @flow

import React from 'react'
import { I18n } from 'react-redux-i18n'
import AvatarEditor from 'react-avatar-editor'

import Dialog from '$shared/components/Dialog'
import Slider from '$shared/components/Slider'
import { type Ref } from '$shared/flowtype/common-types'

import styles from './cropAvatarDialog.pcss'

type Props = {
    originalImage: string,
    onClose: () => void,
    cropAndSave: (File) => Promise<void>,
}

type State = {
    sliderValue: number,
    saving: boolean,
}

class CropAvatarDialog extends React.Component<Props, State> {
    state = {
        sliderValue: 1,
        saving: false,
    }

    editor: Ref<AvatarEditor> = React.createRef()

    onSliderChange = (value: number) => {
        this.setState({
            sliderValue: value,
        })
    }

    onSave = () => {
        const { onClose } = this.props

        this.setState({
            saving: true,
        }, () => {
            if (this.editor.current) {
                const canvas = this.editor.current.getImageScaledToCanvas()
                const dataURL = canvas.toDataURL()

                fetch(dataURL)
                    .then((res) => res.blob())
                    .then((blob) => {
                        const file = new File([blob], 'avatar.png')

                        this.props.cropAndSave(file)
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
        })
    }

    render() {
        const { originalImage, onClose } = this.props
        const { sliderValue, saving } = this.state
        return (
            <Dialog
                title={I18n.t('modal.avatar.cropYourImage')}
                onClose={onClose}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        outline: true,
                        type: 'link',
                        onClick: onClose,
                    },
                    save: {
                        title: I18n.t('modal.avatar.saveAndApplyAvatar'),
                        type: 'primary',
                        onClick: this.onSave,
                        disabled: saving,
                        spinner: saving,
                    },
                }}
            >
                <AvatarEditor
                    ref={this.editor}
                    className={styles.editor}
                    image={originalImage}
                    width={200}
                    height={200}
                    border={[132, 16]}
                    borderRadius={100}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={(100 + sliderValue) / 100}
                    rotate={0}
                />
                <div>
                    <Slider
                        min={0}
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

export default CropAvatarDialog
