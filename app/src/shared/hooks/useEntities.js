// @flow

import { useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { normalize } from 'normalizr'

import { updateEntities } from '$shared/modules/entities/actions'
import { selectEntities } from '$shared/modules/entities/selectors'

type UpdateParams = {
    data: any,
    schema: any,
}

function useEntities() {
    const dispatch = useDispatch()
    const entities = useSelector(selectEntities)

    const update = useCallback(({ data, schema }: UpdateParams) => {
        const { result, entities: normalizedEntities } = normalize(data, schema)

        dispatch(updateEntities(normalizedEntities))

        return result
    }, [dispatch])

    return useMemo(() => ({
        update,
        entities,
    }), [update, entities])
}

export default useEntities
