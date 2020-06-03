// @flow

import React from 'react'

import useProduct from '$mp/containers/ProductController/useProduct'
import TermsComponent from '$mp/components/ProductPage/Terms'

const Terms = () => {
    const product = useProduct()

    return (
        <TermsComponent
            product={product}
        />
    )
}

export default Terms
