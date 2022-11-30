import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { COLORS, DESKTOP, TABLET } from '$shared/utils/styled'
import { useWindowSize } from '$shared/hooks/useWindowSize'

export type TabOptionProps = {
    label: string
    value: string
    disabled?: boolean
    disabledReason?: string
}

export type TabsProps = {
    options: TabOptionProps[]
    selectedOptionValue: string
    onChange: (optionValue: string) => void,
    fullWidth?: 'on' | 'onlyMobile' | 'mobileAndTablet'
}
const Tabs: FunctionComponent<TabsProps> = ({options, selectedOptionValue, onChange, fullWidth}) => {

    const [selection, setSelection] = useState<string>(selectedOptionValue)
    const [markerWidth, setMarkerWidth] = useState<string>('0px')
    const [markerMarginLeft, setMarkerMarginLeft] = useState<string>('0px')
    const [componentLoaded, setComponentLoaded] = useState<boolean>(false)
    const [markerLoaded, setMarkerLoaded] = useState<boolean>(false)
    const list = useRef<HTMLUListElement>(null)
    const {width} = useWindowSize()

    const handleMarkerResize = (): void => {
        if (list.current && componentLoaded) {
            const elementIndex = options.findIndex((option) => option.value === selection)
            const element: HTMLLIElement = list.current.children[elementIndex + 1] as HTMLLIElement
            setMarkerWidth(`${element.offsetWidth}px`)
            setMarkerMarginLeft(`${element.offsetLeft}px`)
            if (!markerLoaded) {
                setTimeout(() => setMarkerLoaded(true), 0)
            }

        }
    }

    useEffect(() => {
        setSelection(selectedOptionValue)
    }, [selectedOptionValue])

    useEffect((): void => {
        handleMarkerResize()
    }, [list, options, selection, componentLoaded, width])

    useEffect(() => {
        setComponentLoaded(true)
    }, [])

    const handleClick = (newSelection: TabOptionProps): void => {
        if (newSelection.disabled || (newSelection.value === selection)) {
            return
        }
        setSelection(newSelection.value)
        onChange(newSelection.value)
    }

    const getFullWidthClassName = (fullWidth: TabsProps['fullWidth']): string => {
        switch (fullWidth) {
            case 'on':
                return 'fullWidth'
            case 'onlyMobile':
                return 'fullWidthToTablet'
            case 'mobileAndTablet':
                return 'fullWidthToDesktop'
            default:
                return ''
        }
    }

    return <TabList ref={list} className={getFullWidthClassName(fullWidth)}>
        <Marker style={{width: markerWidth, marginLeft: markerMarginLeft}} className={markerLoaded ? 'transition' : ''}><MarkerFill/></Marker>
        {options.map((option, index) => {
            return <TabOption
                key={index}
                className={
                    `${option.value === selection ? 'selected' : ''} ${markerLoaded ? 'transition' : ''} ${option.disabled ? 'disabled' : ''} `
                    + getFullWidthClassName(fullWidth)
                }
                onClick={() => handleClick(option)}
                title={option.disabled ? option.disabledReason : undefined}
            >
                {option.label}
            </TabOption>
        })}
    </TabList>
}

export const TabList = styled.ul`
  list-style-type: none;
  padding: 4px 0;
  margin: 0;
  display: flex;
  background-color: ${COLORS.secondary};
  border-radius: 100px;
  width: fit-content;
  position: relative;
  &.fullWidth {
    width: 100%;
    justify-content: space-between;
  }
  &.fullWidthToTablet {
    width: 100%;
    justify-content: space-between;
    @media(${TABLET}) {
      width: fit-content;
      justify-content: unset;
    }
  }
  &.fullWidthToDesktop {
    width: 100%;
    justify-content: space-between;
    @media(${DESKTOP}) {
      width: fit-content;
      justify-content: unset;
    }
  }
`

export const TabOption = styled.li`
  padding: 8px 16px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  color: ${COLORS.primary};
  cursor: pointer;
  z-index: 2;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: pre;
  
  @media(${TABLET}) { 
    font-size: 14px;
  }
  
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

  &.fullWidth {
    flex: 1;
  }
  &.fullWidthToTablet {
    flex: 1;
    @media(${TABLET}) {
      flex: unset;
    }
  }
  &.fullWidthToDesktop {
    flex: 1;
    @media(${DESKTOP}) {
      flex: unset;
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
