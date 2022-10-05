import React, { useContext, Fragment, useCallback, useEffect, useState } from 'react'
import cx from 'classnames'
import styled from 'styled-components'
import Text from '$ui/Text'
import Errors, { MarketplaceTheme } from '$ui/Errors'
import WithInputActions from '$shared/components/WithInputActions'
import Popover from '$shared/components/Popover'
import useCopy from '$shared/hooks/useCopy'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { truncate } from '$shared/utils/text'
import useAccountAddress from '$shared/hooks/useAccountAddress'
import useValidation from '../ProductController/useValidation'
import { Context as EditControllerContext } from './EditControllerProvider'
import styles from './beneficiaryAddress.pcss'
type Props = {
    address?: string
    onChange: (arg0: string) => void
    disabled: boolean
    className?: string
}
type AddressItemProps = {
    address?: string | null | undefined
    className?: string | null | undefined
    name: string
}

const UnstyledAddressItem = ({ className, name, address }: AddressItemProps) => (
    <div className={className}>
        <div>{`Fill ${name}`}</div>
        {!!address && <div className="address">{truncate(address)}</div>}
    </div>
)

const AddressItem = styled(UnstyledAddressItem)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    & > .address {
        color: #adadad;
        font-size: 10px;
        margin-top: -14px;
    }
`

const BeneficiaryAddress = ({ address: addressProp, onChange, disabled, className }: Props) => {
    const { isValid, message } = useValidation('beneficiaryAddress')
    const { publishAttempted } = useContext(EditControllerContext)
    const [ownAddress, setOwnAddress] = useState(addressProp || '')
    const accountAddress = useAccountAddress()
    const invalid = publishAttempted && !isValid
    const { copy } = useCopy()
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
    const useCurrentWalletAddress = useCallback(() => {
        if (accountAddress) {
            onChange(accountAddress)
        }
    }, [accountAddress, onChange])
    useEffect(() => {
        setOwnAddress(addressProp)

        // If no address was provided, prefill with accountAddress
        if ((addressProp == null || addressProp.length === 0) && accountAddress) {
            onChange(accountAddress)
        }
    }, [addressProp, onChange, accountAddress])
    const onOwnAddressChange = useCallback((e: React.SyntheticEvent<EventTarget>) => {
        setOwnAddress(e.target.value)
    }, [])
    return (
        <form autoComplete="off" onSubmit={e => e.preventDefault()}>
            <label htmlFor="beneficiaryAddress" className={cx(styles.root, className)}>
                <WithInputActions
                    disabled={disabled}
                    actions={[
                        <Popover.Item key="useCurrent" onClick={useCurrentWalletAddress} disabled={!accountAddress}>
                            <AddressItem name="wallet address" address={accountAddress || 'Wallet locked'} />
                        </Popover.Item>,
                        <Popover.Item key="copy" disabled={!addressProp} onClick={onCopy}>
                            Copy
                        </Popover.Item>,
                    ]}
                >
                    <Text
                        key={addressProp}
                        id="beneficiaryAddress"
                        autoComplete="off"
                        value={ownAddress}
                        onCommit={onChange}
                        onChange={onOwnAddressChange}
                        placeholder="Beneficiary address"
                        invalid={invalid}
                        disabled={disabled}
                        selectAllOnFocus
                        smartCommit
                    />
                </WithInputActions>
                {invalid && (
                    <Fragment>
                        <div />
                        <Errors theme={MarketplaceTheme}>{message}</Errors>
                    </Fragment>
                )}
            </label>
        </form>
    )
}

export default BeneficiaryAddress
