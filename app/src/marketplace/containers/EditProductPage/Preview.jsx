// @flow

import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import useEditableProduct from '../ProductController/useEditableProduct'
import { selectStreams } from '$mp/modules/streams/selectors'

import ProductPage from '$mp/containers/ProductPage/Page'

const Preview = () => {
    const product = useEditableProduct()
    const streamIds = product.streams
    const streams = useSelector(selectStreams) // todo: safe to assume streams are fetched?

    const selectedStreams = useMemo(() => streams.filter((s) => streamIds.includes(s.id)), [streamIds, streams])

    return (
        <ProductPage
            product={product}
            streams={selectedStreams}
            relatedProducts={[]}
        />
    )
}

export default Preview
