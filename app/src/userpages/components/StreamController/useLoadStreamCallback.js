import { useCallback } from 'react'
import { useClient } from 'streamr-client-react'
import uuid from 'uuid'

import useIsMounted from '$shared/hooks/useIsMounted'
import usePending from '$shared/hooks/usePending'
import { canHandleClientError, handleClientError } from '$auth/utils/loginInterceptor'

import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import useFailure from '$shared/hooks/useFailure'
import useEditableState from '$shared/contexts/Undo/useEditableState'

import { useController } from '.'

const mapStreamFields = (stream) => {
    const { config } = stream

    if (!config || !config.fields) {
        return stream
    }

    return {
        ...stream,
        config: {
            ...config,
            fields: (config.fields || []).map((field) => ({
                ...field,
                id: field.id ? field.id : uuid(),
            })),
        },
    }
}

export default function useLoadStreamCallback() {
    const client = useClient()
    const { wrap } = usePending('stream.LOAD')
    const isMounted = useIsMounted()
    const fail = useFailure()
    const productUpdater = useEditableState()
    const { setStream } = useController()

    const load = useCallback(async ({ id, username, ignoreUnauthorized }) => (
        wrap(async () => {
            let stream
            try {
                stream = await client.getStream(id)
            } catch (error) {
                if (!isMounted()) { return }
                if (canHandleClientError(error)) {
                    await handleClientError({
                        error,
                        type: 'STREAM',
                        id,
                        ignoreUnauthorized,
                    })
                }

                throw error
            }

            if (!isMounted()) { return }

            const permissions = await (async () => {
                try {
                    return await stream.getUserPermissions(username)
                } catch (e) {
                    console.error('useLoadStreamCallback', e)
                }

                return {}
            })()

            if (!isMounted()) { return }

            productUpdater.replaceState(() => mapStreamFields(stream.toObject()))

            setStream({
                stream,
                permissions,
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
