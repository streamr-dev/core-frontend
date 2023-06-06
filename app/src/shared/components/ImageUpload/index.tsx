import React, { Fragment, useState, useCallback, useMemo, FunctionComponent } from 'react'
import { useDropzone } from 'react-dropzone'
import cx from 'classnames'
import { maxFileSizeForImageUpload } from '$shared/utils/constants'
import PngIcon from '$shared/components/PngIcon'
import useIsMounted from '$shared/hooks/useIsMounted'
import useFilePreview from '$shared/hooks/useFilePreview'
import {errorToast} from "$utils/toast"
import styles from './imageUpload.pcss'

type DropzoneFile = File & {
    preview?: string
}

type Props = {
    setImageToUpload?: (arg0: DropzoneFile) => void | Promise<void>
    originalImage?: string | null | undefined
    className?: string
    dropZoneClassName?: string
    disabled?: boolean
    noPreview?: boolean
}

const ImageUpload: FunctionComponent<Props> = ({
    setImageToUpload,
    originalImage,
    className,
    dropZoneClassName,
    noPreview,
    disabled
}: Props) => {
    const [uploading, setUploading] = useState(false)
    const { preview, createPreview } = useFilePreview()
    const isMounted = useIsMounted()
    const onDrop = useCallback(
        (files: Array<File>) => {
            if (!isMounted()) {
                return
            }

            const [image] = files

            if (image) {
                // Save image to the state also so that a preview can be shown
                const imagePreview = createPreview(image)
                setUploading(true)

                if (setImageToUpload) {
                    // $FlowFixMe property `preview` is missing in  `File`.
                    setImageToUpload(
                        Object.assign(image, {
                            preview: imagePreview,
                        }),
                    )
                }
            }
        },
        [createPreview, setImageToUpload, isMounted],
    )
    const onDropAccepted = useCallback(() => {
        if (!isMounted()) {
            return
        }

        setUploading(false)
    }, [isMounted])
    const onDropRejected = useCallback(
        ([rejection]: any) => {
            if (!isMounted()) {
                return
            }

            if (rejection.file.size > maxFileSizeForImageUpload) {
                errorToast({title: `Image file size must be less than ${Math.floor(maxFileSizeForImageUpload / 1e6)}MB`})
            }

            setUploading(false)
        },
        [isMounted],
    )
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
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
                className: cx(
                    styles.root,
                    styles.ImageUpload,
                    {
                        [styles.dropzoneAdviceImageLoading]: !!uploading,
                        [styles.imageUploaded]: !uploading && !!srcImage,
                        [styles.dragEntered]: isDragActive,
                    },
                    className,
                ),
                'aria-disabled': disabled,
            })}
        >
            <input {...getInputProps()} />
            <div className={cx(styles.dropzoneAdvice, dropZoneClassName)}>
                <PngIcon className={styles.icon} name="imageUpload" alt="" />
                <p>
                    {srcImage ? (
                        <span>
                            Drag &amp; drop to replace your cover image <br /> or click to browse for one
                        </span>
                    ) : (
                        <Fragment>
                            <span className={cx(styles.uploadAdvice, styles.uploadAdviceDesktop)}>
                                Drag &amp; drop to upload a cover image <br /> or click to browse for one
                            </span>
                            <span className={cx(styles.uploadAdvice, styles.uploadAdviceTablet)}>
                                Tap to take a photo or browse for one
                            </span>
                            <span className={cx(styles.uploadAdvice, styles.uploadAdviceMobile)}>
                                Tap to take a photo
                                <br />
                                or browse for one
                            </span>
                        </Fragment>
                    )}
                </p>
            </div>
            {srcImage && <img className={styles.previewImage} src={srcImage} alt="Uploaded" />}
        </div>
    )
}

export default ImageUpload
