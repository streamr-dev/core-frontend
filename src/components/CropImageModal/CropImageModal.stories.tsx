import React, { useRef } from 'react'
import { Container, toaster } from 'toasterhea'
import { Meta } from '@storybook/react'
import { COLORS } from '~/shared/utils/styled'
import { Layer } from '~/utils/Layer'
import CropImageModal from './CropImageModal'

const cropModal = toaster(CropImageModal, Layer.Modal)

const Story = ({ mask }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                style={{ display: 'none' }}
                onChange={(e) => {
                    void (async () => {
                        if (!e.target.files?.length) {
                            return
                        }

                        try {
                            await cropModal.pop({
                                imageUrl: URL.createObjectURL(e.target.files[0]),
                                mask: 'round',
                            })
                        } catch (e) {
                            // Ignore.
                        }
                    })()
                }}
            />
            <button
                type="button"
                onClick={() => {
                    inputRef.current?.click()
                }}
            >
                Select an image
            </button>
        </>
    )
}
export const Default = () => {
    return <Story mask={'none'} />
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
