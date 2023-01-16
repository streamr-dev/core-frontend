import React, { ChangeEvent, FunctionComponent, useCallback, useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { COLORS, MAX_CONTENT_WIDTH } from '$shared/utils/styled'
import WithInputActions from '$shared/components/WithInputActions'
import PopoverItem from '$shared/components/Popover/PopoverItem'
import Text from '$ui/Text'
import useCopy from '$shared/hooks/useCopy'
import useAccountAddress from '$shared/hooks/useAccountAddress'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { truncate } from '$shared/utils/text'
import { isEthereumAddress } from '$mp/utils/validate'
import useValidation2 from '$mp/containers/ProductController/useValidation2'
import { SeverityLevel } from '$mp/containers/ProductController/ValidationContextProvider2'

const Heading = styled.p`
  font-size: 20px;
  color: black;
  margin-top: 30px;
`

const DescriptionText = styled.p`
  color: black;
  margin-bottom: 15px;
  margin-right: 55px;
  flex-shrink: 0;
`

const Container = styled.div`
  background-color: ${COLORS.inputBackground};
  padding: 12px 24px;
  max-width: ${MAX_CONTENT_WIDTH};
  
  .beneficiary-address-input {
    margin: 0;
    input:disabled {
      background-color: white;
      opacity: 1;
    }
  }
`

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

export const BeneficiaryAddress2: FunctionComponent<{disabled?: boolean}> = ({disabled}) => {

    const {state: project} = useContext(ProjectStateContext)
    const {updateBeneficiaryAddress} = useEditableProjectActions()
    const { copy } = useCopy()
    const accountAddress = useAccountAddress()
    const {setStatus, clearStatus, isValid} = useValidation2('beneficiaryAddress')
    const [defaultValueWasSet, setDefaultValueWasSet] = useState(false)
    const onCopy = useCallback(() => {
        if (!project.beneficiaryAddress) {
            return
        }

        copy(project.beneficiaryAddress)
        Notification.push({
            title: 'Copied',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy, project.beneficiaryAddress])

    useEffect(() => {
        if (!defaultValueWasSet && project.chain && !project.beneficiaryAddress) {
            updateBeneficiaryAddress(accountAddress)
            setDefaultValueWasSet(true)
        }
    }, [accountAddress, project])

    const handleUpdate = (value: string): void => {
        console.log('updateee', value)
        updateBeneficiaryAddress(value)
        const isValid = isEthereumAddress(value)
        if (isValid) {
            clearStatus()
        } else {
            setStatus(SeverityLevel.ERROR, 'Provided wallet address is invalid')
        }
    }

    return <>
        <Heading>Set beneficiary</Heading>
        <DescriptionText>This wallet address receives the payments for this product on the selected chain.</DescriptionText>
        <Container>
            <WithInputActions
                disabled={disabled}
                className={'beneficiary-address-input'}
                actions={[
                    <PopoverItem key="useCurrent" onClick={() => {
                        updateBeneficiaryAddress(accountAddress)
                    }} disabled={!accountAddress}>
                        <AddressItem name="wallet address" address={accountAddress || 'Wallet locked'} />
                    </PopoverItem>,
                    <PopoverItem key="copy" disabled={!project.beneficiaryAddress} onClick={onCopy}>
                        Copy
                    </PopoverItem>,
                ]}
            >
                <Text
                    id="beneficiaryAddress"
                    autoComplete="off"
                    value={project.beneficiaryAddress || ''}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        handleUpdate(event.target.value)
                    }}
                    placeholder={'i.e. 0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1'}
                    disabled={disabled  || !project.chain}
                    invalid={!isValid}
                    selectAllOnFocus
                />
            </WithInputActions>
        </Container>
    </>
}
