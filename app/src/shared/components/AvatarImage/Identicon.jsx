import React from 'react'
import styled from 'styled-components'
import ReactIdenticon from 'react-identicons'

const UnstyledIdenticon = ({ id, size, ...props }) => (
    <div {...props}>
        <svg
            viewBox="0 0 1 1"
            xmlns="http://www.w3.org/2000/svg"
        />
        <ReactIdenticon
            string={id}
            size={size}
        />
    </div>
)

const Identicon = styled(UnstyledIdenticon)`
    position: relative;

    .identicon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 50% !important;
        height: 50% !important;
    }
`

Identicon.defaultProps = {
    size: 80,
}

export default Identicon
