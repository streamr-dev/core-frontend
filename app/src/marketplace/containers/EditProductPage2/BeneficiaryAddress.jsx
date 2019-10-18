// @flow

import React, { useContext } from 'react'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'

import useValidation from '../ProductController/useValidation'
import TextField from '$mp/components/TextField'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'

import styles from './beneficiaryAddress.pcss'

type Props = {
    address?: string,
    onChange: (string) => void,
    disabled: boolean,
    className?: string,
}

const BeneficiaryAddress = ({ address, onChange, disabled, className }: Props) => {
    const { isValid, message } = useValidation('beneficiaryAddress')
    const { isTouched } = useContext(ValidationContext)

    return (
        <form autoComplete="off">
            <label
                htmlFor="beneficiaryAddress"
                className={cx(styles.root, styles.BeneficiaryAddress, className)}
            >
                <strong>
                    <Translate value="editProductPage.setPrice.setRecipientEthAddress" />
                </strong>
                <div>
                    <TextField
                        id="beneficiaryAddress"
                        autoComplete="off"
                        value={address || ''}
                        onCommit={onChange}
                        placeholder={I18n.t('editProductPage.setPrice.placeholder.enterEthAddress')}
                        error={isTouched('beneficiaryAddress') && !isValid ? message : undefined}
                        disabled={disabled}
                    />
                </div>
            </label>
        </form>
    )
}

export default BeneficiaryAddress
