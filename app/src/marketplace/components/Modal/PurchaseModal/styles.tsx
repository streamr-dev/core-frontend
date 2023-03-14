import styled from 'styled-components'
import UnstyledButton from '$shared/components/Button'
import { COLORS, LIGHT, MEDIUM } from '$shared/utils/styled'

export const DialogContainer = styled.div`
    display: grid;
    grid-template-rows: auto auto auto;
    padding-top: 50px;
`

export const DialogTitle = styled.h1`
    font-weight: 400;
    font-size: 24px;
    line-height: 24px;
    margin-bottom: 24px;
`

export const NextButton = styled(UnstyledButton)`
    margin-top: 32px;
    place-self: end;
    min-width: 120px;
`

export const DetailsBox = styled.div`
    display: grid;
    grid-template-rows: auto auto auto;
    background-color: ${COLORS.secondary};
    gap: 8px;
    font-weight: ${MEDIUM};
    font-size: 12px;
    line-height: 12px;
    letter-spacing: 0.05em;
`

export const Price = styled.div`
    color: ${COLORS.primary};
    font-weight: ${LIGHT};
    font-size: 44px;
    line-height: 44px;
    overflow: auto;
`

export const Currency = styled.span`
    font-weight: ${MEDIUM};
    font-size: 12px;
    line-height: 24px;
`

export const Usd = styled.div`
    color: ${COLORS.primaryDisabled};
`
