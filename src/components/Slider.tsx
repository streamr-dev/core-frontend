import React from 'react'
import styled from 'styled-components'
import { COLORS } from '~/shared/utils/styled'

interface Props {
    className?: string
    min: number
    max: number
    value: number
    onChange?: (value: number) => void
    disabled?: boolean
}

export function Slider({
    min,
    max,
    value,
    onChange: onChangeProp,
    disabled,
    className,
}: Props) {
    const borderPercentage = (100 * value) / (max - min)

    return (
        <SliderRoot className={className}>
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => {
                    onChangeProp?.(Number.parseInt(e.target.value, 10))
                }}
                disabled={disabled}
                style={{
                    background: `linear-gradient(to right, ${COLORS.link} calc(${borderPercentage}%), ${COLORS.linkInactive} 1%)`,
                }}
            />
        </SliderRoot>
    )
}

const SliderRoot = styled.div`
    width: 100%;
    position: relative;
    padding-bottom: 6px;

    input {
        appearance: none;
        width: 100%;
        outline: none;
        transition: opacity 0.2s;
        height: 3px;
        border-radius: 2px;
    }

    input::-webkit-slider-thumb {
        appearance: none;
        width: 12px;
        height: 12px;
        background: #0324ff;
        cursor: pointer;
        border-radius: 50%;
    }

    input::-moz-range-thumb {
        width: 12px;
        height: 12px;
        background: #0324ff;
        cursor: pointer;
        border-radius: 50%;
    }

    input:focus {
        outline: none;
    }

    input[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }
`
