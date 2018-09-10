// @flow

import React from 'react'
import ReactImg from 'react-image'

import { Logo } from '../ProductTile/Logo'

import styles from './fallbackImage.pcss'

const DefaultImagePlaceholder = () => (
    <div className={styles.defaultImagePlaceholder}>
        <Logo color="black" opacity="0.15" />
        <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAA
                AA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII="
            alt="Product"
        />
    </div>
)

type Props = {
    src: string,
    alt: string,
    className?: string,
}

const FallbackImage = ({ src, alt, className }: Props) => (
    <ReactImg
        className={className}
        src={src}
        alt={alt}
        unloader={<DefaultImagePlaceholder />}
    />
)

export default FallbackImage
