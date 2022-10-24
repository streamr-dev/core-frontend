import { createContext, useContext } from 'react'
import { Product } from '$mp/types/product-types'
export const ProductControllerContext = createContext<{product?: Product, setProduct?: (product: Product) => void}>({})
export default function useController() {
    return useContext(ProductControllerContext)
}
