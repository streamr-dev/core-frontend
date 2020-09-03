// @flow

import React, { Fragment, useState, useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'

import { maxFileSizeForImageUpload } from '$shared/utils/constants'
import PngIcon from '$shared/components/PngIcon'
import useIsMounted from '$shared/hooks/useIsMounted'
import useFilePreview from '$shared/hooks/useFilePreview'

import Notification from '$shared/utils/Notification'
import styles from './imageUpload.pcss'

export type OnUploadError = (errorMessage: string) => void

type DropzoneFile = File & {
    preview?: string,
}

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
    const { preview, createPreview } = useFilePreview()
    const isMounted = useIsMounted()

    const onDrop = useCallback((files: Array<File>) => {
        if (!isMounted()) { return }

        const [image] = files

        if (image) {
            // Save image to the state also so that a preview can be shown
            const imagePreview = createPreview(image)

            setUploading(true)

            if (setImageToUpload) {
                // $FlowFixMe property `preview` is missing in  `File`.
                setImageToUpload(Object.assign(image, {
                    preview: imagePreview,
                }))
            }
        }
    }, [createPreview, setImageToUpload, isMounted])

    const onDropAccepted = useCallback(() => {
        if (!isMounted()) { return }

        setUploading(false)
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
                    [styles.imageUploaded]: !uploading && !!srcImage,
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
                    {srcImage ? (
                        <Translate value="imageUpload.coverImage.replace" dangerousHTML />
                    ) : (
                        <Fragment>
                            <Translate
                                value="imageUpload.coverImage.upload"
                                className={cx(styles.uploadAdvice, styles.uploadAdviceDesktop)}
                                dangerousHTML
                            />
                            <Translate
                                value="imageUpload.coverImage.tabletUpload"
                                className={cx(styles.uploadAdvice, styles.uploadAdviceTablet)}
                                dangerousHTML
                            />
                            <Translate
                                value="imageUpload.coverImage.mobileUpload"
                                className={cx(styles.uploadAdvice, styles.uploadAdviceMobile)}
                                dangerousHTML
                            />
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
