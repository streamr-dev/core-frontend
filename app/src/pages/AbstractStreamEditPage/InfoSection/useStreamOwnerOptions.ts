import { useEffect, useState } from 'react'
import { post } from '$shared/utils/api'
import InterruptionError from '$shared/errors/InterruptionError'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import { truncate } from '$shared/utils/text'
import { useWalletAccount } from '$app/src/shared/stores/wallet'

export const ADD_ENS_DOMAIN_VALUE = '::ens/add_domain'

export default function useStreamOwnerOptions() {
    const [domains, setDomains] = useState([])
    const [options, setOptions] = useState([])
    const account = useWalletAccount()

    useEffect(() => {
        setDomains(undefined)
        let aborted = false

        async function fn() {
            try {
                const {
                    data: { domains: newDomains },
                } = account
                    ? await post({
                        url: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
                        data: {
                            query: `
                                query {
                                    domains(
                                        where: { owner_in: ["${account.toLowerCase()}"]}
                                        orderBy: name
                                    ) {
                                        id
                                        name
                                        labelName
                                        labelhash
                                    }
                                }
                            `,
                        },
                    })
                    : {
                        data: {
                            domains: [],
                        },
                    }

                if (aborted) {
                    throw new InterruptionError()
                }

                if (!Array.isArray(newDomains)) {
                    throw new Error('Invalid collection')
                }

                setDomains(newDomains)
            } catch (e) {
                if (e instanceof InterruptionError) {
                    return
                }

                if (!aborted) {
                    setDomains([])
                }

                console.warn(e)
                Notification.push({
                    title: 'Failed to load ENS domains',
                    icon: NotificationIcon.ERROR,
                })
            }
        }

        fn()
        return () => {
            aborted = true
        }
    }, [account])

    useEffect(() => {
        if (!account) {
            setOptions([])
            return
        }

        const ensOptions = []

        if (domains) {
            domains.forEach(({ name: value }) => {
                ensOptions.push({
                    value,
                    label: value,
                })
            })
        }

        ensOptions.push({
            value: ADD_ENS_DOMAIN_VALUE,
            label: 'Add new domain',
        })
        const ethAccountOptions = []

        if (account) {
            ethAccountOptions.push({
                value: account,
                label: truncate(account),
            })
        }

        setOptions([
            {
                label: 'ENS Domains',
                options: ensOptions,
            },
            {
                label: 'Eth Account',
                options: ethAccountOptions,
            },
        ])
    }, [account, domains])

    return options
}
