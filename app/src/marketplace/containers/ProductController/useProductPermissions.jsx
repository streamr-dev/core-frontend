// @flow

import React, { type Context, type Node, useMemo, useCallback, useState, useEffect, useContext } from 'react'

import usePending from '$shared/hooks/usePending'
import useIsMounted from '$shared/hooks/useIsMounted'

import { getPermissions } from '$mp/modules/product/services'
import { useController } from '.'

type ContextProps = {
    hasPermissions: boolean,
    share: boolean,
    get: boolean,
    edit: boolean,
    del: boolean,
}

const PermissionContext: Context<ContextProps> = React.createContext({})

function usePermissionContextValue(autoLoadPermissions: boolean = true) {
    const [permissions, setPermissions] = useState()
    const isMounted = useIsMounted()
    const { product } = useController()
    const { wrap, isPending } = usePending('product.PERMISSIONS')
    const [loadedOnce, setLoadedOnce] = useState(false)

    const productId = !!product && product.id

    const loadPermissions = useCallback(async (id) => (
        wrap(async () => {
            const result = await getPermissions(id, 'me')
            if (!isMounted()) { return }
            setPermissions(result.map(({ operation }) => operation))
        })
    ), [wrap, isMounted])

    // load permissions if needed
    useEffect(() => {
        if (!productId || isPending || !autoLoadPermissions) { return }

        if (!loadedOnce) {
            loadPermissions(productId)
            setLoadedOnce(true)
        }
    }, [autoLoadPermissions, productId, loadedOnce, isPending, loadPermissions])

    const hasPermissions = !!permissions

    const share = !!(permissions && permissions.includes('product_get'))
    const del = !!(permissions && permissions.includes('product_delete'))
    const edit = !!(permissions && permissions.includes('product_edit'))
    const get = !!(permissions && permissions.includes('product_share'))

    return useMemo(() => ({
        hasPermissions,
        share,
        get,
        edit,
        del,
    }), [hasPermissions, share, edit, get, del])
}

type Props = {
    children?: Node,
    autoLoadPermissions?: boolean,
}

function PermissionContextProvider({ children, autoLoadPermissions = true }: Props) {
    return (
        <PermissionContext.Provider value={usePermissionContextValue(!!autoLoadPermissions)}>
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
