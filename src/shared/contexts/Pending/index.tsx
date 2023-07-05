import React, {
    useMemo,
    useCallback,
    useState,
    useContext,
    useEffect,
    Context,
    ReactNode,
} from 'react'
import t from 'prop-types'
import useIsMounted from '~/shared/hooks/useIsMounted'
type ContextProps = {
    name: string
    isPending: boolean
    setPending: (arg0: string, arg1: number) => any
    checkPending: (arg0: string) => boolean
    updateChildren: (arg0: string, arg1: ContextProps) => any
}
const ROOT: ContextProps = {
    name: '',
    isPending: false,
    setPending: () => {},
    checkPending: () => false,
    updateChildren: () => {},
}

function useNamedCounters(): [
    { [key: string]: number },
    (name: string, direction: number) => void,
] {
    const isMounted = useIsMounted()
    const [counters, setCountersState] = useState<{ [key: string]: number }>({})
    const updateCounter: (name: string, direction: number) => void = useCallback(
        (name, direction) => {
            if (!isMounted()) {
                return
            }

            if (!name) {
                throw new Error('counter needs a name')
            }

            setCountersState((state) => {
                const current = state[name] || 0
                return { ...state, [name]: Math.max(0, current + direction) }
            })
        },
        [setCountersState, isMounted],
    )
    return [counters, updateCounter]
}

const PendingContext: Context<ContextProps> = React.createContext(ROOT)

/* eslint-disable no-shadow */
function usePendingContext(name: string): ContextProps {
    const parentContext = useContext(PendingContext)
    const isMounted = useIsMounted()
    const path = [parentContext && parentContext.name, name].filter(Boolean).join('.')
    const [pendingChildren, updatePendingChildren] = React.useState({})
    const updateParent = parentContext !== ROOT && parentContext.updateChildren
    const [selfPending, setPending] = useNamedCounters()
    const updateChildren = useCallback<(childName: string, value: any) => void>(
        (childName, value) => {
            if (!isMounted()) {
                return
            }

            updatePendingChildren((c) => ({ ...c, [childName]: value }))
        },
        [updatePendingChildren, isMounted],
    )
    const isSelfPending = Object.values(selfPending).some((value) => !!value)
    const pendingChildrenValues = Object.values(pendingChildren)
    const isChildrenPending =
        !!pendingChildrenValues.length &&
        pendingChildrenValues.some(({ isPending }: any) => isPending)
    const isPending = isSelfPending || isChildrenPending
    const checkPending = useCallback((key: any) => !!selfPending[key], [selfPending])
    const value = useMemo<ContextProps>(
        () => ({
            name,
            path,
            isPending,
            checkPending,
            setPending,
            updateChildren,
        }),
        [path, name, isPending, updateChildren, setPending, checkPending],
    )
    useEffect(() => {
        if (!updateParent) {
            return
        }

        updateParent(name, value)
    }, [value, name, updateParent])
    return value
}

type Props = {
    children?: ReactNode
    name: string
}

function PendingContextProvider({ name, children }: Props) {
    return (
        <PendingContext.Provider key={name} value={usePendingContext(name)}>
            {children || null}
        </PendingContext.Provider>
    )
}

PendingContextProvider.propTypes = {
    name: t.string.isRequired,
}
export { PendingContextProvider as Provider, PendingContext as Context }
