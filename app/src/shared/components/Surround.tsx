import React, { ReactNode } from 'react'

interface Props {
    children?: ReactNode
    head?: string
    tail?: string
}

export default function Surround({ head, children, tail }: Props) {
    return (
        <>
            {head}
            {children}
            {tail}
        </>
    )
}
