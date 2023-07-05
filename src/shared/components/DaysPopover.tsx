import React from 'react'
import styled from 'styled-components'
import Popover, { StyledDropdownToggle } from '~/shared/components/Popover'
import PopoverItem from '~/shared/components/Popover/PopoverItem'

const UnstyledDaysPopover = (props) => (
    <Popover
        {...props}
        title=""
        activeTitle
        menuProps={{
            right: true,
        }}
    >
        <PopoverItem value="7">Last 7 days</PopoverItem>
        <PopoverItem value="28">Last 28 days</PopoverItem>
        <PopoverItem value="90">Last 90 days</PopoverItem>
    </Popover>
)

const DaysPopover = styled(UnstyledDaysPopover)`
    && {
        text-align: right;
        margin-bottom: 0.5rem;

        & > button {
            height: 24px;
        }

        ${StyledDropdownToggle} {
            font-size: 12px;
            line-height: 1em;
            color: #525252;
        }

        .caret {
            &.open {
                transform: rotate(180deg) translateY(2px);
            }
        }
    }
`
export default DaysPopover
