// @flow

import React, { type Node, Fragment } from 'react'
import cx from 'classnames'

import type { NumberString } from '$shared/flowtype/common-types'

import styles from './balance.pcss'

type AccountProps = {
    name: string,
    value: NumberString,
}

const Account = ({ name, value }: AccountProps) => (
    <Fragment>
        <span className={styles.balanceLabel}>{name}</span>
        <span className={styles.balanceValue}>{value}</span>
    </Fragment>
)

type BalanceProps = {
    children?: Node,
    className?: string,
}

const Balance = ({ children, className }: BalanceProps) => (
    <div className={cx(styles.balances, className)}>
        {children}
    </div>
)

Balance.Account = Account

export default Balance
