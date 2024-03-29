import styled from 'styled-components'
import { COLORS } from '~/shared/utils/styled'

export const Address = styled.div`
    align-items: center;
    color: ${COLORS.primaryLight};
    display: grid;
    font-size: 14px;
    gap: 4px;
    grid-template-columns: 1fr;
    line-height: 20px;

    p + & {
        margin-top: 8px;
    }

    strong {
        color: ${COLORS.primary};
    }

    svg {
        display: block;
    }

    @media (min-width: 400px) {
        grid-template-columns: max-content max-content;
    }
`

export const AddressLabel = styled.div``

export const AddressContent = styled.div`
    align-items: center;
    display: grid;
    gap: 4px;
    grid-template-columns: max-content max-content;
`

export const Banner = styled.div`
    background: ${COLORS.secondaryLight};
    border-radius: 6px;
    padding: 12px;
    display: grid;
    gap: 10px;
    grid-template-columns: 24px 1fr;

    * + & {
        margin-top: 20px;
    }

    span[role='img'] {
        color: ${COLORS.primaryDisabled};
    }

    svg,
    span[role='img'] {
        display: block;
        width: 20px;
        height: 20px;
    }
`

export const IconWrap = styled.div`
    align-items: center;
    display: flex;
    height: 24px;
    justify-content: center;
    width: 24px;
`
