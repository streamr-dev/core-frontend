// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import usePending from '$shared/hooks/usePending'

import type { CommunityId } from '$mp/flowtype/product-types'
import { getCommunityById } from '$mp/modules/communityProduct/actions'

export default function useCommunityProductLoadCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('communityProduct.LOAD')

    return useCallback(async (id: CommunityId) => (
        wrap(async () => {
            await dispatch(getCommunityById(id))
        })
    ), [wrap, dispatch])
}
