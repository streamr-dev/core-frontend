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

export const Badges = ({ badges, ...props }: BadgesProps) => (
    <Label {...props}>
        {Object.keys(badges).length > 0 && (
            <Label bottomRight>
                {Object.keys(badges).map((badge) => (
                    <Label.Badge key={badge} badge={badge} value={badges[badge]} />
                ))}
            </Label>
        )}
    </Label>
)

export type LabelsType = Array<string>

type LabelsProps = Props & {
    labels: LabelsType,
}

export const Labels = ({ labels, ...props }: LabelsProps) => (
    <Label {...props}>
        {labels.map((label) => (
            <Label.Badge key={label} tag={label} />
        ))}
    </Label>
)
