// @flow

import { useEffect, useContext } from 'react'

import useProduct from './useProduct'
import { Context as ValidationContext } from './ValidationContextProvider'

export default function useProductValidationEffect() {
    const product = useProduct()
    const { validate } = useContext(ValidationContext)

    useEffect(() => {
        if (product) {
            validate(product)
        }
    }, [product, validate])
}
