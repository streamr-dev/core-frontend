// @flow

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import AvatarEditor from 'react-avatar-editor'
import { I18n } from 'react-redux-i18n'

import useModal from '$shared/hooks/useModal'
import Dialog from '$shared/components/Dialog'
import Slider from '$shared/components/Slider'

import styles from './cropImageModal.pcss'

type Props = {
    image: File,
    api: Object,
}

const CropImageModal = ({ image, api }: Props) => {
    const editorRef = useRef()
    const [previewImage, setPreviewImage] = useState(null)
    const [sliderValue, setSliderValue] = useState(1)

    useEffect(() => {
        const objectUrl = URL.createObjectURL(image)
        setPreviewImage(objectUrl)
        return () => {
            URL.revokeObjectURL(objectUrl)
        }
    }, [image])

    const onClose = useCallback((result: ?File = undefined) => {
        api.close(result)
    }, [api])

    const onSave = useCallback(async () => {
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas()
            const dataURL = canvas.toDataURL()

            const res = await fetch(dataURL)
            const blob = await res.blob()
            const file = new File([blob], 'coverImage.png')

            onClose(file)
        }
    }, [onClose])

    return (
        <Dialog
            title={I18n.t('modal.avatar.cropYourImage')}
            onClose={onClose}
            actions={{
                cancel: {
                    title: I18n.t('modal.common.cancel'),
                    outline: true,
                    color: 'link',
                    onClick: onClose,
                },
                save: {
                    title: I18n.t('modal.avatar.saveAndApplyAvatar'),
                    color: 'primary',
                    onClick: onSave,
                },
            }}
        >
            <AvatarEditor
                ref={editorRef}
                className={styles.editor}
                image={previewImage}
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
                    onChange={setSliderValue}
                    className={styles.slider}
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
