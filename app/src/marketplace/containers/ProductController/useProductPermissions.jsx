// @flow

import React, { type Context, type Node, useMemo, useCallback, useState, useEffect, useContext } from 'react'

import usePending from '$shared/hooks/usePending'
import useIsMounted from '$shared/hooks/useIsMounted'

import { getResourcePermissions } from '$userpages/modules/permission/services'
import useProduct from './useProduct'

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
            const result = await getResourcePermissions({
                resourceType: 'PRODUCT',
                resourceId: id,
                id: 'me',
            })
            if (!isMounted()) { return }
            setPermissions(result.map(({ operation }) => operation))
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
