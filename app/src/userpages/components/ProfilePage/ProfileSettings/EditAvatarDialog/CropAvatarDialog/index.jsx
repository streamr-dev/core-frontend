// @flow

import React, { useRef, useState, useCallback } from 'react'
import AvatarEditor from 'react-avatar-editor'

import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Slider from '$shared/components/Slider'
import { type Ref } from '$shared/flowtype/common-types'

import styles from './cropAvatarDialog.pcss'

type Props = {
    originalImage: string,
    onClose: () => void,
    onSave: (File) => Promise<void>,
    waiting?: boolean,
}

const CropAvatarDialog = ({ originalImage, onClose, onSave: onSaveProp, waiting }: Props) => {
    const editorRef: Ref<any> = useRef()
    const [sliderValue, setSliderValue] = useState(1)

    const onSave = useCallback(async () => {
        const editor = editorRef.current
        if (editor) {
            const blob = await new Promise((resolve) => editor.getImageScaledToCanvas().toBlob(resolve))
            const file = new File([blob], 'avatar.png')

            onSaveProp(file)
        }
    }, [onSaveProp])

    return (
        <ModalPortal>
            <Dialog
                title="Crop your image"
                onClose={onClose}
                actions={{
                    cancel: {
                        title: 'Cancel',
                        outline: true,
                        kind: 'link',
                        onClick: () => onClose(),
                    },
                    save: {
                        title: 'Save & Apply',
                        kind: 'primary',
                        onClick: () => onSave(),
                        disabled: !!waiting,
                        spinner: !!waiting,
                    },
                }}
            >
                <AvatarEditor
                    ref={editorRef}
                    className={styles.editor}
                    image={originalImage}
                    width={200}
                    height={200}
                    border={[132, 16]}
                    borderRadius={100}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={(100 + sliderValue) / 100}
                    rotate={0}
                    disabled={!!waiting}
                />
                <div>
                    <Slider
                        min={0}
                        max={200}
                        value={sliderValue}
                        onChange={setSliderValue}
                        className={styles.slider}
                        disabled={!!waiting}
                    />
                </div>
            </Dialog>
        </ModalPortal>
    )
}

export default CropAvatarDialog
