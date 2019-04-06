// @flow

import React, { useRef, useEffect } from 'react'
import { type Ref } from '$shared/flowtype/common-types'
import styles from './measurer.pcss'

type Props = {
    children: string,
    onResult: (number) => void,
}

const Measurer = ({ children, onResult }: Props) => {
    const ref: Ref<HTMLSpanElement> = useRef(null)

    useEffect(() => {
        const { current: span } = ref

        if (span) {
            onResult(span.offsetWidth)
        }
    })

    return (
        <span
            className={styles.root}
            ref={ref}
        >
            {children}
        </span>
    )
}

export default Measurer
