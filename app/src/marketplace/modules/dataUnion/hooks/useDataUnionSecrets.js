import { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { dataUnionSecretSchema, dataUnionSecretsSchema } from '$shared/modules/entities/schema'

import { setDataUnionSecrets, addDataUnionSecret, removeDataUnionSecret } from '../actions'
import { selectDataUnionSecrets } from '../selectors'
import { getSecrets, postSecret, putSecret, deleteSecret } from '../services'
import useEntities from '$shared/hooks/useEntities'

function useDataUnionSecrets() {
    const dispatch = useDispatch()
    const secrets = useSelector(selectDataUnionSecrets)
    const { update } = useEntities()

    const load = useCallback(async (dataUnionId) => {
        try {
            const response = await getSecrets({
                dataUnionId,
            })
            const result = update({
                data: response,
                schema: dataUnionSecretsSchema,
            })
            dispatch(setDataUnionSecrets(dataUnionId, result))
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [dispatch, update])

    const add = useCallback(async ({ dataUnionId, name }) => {
        try {
            const response = await postSecret({
                dataUnionId,
                name,
            })
            const result = update({
                data: response,
                schema: dataUnionSecretSchema,
            })
            dispatch(addDataUnionSecret(dataUnionId, result))
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [dispatch, update])

    const edit = useCallback(async ({ dataUnionId, id, name }) => {
        try {
            const response = await putSecret({
                dataUnionId,
                id,
                name,
            })
            update({
                data: response,
                schema: dataUnionSecretSchema,
            })
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [update])

    const remove = useCallback(async ({ dataUnionId, id }) => {
        try {
            await deleteSecret({
                dataUnionId,
                id,
            })
            dispatch(removeDataUnionSecret(dataUnionId, id))
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [dispatch])

    const reset = useCallback(async (dataUnionId) => {
        dispatch(setDataUnionSecrets(dataUnionId, []))
    }, [dispatch])

    return useMemo(() => ({
        load,
        secrets,
        add,
        edit,
        remove,
        reset,
    }), [
        load,
        secrets,
        add,
        edit,
        remove,
        reset,
    ])
}

export default useDataUnionSecrets
