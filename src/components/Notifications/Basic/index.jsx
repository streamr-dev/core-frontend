// @flow

import React from 'react'
import Spinner from '../../Spinner'
import CheckmarkIcon from '../../CheckmarkIcon'
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
            <CheckmarkIcon size="small" />
        }
        {icon && icon === notificationIcons.SPINNER &&
            <Spinner size="small" />
        }
        <span className={styles.title}>{title}</span>
    </div>
)

export default Basic
