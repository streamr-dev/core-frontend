import React, { ChangeEvent, FunctionComponent, useCallback, useContext } from 'react'
import styled from 'styled-components'
import { COLORS, MAX_CONTENT_WIDTH } from '$shared/utils/styled'
import Text from '$ui/Text'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import useCopy from '$shared/hooks/useCopy'
import useAccountAddress from '$shared/hooks/useAccountAddress'
import PopoverItem from '$shared/components/Popover/PopoverItem'
import WithInputActions from '$shared/components/WithInputActions'
import { truncate } from '$shared/utils/text'

const Heading = styled.p`
  font-size: 20px;
  color: black;
  margin-top: 30px;
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

const DescriptionText = styled.p`
  color: black;
  margin-bottom: 0;
  margin-right: 55px;
  flex-shrink: 0;
  
  &.with-margin  {
    margin-bottom: 15px;
  }
`

const StyledInput = styled(Text)`
  flex-shrink: 1;
`

const AdminFeeInputWrap = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  .percent-input {
    padding-right: 40px;
    &:disabled {
      background-color: white;
      opacity: 1;
    }
  }
  .percent-symbol {
    position: absolute;
    right: 12px;
    top: 0;
    height: 100%;
    font-size: 14px;
    border-left: 1px solid ${COLORS.separator};
    padding-left: 10px;
    color: ${COLORS.primaryLight};
    display: flex;
    align-items: center;
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

export const DataUnionFeesAndBeneficiary: FunctionComponent<{disabled?: boolean}> = ({disabled = false}) => {

    const {state: project} = useContext(ProjectStateContext)
    const {updateBeneficiaryAddress, updateAdminFee} = useEditableProjectActions()
    const { copy } = useCopy()
    const accountAddress = useAccountAddress()
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

    return <>
        <Heading>Data Union admin fee</Heading>
        <Container>
            <AdminFeeInputWrap>
                <DescriptionText>Set the fee you receive from this Data Union (% of total sales)</DescriptionText>
                <StyledInput
                    className={'percent-input'}
                    placeholder={'Fee'}
                    defaultlValue={project.adminFee || ''}
                    disabled={disabled || !project.chain}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        updateAdminFee(event.target.value)
                    }}
                />
                <span className={'percent-symbol'}>%</span>
            </AdminFeeInputWrap>
        </Container>
        <Heading>Set beneficiary</Heading>
        <DescriptionText className={'with-margin'}>This wallet address receives the payments for this product on the selected chain.</DescriptionText>
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
                        console.log('update', event.target.value)
                        updateBeneficiaryAddress(event.target.value)
                    }}
                    placeholder={'i.e. 0xa3d1F77ACfF0060F7213D7BF3c7fEC78df847De1'}
                    disabled={disabled  || !project.chain}
                    selectAllOnFocus
                />
            </WithInputActions>
        </Container>
    </>
}
