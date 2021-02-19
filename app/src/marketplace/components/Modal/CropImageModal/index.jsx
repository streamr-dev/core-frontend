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

export const MAX_WIDTH = 1024

// only width is considered because images returned from the cropper will always be wider than taller
export function getResizedBlob(originalCanvas: HTMLCanvasElement): Promise<Blob> {
    let canvas = originalCanvas

    if (originalCanvas.width > MAX_WIDTH) {
        const resizedCanvas = document.createElement('canvas')
        const resizedCanvasContext = resizedCanvas.getContext('2d')

        // Start with original image size
        resizedCanvas.width = originalCanvas.width
        resizedCanvas.height = originalCanvas.height

        // Draw the original image on the (temp) resizing canvas
        resizedCanvasContext.drawImage(originalCanvas, 0, 0)

        // Quickly reduce the size by 50% each time in few iterations until the size is less then
        // 2x time the target size - the motivation for it, is to reduce the aliasing that would have been
        // created with direct reduction of very big image to small image
        while (resizedCanvas.width * 0.5 > MAX_WIDTH) {
            resizedCanvas.width *= 0.5
            resizedCanvas.height *= 0.5
            resizedCanvasContext.drawImage(resizedCanvas, 0, 0, resizedCanvas.width, resizedCanvas.height)
        }

        // Now do final resize for the resizingCanvas to meet the dimension requirments
        // directly to the output canvas, that will output the final image
        resizedCanvas.width = MAX_WIDTH
        resizedCanvas.height = (resizedCanvas.width * originalCanvas.height) / originalCanvas.width
        resizedCanvasContext.drawImage(originalCanvas, 0, 0, resizedCanvas.width, resizedCanvas.height)

        canvas = resizedCanvas
    }

    return new Promise((resolve) => canvas.toBlob(resolve))
}

const CropImageModal = ({ imageUrl, onClose, onSave: onSaveProp }: Props) => {
    const editorRef = useRef()
    const [sliderValue, setSliderValue] = useState(1)

    const onSave = useCallback(async () => {
        if (editorRef.current) {
            const blob = await getResizedBlob(editorRef.current.getImage())
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
                        title: 'Cancel',
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
