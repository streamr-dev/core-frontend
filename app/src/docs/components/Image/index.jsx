/* eslint-disable object-curly-newline */
// @flow

import React from 'react'
import { SRLWrapper } from 'simple-react-lightbox'
import SvgIcon from '$shared/components/SvgIcon'
import cx from 'classnames'

import imageStyles from './image.pcss'

const lightboxOptions = {
    settings: {
    },
    buttons: {
        showAutoplayButton: false,
        showDownloadButton: false,
        showFullscreenButton: false,
        showNextButton: false,
        showPrevButton: false,
        showThumbnailsButton: false,
    },
    caption: {
        captionFontStyle: 'italic',
    },
    thumbnails: {
        showThumbnails: false,
    },
}

type ImageProps = {
    lightbox?: boolean,
    mobileSrc: any,
    src: any,
    highResSrc: any,
    alt?: string,
    border?: boolean,
    className?: string,
    figCaption?: string,
}

type FigureProps = {
    mobileSrc: any,
    src: any,
    highResSrc: any,
    alt?: string,
    border?: boolean,
    className?: string,
    figCaption?: string,
}

const Figure = ({
    mobileSrc,
    src,
    highResSrc,
    alt,
    border,
    figCaption,
    className,
}: FigureProps) => (
    <figure
        className={className}
    >
        <picture>
            {mobileSrc && <source srcSet={mobileSrc} media="(max-width: 575px)" />}
            <img
                className={border && imageStyles.bordered}
                src={src}
                srcSet={highResSrc && `${highResSrc} 2x`}
                alt={alt}
            />
        </picture>
        {figCaption && (
            <figcaption>{figCaption}</figcaption>
        )}
    </figure>
)

const Image = ({
    lightbox,
    mobileSrc,
    src,
    highResSrc,
    alt,
    border,
    className,
    figCaption,
}: ImageProps) => (
    lightbox ? (
        <SRLWrapper options={lightboxOptions}>
            <div className={imageStyles.lightboxWrapper}>
                <Figure
                    className={cx(className, imageStyles.docsImage)}
                    lightbox={lightbox}
                    mobileSrc={mobileSrc}
                    src={lightbox && highResSrc ? highResSrc : src}
                    highResSrc={highResSrc}
                    border={border}
                    alt={alt}
                    figCaption={figCaption}
                />
                <SvgIcon
                    name="expand"
                    className={
                        cx(imageStyles.hoverIcon, {
                            [imageStyles.captioned]: figCaption,
                        })}
                />
            </div>
        </SRLWrapper>
    )
        : (
            <Figure
                className={cx(className, imageStyles.docsImage)}
                mobileSrc={mobileSrc}
                src={src}
                highResSrc={highResSrc}
                border={border}
                alt={alt}
                figCaption={figCaption}
            />
        )
)

export default Image
