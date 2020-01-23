// @flow

import React, { useContext, Fragment, useCallback, useEffect, useMemo } from 'react'
import cx from 'classnames'
import { Translate, I18n } from 'react-redux-i18n'
import { useSelector, useDispatch } from 'react-redux'

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
}

const EMPTY = []

const BeneficiaryAddress = ({ address, onChange, disabled, className }: Props) => {
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

    const onCopy = useCallback((value: string) => {
        copy(value)

        Notification.push({
            title: 'Copied',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy])

    useEffect(() => {
        dispatch(fetchIntegrationKeys())
    }, [dispatch])

    const accountAddress = useAccountAddress()

    const useCurrentWalletAddress = useCallback(() => {
        if (accountAddress) {
            onChange(accountAddress)
        }
    }, [accountAddress, onChange])

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
                            Use current wallet address
                        </DropdownActions.Item>,
                        ...integrationKeysFiltered.map(({ id, name, json }) => (
                            <DropdownActions.Item
                                key={id}
                                onClick={() => onChange(json.address)}
                            >
                                {`Use ${truncate(json.address, {
                                    maxLength: 15,
                                })} (${name})`}
                            </DropdownActions.Item>
                        )),
                        (integrationKeysFiltered.length > 0 && (
                            <DropdownActions.Item key="divider" divider />
                        )),
                        <DropdownActions.Item
                            key="copy"
                            disabled={!address}
                            onClick={() => onCopy(address || '')}
                        >
                            <Translate value="userpages.keyField.copy" />
                        </DropdownActions.Item>,
                    ]}
                >
                    <Text
                        id="beneficiaryAddress"
                        autoComplete="off"
                        defaultValue={address || ''}
                        onCommit={onChange}
                        placeholder={I18n.t('editProductPage.setPrice.placeholder.enterEthAddress')}
                        invalid={invalid}
                        disabled={disabled}
                        selectAllOnFocus
                        smartCommit
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
