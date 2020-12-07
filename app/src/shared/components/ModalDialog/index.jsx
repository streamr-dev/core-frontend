// @flow

import React from 'react'
import styled from 'styled-components'
import type { Node } from 'react'
import ReactModal2 from 'react-modal2'

import BodyClass, { NO_SCROLL } from '$shared/components/BodyClass'
import './accessibility'

export type Props = {
    fullpage?: boolean,
    onClose: () => void,
    className?: string,
    backdropClassName?: string,
}

export type InternalProps = Props & {
    children: Node,
}

const Fullpage = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(239, 239, 239, 0.98);
    z-index: 1;
    overflow-y: scroll;
`

const ModalDialog = ({
    onClose,
    children,
    className,
    backdropClassName,
    fullpage,
}: InternalProps) => (
    <ReactModal2
        onClose={onClose}
        backdropClassName={backdropClassName}
        modalClassName={className}
    >
        <BodyClass className={NO_SCROLL} />
        {fullpage ? <Fullpage>{children}</Fullpage> : children}
    </ReactModal2>
)

export default ModalDialog
