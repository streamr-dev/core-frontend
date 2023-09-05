import React, { FunctionComponent } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { COLORS } from '~/shared/utils/styled'
export type SpinnerSize = 'small' | 'large' | 'medium'
export type SpinnerColor = 'green' | 'white' | 'gray' | 'blue'
type Props = {
    size?: SpinnerSize
    color?: SpinnerColor
    className?: string
}

const Spinner: FunctionComponent<Props> = ({
    size = 'small',
    color = 'green',
    className,
}: Props) => (
    <SpinnerContainer className={className}>
        <SpinnerElement $size={size} $color={color} />
        <ScreenReaderText>Loading...</ScreenReaderText>
    </SpinnerContainer>
)

export default Spinner

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }`

const SpinnerContainer = styled.div`
    display: inline-flex;
    align-self: center;
`

const ScreenReaderText = styled.span`
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
`

const SpinnerElement = styled.span<{ $color: SpinnerColor; $size: SpinnerSize }>`
    ${({ $color, $size }) => {
        let styles = css`
            display: inline-block;
            position: relative;
            transform: translateZ(0);
            animation: ${spin} 1.1s infinite linear;

            &,
            &::after {
                border-radius: 100%;
                min-width: 16px;
                min-height: 16px;
                line-height: 1;
            }
        `
        switch ($size) {
            case 'small':
                styles = css`
                    ${styles};
                    font-size: 2px;
                `
                break
            case 'medium':
                styles = css`
                    ${styles};
                    font-size: 2px;
                    &,
                    &::after {
                        min-width: 22px;
                        min-height: 22px;
                    }
                `
                break
            case 'large':
                styles = css`
                    ${styles};
                    font-size: 4px;

                    &,
                    &::after {
                        min-width: 40px;
                        min-height: 40px;
                    }
                `
        }
        switch ($color) {
            case 'blue':
                styles = css`
                    ${styles};
                    border: 2px solid ${COLORS.spinnerBorder};
                    border-left-color: ${COLORS.link};
                `
                break
            case 'green':
                styles = css`
                    ${styles};
                    border: 2px solid ${COLORS.greenSpinner};
                    border-left-color: ${COLORS.spinnerBorder};
                `
                break
            case 'white':
                styles = css`
                    ${styles};
                    border: 2px solid ${COLORS.primaryContrast};
                    border-left-color: ${COLORS.spinnerBorder};
                `
                break
            case 'gray':
                styles = css`
                    ${styles};
                    border: 2px solid ${COLORS.spinnerBorder};
                    border-left-color: ${COLORS.primaryContrast};
                `
                break
        }
        return styles
    }}
`
