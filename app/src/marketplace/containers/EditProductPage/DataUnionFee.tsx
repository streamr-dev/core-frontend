import React, { ChangeEvent, FunctionComponent, useContext } from 'react'
import styled from 'styled-components'
import { COLORS, MAX_CONTENT_WIDTH } from '$shared/utils/styled'
import Text from '$ui/Text'
import { ProjectStateContext } from '$mp/contexts/ProjectStateContext'
import { useEditableProjectActions } from '$mp/containers/ProductController/useEditableProjectActions'

const Heading = styled.p`
  font-size: 20px;
  color: black;
  margin-top: 30px;
`

const Container = styled.div`
  background-color: ${COLORS.inputBackground};
  padding: 12px 24px;
  max-width: ${MAX_CONTENT_WIDTH};
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

export const DataUnionFee: FunctionComponent<{disabled?: boolean}> = ({disabled = false}) => {

    const {state: project} = useContext(ProjectStateContext)
    const {updateAdminFee} = useEditableProjectActions()

    return <>
        <Heading>Data Union admin fee</Heading>
        <Container>
            <AdminFeeInputWrap>
                <DescriptionText>Set the fee you receive from this Data Union (% of total sales)</DescriptionText>
                <StyledInput
                    className={'percent-input'}
                    placeholder={'Fee'}
                    value={project.adminFee || ''}
                    disabled={disabled || !project.chain}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        updateAdminFee(event.target.value)
                    }}
                />
                <span className={'percent-symbol'}>%</span>
            </AdminFeeInputWrap>
        </Container>
    </>
}
