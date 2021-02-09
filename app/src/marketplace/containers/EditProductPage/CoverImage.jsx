// @flow

import React, { useContext, useCallback, useEffect } from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import ImageUpload from '$shared/components/ImageUpload'
import Errors from '$ui/Errors'
import useModal from '$shared/hooks/useModal'
import useFilePreview from '$shared/hooks/useFilePreview'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import useValidation from '../ProductController/useValidation'
import useEditableProduct from '../ProductController/useEditableProduct'
import { Context as EditControllerContext } from './EditControllerProvider'

import styles from './coverImage.pcss'
import docsLinks from '$shared/../docsLinks'

type Props = {
    disabled?: boolean,
}

const CoverImage = ({ disabled }: Props) => {
    const product = useEditableProduct()
    const { updateImageFile } = useEditableProductActions()
    const { isValid, message } = useValidation('imageUrl')
    const { api: cropImageDialog, isOpen } = useModal('cropImage')
    const { preview, createPreview } = useFilePreview()
    const { publishAttempted } = useContext(EditControllerContext)

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

    const hasError = publishAttempted && !isValid

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
                    docsLink={docsLinks.createProduct}
                    dangerousHTML
                />
                <ImageUpload
                    setImageToUpload={onUpload}
                    originalImage={preview || product.imageUrl}
                    className={styles.imageUpload}
                    dropzoneClassname={cx(styles.dropZone, {
                        [styles.dropZoneError]: !!hasError,
                    })}
                    disabled={!!disabled || isOpen}
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
