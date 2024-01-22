import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { COLORS, MAX_CONTENT_WIDTH } from '~/shared/utils/styled'
import Text from '~/shared/components/Ui/Text'
import useCopy from '~/shared/hooks/useCopy'
import { truncate } from '~/shared/utils/text'
import { useWalletAccount } from '~/shared/stores/wallet'
import { usePersistProjectCallback } from '~/stores/projectDraft'
import { Meatball } from '../Meatball'
import { SimpleDropdown, SimpleListDropdownMenu } from '../SimpleDropdown'
import { DropdownMenuItem } from '../DropdownMenuItem'

export default function BeneficiaryAddressEditor({
    disabled = false,
    invalid = false,
    onChange: onChangeProp,
    value: valueProp = '',
}: {
    disabled?: boolean
    invalid?: boolean
    onChange?: (value: string) => void
    value?: string
}) {
    const [value, setValue] = useState(valueProp)

    useEffect(() => {
        setValue(valueProp)
    }, [valueProp])

    const valueRef = useRef(value)

    if (valueRef.current !== value) {
        valueRef.current = value
    }

    const accountAddress = useWalletAccount()

    const { copy } = useCopy()

    function onChange(newValue: string) {
        setValue(newValue)

        onChangeProp?.(newValue)
    }

    const persist = usePersistProjectCallback()

    return (
        <Container>
            <Text
                value={value}
                onCommit={onChange}
                placeholder={
                    accountAddress
                        ? accountAddress
                        : 'i.e. 0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1'
                }
                disabled={disabled}
                invalid={invalid}
                selectAllOnFocus
                onKeyDown={({ key }) => {
                    if (key === 'Enter') {
                        persist()
                    }
                }}
            />
            <Actions>
                <SimpleDropdown
                    detached
                    menu={(toggle) => (
                        <SimpleListDropdownMenu>
                            <ul>
                                <DropdownMenuItem
                                    tabIndex={-1}
                                    type="button"
                                    disabled={!accountAddress}
                                    onClick={() => {
                                        toggle(false)

                                        if (!accountAddress) {
                                            return
                                        }

                                        onChange(accountAddress)
                                    }}
                                >
                                    <AddressItem>
                                        <div>Fill wallet address</div>
                                        <div>
                                            {accountAddress
                                                ? truncate(accountAddress)
                                                : 'Wallet locked'}
                                        </div>
                                    </AddressItem>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    tabIndex={-1}
                                    type="button"
                                    disabled={!value}
                                    onClick={() => {
                                        copy(value)

                                        toggle(false)
                                    }}
                                >
                                    Copy
                                </DropdownMenuItem>
                            </ul>
                        </SimpleListDropdownMenu>
                    )}
                >
                    {(toggle) => (
                        <ActionsToggle
                            type="button"
                            onClick={() => void toggle((x) => !x)}
                            disabled={disabled}
                        >
                            <Meatball alt="" color="gray" disabled={disabled} />
                        </ActionsToggle>
                    )}
                </SimpleDropdown>
            </Actions>
        </Container>
    )
}

const Container = styled.div`
    background-color: ${COLORS.inputBackground};
    max-width: ${MAX_CONTENT_WIDTH};
    padding: 12px 24px;
    position: relative;
    line-height: normal;
`

const AddressItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    div + div {
        color: #adadad;
        font-size: 10px;
    }
`

const Actions = styled.div`
    position: absolute;
    padding: 0 32px;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
`

const ActionsToggle = styled.button`
    appearance: none;
    background: none;
    border: 0;
    display: block;
    outline: 0;
    padding: 0;
`
