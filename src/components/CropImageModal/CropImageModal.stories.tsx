import React, { useCallback, useEffect, useState } from 'react'
import { Container, toaster } from 'toasterhea'
import { Meta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { COLORS } from '~/shared/utils/styled'
import { Layer } from '~/utils/Layer'
import ImageUpload from '~/shared/components/ImageUpload'
import CropImageModal from './CropImageModal'
import styled from 'styled-components'

const cropModal = toaster(CropImageModal, Layer.Modal)

const Story = ({ mask }) => {
    const [croppedImage, setCroppedImage] = useState<File>()
    const onUpload = useCallback(
        async (image: File) => {
            try {
                await cropModal.pop({
                    imageUrl: URL.createObjectURL(image),
                    onResolve: (file) => {
                        console.log('save', file)
                        setCroppedImage(file)
                    },
                    onReject: () => {
                        console.log('closed')
                    },
                    mask,
                })
            } catch (e) {}
        },
        [setCroppedImage],
    )
    return (
        <StoryContainer>
            <ImageUpload
                setImageToUpload={onUpload}
                originalImage={croppedImage ? URL.createObjectURL(croppedImage) : ''}
                dropZoneClassName={'imageUploadDropZone'}
                disabled={false}
                className={'uploader'}
                noPreview={true}
            />
        </StoryContainer>
    )
}
export const Default = () => {
    return <Story mask={'none'} />
}

export const Rounded = () => {
    return <Story mask={'round'} />
}

const meta: Meta<typeof Default> = {
    title: 'Shared/CropImageModal',
    component: Default,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        padding: '40px',
                        maxWidth: '600px',
                        backgroundColor: 'lightgrey',
                        color: COLORS.primary,
                    }}
                >
                    <Story />
                    <Container id={Layer.Modal} />
                </div>
            )
        },
    ],
}

export default meta

const StoryContainer = styled.div`
    .uploader {
        aspect-ratio: 1/1 !important;
        width: 500px;
        height: auto;
    }
`
