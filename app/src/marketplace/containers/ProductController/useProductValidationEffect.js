// @flow

import { useEffect, useContext } from 'react'

import useEditableState from '$shared/contexts/Undo/useEditableState'
import { Context as ValidationContext } from './ValidationContextProvider'

export default function useProductValidationEffect() {
    const { state: product } = useEditableState()
    const { validate } = useContext(ValidationContext)

    useEffect(() => {
        if (product) {
            validate(product)
        }
    }, [product, validate])
}
