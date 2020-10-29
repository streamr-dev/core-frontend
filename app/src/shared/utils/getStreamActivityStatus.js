import StatusIcon from '$shared/components/StatusIcon'

export default function getStreamActivityStatus(recentMessageTimestamp, inactivityThresholdHours = -Infinity) {
    if (new Date().getTime() - (inactivityThresholdHours * 60 * 60 * 1000) < recentMessageTimestamp) {
        return StatusIcon.OK
    }

    return StatusIcon.INACTIVE
}
