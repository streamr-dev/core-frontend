// @flow

import React from 'react'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductActions from '../ProductController/useProductActions'
import ImageUpload from '$shared/components/ImageUpload'

const CoverImage = () => {
    const product = useProduct()
    const { updateImageUrl } = useProductActions()
    const { isValid, level, message } = useValidation('coverImage')

    return (
        <div>
            <h1>Add a cover image</h1>
            <p>This image will be shown as the tile image in the Marketplace browse view,
                and also as the main image on your product page. For best quality,
                an image size of around 1000 x 800px is recommended. PNG or JPEG format.
                Need images? See the docs.
            </p>
            <ImageUpload
                setImageToUpload={updateImageUrl}
                originalImage={product.imageUrl}
            />
            {!isValid && (
                <p>{level}: {message}</p>
            )}
        </div>
    )
}

export default CoverImage
