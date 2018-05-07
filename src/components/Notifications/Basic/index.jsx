// @flow

import React from 'react'
import type { NotificationIcon } from '../../../flowtype/common-types'
import { notificationIcons } from '../../../utils/constants'

import styles from './basic.pcss'

type Props = {
    title: string,
    icon?: ?NotificationIcon,
}

const Basic = ({ title, icon }: Props) => (
    <div className={styles.container}>
        {icon && icon === notificationIcons.CHECKMARK &&
            <span className={styles.checkmark} />
        }
        {icon && icon === notificationIcons.SPINNER &&
            <span className={styles.spinner}>Loading...</span>
        }
        <span className={styles.title}>{title}</span>
    </div>
)

export default Basic
