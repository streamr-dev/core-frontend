import { useMemo, useCallback, useState } from 'react'
import Activity from '$shared/utils/Activity'
import { isLocalStorageAvailable } from '$shared/utils/storage'

export const ACTIVITY_FROM = 30 * 24 * 60 * 60 * 1000 // 30 days

const storage = isLocalStorageAvailable() ? localStorage : null

export default () => {
    const [activities, setActivities] = useState([])

    const onMessage = useCallback((msg) => {
        const activity = Activity.deserialize(msg)
        setActivities((prev) => (
            [activity, ...prev]
        ))
    }, [])

    if (!process.env.ACTIVITY_QUEUE || !storage) {
        return null
    }

    const streamId = storage.getItem('user.activityStreamId')

    if (!streamId) {
        return null
    }

    return useMemo(() => ({
        activities,
        onMessage,
        streamId,
    }), [
        activities,
        onMessage,
        streamId,
    ])
}


// HERE: We're building a hook for activities.
