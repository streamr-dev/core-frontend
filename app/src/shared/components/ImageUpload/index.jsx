// @flow

import React, { Fragment, useState, useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'
import MediaQuery from 'react-responsive'

import breakpoints from '$app/scripts/breakpoints'
import { maxFileSizeForImageUpload } from '$shared/utils/constants'
import PngIcon from '$shared/components/PngIcon'
import useIsMounted from '$shared/hooks/useIsMounted'
import useFilePreview from '$shared/hooks/useFilePreview'
import type { DropzoneFile } from '$shared/components/FileUpload'

import Notification from '$shared/utils/Notification'
import styles from './imageUpload.pcss'

const { lg } = breakpoints

export type OnUploadError = (errorMessage: string) => void

type Props = {
    setImageToUpload?: (DropzoneFile) => void | Promise<void>,
    originalImage?: ?string,
    className?: string,
    disabled?: boolean,
    noPreview?: boolean,
}

const ImageUpload = ({
    setImageToUpload,
    originalImage,
    className,
    noPreview,
    disabled,
}: Props) => {
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const { preview, createPreview } = useFilePreview()
    const isMounted = useIsMounted()

    const onDrop = useCallback((files: Array<File>) => {
        if (!isMounted()) { return }

        const [image] = files

        if (image) {
            // Save image to the state also so that a preview can be shown
            const imagePreview = createPreview(image)

            setUploading(true)
            setUploaded(false)

            if (setImageToUpload) {
                setImageToUpload(((Object.assign({}, image, {
                    preview: imagePreview,
                }): any): DropzoneFile))
            }
        }
    }, [createPreview, setImageToUpload, isMounted])

    const onDropAccepted = useCallback(() => {
        if (!isMounted()) { return }

        setUploading(false)
        setUploaded(true)
    }, [isMounted])

    const onDropRejected = useCallback(([file]: any) => {
        if (!isMounted()) { return }

        if (file.size > maxFileSizeForImageUpload) {
            Notification.push({
                title: I18n.t('imageUpload.fileSize.error', {
                    limit: Math.floor(maxFileSizeForImageUpload / 1e6),
                }),
            })
        }

        setUploading(false)
        setUploaded(false)
    }, [isMounted])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/jpeg, image/png',
        maxSize: maxFileSizeForImageUpload,
        onDrop,
        onDropAccepted,
        onDropRejected,
        disabled,
    })

    const srcImage = useMemo(() => {
        if (noPreview) {
            return originalImage
        }

        return preview || originalImage
    }, [noPreview, originalImage, preview])

    return (
        <div
            {...getRootProps({
                className: cx(styles.root, styles.ImageUpload, {
                    [styles.dropzoneAdviceImageLoading]: !!uploading,
                    [styles.imageUploaded]: !uploading && (!!srcImage || uploaded),
                    [styles.dragEntered]: isDragActive,
                }, className),
                'aria-disabled': disabled,
            })}
        >
            <input {...getInputProps()} />
            <div className={styles.dropzoneAdvice}>
                <PngIcon
                    className={styles.icon}
                    name="imageUpload"
                    alt={I18n.t('imageUpload.coverImage.upload')}
                />
                <p>
                    {(uploaded || !!srcImage) ? (
                        <Translate value="imageUpload.coverImage.replace" dangerousHTML />
                    ) : (
                        <Fragment>
                            <MediaQuery minWidth={lg.min}>
                                <Translate value="imageUpload.coverImage.upload" className={styles.uploadAdvice} dangerousHTML />
                            </MediaQuery>
                            <MediaQuery maxWidth={lg.min}>
                                <Translate value="imageUpload.coverImage.tabletUpload" className={styles.uploadAdvice} dangerousHTML />
                            </MediaQuery>
                        </Fragment>
                    )}
                </p>
            </div>
            {srcImage && (
                <img
                    className={styles.previewImage}
                    src={srcImage}
                    alt={I18n.t('imageUpload.imageCaption')}
                />
            )}
        </div>
    )
}

export default ImageUpload
