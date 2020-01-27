// @flow

import React, { useContext, Fragment } from 'react'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'

import useValidation from '../ProductController/useValidation'
import Text from '$ui/Text'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import FormControlErrors, { MarketplaceTheme } from '$shared/components/FormControlErrors'

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
    const priceTouched = isTouched('pricePerSecond') || isTouched('beneficiaryAddress')
    const invalid = priceTouched && !isValid

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
                    <Text
                        id="beneficiaryAddress"
                        autoComplete="off"
                        value={address || ''}
                        onCommit={onChange}
                        placeholder={I18n.t('editProductPage.setPrice.placeholder.enterEthAddress')}
                        invalid={invalid}
                        disabled={disabled}
                        selectAllOnFocus
                        smartCommit
                    />
                </div>
                {invalid && (
                    <Fragment>
                        <div />
                        <FormControlErrors theme={MarketplaceTheme}>
                            {message}
                        </FormControlErrors>
                    </Fragment>
                )}
            </label>
        </form>
    )
}

export default BeneficiaryAddress
