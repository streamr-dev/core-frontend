// @flow

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getResourcePermissions } from '$userpages/modules/permission/actions'
import { selectStreamPermissions } from '$userpages/modules/permission/selectors'
import { canHandleLoadError, handleLoadError } from '$auth/utils/loginInterceptor'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import useFailure from '$shared/hooks/useFailure'
import { isAuthenticating } from '$shared/modules/user/selectors'

export default (id: string) => {
    const dispatch = useDispatch()
    const permissions = useSelector(selectStreamPermissions)

    const fail = useFailure()

    const authenticating = useSelector(isAuthenticating)

    const hasPermission = !!permissions[id]

    useEffect(() => {
        const fetch = async () => {
            try {
                try {
                    await dispatch(getResourcePermissions('STREAM', id))
                } catch (error) {
                    if (canHandleLoadError(error)) {
                        await handleLoadError({
                            error,
                        })
                    }
                }
            } catch (e) {
                if (e instanceof ResourceNotFoundError) {
                    fail(e)
                    return
                }
                throw e
            }
        }

        if (!authenticating && !hasPermission) {
            fetch()
        }
    }, [id, authenticating, hasPermission, fail, dispatch])

    return hasPermission ? permissions[id] : undefined
}
