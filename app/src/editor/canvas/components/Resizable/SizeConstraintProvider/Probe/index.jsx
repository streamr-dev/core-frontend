// @flow

import React, { useRef, useEffect, useContext } from 'react'
import { type Ref } from '$shared/flowtype/common-types'
import { Context as SizeConstaintContext } from '..'
import styles from './probe.pcss'

type Props = {
    group: string,
    height?: 'auto' | number,
    id?: string,
    width?: 'auto' | number,
}

const Probe = ({ group, id: idProp, width, height }: Props) => {
    const id = idProp || group
    const ref: Ref<HTMLDivElement> = useRef(null)
    const { setWidth, setHeight, probeRefreshCount } = useContext(SizeConstaintContext)

    useEffect(() => {
        const { current } = ref

        if (!current) {
            return
        }

        const { width: w, height: h } = current.getBoundingClientRect()

        if (width != null) {
            setWidth(group, id, width !== 'auto' ? width : w)
        }

        if (height != null) {
            setHeight(group, id, height !== 'auto' ? height : h)
        }
    }, [
        group,
        id,
        width,
        setWidth,
        height,
        setHeight,
        // We have to recalculate size when the `probeRefreshCount`.
        probeRefreshCount,
    ])

    return <div ref={ref} className={styles.root} />
}

export default Probe

