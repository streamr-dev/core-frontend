import React, { useState } from 'react'
import { Meta } from '@storybook/react'
import ImageUpload from '.'

type Props = {
    defaultImage?: string
    disabled?: boolean
}

const ImageUploadContainer = ({ disabled, defaultImage }: Props) => {
    const [image, setImage] = useState(defaultImage)
    return (
        <ImageUpload
            setImageToUpload={setImage as any}
            originalImage={image}
            disabled={!!disabled}
        />
    )
}

export const Default = () => <ImageUploadContainer />

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/ImageUpload',
    component: Default,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '5rem',
                        background: '#F8F8F8',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta

export const DefaultTablet = () => <ImageUploadContainer />

DefaultTablet.story = {
    name: 'default (tablet)',

    parameters: {
        viewport: {
            defaultViewport: 'md',
        },
    },
}

export const DefaultMobile = () => <ImageUploadContainer />

DefaultMobile.story = {
    name: 'default (mobile)',

    parameters: {
        viewport: {
            defaultViewport: 'sm',
        },
    },
}

export const WithDefaultImage = () => (
    <ImageUploadContainer defaultImage="https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg" />
)

WithDefaultImage.story = {
    name: 'with default image',
}

export const Disabled = () => <ImageUploadContainer disabled />

Disabled.story = {
    name: 'disabled',
}

export const DisabledWithDefaultImage = () => (
    <ImageUploadContainer
        disabled
        defaultImage="https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg"
    />
)

DisabledWithDefaultImage.story = {
    name: 'disabled with default image',
}
