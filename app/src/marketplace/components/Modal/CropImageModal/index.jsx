// @flow

import React, { useState, useCallback, useRef } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { I18n } from 'react-redux-i18n'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Slider from '$shared/components/Slider'

import styles from './cropImageModal.pcss'

type Props = {
    imageUrl: string,
    onClose: () => void,
    onSave: (File) => void,
}

const CropImageModal = ({ imageUrl, onClose, onSave: onSaveProp }: Props) => {
    const editorRef = useRef()
    const [sliderValue, setSliderValue] = useState(1)

    const onSave = useCallback(async () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImage()
            const dataURL = canvas.toDataURL()

            const res = await fetch(dataURL)
            const blob = await res.blob()
            const file = new File([blob], 'coverImage.png')

            onSaveProp(file)
        }
    }, [onSaveProp])

    return (
        <ModalPortal>
            <Dialog
                title={I18n.t('modal.cropImage.title')}
                onClose={onClose}
                actions={{
                    cancel: {
                        title: I18n.t('modal.common.cancel'),
                        kind: 'link',
                        onClick: onClose,
                    },
                    save: {
                        title: I18n.t('modal.cropImage.apply'),
                        kind: 'primary',
                        onClick: onSave,
                    },
                }}
                contentClassName={styles.contentArea}
            >
                <div className={styles.inner}>
                    <AvatarEditor
                        ref={editorRef}
                        className={styles.editor}
                        image={imageUrl}
                        width={540}
                        height={340}
                        border={[0, 0]}
                        borderRadius={0}
                        color={[255, 255, 255, 0.6]} // RGBA
                        scale={(100 + sliderValue) / 100}
                        rotate={0}
                    />
                    <Slider
                        min={0}
                        max={200}
                        value={sliderValue}
                        onChange={setSliderValue}
                        className={styles.sliderWrapper}
                        sliderClassname={styles.slider}
                    />
                </div>
            </Dialog>
        </ModalPortal>
    )
}

export default CropImageModal
