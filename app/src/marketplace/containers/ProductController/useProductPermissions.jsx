// @flow

import React, { type Context, type Node, useMemo, useCallback, useState, useEffect, useContext } from 'react'

import usePending from '$shared/hooks/usePending'
import useProduct from './useProduct'
import useIsMounted from '$shared/hooks/useIsMounted'

import { getUserProductPermissions } from '$mp/modules/product/services'

type ContextProps = {
    hasPermissions: boolean,
    share: boolean,
    get: boolean,
    edit: boolean,
    del: boolean,
}

const PermissionContext: Context<ContextProps> = React.createContext({})

function usePermissionContextValue() {
    const [permissions, setPermissions] = useState()
    const isMounted = useIsMounted()
    const product = useProduct()
    const { wrap, isPending } = usePending('product.PERMISSIONS')
    const [loadedOnce, setLoadedOnce] = useState(false)

    const productId = !!product && product.id

    const loadPermissions = useCallback(async (id) => (
        wrap(async () => {
            const result = await getUserProductPermissions(id)
            if (!isMounted()) { return }
            setPermissions(result)
        })
    ), [wrap, isMounted])

    // load permissions if needed
    useEffect(() => {
        if (!productId || isPending) { return }

        if (!loadedOnce) {
            loadPermissions(productId)
            setLoadedOnce(true)
        }
    }, [productId, loadedOnce, isPending, loadPermissions])

    const hasPermissions = !!permissions
    /* eslint-disable camelcase */
    const share = !!(permissions && permissions.share)
    const del = !!(permissions && permissions.del)
    const edit = !!(permissions && permissions.edit)
    const get = !!(permissions && permissions.get)

    return useMemo(() => ({
        hasPermissions,
        share,
        get,
        edit,
        del,
    }), [hasPermissions, share, edit, get, del])
    /* eslint-enable camelcase */
}

type Props = {
    children?: Node,
}

function PermissionContextProvider({ children }: Props) {
    return (
        <PermissionContext.Provider value={usePermissionContextValue()}>
            {children || null}
        </PermissionContext.Provider>
    )
}

export {
    PermissionContextProvider as Provider,
    PermissionContext as Context,
}

function usePermissionContext() {
    return useContext(PermissionContext)
}

export default usePermissionContext
