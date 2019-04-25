// @flow

import React from 'react'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'

import styles from './sidebar.pcss'

export type Props = {
    onClose: () => void,
    title: string,
}

const Header = ({ title, onClose }: Props) => {
    const { version } = global.streamr.info()
    return (
        <div className={cx(styles.header)}>
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
            <div className={styles.appInfo}>
                Streamr App {version}
            </div>
        </div>
    )
}

export default Header
