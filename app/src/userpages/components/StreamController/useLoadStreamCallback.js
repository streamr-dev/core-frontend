import { useCallback } from 'react'
import { useClient } from 'streamr-client-react'

import useIsMounted from '$shared/hooks/useIsMounted'
import usePending from '$shared/hooks/usePending'
import { canHandleLoadError, handleLoadError } from '$auth/utils/loginInterceptor'

import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import useFailure from '$shared/hooks/useFailure'
import useEditableState from '$shared/contexts/Undo/useEditableState'

import { useController } from '.'

function normalizePermissions(permissions) {
    if (!permissions || !Array.isArray(permissions)) {
        return []
    }

    return [...new Set(permissions.map(({ operation }) => operation))]
}

export default function useLoadStreamCallback() {
    const client = useClient()
    const { wrap } = usePending('stream.LOAD')
    const isMounted = useIsMounted()
    const fail = useFailure()
    const productUpdater = useEditableState()
    const { setStream } = useController()

    const load = useCallback(async ({ id, ignoreUnauthorized }) => (
        wrap(async () => {
            let stream
            try {
                stream = await client.getStream(id)
            } catch (error) {
                if (!isMounted()) { return }
                if (canHandleLoadError(error)) {
                    await handleLoadError({
                        error,
                        ignoreUnauthorized,
                    })
                }

                throw error
            }

            if (!isMounted()) { return }

            const permissions = await (async () => {
                try {
                    return await stream.getMyPermissions()
                } catch (e) {
                    console.error('useLoadStreamCallback', e)
                }

                return []
            })()

            if (!isMounted()) { return }

            productUpdater.replaceState(() => stream.toObject())

            setStream({
                stream,
                permissions: normalizePermissions(permissions),
            })
        })
    ), [wrap, client, setStream, productUpdater, isMounted])

    return useCallback(async (props) => {
        try {
            await load(props)
        } catch (e) {
            if (e instanceof ResourceNotFoundError) {
                fail(e)
                return
            }

            throw e
        }
    }, [load, fail])
}
