import { useEffect, useState } from 'react'
import { truncate } from '~/shared/utils/text'
import { useWalletAccount } from '~/shared/stores/wallet'
import { getENSDomainsForWallet } from '~/getters'

export const ADD_ENS_DOMAIN_VALUE = '::ens/add_domain'

interface Option {
    value: string
    label: string
}

export interface OptionGroup {
    label: string
    options: Option[]
}

/**
 * @todo Refactor using `useQuery` and bake `fetchDomains` into it (it hasn't been used anywhere else).
 * @returns an array of `OptionGroup` items, or `undefined` if entries are being loaded.
 */
export default function useStreamOwnerOptionGroups(): OptionGroup[] | undefined {
    const [groups, setGroups] = useState<OptionGroup[]>()

    const account = useWalletAccount()

    useEffect(() => {
        let mounted = true

        setGroups(undefined)

        async function fn() {
            if (!account) {
                return void setGroups([])
            }

            const domains = await getENSDomainsForWallet(account)

            if (!mounted) {
                return
            }

            const ensOptions: Option[] = []

            domains.forEach((value) => {
                ensOptions.push({
                    value,
                    label: value,
                })
            })

            ensOptions.push({
                value: ADD_ENS_DOMAIN_VALUE,
                label: 'Add new domain',
            })

            setGroups([
                {
                    label: 'ENS domains',
                    options: ensOptions,
                },
                {
                    label: 'Eth Account',
                    options: [
                        {
                            value: account,
                            label: truncate(account),
                        },
                    ],
                },
            ])
        }

        fn()

        return () => {
            mounted = false
        }
    }, [account])

    return groups
}
