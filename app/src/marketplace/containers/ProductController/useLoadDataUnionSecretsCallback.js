// @flow

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import usePending from '$shared/hooks/usePending'

import type { DataUnionId } from '$mp/flowtype/product-types'
import { getSecrets } from '$mp/modules/dataUnion/actions'

export default function useLoadDataUnionSecretsCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('dataUnion.LOAD_SECRETS')

    return useCallback(async (id: DataUnionId) => (
        wrap(async () => {
            await dispatch(getSecrets(id))
        })
    ), [wrap, dispatch])
}
