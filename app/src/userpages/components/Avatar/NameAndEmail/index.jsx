// @flow

import React, { Fragment } from 'react'

import type { Address } from '$shared/flowtype/web3-types'
import { isEthereumAddress } from '$mp/utils/validate'
import { useBalance, BalanceType } from '$shared/hooks/useBalance'
import { truncate } from '$shared/utils/text'
import Balance from '$userpages/components/Balance'

import styles from './nameAndEmail.pcss'

export type NameAndEmailProps = {
    name: string,
    username: string | Address,
    showBalance?: boolean,
}

const NameAndUsername = ({ name, username, showBalance }: NameAndEmailProps) => {
    const isEthAddress = isEthereumAddress(username)

    /* eslint-disable object-curly-newline */
    const {
        balance: dataBalance,
        fetching: fetchingDataBalance,
        error: dataBalanceError,
    } = useBalance(username, BalanceType.DATA)
    const {
        balance: ethBalance,
        fetching: fetchingEthBalance,
        error: ethBalanceError,
    } = useBalance(username, BalanceType.ETH)
    /* eslint-enable object-curly-newline */

    return (
        <div className={styles.content}>
            <div className={styles.name}>{name}</div>
            <div className={styles.username}>
                {!isEthAddress && (username)}
                {!!isEthAddress && (
                    <Fragment>
                        <span className={styles.usernameDesktop}>{username}</span>
                        <span className={styles.usernameMobile} title={username}>{truncate(username, {
                            maxLength: 20,
                        })}
                        </span>
                    </Fragment>
                )}
            </div>
            {!!showBalance && isEthAddress && (
                <Balance className={styles.balance}>
                    <Balance.Account
                        name="DATA"
                        value={(!fetchingDataBalance && !dataBalanceError && dataBalance) ? dataBalance : '-'}
                    />
                    <Balance.Account
                        name="ETH"
                        value={(!fetchingEthBalance && !ethBalanceError && ethBalance) ? ethBalance : '-'}
                    />
                </Balance>
            )}
        </div>
    )
}

export default NameAndUsername
