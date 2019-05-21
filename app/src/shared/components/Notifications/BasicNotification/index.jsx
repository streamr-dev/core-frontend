// @flow

import React from 'react'
import cx from 'classnames'
import Spinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'
import { NotificationIcon } from '$shared/utils/constants'

import styles from './basic.pcss'

type Props = {
    title: string,
    icon?: ?$Values<typeof NotificationIcon>,
}

const BasicNotification = ({ title, icon }: Props) => (
    <div className={styles.container}>
        {icon && icon === NotificationIcon.CHECKMARK &&
            <SvgIcon name="checkmark" size="small" className={styles.icon} />
        }
        {icon && icon === NotificationIcon.SPINNER &&
            <Spinner size="small" className={styles.icon} />
        }
        {icon && icon === NotificationIcon.ERROR &&
            <SvgIcon name="error" className={cx(styles.icon, styles.iconSize)} />
        }
        {icon && icon === NotificationIcon.WARNING && (
            <SvgIcon name="warning" size="small" className={cx(styles.icon, styles.iconSize)} />
        )}
        {icon && icon === NotificationIcon.INFO &&
            /* warning icon for now */
            <SvgIcon name="warning" size="small" className={cx(styles.icon, styles.iconSize)} />
        }
        <span className={styles.title}>{title}</span>
    </div>
)

export default BasicNotification
