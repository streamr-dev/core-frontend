import { useEffect, useState } from 'react'
import { getOperatorByOwnerAddress } from '~/getters'
import { OperatorParser, ParsedOperator } from '~/parsers/OperatorParser'

export function useOperatorForWallet(address = '') {
    const [operator, setOperator] = useState<ParsedOperator | null | undefined>()

    const addr = address.toLowerCase()

    useEffect(() => {
        let mounted = true

        if (!addr) {
            return void setOperator(null)
        }

        setOperator(undefined)

        setTimeout(async () => {
            const operator = await getOperatorByOwnerAddress(addr)

            if (mounted) {
                setOperator(operator ? OperatorParser.parse(operator) : null)
            }
        })

        return () => {
            mounted = false
        }
    }, [addr])

    return operator
}

export function useOperatorStatsForWallet(address = '') {
    const operator = useOperatorForWallet(address)

    if (!operator) {
        return operator
    }

    const { delegatorCount: numOfDelegators, poolValue: value, stakes } = operator

    return {
        numOfDelegators,
        numOfSponsorships: stakes.length,
        value,
    }
}
