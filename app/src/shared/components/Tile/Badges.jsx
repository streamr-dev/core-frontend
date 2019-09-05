// @flow

import React from 'react'

import styles from './tile.pcss'

import SvgIcon from '$shared/components/SvgIcon'

export type BadgesType = {
    [string]: number | string,
}

type Props = {
    badges: BadgesType,
}

const badgeIcons = {
    members: 'community',
}

export const Badges = ({ badges }: Props) => (
    <div className={styles.badges}>
        {Object.keys(badges).map((badge) => (
            <div
                key={badge}
                className={styles.badge}
            >
                {badgeIcons[badge] && (
                    <SvgIcon name={badgeIcons[badge]} className={styles.badgeIcon} />
                )}
                <span className={styles.badgeValue}>
                    {badges[badge]}
                </span>
            </div>
        ))}
    </div>
)

export default Badges
