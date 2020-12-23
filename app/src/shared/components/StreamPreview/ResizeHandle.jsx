import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import Layout from './Layout'
import { SM } from '$shared/utils/styled'

const UnstyledResizeHandle = (props) => {
    const ref = useRef(null)

    const [x, drag] = useState()

    const touch = ({ touches }) => touches[0]

    const onTouchStart = (e) => {
        const { current: el } = ref

        const width = el.offsetWidth

        const t = touch(e)

        const x0 = t.clientX

        const onMove = (evt) => {
            drag(width + (x0 - touch(evt).clientX))
        }

        const onUp = () => {
            window.removeEventListener('touchmove', onMove)
            window.removeEventListener('touchend', onUp)
        }

        window.addEventListener('touchmove', onMove)
        window.addEventListener('touchend', onUp)
    }

    const onMouseDown = ({ clientX: x0 }) => {
        const { current: el } = ref

        const width = el.offsetWidth

        const onMove = (e) => {
            e.preventDefault()
            drag(width + (x0 - e.clientX))
        }

        const onUp = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }

    const onDblClick = () => {
        drag(undefined)
    }

    return (
        <div {...props} ref={ref}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
                onDoubleClick={onDblClick}
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
            />
            <Layout inspectorWidth={x} />
        </div>
    )
}

const ResizeHandle = styled(UnstyledResizeHandle)`
    display: none;
    top: 0;
    height: 54px;
    right: 0;
    pointer-events: none;
    position: absolute;
    max-width: calc(100vw - var(--LiveDataMinLhsWidth) + 1px);
    min-width: var(--LiveDataInspectorMinWidth);
    width: var(--LiveDataInspectorWidth);

    > div {
        cursor: col-resize;
        height: 100%;
        pointer-events: auto;
        transform: translateX(-50%);
        width: 16px;
    }

    > div::after {
        background: #e0e0e0;
        content: '';
        height: 12px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%) translateX(0.5px);
        width: 1px;
    }

    > div::before {
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        content: '';
        height: 20px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%) translateX(0.5px);
        width: 8px;
    }

    @media (min-width: 668px) {
        display: block;
    }
`

export default ResizeHandle
