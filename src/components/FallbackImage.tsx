import React from 'react'
import { Img as ReactImg } from 'react-image'
import styled from 'styled-components'
import Logo from '~/shared/components/Logo'

type PlaceholderProps = {
    alt: string
    className?: string
}

const DefaultImagePlaceholder = ({ alt, className }: PlaceholderProps) => (
    <DefaultImagePlaceholderRoot className={className}>
        <Logo color="black" opacity="0.15" />
        <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAA
                AA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII="
            alt={alt}
        />
    </DefaultImagePlaceholderRoot>
)

interface Props {
    src: string
    alt: string
    className?: string
    placeholder?: JSX.Element
}

export function FallbackImage({ src, alt, className, placeholder }: Props) {
    return (
        <ReactImg
            className={className}
            src={src}
            alt={alt}
            unloader={
                placeholder || <DefaultImagePlaceholder alt={alt} className={className} />
            }
        />
    )
}

const DefaultImagePlaceholderRoot = styled.div`
    position: relative;
    background-image: linear-gradient(135deg, #0045ff 0%, #7200ee 100%);
    border-radius: 2px;
    transition: 50ms ease-in-out transform;

    img {
        width: 100%;
        height: 100%;
        background-color: transparent;
    }

    svg {
        position: absolute;
        width: 80px;
        height: 80px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
`
