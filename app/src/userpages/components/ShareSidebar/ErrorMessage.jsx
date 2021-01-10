import React, { useMemo, useRef } from 'react'
import styled, { css } from 'styled-components'
import { MEDIUM } from '$shared/utils/styled'
import Sidebar from '$shared/components/Sidebar'
import useMeasure from '$shared/hooks/useMeasure'

const ErrorMessage = styled.div`
    background-color: #fff4f5;
    color: #ff0f2d;
    font-size: 14px;
    line-height: 20px;

    strong {
        font-weight: ${MEDIUM};
    }
`

const UnstyledWrapper = ({ visible, className, children }) => {
    const [bind, { height }] = useMeasure()

    const childrenRef = useRef(children)

    if (React.Children.toArray(children).filter(Boolean).length) {
        childrenRef.current = children
    }

    const style = useMemo(() => (
        visible ? {
            height,
        } : {
            transitionDelay: '0.5s',
        }
    ), [visible, height])

    return (
        <div className={className} style={style}>
            <div {...bind}>
                <Sidebar.Container as={ErrorMessage}>
                    {childrenRef.current}
                </Sidebar.Container>
            </div>
        </div>
    )
}

const Wrapper = styled(UnstyledWrapper)`
    flex-shrink: 0;
    height: 0;
    overflow: hidden;
    position: relative;
    transition: 200ms height;
`

const Overlay = styled.div`
    background: white;
    bottom: 0;
    content: ' ';
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity 400ms ease;
    z-index: 0;

    ${({ visible }) => !!visible && css`
        opacity: 0.5;
        pointer-events: auto;
    `}
`

Object.assign(ErrorMessage, {
    Overlay,
    Wrapper,
})

export default ErrorMessage
