import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import usePending from '$shared/hooks/usePending'
import type { ProjectId } from '$mp/types/project-types'
import { getRelatedProducts } from '../../modules/relatedProducts/actions'
export default function useRelatedProductsLoadCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('product.LOAD_RELATED_PRODUCTS')
    return useCallback(
        async (productId: ProjectId, useAuthorization = true) =>
            wrap(async () => {
                await dispatch(getRelatedProducts(productId, useAuthorization))
            }),
        [wrap, dispatch],
    )
}
