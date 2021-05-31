import React, { useMemo, useCallback, useState, useContext, useRef, useEffect } from 'react'
import { denormalize } from 'normalizr'

import { dataUnionMemberSchema, dataUnionMembersSchema } from '$shared/modules/entities/schema'

import useIsMounted from '$shared/hooks/useIsMounted'
import useEntities from '$shared/hooks/useEntities'
import { getAllMemberEvents, removeMembers } from '../services'

const DataUnionMembersContext = React.createContext({})

function useDataUnionMembers() {
    const isMounted = useIsMounted()
    const [loading, setLoading] = useState(false)
    const [ids, setIds] = useState([])
    const { update, entities } = useEntities()
    const generator = useRef(null)

    const reset = useCallback(() => {
        setIds([])
    }, [])

    useEffect(() => () => {
        // Cancel generator on unmount
        if (generator.current != null) {
            generator.current.return('Canceled')
            generator.current = null
        }
    }, [])

    const load = useCallback(async (dataUnionId) => {
        setLoading(true)
        try {
            if (generator.current != null) {
                generator.current.return('Canceled')
                generator.current = null
                reset()
            }
            generator.current = getAllMemberEvents(dataUnionId)

            // eslint-disable-next-line no-restricted-syntax
            for await (const event of generator.current) {
                if (isMounted()) {
                    const result = update({
                        data: event,
                        schema: dataUnionMemberSchema,
                    })
                    setIds((prev) => [
                        ...prev.filter((i) => i !== result),
                        result,
                    ])
                }
            }
        } catch (e) {
            console.warn(e)
            throw e
        } finally {
            setLoading(false)
        }
    }, [update, reset, isMounted])

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
