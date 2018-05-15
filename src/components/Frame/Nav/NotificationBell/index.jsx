// @flow

import React from 'react'
import classNames from 'classnames'
import NavLink from '../NavLink'
import styles from './notificationBell.pcss'

const PENDING: string = 'pending'
const COMPLETE: string = 'complete'

type Props = {
    color?: string,
    state?: string,
}

const NotificationBell = ({ color, state, ...props }: Props) => (
    <NavLink {...props}>
        <div
            className={classNames(styles.activityCircle, {
                [styles.pending]: state === PENDING,
                [styles.complete]: state === COMPLETE,
            })}
        />
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className={styles.bell}>
            <path
                fill={color}
                d="M5.555 16c.693 1.19 1.969 2 3.445 2 1.476 0 2.752-.81 3.445-2h-6.89zM18
                15H0v-2.721l.684-.227A3.3854 3.3854 0 0 0 3 8.838V6c0-3.309 2.691-6 6-6s6
                2.691 6 6v2.838c0 1.46.931 2.751 2.316 3.214l.684.227V15zM3.035
                13h11.931A5.3762 5.3762 0 0 1 13 8.838V6c0-2.206-1.794-4-4-4S5 3.794 5
                6v2.838c0 1.648-.745 3.16-1.965 4.162z"
            />
        </svg>
    </NavLink>
)

NotificationBell.defaultProps = {
    color: '#323232',
}

export default NotificationBell
