import React, { useCallback } from 'react'
import styled from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
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

const UnstyledSelector = ({
    active,
    onChange,
    options = [],
    title,
    ...props
}) => {
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
            <strong>{title}</strong>
            <Button disabled={current <= 0} onClick={prev}>
                <SvgIcon name="back" />
            </Button>
            <div>
                <strong>{current + 1}</strong> of <strong>{options.length}</strong>
            </div>
            <Button disabled={current >= options.length - 1} onClick={next}>
                <SvgIcon name="forward" />
            </Button>
        </div>
    )
}

const Selector = styled(UnstyledSelector)`
    align-items: center;
    color: #525252;
    display: flex;
    font-size: 14px;
`

export default Selector
