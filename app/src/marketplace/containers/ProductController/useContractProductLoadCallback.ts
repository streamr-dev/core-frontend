import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import usePending from '$shared/hooks/usePending'
import type { ProjectId } from '$mp/types/project-types'
import { getProductFromContract } from '$mp/modules/contractProduct/actions'
export default function useContractProductLoadCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('contractProduct.LOAD')
    return useCallback(
        async (productId: ProjectId, chainId: number) =>
            wrap(async () => {
                await dispatch(getProductFromContract(productId, chainId))
            }),
        [wrap, dispatch],
    )
}
