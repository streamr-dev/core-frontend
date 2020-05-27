// @flow

import React, { useEffect, useState, useContext } from 'react'

import { Provider as ClientProvider, Context as ClientContext } from '$shared/contexts/StreamrClient'
import Activity from '$shared/utils/Activity'
import { isLocalStorageAvailable } from '$shared/utils/storage'
import { Provider as PendingProvider } from '$shared/contexts/Pending'

const storage = isLocalStorageAvailable() ? localStorage : null

const Handler = () => {
    const [streamId, setStreamId] = useState(storage ? storage.getItem('user.activityStreamId') : null)
    const { client } = useContext(ClientContext)

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
            const stream = await client.createStream({
                name: 'Activity stream',
                description: 'Automatically created stream for storing user activity',
            })
            // TODO: Remove permissions from stream so that user cannot delete this stream
            setStreamId(stream.id)
            if (storage) {
                storage.setItem('user.activityStreamId', stream.id)
            }
        }

        if (client && streamId == null) {
            createStream()
        }
    }, [client, streamId])

    return null
}

const ActivityStreamHandler = () => (
    <PendingProvider name="streamr-client">
        <ClientProvider>
            <Handler />
        </ClientProvider>
    </PendingProvider>
)

export default ActivityStreamHandler
