// @flow

import React from 'react'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductUpdater from '../ProductController/useProductUpdater'
import ImageUpload from '$shared/components/ImageUpload'

const CoverImage = () => {
    const product = useProduct()
    const { updateProduct } = useProductUpdater()
    const { status } = useValidation('coverImage')

    const setImageToUpload = (image: File) => {
        updateProduct('Update cover image', (p) => ({
            ...p,
            imageUrl: image,
        }))
    }

    return (
        <div>
            <h1>Add a cover image</h1>
            <p>This image will be shown as the tile image in the Marketplace browse view,
                and also as the main image on your product page. For best quality,
                an image size of around 1000 x 800px is recommended. PNG or JPEG format.
                Need images? See the docs.
            </p>
            <ImageUpload
                setImageToUpload={setImageToUpload}
                originalImage={product.imageUrl}
            />
            <p>status: {status}</p>
        </div>
    )
}

export default CoverImage
