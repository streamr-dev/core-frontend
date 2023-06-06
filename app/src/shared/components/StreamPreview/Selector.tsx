import React, { useCallback } from 'react'
import styled from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import { COLORS, MEDIUM } from '$shared/utils/styled'
import IconButton from './IconButton'
const Button = styled(IconButton)`
    :not(:last-child) {
        margin-left: 16px;
    }

    + div {
        margin: 0 12px;
        white-space: nowrap;
    }

    svg {
        width: 8px;
        height: 14px;
    }
`

const Title = styled.div`
    font-weight: ${MEDIUM};
`

const UnstyledSelector = ({ active, onChange, options = [], title, ...props }) => {
    const current = options.indexOf(active)
    const prevOption = options[Math.max(0, current - 1)]
    const prev = useCallback(() => {
        onChange(prevOption)
    }, [onChange, prevOption])
    const nextOption = options[Math.min(current + 1, options.length)]
    const next = useCallback(() => {
        onChange(nextOption)
    }, [onChange, nextOption])

    if (options.length <= 1) {
        return null
    }

    return (
        <div {...props}>
            <Title>{title}</Title>
            <Button disabled={current <= 0} onClick={prev} type="button">
                <SvgIcon name="back" />
            </Button>
            <div>
                <strong>{current + 1}</strong> of <strong>{options.length}</strong>
            </div>
            <Button disabled={current >= options.length - 1} onClick={next} type="button">
                <SvgIcon name="forward" />
            </Button>
        </div>
    )
}

const Selector = styled(UnstyledSelector)`
    align-items: center;
    color: ${COLORS.primary};
    display: flex;
    button {
        color: ${COLORS.primary};
    }
`
export default Selector
