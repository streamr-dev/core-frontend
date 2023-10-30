import { FunctionComponent, ReactNode } from 'react'
import React, { Fragment } from 'react'
import cx from 'classnames'
import styles from './balance.pcss'

type AccountProps = {
    name: string
    value: string
}

export const Account: FunctionComponent<AccountProps> = ({
    name,
    value,
}: AccountProps) => (
    <Fragment>
        <span className={styles.balanceLabel}>{name}</span>
        <span className={styles.balanceValue}>{value}</span>
    </Fragment>
)

type BalanceProps = {
    children?: ReactNode
    className?: string
}

const Balance: FunctionComponent<BalanceProps> = ({
    children,
    className,
}: BalanceProps) => <div className={cx(styles.balances, className)}>{children}</div>

export default Balance
