// @flow

import * as React from 'react'
import SvgIcon from '$shared/components/SvgIcon'

import styles from './warning.pcss'

type Props = {
    children: React.Node,
}

const Warning = ({ children }: Props) => (
    <div className={styles.root}>
        <SvgIcon name="warning" className={styles.warningIcon} />
        <div className={styles.content}>
            {children}
        </div>
    </div>
)

export default Warning
