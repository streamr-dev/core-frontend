import React from 'react'
import styled from 'styled-components'
import { COLORS } from '~/shared/utils/styled'
import SvgIcon from '~/shared/components/SvgIcon'
import { Button } from '~/components/Button'
import { Route as R } from '~/utils/routes'
import ProjectModal, { Actions } from './ProjectModal'

const Box = styled.div`
    background: #ffffff;
    border-radius: 8px;
    padding: 32px 24px 24px;
    font-size: 16px;
    line-height: 24px;

    p {
        margin: 0;
    }
`

const Explainer = styled.div`
    display: grid;
    grid-template-columns: 18px 1fr;
    background: ${COLORS.secondary};
    border-radius: 8px;
    padding: 20px 24px;
    line-height: 24px;
    gap: 12px;
    margin-top: 32px;
`

const IconWrap = styled.div`
    align-items: center;
    display: flex;
    height: 24px;

    svg {
        display: block;
    }
`

interface Props {
    tokenSymbol?: string
    onReject?: (reason?: unknown) => void
}

export default function AllowanceModal({ tokenSymbol = 'DATA', onReject }: Props) {
    return (
        <ProjectModal onReject={onReject} title="Set Streamr Hub Allowance">
            <Box>
                <p>
                    This step allows the Hub to transfer the required amount of{' '}
                    {tokenSymbol}.
                </p>
                <Explainer>
                    <IconWrap>
                        <SvgIcon name="outlineQuestionMark2" />
                    </IconWrap>
                    <p>
                        Allowance is a requirement of ERC-20 token transfers, designed to
                        increase security and efficiency. For more about allowances, see
                        this{' '}
                        <a
                            href={R.allowanceInfo()}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            page
                        </a>
                        .
                    </p>
                </Explainer>
            </Box>
            <Actions>
                <Button waiting type="button">
                    Waiting
                </Button>
            </Actions>
        </ProjectModal>
    )
}
