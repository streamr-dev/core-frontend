// @flow

import { useMemo, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { dataUnionSecretSchema, dataUnionSecretsSchema } from '$shared/modules/entities/schema'
import type { DataUnionId } from '$mp/flowtype/product-types'

import useEntities from '$shared/hooks/useEntities'
import { setDataUnionSecrets, addDataUnionSecret, removeDataUnionSecret } from '../actions'
import { selectDataUnionSecrets } from '../selectors'
import { getSecrets, createSecret, editSecret, deleteSecret } from '../services'

function useDataUnionSecrets() {
    const dispatch = useDispatch()
    const secrets = useSelector(selectDataUnionSecrets)
    const { update } = useEntities()

    const load = useCallback(async (dataUnionId: DataUnionId, chainId: number) => {
        try {
            const response = await getSecrets({
                dataUnionId,
                chainId,
            })
            const result = update({
                data: response.map((r) => ({
                    ...r,
                    id: r.secret,
                })),
                schema: dataUnionSecretsSchema,
            })
            dispatch(setDataUnionSecrets(dataUnionId, result))
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [dispatch, update])

    const add = useCallback(async ({ dataUnionId, name, chainId }: { dataUnionId: DataUnionId, name: string, chainId: number }) => {
        try {
            const response = await createSecret({
                dataUnionId,
                name,
                chainId,
            })
            const result = update({
                data: {
                    ...response,
                    id: response.secret,
                },
                schema: dataUnionSecretSchema,
            })
            dispatch(addDataUnionSecret(dataUnionId, result))
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [dispatch, update])

    const edit = useCallback(async ({ dataUnionId, id, name, chainId }: { dataUnionId: DataUnionId, id: string, name: string, chainId: number }) => {
        try {
            const response = await editSecret({
                dataUnionId,
                id,
                name,
                chainId,
            })
            update({
                data: {
                    ...response,
                    id: response.secret,
                },
                schema: dataUnionSecretSchema,
            })
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [update])

    const remove = useCallback(async ({ dataUnionId, id, chainId }: { dataUnionId: DataUnionId, id: string, chainId: number }) => {
        try {
            await deleteSecret({
                dataUnionId,
                id,
                chainId,
            })
            dispatch(removeDataUnionSecret(dataUnionId, id))
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [dispatch])

    const reset = useCallback(async (dataUnionId: DataUnionId) => {
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
