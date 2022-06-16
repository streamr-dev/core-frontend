import React, { useMemo, useCallback, useState, useContext, useRef, useEffect } from 'react'

import useIsMounted from '$shared/hooks/useIsMounted'
import { useThrottled } from '$shared/hooks/wrapCallback'
import { getAllMemberEvents, removeMembers } from '../services'

const DataUnionMembersContext = React.createContext({})
const VISIBLE_MEMBERS_LIMIT = 100

function useDataUnionMembers() {
    const isMounted = useIsMounted()
    const [loading, setLoading] = useState(false)
    const [members, setMembers] = useState([])
    const generator = useRef(null)
    const membersRef = useRef([])

    const updateDataToState = useThrottled(useCallback((data) => {
        setMembers([...data.slice(0, VISIBLE_MEMBERS_LIMIT)])
    }, []), 100)

    const reset = useCallback(() => {
        setMembers([])
        membersRef.current = []
    }, [])

    useEffect(() => () => {
        // Cancel generator on unmount
        if (generator.current != null) {
            generator.current.return('Canceled')
            generator.current = null
        }
    }, [])

    const load = useCallback(async (dataUnionId, chainId) => {
        setLoading(true)
        try {
            if (generator.current != null) {
                generator.current.return('Canceled')
                generator.current = null
                reset()
            }
            generator.current = getAllMemberEvents(dataUnionId, chainId)

            // eslint-disable-next-line no-restricted-syntax
            for await (const event of generator.current) {
                if (isMounted()) {
                    if (membersRef.current.find((m) => m.address === event.address) === undefined) {
                        membersRef.current.push(event)
                        updateDataToState(membersRef.current)
                    }
                }
            }
        } catch (e) {
            console.warn(e)
            throw e
        } finally {
            if (isMounted()) {
                setLoading(false)
            }
        }
    }, [reset, isMounted, updateDataToState])

    const remove = useCallback(async (dataUnionId, memberAddresses) => {
        try {
            await removeMembers(dataUnionId, memberAddresses)

            if (isMounted()) {
                setMembers((prev) => prev.filter((m) => !memberAddresses.includes(m.address)))
            }
        } catch (e) {
            console.warn(e)
            throw e
        }
    }, [isMounted])

    const search = useCallback((text) => (
        membersRef.current
            .filter((m) => ((text && text.length > 0) ? m.address.includes(text) : true))
            .slice(0, VISIBLE_MEMBERS_LIMIT)
    ), [])

    return useMemo(() => ({
        loading,
        load,
        members,
        remove,
        reset,
        search,
    }), [
        loading,
        load,
        members,
        remove,
        reset,
        search,
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
