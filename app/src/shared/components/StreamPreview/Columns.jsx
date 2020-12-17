import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Translate } from 'react-redux-i18n'
import { MEDIUM } from '$shared/utils/styled'
import Layout from './Layout'
import Cell from './Cell'

const Lhs = styled.div`
    align-items: center;
    display: grid;
    grid-template-columns: auto minmax(auto, 360px) 1fr;
    height: 54px;
    min-width: 420px;
    width: calc(100vw - var(--LiveDataInspectorWidth, 504px));
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
    max-width: calc(100vw - 428px + 1px);
    width: var(--LiveDataInspectorWidth, 504px);
`

const INSPECTOR_WIDTH = 504

const UnstyledHandle = (props) => {
    const ref = useRef(null)

    const [x, drag] = useState(INSPECTOR_WIDTH)

    const onMouseDown = ({ clientX: x0 }) => {
        const { current: el } = ref

        const width = el.offsetWidth

        const onMove = (e) => {
            e.preventDefault()
            drag(Math.max(INSPECTOR_WIDTH, width + (x0 - e.clientX)))
        }

        const onUp = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }

    const onDblClick = () => {
        drag(INSPECTOR_WIDTH)
    }

    return (
        <div {...props} ref={ref}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
                onDoubleClick={onDblClick}
                onMouseDown={onMouseDown}
            />
            <Layout inspectorWidth={x} />
        </div>
    )
}

const Handle = styled(UnstyledHandle)`
    top: 0;
    height: 54px;
    right: 0;
    pointer-events: none;
    position: absolute;
    max-width: calc(100vw - 428px + 1px);
    width: var(--LiveDataInspectorWidth, 504px);

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
        height: 14px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%) translateX(0.5px);
        width: 1px;
    }

    > div::before {
        background: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 1px;
        content: '';
        height: 20px;
        left: 50%;
        position: absolute;
        top: 50%;
        transform: translate(-50%, -50%) translateX(0.5px);
        width: 6px;
    }
`

const Inner = styled.div`
    padding-right: 16px;
    min-width: 0;
`

const UnstyledColumns = ({ className }) => (
    <div className={className}>
        <Lhs>
            <Layout.Pusher />
            <Translate tag={Cell} value="streamLivePreview.timestamp" />
            <Inner>
                <Translate tag={Cell} value="streamLivePreview.data" />
            </Inner>
        </Lhs>
        <Rhs>
            <Translate tag={Cell} value="streamLivePreview.inspector" />
        </Rhs>
        <Handle />
    </div>
)

const Columns = styled(UnstyledColumns)`
    border: 1px solid #efefef;
    border-width: 1px 0;
    font-weight: ${MEDIUM};
    position: relative;
`

Object.assign(Columns, {
    Handle,
    Lhs,
    Rhs,
})

export default Columns
