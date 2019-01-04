// @flow

import React from 'react'
import cx from 'classnames'

import FallbackImage from '$shared/components/FallbackImage'

import styles from './avatarCircle.pcss'

type CircleProps = {
    name: string,
    className?: string,
}

type AvatarProps = CircleProps & {
    imageUrl?: ?string,
    className?: string,
}

const AccountCircle = ({ name, className }: CircleProps) => (
    <div className={cx(styles.accountCircle, className)}>
        <span className={styles.inner}>
            {name && name[0]}
        </span>
    </div>
)

const AvatarCircle = ({ name, imageUrl, className }: AvatarProps) => (
    <div>
        <FallbackImage
            className={cx(styles.accountCircle, className)}
            src={imageUrl || ''}
            alt={name || ''}
            placeholder={<AccountCircle name={name} className={className} />}
        />
    </div>
)

export default AvatarCircle
