// @flow

import React, { type Node } from 'react'

import type { Address } from '$shared/flowtype/web3-types'
import HoverCopy from '$shared/components/HoverCopy'
import { isEthereumAddress } from '$mp/utils/validate'
import { truncate } from '$shared/utils/text'

import styles from './nameAndUsername.pcss'

export type NameAndUsernameProps = {
    name: string,
    username: string | Address,
    children?: Node,
}

const NameAndUsername = ({ name, username, children }: NameAndUsernameProps) => {
    const isEthAddress = isEthereumAddress(username)

    return (
        <div className={styles.content}>
            <div className={styles.name}>{name}</div>
            <div className={styles.usernameWrapper}>
                <span title={username} className={styles.username}>
                    {!isEthAddress && (username)}
                    <HoverCopy value={username}>
                        {!!isEthAddress && (truncate(username, {
                            maxLength: 20,
                        }))}
                    </HoverCopy>
                </span>
            </div>
            {children}
        </div>
    )
}

export default NameAndUsername
