// @flow

import React from 'react'
import cx from 'classnames'

import FallbackImage from '$shared/components/FallbackImage'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './avatarCircle.pcss'

/* eslint-disable react/no-unused-prop-types */

type CircleProps = {
    name: string,
    className?: string,
    navBar?: boolean,
    settingsPage?: boolean,
}

type AvatarProps = CircleProps & {
    name: string,
    imageUrl?: ?string,
    className?: string,
}

const AccountCircle = ({ className, navBar, name, settingsPage }: CircleProps) => (
    <div className={cx(styles.accountCircle, className, {
        [styles.navBar]: navBar,
        [styles.settingsPage]: settingsPage,
    })}
    >
        {!navBar && (
            <div className={styles.profileEmptyIcon} >
                {/* TODO: switch settings svg for userpages svg */}
                <SvgIcon
                    name="profileMan"
                />
            </div>
        )}
        {navBar && (
            <span className={styles.inner}>
                {/* TODO: Get firstname and lastname initials */}
                {name && name[0]}{name && name[1]}
            </span>
        )}
    </div>
)

const AvatarCircle = ({
    name,
    imageUrl,
    navBar,
    className,
    settingsPage,
}: AvatarProps) => (
    <div>
        <FallbackImage
            className={cx(styles.accountCircle, className)}
            src={imageUrl || ''}
            alt={name || ''}
            placeholder={<AccountCircle name={name} navBar={navBar} settingsPage={settingsPage} className={className} />}
        />
    </div>
)

export default AvatarCircle
