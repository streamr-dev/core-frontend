import { ReactNode } from 'react'
import { ProjectDraft } from '~/stores/projectDraft'
import { SalePoint } from '~/shared/types'

export default function DataUnionPayment({
    children,
}: {
    children?: (salePoint: SalePoint | undefined) => ReactNode
}) {
    const { salePoints = {} } = ProjectDraft.useEntity({ hot: true }) || {}

    const salePoint = Object.values(salePoints).find((salePoint) => salePoint?.enabled)

    return children?.(salePoint) || null
}
