import { useEffect, useState } from 'react'
import { ConfigFromChain, getConfigFromChain } from '~/getters/getConfigFromChain'
import { errorToast } from '~/utils/toast'

export const useConfigFromChain = (): ConfigFromChain | Record<string, undefined> => {
    const [config, setConfig] = useState({})

    useEffect(() => {
        getConfigFromChain()
            .then(setConfig)
            .catch((e) => {
                console.warn('Could not load config from chain', e)

                errorToast({ title: 'Could not load config from chain' })
            })
    }, [])

    return config
}
