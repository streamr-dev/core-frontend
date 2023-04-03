import React, { useEffect, useState } from 'react'
import { useClient } from 'streamr-client-react'
import Activity from '$shared/utils/Activity'
import { isLocalStorageAvailable } from '$shared/utils/storage'
import { Provider as PendingProvider } from '$shared/contexts/Pending'
import getTransactionalClient from '$app/src/getters/getTransactionalClient'
const storage = isLocalStorageAvailable() ? localStorage : null

const Handler = () => {
    const [streamId, setStreamId] = useState(storage ? storage.getItem('user.activityStreamId') : null)
    const client = useClient()
    useEffect(() => {
        const publishActivity = (activity) => {
            if (client && streamId) {
                const data = activity.serialize()
                client.publish(streamId, data)
            }
        }

        if (client && streamId) {
            Activity.subscribe(publishActivity)
            return () => {
                Activity.unsubscribe(publishActivity)
            }
        }

        return () => {}
    }, [client, streamId])
    useEffect(() => {
        const createStream = async () => {
            const stream = await getTransactionalClient().createStream({
                id: 'activity-stream',
                description: 'Automatically created stream for storing user activity',
            })
            // TODO: Remove permissions from stream so that user cannot delete this stream
            setStreamId(stream.id)

            if (storage) {
                storage.setItem('user.activityStreamId', stream.id)
            }
        }

        if (streamId == null) {
            createStream()
        }
    }, [streamId])
    return null
}

const ActivityStreamHandler = () => (
    <PendingProvider name="streamr-client">
        <Handler />
    </PendingProvider>
)

export default ActivityStreamHandler
