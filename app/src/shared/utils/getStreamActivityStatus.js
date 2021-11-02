import { StatusIcon } from '@streamr/streamr-layout'

export default function getStreamActivityStatus(recentMessageTimestamp, inactivityThresholdHours = -Infinity) {
    if (new Date().getTime() - (inactivityThresholdHours * 60 * 60 * 1000) < recentMessageTimestamp) {
        return StatusIcon.OK
    }

    return StatusIcon.INACTIVE
}
