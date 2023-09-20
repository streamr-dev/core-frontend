import React, { ReactNode } from 'react'
import { useProject } from '~/shared/stores/projectEditor'
import { SalePoint } from '~/shared/types'

export default function DataUnionPayment({
    children,
}: {
    children?: (salePoint: SalePoint | undefined) => ReactNode
}) {
    const { salePoints } = useProject({ hot: true })

    const salePoint = Object.values(salePoints).find((salePoint) => salePoint?.enabled)

    return children?.(salePoint) || null
}
