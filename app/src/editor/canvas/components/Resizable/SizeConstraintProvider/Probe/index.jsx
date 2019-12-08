// @flow

import React, { useRef, useEffect, useContext } from 'react'
import cx from 'classnames'
import { type Ref } from '$shared/flowtype/common-types'
import { Context as SizeConstaintContext } from '..'
import styles from './probe.pcss'

const DEBUG: boolean = false

type Props = {
    group: string,
    height?: 'auto' | number,
    uid?: string,
    width?: 'auto' | number,
}

const Probe = ({ group, uid: uidProp, width, height }: Props) => {
    const uid = uidProp || group
    const ref: Ref<HTMLDivElement> = useRef(null)
    const { setDimensions, probeRefreshCount } = useContext(SizeConstaintContext)

    useEffect(() => {
        const { current } = ref

        if (!current) {
            return
        }

        // use client{Width,Height} which ignore css transformation
        // which we want so it reports original px values rather than camera-scaled px values
        const { clientWidth: w, clientHeight: h } = current

        const dim = {}

        if (width != null) {
            dim.width = [group, uid, width !== 'auto' ? width : w]
        }

        if (height != null) {
            dim.height = [group, uid, height !== 'auto' ? height : h]
        }

        setDimensions(dim)
    }, [
        group,
        height,
        setDimensions,
        uid,
        width,
        // We have to recalculate size when the `probeRefreshCount`.
        probeRefreshCount,
    ])

    return (
        <div
            ref={ref}
            className={cx(styles.root, {
                [styles.debug]: DEBUG,
            })}
        />
    )
}

// $FlowFixMe – again, memo's annotation issue
export default React.memo(Probe)
