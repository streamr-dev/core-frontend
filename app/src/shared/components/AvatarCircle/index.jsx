// @flow

import React from 'react'
import cx from 'classnames'

import FallbackImage from '$shared/components/FallbackImage'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './avatarCircle.pcss'

type CircleProps = {
    name: string,
    className?: string,
    textDisplay?: boolean,
    uploadAvatarPlaceholder?: boolean,
}

type AvatarProps = CircleProps & {
    name: string,
    imageUrl?: ?string,
    className?: string,
}

export const getInitialsFromName = (name: string) => {
    if (name.split(' ')[0] && name.split(' ')[1]) {
        return name.split(' ')[0][0] + name.split(' ')[1][0]
    } else if (name.split(' ')[0]) {
        return name.split(' ')[0][0]
    }

    return ''
}

const AccountCircle = ({ className, textDisplay, name, uploadAvatarPlaceholder }: CircleProps) => (
    <div className={cx(styles.accountCircle, className, {
        [styles.textDisplay]: textDisplay,
        [styles.uploadAvatarPlaceholder]: uploadAvatarPlaceholder,
    })}
    >
        {!textDisplay && (
            <div className={styles.profileEmptyIcon} >
                {uploadAvatarPlaceholder ?
                    <SvgIcon name="emptyAvatarUpload" />
                    : <SvgIcon name="emptyAvatar" />
                }
            </div>
        )}
        {textDisplay && (
            <span className={styles.inner}>
                {getInitialsFromName(name)}
            </span>
        )}
    </div>
)

const AvatarCircle = ({
    name,
    imageUrl,
    textDisplay,
    className,
    uploadAvatarPlaceholder,
}: AvatarProps) => (
    <div>
        <FallbackImage
            className={cx(styles.accountCircle, className)}
            src={imageUrl || ''}
            alt={name || ''}
            placeholder={
                <AccountCircle
                    name={name}
                    textDisplay={textDisplay}
                    uploadAvatarPlaceholder={uploadAvatarPlaceholder}
                    className={className}
                />}
        />
    </div>
)

export default AvatarCircle
