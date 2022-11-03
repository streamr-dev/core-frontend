import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { COLORS } from '$shared/utils/styled'

export type TabOption = {
    label: string
    value: string
    disabled?: boolean
    disabledReason?: string
}

export type TabsProps = {
    name: string
    options: TabOption[]
    selectedOptionValue: string
    onChange: (optionValue: string) => void
}
const Tabs: FunctionComponent<TabsProps> = ({options, selectedOptionValue, onChange}) => {

    const [selection, setSelection] = useState<string>(selectedOptionValue)
    const [markerWidth, setMarkerWidth] = useState<string>('0px')
    const [markerMarginLeft, setMarkerMarginLeft] = useState<string>('0px')
    const [componentLoaded, setComponentLoaded] = useState<boolean>(false)
    const [markerLoaded, setMarkerLoaded] = useState<boolean>(false)
    const list = useRef<HTMLUListElement>(null)

    useEffect(() => {
        setSelection(selectedOptionValue)
    }, [selectedOptionValue])

    useEffect((): void => {
        if (list.current && componentLoaded) {
            const elementIndex = options.findIndex((option) => option.value === selection)
            const element: HTMLLIElement = list.current.children[elementIndex + 1] as HTMLLIElement
            setMarkerWidth(`${element.offsetWidth}px`)
            setMarkerMarginLeft(`${element.offsetLeft}px`)
            if (!markerLoaded) {
                setTimeout(() => setMarkerLoaded(true), 0)
            }

        }
    }, [list, options, selection, componentLoaded])

    useEffect(() => {
        setComponentLoaded(true)
    }, [])

    const handleClick = (newSelection: TabOption): void => {
        if (newSelection.disabled) {
            return
        }
        setSelection(newSelection.value)
        onChange(newSelection.value)
    }

    return <TabList ref={list}>
        <Marker style={{width: markerWidth, marginLeft: markerMarginLeft}} className={markerLoaded ? 'transition' : ''}><MarkerFill/></Marker>
        {options.map((option, index) => {
            return <TabOption
                key={index}
                className={`${option.value === selection ? 'selected' : ''} ${markerLoaded ? 'transition' : ''} ${option.disabled ? 'disabled' : ''}`}
                onClick={() => handleClick(option)}
                title={option.disabled ? option.disabledReason : undefined}
            >
                {option.label}
            </TabOption>
        })}
    </TabList>
}

const TabList = styled.ul`
  list-style-type: none;
  padding: 4px 0;
  margin: 0;
  display: flex;
  background-color: ${COLORS.secondary};
  border-radius: 100px;
  width: fit-content;
  position: relative;
`

const TabOption = styled.li`
  padding: 8px 16px;
  font-size: 14px;
  line-height: 18px;
  font-weight: 500;
  color: ${COLORS.primary};
  cursor: pointer;
  z-index: 2;
  &.transition {
    transition: color 250ms ease-in;
  }
  
  &.selected {
    color: ${COLORS.primaryContrast}
  }
  
  &.disabled {
    cursor: not-allowed;
    color: ${COLORS.primaryDisabled};
  }
`

const Marker = styled.li`
  position: absolute;
  width: 0;
  height: 100%;
  top: 0;
  padding: 4px;
  &.transition {
    transition: all 250ms ease-in;
  }
`

const MarkerFill = styled.div`
  background-color: ${COLORS.primary};
  border-radius: 100px;
  width: 100%;
  height: 100%;
`

export default Tabs
