import React, { Fragment } from 'react'

export default function Surround({ head = null, children, tail = null }) {
    return (
        <Fragment>
            {head}
            {children}
            {tail}
        </Fragment>
    )
}
