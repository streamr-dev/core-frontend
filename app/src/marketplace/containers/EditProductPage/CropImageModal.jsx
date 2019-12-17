// @flow

import React, { useState, useEffect, useCallback, useRef } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { I18n } from 'react-redux-i18n'

import useModal from '$shared/hooks/useModal'
import Dialog from '$shared/components/Dialog'
import Slider from '$shared/components/Slider'
import useFilePreview from '$shared/hooks/useFilePreview'

import styles from './cropImageModal.pcss'

type Props = {
    image: File,
    api: Object,
}

const CropImageModal = ({ image, api }: Props) => {
    const editorRef = useRef()
    const resultRef = useRef(undefined)
    const [sliderValue, setSliderValue] = useState(1)
    const { preview, createPreview } = useFilePreview()

    useEffect(() => {
        createPreview(image)
    }, [image, createPreview])

    const onClose = useCallback(() => {
        api.close(resultRef.current)
    }, [api])

    const onSave = useCallback(async () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImage()
            const dataURL = canvas.toDataURL()

            const res = await fetch(dataURL)
            const blob = await res.blob()
            const file = new File([blob], 'coverImage.png')

            resultRef.current = file
            onClose()
        }
    }, [onClose])

    return (
        <Dialog
            title={I18n.t('modal.cropImage.title')}
            onClose={onClose}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    outline: true,
                    color: 'link',
                    onClick: onClose,
                },
                save: {
                    title: I18n.t('modal.cropImage.apply'),
                    color: 'primary',
                    onClick: onSave,
                },
            }}
            contentClassName={styles.contentArea}
        >
            <div className={styles.inner}>
                <AvatarEditor
                    ref={editorRef}
                    className={styles.editor}
                    image={preview}
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
    )
}

export default () => {
    const { isOpen, api, value } = useModal('cropImage')

    if (!isOpen) {
        return null
    }

    const { image, onUpdateImage } = value || {}

    return (
        <CropImageModal
            image={image}
            onUpdateImage={onUpdateImage}
            api={api}
        />
    )
}
