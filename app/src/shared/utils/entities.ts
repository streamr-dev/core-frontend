import { normalize } from 'normalizr'
import { updateEntities } from '$shared/modules/entities/actions'
export const handleEntities = (schema: any, dispatch: (...args: Array<any>) => any) => (data: any) => {
    const { result, entities } = normalize(data, schema)
    dispatch(updateEntities(entities))
    return result
}
