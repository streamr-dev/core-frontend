import StatusIcon from '$shared/components/StatusIcon'

export default function getStreamActivityStatus(recentMessageTimestamp, inactivityThresholdHours = Infinity) {
    return (
        new Date().getTime() - (inactivityThresholdHours * 60 * 60 * 1000) < recentMessageTimestamp
            ? StatusIcon.OK
            : StatusIcon.INACTIVE
    )
}
