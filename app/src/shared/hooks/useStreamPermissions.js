// @flow

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getMyStreamPermissions } from '$userpages/modules/userPageStreams/services'
import { handleLoadError } from '$auth/utils/loginInterceptor'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import useFailure from '$shared/hooks/useFailure'
import { selectUserData, isAuthenticating } from '$shared/modules/user/selectors'
import useIsMounted from '$shared/hooks/useIsMounted'

const extractOperations = (data: Array<any>, username: ?string): Array<string> => (
    data
        .filter((item) => item.user === 'anonymous' || (username && item.user === username))
        .map((item) => item.operation)
)

export default (id: string) => {
    const [permissions, setPermissions] = useState()

    const fail = useFailure()

    const { username } = useSelector(selectUserData) || {}

    const authenticating = useSelector(isAuthenticating)

    const isMounted = useIsMounted()

    useEffect(() => {
        setPermissions(undefined)

        const fetch = async () => {
            try {
                try {
                    const data = await getMyStreamPermissions(id)

                    if (isMounted()) {
                        setPermissions(extractOperations(data, username))
                    }
                } catch (e) {
                    await handleLoadError(e)
                }
            } catch (e) {
                if (e instanceof ResourceNotFoundError) {
                    fail(e)
                    return
                }
                throw e
            }
        }

        if (!authenticating) {
            fetch()
        }
    }, [id, username, authenticating, fail, isMounted])

    return permissions
}
