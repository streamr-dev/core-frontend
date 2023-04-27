import { useEffect, useState } from 'react'
import { z } from 'zod'
import { post } from '$shared/utils/api'
import { truncate } from '$shared/utils/text'
import { useWalletAccount } from '$app/src/shared/stores/wallet'
import { errorToast } from '$app/src/utils/toast'

export const ADD_ENS_DOMAIN_VALUE = '::ens/add_domain'

const EnsGraphResponse = z.object({
    data: z.object({
        domains: z.array(
            z.object({
                name: z.string(),
            }),
        ),
    }),
})

async function fetchDomains(account: string | undefined): Promise<string[]> {
    if (!account) {
        return []
    }

    try {
        const resp = await post({
            url: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
            data: {
                query: `
                query {
                    domains(
                        where: { owner_in: ["${account.toLowerCase()}"]}
                        orderBy: name
                    ) {
                        name
                    }
                }
            `,
            },
        })

        return EnsGraphResponse.parse(resp)
            .data.domains.map(({ name }) => name)
            .sort()
    } catch (e) {
        console.warn('Failed to load ENS domains', e)

        errorToast({
            title: 'Failed to load ENS domains',
        })

        return []
    }
}

interface Option {
    value: string
    label: string
}

export interface OptionGroup {
    label: string
    options: Option[]
}

/**
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

            const domains = await fetchDomains(account)

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
