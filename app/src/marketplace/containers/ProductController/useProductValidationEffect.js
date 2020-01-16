// @flow

import { useEffect, useContext } from 'react'

import useEditableProduct from './useEditableProduct'
import { Context as ValidationContext } from './ValidationContextProvider'

export default function useProductValidationEffect() {
    const product = useEditableProduct()
    const { validate } = useContext(ValidationContext)

    useEffect(() => {
        if (product) {
            validate(product)
        }
    }, [product, validate])
}
