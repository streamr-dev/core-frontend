// @flow

import React, { useCallback } from 'react'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'

import styles from './beneficiaryAddress.pcss'

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
                <strong>
                    <Translate value="editProductPage.setPrice.setRecipientEthAddress" />
                </strong>
                <div>
                    <input
                        autoComplete="off"
                        className={styles.input}
                        placeholder={I18n.t('editProductPage.setPrice.placeholder.enterEthAddress')}
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
