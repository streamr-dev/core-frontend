import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProjectId } from '$mp/types/project-types'
import { getProductSubscription } from '$mp/modules/product/actions'
import { useController } from '$mp/containers/ProductController'
import { selectUserData } from '$shared/modules/user/selectors'
import { getChainIdFromApiString } from '$shared/utils/chains'
import { selectRelatedProductList } from '$mp/modules/relatedProducts/selectors'
import { selectAllCategories } from '$mp/modules/categories/selectors'

export const useLoadAdditionalProductData = (): void => {
    const { product, loadCategories, loadRelatedProducts } = useController()
    const relatedProjects = useSelector(selectRelatedProductList)
    const categories = useSelector(selectAllCategories)
    const dispatch = useDispatch()
    const userData = useSelector(selectUserData)
    const isLoggedIn = userData !== null
    const productId = product.id
    const chainId = getChainIdFromApiString(product.chain)
    const loadAdditionalProductData = useCallback(
        async (id: ProjectId) => {
            if (!categories?.length) {
                loadCategories()
            }
            if (!relatedProjects?.length) {
                loadRelatedProducts(id, isLoggedIn)
            }

            if (isLoggedIn) {
                dispatch(getProductSubscription(id, chainId))
            }
        },
        [dispatch, isLoggedIn, loadCategories, loadRelatedProducts, chainId],
    )
    useEffect(() => {
        loadAdditionalProductData(productId)
    }, [loadAdditionalProductData, productId])
}
