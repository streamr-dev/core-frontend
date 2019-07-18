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
    const { version, branch } = global.streamr.info()
    const isMaster = branch === 'master'
    // version e.g. v2.0.5-926-g7e20dd2eb
    const [versionNumber, , hash] = version.split('-')

    // hash minus leading 'g', not shown on master
    const displayHash = isMaster ? '' : hash.slice(1)

    // don't show branch if master
    let displayBranch = branch === 'master' ? '' : branch

    // replace hyphen in branch name with non-breaking hyphen
    displayBranch = branch.replace(/-/g, '‑')

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
                Streamr Core {[versionNumber, displayBranch, displayHash].filter(Boolean).join(' ')}
            </div>
        </div>
    )
}

export default Header
