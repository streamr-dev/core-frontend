// @flow

import React, { useCallback } from 'react'
import cx from 'classnames'

import styles from './BeneficiaryAddress.pcss'

type Props = {
    address?: string,
    onChange: (string) => void,
    disabled: boolean,
    className?: string,
}

const BeneficiaryAddress = ({ address, onChange, disabled, className }: Props) => {
    const onAddressChange = useCallback((e: SyntheticInputEvent<EventTarget>) => {
        onChange(e.target.value)
    }, [onChange])

    return (
        <form autoComplete="off">
            <label className={cx(styles.root, className)}>
                <strong>Set recipient ETH address</strong>
                <div>
                    <input
                        autoComplete="off"
                        className={styles.input}
                        placeholder="Enter ETH address"
                        value={address}
                        onChange={onAddressChange}
                        disabled={disabled}
                    />
                </div>
            </label>
        </form>
    )
}

export default BeneficiaryAddress
