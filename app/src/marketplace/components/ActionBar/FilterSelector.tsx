import React, { useCallback, useMemo, ReactNode } from 'react'
import styled from 'styled-components'
import type { AnyFilter } from '$mp/types/project-types'
import UnstyledPopover from '$shared/components/Popover'
import { LG } from '$shared/utils/styled'
import useModal from '$shared/hooks/useModal'
import PopoverItem from '$shared/components/Popover/PopoverItem'
export type Options = Array<{
    id: string
    value: AnyFilter | null | undefined
    title: string
}>
type Props = {
    title: string
    selected: ReactNode
    options: Options
    onChange: (value: AnyFilter | null | undefined) => void
}
const Popover = styled(UnstyledPopover)`
    && > * {
        color: #323232;
    }
`
const DesktopPopover = styled(Popover)`
    display: none;

    @media (min-width: ${LG}px) {
        display: block;
    }
`
const MobileButton = styled.button`
    display: block;
    width: 100%;
    appearance: none;
    background: transparent;
    border: 0;
    padding: 0;
    margin: 0;
    outline: none;
    text-align: left;

    :focus {
        outline: none;
    }

    @media (min-width: ${LG}px) {
        display: none;
    }
`

const UnstyledFilterSelector = ({ title: popoverTitle, selected, options, onChange: onChangeProp, ...props }: Props) => {
    const { api: filterDialog } = useModal('marketplace.filter')
    const onClick = useCallback(() => {
        filterDialog.open({
            title: popoverTitle,
            options,
            onChange: onChangeProp,
            selected,
        })
    }, [filterDialog, popoverTitle, options, onChangeProp, selected])
    const mobileTitle = useMemo(
        () => (options.find(({ value }) => value === selected) || {}).title || popoverTitle,
        [options, selected, popoverTitle],
    )
    return (
        <div {...props}>
            <DesktopPopover title={popoverTitle} caret="svg" selectedItem={selected} activeTitle onChange={onChangeProp} leftTick>
                {options.map(({ id, value, title }) => (
                    <PopoverItem key={id} value={value}>
                        {title}
                    </PopoverItem>
                ))}
            </DesktopPopover>
            <MobileButton type="button" onClick={onClick}>
                <Popover title={mobileTitle} caret="svg" />
            </MobileButton>
        </div>
    )
}

const FilterSelector = styled(UnstyledFilterSelector)`
    position: relative;
`
export default FilterSelector
