// @flow

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getMyStreamPermissions } from '$userpages/modules/userPageStreams/services'
import { handleLoadError } from '$auth/utils/loginInterceptor'
import ResourceNotFoundError from '$shared/errors/ResourceNotFoundError'
import useFailure from '$shared/hooks/useFailure'
import { selectUserData } from '$shared/modules/user/selectors'

const extractOperations = (data: Array<any>, username: ?string): Array<string> => (
    data
        .filter((item) => item.user === 'anonymous' || (username && item.user === username))
        .map((item) => item.operation)
)

export default (id: string) => {
    const [permissions, setPermissions] = useState()

    const fail = useFailure()

    const { name: username } = useSelector(selectUserData) || {}

    useEffect(() => {
        setPermissions(undefined)

        const fetch = async () => {
            try {
                try {
                    setPermissions(extractOperations(await getMyStreamPermissions(id), username))
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

        fetch()
    }, [id, username, fail])

    return permissions
}
