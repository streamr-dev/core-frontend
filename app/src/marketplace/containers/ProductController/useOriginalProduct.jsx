// @flow

import { useContext } from 'react'

import { Context as ValidationContext } from './ValidationContextProvider'

export default function useOriginalProduct() {
    const { originalProduct, setOriginalProduct } = useContext(ValidationContext)

    return {
        originalProduct,
        setOriginalProduct,
    }
}
