// @flow

import React from 'react'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductUpdater from '../ProductController/useProductUpdater'
import MarkdownEditor from '$mp/components/MarkdownEditor'

const ProductDescription = () => {
    const product = useProduct()
    const { updateProduct } = useProductUpdater()
    const { status } = useValidation('description')

    const onChange = (description) => {
        updateProduct('Update description', (p) => ({
            ...p,
            description,
        }))
    }

    return (
        <div>
            <h1>Write a product description</h1>
            <p>Sell your product — make sure you include details about the contents of
                your streams, historical data, and any other relevant details.
                Generally around a maximum of around 300 words fits best on a product
                detail page. Markdown formatting is ok.
            </p>
            <MarkdownEditor placeholder="Type something great about your product" />
            <p>
                <textarea
                    value={product.description}
                    onChange={(e: SyntheticInputEvent<EventTarget>) => onChange(e.target.value)}
                />
                <br />
                status: {status}
            </p>
        </div>
    )
}

export default ProductDescription
