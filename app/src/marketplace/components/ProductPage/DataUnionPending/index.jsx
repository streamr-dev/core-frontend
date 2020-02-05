// @flow

import React from 'react'
import cx from 'classnames'
import { Translate } from 'react-redux-i18n'

import DeploySpinner from '$shared/components/DeploySpinner'

import styles from './dataUnionPending.pcss'

type Props = {
    className?: string,
}

const DataUnionPending = ({ className }: Props) => (
    <div className={cx(styles.deployingGrid, className)}>
        <div>
            <DeploySpinner isRunning showCounter={false} />
        </div>
        <div>
            <div className={styles.deployMessageHeading}>
                <Translate value="productPage.dataUnionPending.title" />
            </div>
        </div>
    </div>
)

export default DataUnionPending
