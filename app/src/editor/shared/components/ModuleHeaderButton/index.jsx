// @flow

import React from 'react'
import cx from 'classnames'
import styles from './moduleHeaderButton.pcss'

import SvgIcon, { type IconName } from '$shared/components/SvgIcon'

type Props = {
    icon: IconName,
    className?: string,
}

const ModuleHeaderButton = ({ icon, className, ...props }: Props) => (
    <button
        className={cx(styles.root, className)}
        type="button"
        {...props}
    >
        <SvgIcon name={icon} />
    </button>
)

export default ModuleHeaderButton
