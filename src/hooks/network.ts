import { useState } from 'react'

/**
 * @todo Not really implemented. It's a placeholder. We're waiting for `ETH-615`.
 * @see https://linear.app/streamr/issue/ETH-615/create-networkstatistics-subgraph-entity
 */
export function useGlobalNetworkStats() {
    return useState({ totalStake: 0, numOfSponsorships: 0, numOfOperators: 0 })[0]
}
