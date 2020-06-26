// @flow

import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Header } from '$shared/components/DataUnionStats'
import Popover, { StyledDropdownToggle } from '$shared/components/Popover'

type Props = {
    label?: string,
    children: Function,
    className?: string,
    onDaysChange?: Function,
    disabled?: boolean,
}

const StyledPopover = styled(Popover)`
    && {
        text-align: right;
        margin-bottom: 0.5rem;

        & > button {
            height: 24px;
        }

        ${StyledDropdownToggle} {
            font-size: 12px;
            line-height: 24px;
            color: var(--greyDark);
        }

        .caret {
            &.open {
                transform: rotate(180deg) translateY(2px);
            }
        }
    }
`

const Root = styled.div`
    display: inline-block;
`

const HeaderWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  margin-bottom: 1rem;
`

export const WithShownDays = ({
    label,
    children,
    className,
    onDaysChange: onDaysChangeProp,
    disabled,
}: Props) => {
    const [shownDays, setShownDays] = useState(7)

    const onDaysChange = useCallback((item: string) => {
        const newValue = Number(item)
        setShownDays((previousValue) => {
            if (onDaysChangeProp && previousValue !== newValue) {
                onDaysChangeProp(newValue)
            }

            return newValue
        })
    }, [onDaysChangeProp])

    return (
        <Root className={className}>
            <HeaderWrapper>
                {!!label && (
                    <Header>{label}</Header>
                )}
                <StyledPopover
                    title=""
                    activeTitle
                    selectedItem={shownDays.toString()}
                    onChange={onDaysChange}
                    disabled={disabled}
                >
                    <Popover.Item value="7">Last 7 days</Popover.Item>
                    <Popover.Item value="28">Last 28 days</Popover.Item>
                    <Popover.Item value="90">Last 90 days</Popover.Item>
                </StyledPopover>
            </HeaderWrapper>
            {typeof children === 'function' ? children({
                shownDays,
            }) : null}
        </Root>
    )
}

export default WithShownDays
