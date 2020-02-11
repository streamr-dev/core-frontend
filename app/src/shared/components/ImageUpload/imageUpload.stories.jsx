// @flow

import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'

import ImageUpload from '.'

const stories = storiesOf('Shared/ImageUpload', module)
    .addDecorator(styles({
        color: '#323232',
        padding: '5rem',
        background: '#F8F8F8',
    }))

type Props = {
    defaultImage?: string,
    disabled?: boolean,
}

const ImageUploadContainer = ({ disabled, defaultImage }: Props) => {
    const [image, setImage] = useState(defaultImage)

    return (
        <ImageUpload
            setImageToUpload={(setImage: any)}
            originalImage={image}
            disabled={!!disabled}
        />
    )
}

stories.add('default', () => (
    <ImageUploadContainer />
))

stories.add('default (tablet)', () => (
    <ImageUploadContainer />
), {
    viewport: {
        defaultViewport: 'md',
    },
})

stories.add('default (mobile)', () => (
    <ImageUploadContainer />
), {
    viewport: {
        defaultViewport: 'sm',
    },
})

stories.add('with default image', () => (
    <ImageUploadContainer
        defaultImage="https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg"
    />
))

stories.add('disabled', () => (
    <ImageUploadContainer disabled />
))

stories.add('disabled with default image', () => (
    <ImageUploadContainer
        disabled
        defaultImage="https://miro.medium.com/fit/c/256/256/1*NfJkA-ChiQtYLRBOLryZxQ.jpeg"
    />
))
