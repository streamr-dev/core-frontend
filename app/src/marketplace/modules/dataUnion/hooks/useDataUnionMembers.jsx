import React, { useMemo, useCallback, useState, useContext } from 'react'
import { denormalize } from 'normalizr'

import { dataUnionMemberSchema, dataUnionMembersSchema } from '$shared/modules/entities/schema'

import useEntities from '$shared/hooks/useEntities'
import { getAllMemberEvents, removeMembers } from '../services'

const DataUnionMembersContext = React.createContext({})

function useDataUnionMembers() {
    const [loading, setLoading] = useState(false)
    const [ids, setIds] = useState([])
    const { update, entities } = useEntities()

    const load = useCallback(async (dataUnionId) => {
        setLoading(true)
        try {
            // eslint-disable-next-line no-restricted-syntax
            for await (const event of getAllMemberEvents(dataUnionId)) {
                const result = update({
                    data: event,
                    schema: dataUnionMemberSchema,
                })
                setIds((prev) => [
                    ...prev.filter((i) => i !== result),
                    result,
                ])
            }
        } catch (e) {
            console.warn(e)
            throw e
        } finally {
            setLoading(false)
        }
    }, [update])

    const remove = useCallback(async (dataUnionId, memberAddresses) => {
        try {
            await removeMembers({
                dataUnionId,
                memberAddresses,
            })
            setIds((prev) => prev.filter((m) => !memberAddresses.includes(m)))
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [])

    const reset = useCallback(() => {
        setIds([])
    }, [])

    const members = useMemo(() => (
        denormalize(ids, dataUnionMembersSchema, entities)
            .sort((a, b) => a.address.localeCompare(b.address))
    ), [ids, entities])

    return useMemo(() => ({
        loading,
        load,
        members,
        remove,
        reset,
    }), [
        loading,
        load,
        members,
        remove,
        reset,
    ])
}

export const DataUnionMembersProvider = ({ children }) => (
    <DataUnionMembersContext.Provider value={useDataUnionMembers()}>
        {children || null}
    </DataUnionMembersContext.Provider>
)

export default function useDataUnionMembersContext() {
    return useContext(DataUnionMembersContext)
}
