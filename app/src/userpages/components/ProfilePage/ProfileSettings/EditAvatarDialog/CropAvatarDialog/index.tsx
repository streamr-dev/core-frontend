import React, { useRef, useState, useCallback, FunctionComponent } from 'react'
import AvatarEditor from 'react-avatar-editor'
import ModalPortal from '$shared/components/ModalPortal'
import Dialog from '$shared/components/Dialog'
import Slider from '$shared/components/Slider'
import type { Ref } from '$shared/types/common-types'
import '$shared/types/common-types'
import styles from './cropAvatarDialog.pcss'

const CropAvatarDialog: FunctionComponent<{
    originalImage: string
    onClose: () => void
    onSave: (arg0: File) => Promise<void>
    waiting?: boolean
}> = ({ originalImage, onClose, onSave: onSaveProp, waiting }) => {
    const editorRef: Ref<any> = useRef()
    const [sliderValue, setSliderValue] = useState(1)
    const onSave = useCallback(async () => {
        const editor = editorRef.current

        if (editor) {
            const blob: Blob = await new Promise((resolve) => editor.getImageScaledToCanvas().toBlob(resolve))
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
