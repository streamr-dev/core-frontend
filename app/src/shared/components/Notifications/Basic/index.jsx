// @flow

import React from 'react'
import Spinner from '$shared/components/Spinner'
import CheckmarkIcon from '$mp/components/CheckmarkIcon'
import NotificationIcon from '$shared/utils/NotificationIcon'

import styles from './basic.pcss'

type Props = {
    title: string,
    icon?: ?$Values<typeof NotificationIcon>,
}

const Basic = ({ title, icon }: Props) => (
    <div className={styles.container}>
        {icon && icon === NotificationIcon.CHECKMARK &&
            <CheckmarkIcon size="small" className={styles.icon} />
        }
        {icon && icon === NotificationIcon.SPINNER &&
            <Spinner size="small" className={styles.icon} />
        }
        {icon && icon === NotificationIcon.ERROR &&
            <span className={styles.error} />
        }
        <span className={styles.title}>{title}</span>
    </div>
)

export default Basic
