import { normalize } from 'normalizr'
import { updateEntities } from '$shared/modules/entities/actions'
// TODO add typing - possibility for generic types?
export const handleEntities = (schema: any, dispatch: (...args: Array<any>) => any) => (data: any): string=> {
    const { result, entities } = normalize(data, schema)
    dispatch(updateEntities(entities))
    return result
}
