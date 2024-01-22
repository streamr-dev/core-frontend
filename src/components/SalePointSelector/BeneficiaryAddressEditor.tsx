import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { COLORS, MAX_CONTENT_WIDTH } from '~/shared/utils/styled'
import PrestyledWithInputActions from '~/components/WithInputActions'
import { PopoverItem } from '~/components/Popover'
import Text from '~/shared/components/Ui/Text'
import useCopy from '~/shared/hooks/useCopy'
import { truncate } from '~/shared/utils/text'
import { useWalletAccount } from '~/shared/stores/wallet'
import { usePersistProjectCallback } from '~/stores/projectDraft'

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
                        onClick={() => void copy(value)}
                    >
                        Copy
                    </PopoverItem>,
                ]}
            >
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
