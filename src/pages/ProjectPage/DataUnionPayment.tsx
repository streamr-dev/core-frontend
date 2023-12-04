import { ReactNode } from 'react'
import { useProject } from '~/stores/projectDraft'
import { SalePoint } from '~/shared/types'

export default function DataUnionPayment({
    children,
}: {
    children?: (salePoint: SalePoint | undefined) => ReactNode
}) {
    const { salePoints = {} } = useProject({ hot: true }) || {}

    const salePoint = Object.values(salePoints).find((salePoint) => salePoint?.enabled)

    return children?.(salePoint) || null
}
