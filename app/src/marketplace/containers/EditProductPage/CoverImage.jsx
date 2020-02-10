// @flow

import React, { useContext, useCallback, useEffect } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import ImageUpload from '$shared/components/ImageUpload'
import Errors from '$ui/Errors'
import usePending from '$shared/hooks/usePending'
import useModal from '$shared/hooks/useModal'
import useFilePreview from '$shared/hooks/useFilePreview'
import routes from '$routes'

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
                <Translate
                    tag="h1"
                    value="editProductPage.coverImage.title"
                />
                <Translate
                    tag="p"
                    value="editProductPage.coverImage.description"
                    docsLink={routes.docsProductsIntroToProducts()}
                    dangerousHTML
                />
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
                    <Errors overlap>
                        {message}
                    </Errors>
                )}
            </div>
        </section>
    )
}

export default CoverImage
