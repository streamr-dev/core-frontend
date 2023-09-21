import { useEffect, useState } from 'react'
import { ConfigFromChain, getConfigFromChain } from '~/getters/getConfigFromChain'
import { errorToast } from '~/utils/toast'

export const useConfigFromChain = (): ConfigFromChain | Record<string, never> => {
    // Partial<ConfigFromChain> just to mark that it can be an empty object

    const [config, setConfig] = useState({})
    useEffect(() => {
        getConfigFromChain()
            .then(setConfig)
            .catch((e) => {
                console.warn(e)
                errorToast('Could not load config from chain')
            })
    }, [])
    return config
}
