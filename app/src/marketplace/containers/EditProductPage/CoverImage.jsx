// @flow

import React, { useContext, useCallback, useEffect } from 'react'
import cx from 'classnames'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'

import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import ImageUpload from '$shared/components/ImageUpload'
import FormControlErrors from '$shared/components/FormControlErrors'
import usePending from '$shared/hooks/usePending'
import useModal from '$shared/hooks/useModal'
import useFilePreview from '$shared/hooks/useFilePreview'

import styles from './coverImage.pcss'

const CoverImage = () => {
    const product = useEditableProduct()
    const { isTouched } = useContext(ValidationContext)
    const { updateImageFile } = useEditableProductActions()
    const { isValid, message } = useValidation('imageUrl')
    const { isPending } = usePending('product.SAVE')
    const { api: cropImageDialog } = useModal('cropImage')
    const { preview, createPreview } = useFilePreview()

    const onUpload = useCallback(async (image: File) => {
        const newImage = await cropImageDialog.open({
            image,
        })

        if (newImage) {
            updateImageFile(newImage)
        }
    }, [cropImageDialog, updateImageFile])

    const uploadedImage = product.newImageToUpload

    useEffect(() => {
        if (!uploadedImage) { return }

        createPreview(uploadedImage)
    }, [uploadedImage, createPreview])

    const hasError = isTouched('imageUrl') && !isValid

    return (
        <section id="cover-image" className={cx(styles.root, styles.CoverImage)}>
            <div>
                <h1>Add a cover image</h1>
                <p>This image will be shown as the tile image in the Marketplace browse view,
                    and also as the main image on your product page. For best quality,
                    an image size of around 1000 x 800px is recommended. PNG or JPEG format.
                    Need images? See the docs.
                </p>
                <ImageUpload
                    setImageToUpload={onUpload}
                    originalImage={preview || product.imageUrl}
                    className={styles.imageUpload}
                    dropzoneClassname={cx(styles.dropZone, {
                        [styles.dropZoneError]: !!hasError,
                    })}
                    disabled={!!isPending}
                    noPreview
                />
                {hasError && !!message && (
                    <FormControlErrors overlap>
                        {message}
                    </FormControlErrors>
                )}
            </div>
        </section>
    )
}

export default CoverImage
