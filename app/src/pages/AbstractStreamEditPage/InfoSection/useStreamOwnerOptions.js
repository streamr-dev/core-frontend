import { useEffect, useState } from 'react'
import { post } from '$shared/utils/api'
import InterruptionError from '$shared/errors/InterruptionError'
import Notification from '$shared/utils/Notification'
import { NotificationIcon } from '$shared/utils/constants'
import useClientAddress from '$shared/hooks/useClientAddress'
import { truncate } from '$shared/utils/text'

export const ADD_ENS_DOMAIN_VALUE = '::ens/add_domain'

export default function useStreamOwnerOptions() {
    const [domains, setDomains] = useState()

    const [options, setOptions] = useState()

    const user = useClientAddress()

    useEffect(() => {
        setDomains(undefined)

        let aborted = false

        async function fn() {
            try {
                const { data: { domains: newDomains } } = user
                    ? await post({
                        url: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens',
                        useAuthorization: false,
                        data: {
                            query: `
                                query {
                                    domains(
                                        where: { owner_in: ["${user}"]}
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
    }, [user])

    useEffect(() => {
        if (!user) {
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

        if (user) {
            ethAccountOptions.push({
                value: user,
                label: truncate(user),
            })
        }

        setOptions([{
            label: 'ENS Domains',
            options: ensOptions,
        }, {
            label: 'Eth Account',
            options: ethAccountOptions,
        }])
    }, [user, domains])

    return options
}
