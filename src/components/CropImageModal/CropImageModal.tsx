import React, { useState, useCallback, useRef } from 'react'
import styled, { css } from 'styled-components'
import AvatarEditor, { CroppedRect } from 'react-avatar-editor'
import Slider from '~/shared/components/Slider'
import BaseModal, { BaseModalProps, Footer } from '~/modals/BaseModal'
import SvgIcon from '~/shared/components/SvgIcon'
import {
    FormModalCloseButton,
    FormModalContent,
    FormModalHead,
    FormModalRoot,
    FormModalTitle,
} from '~/modals/FormModal'
import Button from '~/shared/components/Button'
import { COLORS } from '~/shared/utils/styled'

type ShapeOption = 'square' | 'round'

type Props = {
    imageUrl: string
    onResolve: (file: File) => void
    onReject: () => void
    title?: string
    shape?: ShapeOption
} & Omit<BaseModalProps, 'children'>
export const MAX_WIDTH = 1024
// only width is considered because images returned from the cropper will always be squared
export const getCroppedAndResizedBlob = async (
    imageUrl: string,
    cropInfo: CroppedRect,
): Promise<Blob> => {
    const imageElement = document.createElement('img')
    await new Promise((resolve) => {
        imageElement.onload = () => resolve(null)
        imageElement.src = imageUrl
    })
    let canvas = document.createElement('canvas')
    const cropCanvasContext = canvas.getContext('2d') as CanvasRenderingContext2D
    const x = Math.round(imageElement.width * cropInfo.x)
    const y = Math.round(imageElement.height * cropInfo.y)
    const width = Math.round(imageElement.width * cropInfo.width)
    const height = Math.round(imageElement.height * cropInfo.height)
    canvas.width = width
    canvas.height = height
    cropCanvasContext.drawImage(imageElement, x, y, width, height, 0, 0, width, height)

    if (canvas.width > MAX_WIDTH) {
        const resizedCanvas = document.createElement('canvas')
        const resizedCanvasContext = resizedCanvas.getContext(
            '2d',
        ) as CanvasRenderingContext2D
        // Start with original image size
        resizedCanvas.width = canvas.width
        resizedCanvas.height = canvas.height
        // Draw the original image on the (temp) resizing canvas
        resizedCanvasContext.drawImage(canvas, 0, 0)

        // Quickly reduce the size by 50% each time in few iterations until the size is less then
        // 2x time the target size - the motivation for it, is to reduce the aliasing that would have been
        // created with direct reduction of very big image to small image
        while (resizedCanvas.width * 0.5 > MAX_WIDTH) {
            resizedCanvas.width *= 0.5
            resizedCanvas.height *= 0.5
            resizedCanvasContext.drawImage(
                resizedCanvas,
                0,
                0,
                resizedCanvas.width,
                resizedCanvas.height,
            )
        }

        // Now do final resize for the resizingCanvas to meet the dimension requirments
        // directly to the output canvas, that will output the final image
        resizedCanvas.width = MAX_WIDTH
        resizedCanvas.height = (resizedCanvas.width * canvas.height) / canvas.width
        resizedCanvasContext.drawImage(
            canvas,
            0,
            0,
            resizedCanvas.width,
            resizedCanvas.height,
        )
        canvas = resizedCanvas
    }

    return await new Promise((resolve) => canvas.toBlob(resolve))
}

const CropImageModal = ({
    imageUrl,
    onResolve,
    onReject,
    title = 'Scale and crop your image',
    shape = 'square',
    ...props
}: Props) => {
    const editorRef = useRef<AvatarEditor>()
    const [sliderValue, setSliderValue] = useState<number>(1)
    const onSave = useCallback(async () => {
        if (editorRef.current) {
            const blob = await getCroppedAndResizedBlob(
                imageUrl,
                editorRef.current.getCroppingRect(),
            )
            const file = new File([blob], 'coverImage.png')
            onResolve(file)
        }
    }, [onResolve, editorRef, imageUrl])
    return (
        <BaseModal {...props} onReject={onReject}>
            {(close) => (
                <FormModalRoot>
                    <FormModalHead>
                        <FormModalTitle>{title}</FormModalTitle>
                        <FormModalCloseButton type="button" onClick={close}>
                            <SvgIcon name="crossMedium" />
                        </FormModalCloseButton>
                    </FormModalHead>
                    <FormModalContent>
                        <div>
                            <StyledAvatarEditor
                                ref={editorRef}
                                image={imageUrl}
                                width={1024}
                                height={1024}
                                border={[0, 0]}
                                borderRadius={0}
                                color={[255, 255, 255, 0.6]} // RGBA
                                scale={(100 + sliderValue) / 100}
                                rotate={0}
                                $shape={shape}
                            />
                            <ZoomControls>
                                <ZoomIcon name={'zoomOut'} />
                                <ZoomSlider
                                    min={0}
                                    max={200}
                                    value={sliderValue}
                                    onChange={setSliderValue}
                                />
                                <ZoomIcon name={'zoomIn'} />
                            </ZoomControls>
                        </div>
                    </FormModalContent>
                    <Footer $borderless $autoHeight>
                        <ButtonsContainer>
                            <StyledButton onClick={onSave}>Crop</StyledButton>
                            <StyledButton kind="secondary" onClick={onReject}>
                                Cancel
                            </StyledButton>
                        </ButtonsContainer>
                    </Footer>
                </FormModalRoot>
            )}
        </BaseModal>
    )
}

export default CropImageModal

const StyledAvatarEditor = styled(AvatarEditor)<{ $shape: ShapeOption }>`
    width: 100% !important;
    height: auto !important;

    ${({ $shape }) => {
        switch ($shape) {
            case 'round':
                return css`
                    border-radius: 100%;
                `
            default:
                return null
        }
    }}
`

const ZoomSlider = styled(Slider)`
    width: 50%;
    min-width: 200px;
    margin: 0 12px;
`

const ZoomControls = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 35px;
`

const ZoomIcon = styled(SvgIcon)`
    color: ${COLORS.link};
    width: 20px;
`

const ButtonsContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 40px 0 30px;
`

const StyledButton = styled(Button)`
    margin-bottom: 10px;
    width: 100%;
`
