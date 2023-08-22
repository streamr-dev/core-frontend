import React, { ReactNode } from 'react'
import styled, { createGlobalStyle, css } from 'styled-components'
import ReactModal2 from 'react-modal2'
import './accessibility'
export type Props = {
    fullpage?: boolean
    onClose: () => void
    className?: string
    backdropClassName?: string
    noScroll?: boolean
    closeOnEsc?: boolean
    closeOnBackdropClick?: boolean
}
export type InternalProps = Props & {
    children: ReactNode
}
const Fullpage = styled.div<{ noScroll: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(239, 239, 239, 0.98);
    z-index: 1;

    ${({ noScroll }) =>
        !noScroll &&
        css`
            overflow-y: scroll;
        `}
`

const NoScrollStyles = createGlobalStyle`
    body {
        overflow: hidden !important;
        overflow-y: hidden !important;
        overflow-x: hidden !important;
    }
`

const ModalDialog = ({
    onClose,
    children,
    className,
    backdropClassName,
    fullpage,
    noScroll = false,
    ...otherProps
}: InternalProps) => (
    <ReactModal2
        onClose={onClose}
        backdropClassName={backdropClassName}
        modalClassName={className}
        {...otherProps}
    >
        <NoScrollStyles />
        {fullpage ? <Fullpage noScroll={noScroll}>{children}</Fullpage> : children}
    </ReactModal2>
)

export default ModalDialog
