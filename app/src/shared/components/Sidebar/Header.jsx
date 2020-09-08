// @flow

import React, { type Node } from 'react'
import cx from 'classnames'
import AppInfo from '$shared/components/AppInfo'

import SvgIcon from '$shared/components/SvgIcon'

import styles from './Sidebar.pcss'

export type Props = {
    onClose: () => void,
    title: string,
    className?: string,
    children?: Node,
}

const Header = ({ title, onClose, className, children = <AppInfo /> }: Props) => (
    <div className={cx(styles.header, className)}>
        <div className={styles.titleRow}>
            <h3 className={cx(styles.name)}>{title}</h3>
            <button
                type="button"
                onClick={() => onClose()}
                className={styles.iconButton}
            >
                <SvgIcon name="crossHeavy" className={styles.icon} />
            </button>
        </div>
        <div className={styles.subtitle}>
            {children}
        </div>
    </div>
)

export default Header
