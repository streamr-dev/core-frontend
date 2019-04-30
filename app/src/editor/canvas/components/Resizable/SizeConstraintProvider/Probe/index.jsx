// @flow

import React, { useRef, useEffect, useContext } from 'react'
import { type Ref } from '$shared/flowtype/common-types'
import { Context as SizeConstaintContext } from '..'
import styles from './probe.pcss'

type Props = {
    group: string,
    height?: 'auto' | number,
    uid?: string,
    width?: 'auto' | number,
}

const Probe = ({ group, uid: uidProp, width, height }: Props) => {
    const uid = uidProp || group
    const ref: Ref<HTMLDivElement> = useRef(null)
    const { setWidth, setHeight, probeRefreshCount } = useContext(SizeConstaintContext)

    useEffect(() => {
        const { current } = ref

        if (!current) {
            return
        }

        const { width: w, height: h } = current.getBoundingClientRect()

        if (width != null) {
            setWidth(group, uid, width !== 'auto' ? width : w)
        }

        if (height != null) {
            setHeight(group, uid, height !== 'auto' ? height : h)
        }
    }, [
        group,
        uid,
        width,
        setWidth,
        height,
        setHeight,
        // We have to recalculate size when the `probeRefreshCount`.
        probeRefreshCount,
    ])

    return <div ref={ref} className={styles.root} />
}

// $FlowFixMe – again, memo's annotation issue
export default React.memo(Probe)
