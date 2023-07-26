import { ApolloClient, InMemoryCache } from '@apollo/client'
import { useEffect, useState } from 'react'
import { truncate } from '~/shared/utils/text'
import { useWalletAccount } from '~/shared/stores/wallet'
import { errorToast } from '~/utils/toast'
import {
    GetEnsDomainsForAccountQuery,
    GetEnsDomainsForAccountDocument,
    GetEnsDomainsForAccountQueryVariables,
} from '~/generated/gql/ens'

export const ADD_ENS_DOMAIN_VALUE = '::ens/add_domain'

const apolloClient = new ApolloClient({
    uri:
        process.env.ENS_GRAPH_SCHEMA_PATH ||
        'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
    cache: new InMemoryCache(),
})

async function fetchDomains(account: string | undefined): Promise<string[]> {
    if (!account) {
        return []
    }

    try {
        const { data = { domains: [] } } = await apolloClient.query<
            GetEnsDomainsForAccountQuery,
            GetEnsDomainsForAccountQueryVariables
        >({
            query: GetEnsDomainsForAccountDocument,
            variables: {
                account: account.toLowerCase(),
            },
        })

        return (data.domains.map(({ name }) => name).filter(Boolean) as string[]).sort()
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
