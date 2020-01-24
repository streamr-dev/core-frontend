// @flow

import React, { useContext, Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'

import useValidation from '../ProductController/useValidation'
import Text from '$ui/Text'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import ActionsDropdown from '$shared/components/ActionsDropdown'
import DropdownActions from '$shared/components/DropdownActions'
import useCopy from '$shared/hooks/useCopy'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { selectEthereumIdentities } from '$shared/modules/integrationKey/selectors'
import { fetchIntegrationKeys } from '$shared/modules/integrationKey/actions'
import { truncate } from '$shared/utils/text'
import useAccountAddress from '$shared/hooks/useAccountAddress'

import styles from './beneficiaryAddress.pcss'

type Props = {
    address?: string,
    onChange: (string) => void,
    disabled: boolean,
    className?: string,
    onFocus?: ?(SyntheticFocusEvent<EventTarget>) => void,
    onBlur?: ?(SyntheticFocusEvent<EventTarget>) => void,
}

const EMPTY = []

type AddressItemProps = {
    address?: ?string,
    className?: ?string,
    name: string,
}

const UnstyledAddressItem = ({ className, name, address }: AddressItemProps) => (
    <Fragment>
        {`Fill ${name}`}
        {!!address && (
            <div className={className}>
                {truncate(address, {
                    maxLength: 15,
                })}
            </div>
        )}
    </Fragment>
)

const AddressItem = styled(UnstyledAddressItem)`
    color: #adadad;
    font-size: 10px;
    margin-top: -16px;
`

const BeneficiaryAddress = ({
    address: addressProp,
    onChange,
    disabled,
    className,
    onFocus: onFocusProp,
    onBlur: onBlurProp,
}: Props) => {
    const { isValid, message } = useValidation('beneficiaryAddress')
    const { isTouched } = useContext(ValidationContext)
    const priceTouched = isTouched('pricePerSecond') || isTouched('beneficiaryAddress')
    const invalid = priceTouched && !isValid

    const { copy } = useCopy()

    const dispatch = useDispatch()

    const integrationKeys = useSelector(selectEthereumIdentities) || EMPTY

    const integrationKeysFiltered = useMemo(() => (
        integrationKeys.filter(({ json }) => json && json.address)
    ), [integrationKeys])

    const onCopy = useCallback(() => {
        if (!addressProp) {
            return
        }

        copy(addressProp)

        Notification.push({
            title: 'Copied',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy, addressProp])

    useEffect(() => {
        dispatch(fetchIntegrationKeys())
    }, [dispatch])

    const accountAddress = useAccountAddress()

    const useCurrentWalletAddress = useCallback(() => {
        if (accountAddress) {
            onChange(accountAddress)
        }
    }, [accountAddress, onChange])

    const [focused, setFocused] = useState(false)

    const address: string = useMemo(() => (
        focused ? (addressProp || '') : truncate(addressProp || '', {
            maxLength: 30,
        })
    ), [focused, addressProp])

    const onFocus = useCallback((e: SyntheticFocusEvent<EventTarget>) => {
        setFocused(true)

        if (onFocusProp) {
            onFocusProp(e)
        }
    }, [onFocusProp])

    const onBlur = useCallback((e: SyntheticFocusEvent<EventTarget>) => {
        setFocused(false)

        if (onBlurProp) {
            onBlurProp(e)
        }
    }, [onBlurProp])

    return (
        <form autoComplete="off" onSubmit={(e) => e.preventDefault()}>
            <label
                htmlFor="beneficiaryAddress"
                className={cx(styles.root, styles.BeneficiaryAddress, className)}
            >
                <strong>
                    <Translate value="editProductPage.setPrice.setRecipientEthAddress" />
                </strong>
                <ActionsDropdown
                    actions={[
                        <DropdownActions.Item
                            key="useCurrent"
                            onClick={useCurrentWalletAddress}
                            disabled={!accountAddress}
                        >
                            <AddressItem name="wallet address" address={accountAddress} />
                        </DropdownActions.Item>,
                        ...integrationKeysFiltered.map(({ id, name, json }) => (
                            <DropdownActions.Item
                                key={id}
                                onClick={() => onChange(json.address)}
                            >
                                <AddressItem name={name} address={json.address} />
                            </DropdownActions.Item>
                        )),
                        <DropdownActions.Item
                            key="copy"
                            disabled={!addressProp}
                            onClick={onCopy}
                        >
                            <Translate value="userpages.keyField.copy" />
                        </DropdownActions.Item>,
                    ]}
                >
                    <Text
                        id="beneficiaryAddress"
                        autoComplete="off"
                        defaultValue={address}
                        onCommit={onChange}
                        placeholder={I18n.t('editProductPage.setPrice.placeholder.enterEthAddress')}
                        invalid={invalid}
                        disabled={disabled}
                        selectAllOnFocus
                        smartCommit
                        onBlur={onBlur}
                        onFocus={onFocus}
                    />
                </ActionsDropdown>
                {invalid && (
                    <Fragment>
                        <div />
                        <Errors theme={MarketplaceTheme}>
                            {message}
                        </Errors>
                    </Fragment>
                )}
            </label>
        </form>
    )
}

export default BeneficiaryAddress
