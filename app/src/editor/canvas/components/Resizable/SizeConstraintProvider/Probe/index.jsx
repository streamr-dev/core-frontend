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

        const { width: w, height: h } = current.getBoundingClientRect()

        setDimensions({
            ...(width != null ? {
                width: [group, uid, width !== 'auto' ? width : w],
            } : {}),
            ...(height != null ? {
                height: [group, uid, height !== 'auto' ? height : h],
            } : {}),
        })
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
