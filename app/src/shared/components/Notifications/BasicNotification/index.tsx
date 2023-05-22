import React, { FunctionComponent } from 'react'
import { $Values } from 'utility-types'
import cx from 'classnames'
import Spinner from '$shared/components/Spinner'
import SvgIcon from '$shared/components/SvgIcon'
import { NotificationIcon } from '$shared/utils/constants'
import styles from './basic.pcss'

type Props = {
    title: string
    description?: string
    icon?: $Values<typeof NotificationIcon> | null | undefined
}

const BasicNotification: FunctionComponent<Props> = ({ title, icon, description }: Props) => (
    <div className={styles.container}>
        {icon && icon === NotificationIcon.CHECKMARK && (
            <SvgIcon name="checkmark" className={styles.icon} />
        )}
        {icon && icon === NotificationIcon.SPINNER && <Spinner size="small" className={styles.icon} />}
        {icon && icon === NotificationIcon.ERROR && (
            <SvgIcon name="error" className={cx(styles.icon, styles.iconSize)} />
        )}
        {icon && icon === NotificationIcon.WARNING && (
            <SvgIcon name="warning" className={cx(styles.icon, styles.iconSize)} />
        )}
        {icon && icon === NotificationIcon.INFO && (
            /* warning icon for now */
            <SvgIcon name="warning" className={cx(styles.icon, styles.iconSize)} />
        )}
        <div className={styles.textBlock}>
            <span className={styles.title}>{title}</span>
            {description && <span className={styles.description}>{description}</span>}
        </div>
    </div>
)

export default BasicNotification
