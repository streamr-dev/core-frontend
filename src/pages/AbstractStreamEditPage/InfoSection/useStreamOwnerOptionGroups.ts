import { useEffect, useState } from 'react'
import { isAddress } from 'web3-validator'
import { getENSDomainsForWallet } from '~/getters'
import { useWalletAccount } from '~/shared/stores/wallet'
import { truncate } from '~/shared/utils/text'

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
export default function useStreamOwnerOptionGroups(
    domain: string,
): OptionGroup[] | undefined {
    const [groups, setGroups] = useState<OptionGroup[]>()

    const account = useWalletAccount()

    useEffect(() => {
        let mounted = true

        setGroups(undefined)

        async function fn() {
            if (!account) {
                return void setGroups([])
            }

            const domains = await (async () => {
                try {
                    return await getENSDomainsForWallet(account)
                } catch (e) {
                    return []
                }
            })()

            if (!mounted) {
                return
            }

            const ensDomainGiven = /\.eth$/.test(domain)

            const ensOptions: Option[] = []

            if (ensDomainGiven && domains.indexOf(domain) === -1) {
                domains.push(domain)
            }

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

            const addrOptions: Option[] = [
                {
                    value: account,
                    label: truncate(account),
                },
            ]

            if (isAddress(domain) && domain.toLowerCase() !== account.toLowerCase()) {
                addrOptions.push({
                    value: domain,
                    label: truncate(domain),
                })
            }

            setGroups([
                {
                    label: 'ENS domains',
                    options: ensOptions,
                },
                {
                    label: 'Eth Account',
                    options: addrOptions,
                },
            ])
        }

        fn()

        return () => {
            mounted = false
        }
    }, [account, domain])

    return groups
}
