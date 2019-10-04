// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import Label from '$shared/components/Label'

import styles from './tile.pcss'

type Props = {
    children?: Node,
    className?: string,
}

export const Title = ({ children, className }: Props) => (
    <div className={cx(styles.title, className)}>{children}</div>
)

export const Description = ({ children, className }: Props) => (
    <div className={cx(styles.description, className)}>{children}</div>
)

export const Status = ({ children, className }: Props) => (
    <div className={cx(styles.status, className)}>{children}</div>
)

export const Tag = ({ children, className }: Props) => (
    <div className={cx(styles.tag, className)}>{children}</div>
)

export type BadgesType = {
    [string]: number | string,
}

type BadgesProps = Props & {
    badges: BadgesType,
}

export const Badges = ({ badges, ...props }: BadgesProps) => {
    const shownBadges = Object.keys(badges)

    if (!shownBadges.length) { return null }

    return (
        <Label {...props}>
            <Label bottomRight>
                {shownBadges.map((badge) => (
                    <Label.Badge key={badge} badge={badge} value={badges[badge]} />
                ))}
            </Label>
        </Label>
    )
}

export type LabelsType = {
    [string]: boolean,
}

type LabelsProps = Props & {
    labels: LabelsType,
}

export const Labels = ({ labels, ...props }: LabelsProps) => {
    const shownLabels = Object.keys(labels).filter((key) => !!labels[key])

    if (!shownLabels.length) { return null }

    return (
        <Label {...props}>
            {shownLabels.map((label) => (
                <Label.Badge key={label} tag={label} />
            ))}
        </Label>
    )
}
