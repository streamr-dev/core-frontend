import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { COLORS, MAX_CONTENT_WIDTH } from '~/shared/utils/styled'
import PrestyledWithInputActions from '~/components/WithInputActions'
import PopoverItem from '~/shared/components/Popover/PopoverItem'
import Text from '~/shared/components/Ui/Text'
import useCopy from '~/shared/hooks/useCopy'
import { truncate } from '~/shared/utils/text'
import { isEthereumAddress } from '~/marketplace/utils/validate'
import useValidation from '~/marketplace/containers/ProductController/useValidation'
import { SeverityLevel } from '~/marketplace/containers/ProductController/ValidationContextProvider'
import { useWalletAccount } from '~/shared/stores/wallet'

export default function BeneficiaryAddressEditor({
    disabled = false,
    value: valueProp = '',
    onChange: onChangeProp,
    chainName,
}: {
    disabled?: boolean
    value?: string
    onChange?: (value: string) => void
    chainName: string
}) {
    const [value, setValue] = useState(valueProp)

    useEffect(() => {
        setValue(valueProp)
    }, [valueProp])

    const valueRef = useRef(value)

    useEffect(() => {
        valueRef.current = value
    }, [value])

    const accountAddress = useWalletAccount()

    const { copy } = useCopy()

    const { setStatus, clearStatus, isValid } = useValidation(
        `salePoints.${chainName}.beneficiaryAddress`,
    )

    useEffect(() => {
        if (accountAddress && !valueRef.current) {
            /**
             * Empty value is valid as long as the wallet is unlocked.
             */
            clearStatus()
        }
    }, [accountAddress, clearStatus])

    function onChange(newValue: string) {
        setValue(newValue)

        const isValidAddress = isEthereumAddress(newValue)

        if (isValidAddress) {
            onChangeProp?.(newValue)
        }

        if (isValidAddress || (accountAddress && !newValue)) {
            return void clearStatus()
        }

        setStatus(SeverityLevel.ERROR, 'Provided wallet address is invalid')
    }

    return (
        <Container>
            <WithInputActions
                disabled={disabled}
                actions={[
                    <PopoverItem
                        key="useCurrent"
                        onClick={() => {
                            if (!accountAddress) {
                                return
                            }

                            onChange(accountAddress)
                        }}
                        disabled={!accountAddress}
                    >
                        <AddressItem>
                            <div>Fill wallet address</div>
                            <div>
                                {accountAddress
                                    ? truncate(accountAddress)
                                    : 'Wallet locked'}
                            </div>
                        </AddressItem>
                    </PopoverItem>,
                    <PopoverItem
                        key="copy"
                        disabled={!value}
                        onClick={() => {
                            copy(value, {
                                toastMessage: 'Copied',
                            })
                        }}
                    >
                        Copy
                    </PopoverItem>,
                ]}
            >
                <Text
                    value={value}
                    onCommit={setValue}
                    onBlur={() => {
                        onChange(value)
                    }}
                    placeholder={
                        accountAddress
                            ? accountAddress
                            : 'i.e. 0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1'
                    }
                    disabled={disabled}
                    invalid={!isValid}
                    selectAllOnFocus
                />
            </WithInputActions>
        </Container>
    )
}

const WithInputActions = styled(PrestyledWithInputActions)`
    margin: 0;

    input:disabled {
        background-color: white;
        opacity: 1;
    }
`

const Container = styled.div`
    background-color: ${COLORS.inputBackground};
    padding: 12px 24px;
    max-width: ${MAX_CONTENT_WIDTH};
`

const AddressItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    div + div {
        color: #adadad;
        font-size: 10px;
        margin-top: -14px;
    }
`
