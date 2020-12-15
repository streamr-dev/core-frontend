import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { MEDIUM } from '$shared/utils/styled'

const Columns = styled.div`
    border: 1px solid #efefef;
    border-width: 1px 0;
    font-weight: ${MEDIUM};
    position: relative;
`

const INSPECTOR_WIDTH = 504

const UnstyledHandle = ({ onDrag, onInit, onReset, ...props }) => {
    const xRef = useRef(INSPECTOR_WIDTH)

    const onMouseDown = ({ clientX: x0 }) => {
        const getX = (e) => (
            Math.max(INSPECTOR_WIDTH, xRef.current + (x0 - e.clientX))
        )

        const onMove = (e) => {
            e.preventDefault()

            if (typeof onDrag === 'function') {
                onDrag(getX(e))
            }
        }

        const onUp = (e) => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)

            xRef.current = getX(e)
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }

    const onDblClick = () => {
        onDrag(INSPECTOR_WIDTH)
        xRef.current = INSPECTOR_WIDTH
    }

    return (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
            {...props}
            onDoubleClick={onDblClick}
            onMouseDown={onMouseDown}
        />
    )
}

const Handle = styled(UnstyledHandle)`
    top: 0;
    cursor: col-resize;
    height: 54px;
    right: var(--LiveDataInspectorWidth);
    position: absolute;
    transform: translateX(50%);
    width: 16px;
`

const Lhs = styled.div`
    align-items: center;
    display: grid;
    grid-template-columns: 360px 1fr;
    height: 54px; /* 56 - 2 (top/bottom border) */
    margin-left: calc((100vw - var(--LiveDataInspectorWidth) - 1108px) / 2);
    padding-right: var(--LiveDataInspectorWidth);
`

const Rhs = styled.div`
    align-items: center;
    background: #fafafa;
    border-left: 1px solid #efefef;
    display: flex;
    height: 100%;
    padding-left: 40px;
    position: absolute;
    right: 0;
    top: 0;
    width: var(--LiveDataInspectorWidth);
`

Object.assign(Columns, {
    Handle,
    Lhs,
    Rhs,
})

export default Columns
