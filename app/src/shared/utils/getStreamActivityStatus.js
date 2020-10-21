import StatusIcon from '$shared/components/StatusIcon'
import { INVALID_TIMESTAMP } from '../hooks/useLastMessageTimestamp'

export default function getStreamActivityStatus(recentMessageTimestamp, inactivityThresholdHours = Infinity) {
    if (recentMessageTimestamp === INVALID_TIMESTAMP) {
        return StatusIcon.ERROR
    }

    if (new Date().getTime() - (inactivityThresholdHours * 60 * 60 * 1000) < recentMessageTimestamp) {
        return StatusIcon.OK
    }

    return StatusIcon.INACTIVE
}
