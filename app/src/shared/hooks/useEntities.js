// @flow

import { useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { normalize } from 'normalizr'

import { updateEntities } from '$shared/modules/entities/actions'
import { selectEntities } from '$shared/modules/entities/selectors'

function useEntities() {
    const dispatch = useDispatch()
    const entities = useSelector(selectEntities)

    const update = useCallback((data: any, schema: any) => {
        const { result, entities: newEntities } = normalize(data, schema)
        dispatch(updateEntities(newEntities))
        return result
    }, [dispatch])

    return useMemo(() => ({
        update,
        entities,
    }), [update, entities])
}

export default useEntities
