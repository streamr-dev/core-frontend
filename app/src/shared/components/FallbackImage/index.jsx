// @flow

import React, { type Node } from 'react'
import { Img as ReactImg } from 'react-image'
import cx from 'classnames'

import Logo from '$shared/components/Logo'

import styles from './fallbackImage.pcss'

type PlaceholderProps = {
    alt: string,
    className?: ?string,
}

const DefaultImagePlaceholder = ({ alt, className }: PlaceholderProps) => (
    <div className={cx(styles.defaultImagePlaceholder, className)}>
        <Logo color="black" opacity="0.15" />
        <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAA
                AA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII="
            alt={alt}
        />
    </div>
)

type Props = {
    src: string,
    alt: string,
    className?: ?string,
    placeholder?: Node,
}

const FallbackImage = ({ src, alt, className, placeholder }: Props) => (
    <ReactImg
        className={className}
        src={src}
        alt={alt}
        unloader={placeholder || <DefaultImagePlaceholder alt={alt} className={className} />}
    />
)

export default FallbackImage
