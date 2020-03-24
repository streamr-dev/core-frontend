// @flow

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getMyResourceKeys } from '$shared/modules/resourceKey/actions'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import { selectAuthState } from '$shared/modules/user/selectors'
import { useClientProvider } from '$shared/contexts/StreamrClient'
import Activity from '$shared/utils/Activity'
import { isLocalStorageAvailable } from '$shared/utils/storage'

const storage = isLocalStorageAvailable() ? localStorage : null

const ActivityStreamHandler = () => {
    const dispatch = useDispatch()
    const [streamId, setStreamId] = useState(storage ? storage.getItem('user.activityStreamId') : null)
    const apiKey = useSelector(selectAuthApiKeyId)
    const authState = useSelector(selectAuthState)
    const { client } = useClientProvider({
        apiKey,
        loadKeys: () => dispatch(getMyResourceKeys()),
        ...authState,
    })

    useEffect(() => {
        const publishActivity = (activity) => {
            if (client && client.options.auth.apiKey) {
                const data = activity.serialize()
                client.publish(streamId, data)
            }
        }

        if (client && apiKey && streamId) {
            Activity.subscribe(publishActivity)
        }
    }, [client, apiKey, streamId])

    useEffect(() => {
        const createStream = async () => {
            const stream = await client.createStream({
                name: 'Activity stream',
                description: 'Automatically created stream for storing user activity',
            })
            setStreamId(stream.id)
            if (storage) {
                storage.setItem('user.activityStreamId', stream.id)
            }
        }

        if (client && apiKey && streamId == null) {
            createStream()
        }
    }, [client, apiKey, streamId])

    return null
}

export default ActivityStreamHandler
