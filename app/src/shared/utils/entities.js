// @flow

import { normalize } from 'normalizr'

import { updateEntities } from '$shared/modules/entities/actions'

export const handleEntities = (schema: any, dispatch: Function) => (data: any) => {
    const { result, entities } = normalize(data, schema)
    dispatch(updateEntities(entities))
    return result
}
