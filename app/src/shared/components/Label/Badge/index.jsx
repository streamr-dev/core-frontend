// @flow

import React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import styles from './badge.pcss'

import SvgIcon from '$shared/components/SvgIcon'

type Props = {
    badge?: string,
    tag?: string,
    value?: number | string,
    className?: string,
}

const badgeIcons = {
    members: 'community',
}

export const Badge = ({ badge, tag, value, className }: Props) => (
    <div
        className={cx(styles.Badge, className)}
    >
        {!!badge && badgeIcons[badge] && (
            <SvgIcon name={badgeIcons[badge]} className={styles.badgeIcon} />
        )}
        {!!tag && (
            <Translate
                value={`general.labels.${tag}`}
                className={styles.badgeValue}
            />
        )}
        {value !== undefined && (
            <span className={styles.badgeValue}>
                {value}
            </span>
        )}
    </div>
)

export default Badge
