import React, { useEffect } from 'react'
import styled from 'styled-components'
import Button from '$shared/components/Button'
import ProjectModal from './ProjectModal'
import SvgIcon from '$shared/components/SvgIcon'
import { LIGHT } from '$shared/utils/styled'

const Box = styled.div`
    background: #ffffff;
    border-radius: 8px;
    padding: 32px 24px;
    margin: 0 auto;
    width: 408px;

    h2 {
        font-size: 24px;
        font-weight: ${LIGHT};
        line-height: normal;
        text-align: center;
        margin: 0 0 12px;
    }

    p {
        font-size: 14px;
        line-height: normal;
        text-align: center;
        margin: 0;
    }

    button {
        width: 100%;
    }
`

const Icon = styled(SvgIcon)`
    width: 112px;
    height: 112px;
    justify-self: center;
    align-self: center;
`

const IconWrap = styled.div`
    align-items: center;
    display: flex;
    height: 224px;
    justify-content: center;
    width: 100%;

    svg {
        display: block;
    }
`

interface Props {
    onReject?: (reason?: unknown) => void
    onResolve?: () => void
}

export default function PurchaseCompleteModal({ onResolve, onReject }: Props) {
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                onResolve?.()
            }
        }

        window.addEventListener('keydown', onKeyDown)

        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [onReject])

    return (
        <ProjectModal onReject={onReject}>
            <Box>
                <h2>Success!</h2>
                <p>Access to the project was granted.</p>
                <IconWrap>
                    <Icon name="checkmarkOutline" />
                </IconWrap>
                <Button type="button" onClick={() => void onResolve?.()}>
                    Done
                </Button>
            </Box>
        </ProjectModal>
    )
}
