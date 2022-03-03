import { createContext, useContext } from 'react'

export const ProductControllerContext = createContext({})

export default function useController() {
    return useContext(ProductControllerContext)
}
