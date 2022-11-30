import React, { FunctionComponent} from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { TabList, TabOption } from '$shared/components/Tabs'
import { COLORS } from '$shared/utils/styled'

export type LinkTabOptionProps = {
    label: string
    href: string
    disabled?: boolean
    disabledReason?: string
}

export type LinkTabsProps = {
    options: LinkTabOptionProps[]
    selectedOptionHref: string
    fullWidth?: 'on' | 'onlyMobile' | 'mobileAndTablet'
}

/**
 * This component simplified version of Tabs component used for tabs with links.
 * It depends on styles of the TabCoponent
 */
const LinkTabs: FunctionComponent<LinkTabsProps> = ({options, selectedOptionHref, fullWidth}) => {

    const getFullWidthClassName = (fullWidth: LinkTabsProps['fullWidth']): string => {
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

    return <LinkTabList className={getFullWidthClassName(fullWidth)}>
        {options.map((option, index) => {
            return <LinkTabOption
                key={index}
                className={
                    `${option.href === selectedOptionHref ? 'selected' : ''} ${option.disabled ? 'disabled' : ''} `
                    + getFullWidthClassName(fullWidth)
                }
                title={option.disabled ? option.disabledReason : undefined}
            >
                <Link to={option.href}>{option.label}</Link>
            </LinkTabOption>
        })}
    </LinkTabList>
}

const LinkTabList = styled(TabList)`
    padding: 4px;
`

const LinkTabOption = styled(TabOption)`
  a {
    color: ${COLORS.primary};
  }
  &.selected {
    background-color: ${COLORS.primary};
    border-radius: 100px;
    a {
      color: ${COLORS.primaryContrast}
    }
  }

  &.disabled a {
    cursor: not-allowed;
    color: ${COLORS.primaryDisabled};
  }
`

export default LinkTabs
