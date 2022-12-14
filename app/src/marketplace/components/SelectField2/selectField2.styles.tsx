import styled, { css } from 'styled-components'
import { components, CSSObjectWithLabel } from 'react-select'
import SvgIcon, { SvgIconProps } from '$shared/components/SvgIcon'
import { COLORS } from '$shared/utils/styled'
import CheckmarkIcon from '$shared/assets/icons/checkmark.svg'

const transitionTime = 150

export const StyledCaretIcon = styled(SvgIcon)<SvgIconProps>`
  height: 8px;
  width: 10px;
  transition: all ${transitionTime}ms ease-in-out;
  color: ${COLORS.primaryLight}
  &.rotated {
    transform: rotate(180deg);
    color: ${COLORS.primaryContrast}
  };
  &.disabled {
    color: ${COLORS.disabled}
  }
`

export const StyledDropdownIndicator = styled(components.DropdownIndicator)`
    margin-right: 10px;
`

export const StyledCloseIcon = styled(SvgIcon)`
  color: ${COLORS.primaryLight}
  &.menu-is-open {
    color: ${COLORS.primaryContrast}
  }
`

const StyledOptionAfter = css`
  :after {
    content: ' ';
    background: url("${CheckmarkIcon}") center center no-repeat;
    width: 10px;
    height: 10px;
    position: absolute;
    right: 12px;
    top: 12px;
  }
`

export const StyledOption = styled(components.Option)`
  cursor: pointer;
  color: ${COLORS.primaryLight};
  font-size: 14px;
  font-weight: 400;
  transition: all ${transitionTime}ms ease-in-out;
  position: relative;
  &:active {
    background-color: ${COLORS.primary} !important;
  }
  &:focus {
    background-color: ${COLORS.focus};
  }
  
  ${(props) => {
        if (props.isSelected ) {
            return StyledOptionAfter
        }
    }}
`

export const getControlStyles = (styles: CSSObjectWithLabel, isFocused: boolean, isOpen: boolean, isDisabled: boolean): CSSObjectWithLabel => {
    const styleObject: CSSObjectWithLabel = {
        ...styles,
        backgroundColor: COLORS.secondary,
        borderRadius: '4px',
        border: 'none',
        fontWeight: 500,
        width: 'auto',
        display: 'inline-flex',
        transition: `background-color ${transitionTime}ms ease-in-out`,
        cursor: 'pointer'
    }
    if (isFocused) {
        styleObject.boxShadow = `none`
    }
    if (isOpen) {
        styleObject.backgroundColor = COLORS.primary
        styleObject.color = COLORS.primaryContrast
    }
    if (isDisabled) {
        styleObject.cursor = 'not-allowed'
    }
    return styleObject
}

export const getPlaceholderStyles = (styles: CSSObjectWithLabel, isOpen: boolean, isDisabled: boolean): CSSObjectWithLabel => {
    const styleObject: CSSObjectWithLabel = {
        ...styles,
        color: COLORS.primaryLight,
        display: 'block',
        position: 'relative',
        top: '0',
        transform: 'translateY(0)',
        fontSize: '14px',
        lineHeight: '36px',
        fontWeight: 500,
        transition: `color ${transitionTime}ms ease-in-out`
    }
    if (isOpen) {
        styleObject.color = COLORS.primaryContrast
    }
    if (isDisabled) {
        styleObject.color = COLORS.disabled
    }
    return styleObject
}

export const getSingleValueStyles = (styles: CSSObjectWithLabel, isOpen: boolean, isDisabled: boolean): CSSObjectWithLabel => {
    const styleObject: CSSObjectWithLabel = {
        ...styles,
        position: 'relative',
        maxWidth: '100%',
        top: 0,
        transform: 'translateY(0)',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '36px',
        color: COLORS.primaryLight
    }

    if (isOpen) {
        styleObject.color = COLORS.primaryContrast
    }
    if (isDisabled) {
        styleObject.color = COLORS.disabled
    }
    return styleObject
}

export const getMenuStyles = (styles: CSSObjectWithLabel): CSSObjectWithLabel => {
    return {
        ...styles,
        background: '#FFF',
        boxShadow: '0px 3px 5px rgba(9, 30, 66, 0.2), 0px 0px 1px rgba(9, 30, 66, 0.31)',
        border: 'none',
        borderRadius: '8px',
        color: COLORS.primary,
        width: '280px',
        marginTop: '8px',
        padding: 0
    }
}

export const getMenuListStyles = (styles: CSSObjectWithLabel): CSSObjectWithLabel => {
    return {
        ...styles,
        padding: 0,
        borderRadius: '8px',
    }
}

export const getOptionStyles = (styles: CSSObjectWithLabel, isSelected: boolean): CSSObjectWithLabel => {
    const styleObject: CSSObjectWithLabel = {
        ...styles,
        cursor: 'pointer',
        color: COLORS.primaryLight,
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '18px'
    }
    if (isSelected) {
        styleObject.backgroundColor = COLORS.primaryLight
        styleObject.color = COLORS.primaryContrast
    }
    return styleObject
}

export const getClearIndicatorStyles = (styles: CSSObjectWithLabel, isOpen: boolean): CSSObjectWithLabel => {
    const styleObject: CSSObjectWithLabel = {
        ...styles,
        color: COLORS.primaryLight,
        transition: `color ${transitionTime}ms ease-in-out`
    }
    if (isOpen) {
        styleObject.color = COLORS.primaryContrast
    }
    return styleObject
}
