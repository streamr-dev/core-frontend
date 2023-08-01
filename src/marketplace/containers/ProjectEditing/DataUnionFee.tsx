import React, { ChangeEvent, FunctionComponent, useContext, useEffect } from 'react'
import styled from 'styled-components'
import { COLORS, MAX_CONTENT_WIDTH } from '~/shared/utils/styled'
import TextField from '~/shared/components/Ui/TextField'
import { ProjectStateContext } from '~/marketplace/contexts/ProjectStateContext'
import { useEditableProjectActions } from '~/marketplace/containers/ProductController/useEditableProjectActions'
import useValidation from '~/marketplace/containers/ProductController/useValidation'
import { SeverityLevel } from '~/marketplace/containers/ProductController/ValidationContextProvider'

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

    &.with-margin {
        margin-bottom: 15px;
    }
`

const StyledInput = styled(TextField)`
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

export const DataUnionFee: FunctionComponent<{ disabled?: boolean }> = ({
    disabled = false,
}) => {
    const { state: project } = useContext(ProjectStateContext)
    const { updateAdminFee } = useEditableProjectActions()
    const { setStatus, isValid, clearStatus } = useValidation('adminFee')

    const handleUpdate = (value: string): void => {
        const number = Number(value)
        if (number < 0) {
            setStatus(SeverityLevel.ERROR, 'Data Union admin fee cannot be under 0%')
        } else if (number > 100) {
            setStatus(SeverityLevel.ERROR, 'Data Union admin fee cannot be over 100%')
        } else {
            clearStatus()
        }

        updateAdminFee(value)
    }

    return (
        <>
            <Heading>Data Union admin fee</Heading>
            <Container>
                <AdminFeeInputWrap>
                    <DescriptionText>
                        Set the fee you receive from this Data Union (% of total sales)
                    </DescriptionText>
                    <StyledInput
                        className={'percent-input'}
                        placeholder={'Fee'}
                        value={project.adminFee || ''}
                        disabled={
                            disabled ||
                            !project.dataUnionChainId ||
                            !!project.existingDUAddress
                        }
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            handleUpdate(event.target.value)
                        }}
                        $invalid={!isValid}
                    />
                    <span className={'percent-symbol'}>%</span>
                </AdminFeeInputWrap>
            </Container>
        </>
    )
}
