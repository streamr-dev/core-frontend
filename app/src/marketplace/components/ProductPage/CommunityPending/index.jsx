// @flow

import React from 'react'
import cx from 'classnames'

import DeploySpinner from '$shared/components/DeploySpinner'

import styles from './communityPending.pcss'

type Props = {
    className?: string,
}

const CommunityPending = ({ className }: Props) => (
    <div className={cx(styles.deployingGrid, className)}>
        <div>
            <DeploySpinner isRunning showCounter={false} />
        </div>
        <div>
            <div className={styles.deployMessageHeading}>Deploying your Community Product</div>
        </div>
    </div>
)

export default CommunityPending
