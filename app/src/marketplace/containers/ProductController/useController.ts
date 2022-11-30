import { createContext, useContext } from 'react'
import { Project } from '$mp/types/project-types'
// TODO - fix typing
type ProductControllerContextProps = {
    hasLoaded: any,
    product: Project,
    setProduct: any,
    productStreams: any,
    setProductStreams: any,
    allStreams: any,
    setAllStreams: any,
    loadProduct: any,
    loadContractProduct: any,
    loadCategories: any,
    loadProductStreams: any,
    loadDataUnion: any,
    loadDataUnionStats: any,
    loadRelatedProducts: any,
    loadAllStreams: any,
    resetDataUnion: any,
}
export const ProductControllerContext = createContext<ProductControllerContextProps>({} as ProductControllerContextProps)
export default function useController() {
    return useContext(ProductControllerContext)
}
