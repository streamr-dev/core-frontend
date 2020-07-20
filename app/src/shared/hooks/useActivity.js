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

    const streamId = storage && process.env.ACTIVITY_QUEUE ? storage.getItem('user.activityStreamId') : undefined

    const result = useMemo(() => ({
        activities,
        onMessage,
        streamId,
    }), [
        activities,
        onMessage,
        streamId,
    ])

    return streamId ? result : null
}
