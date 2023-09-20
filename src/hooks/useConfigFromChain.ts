import { useEffect, useState } from 'react'
import { ConfigFromChain, getConfigFromChain } from '~/getters/getConfigFromChain'
import { errorToast } from '~/utils/toast'

export const useConfigFromChain = (): Partial<ConfigFromChain> => {
    // Partial<ConfigFromChain> just to mark that it can be an empty object

    const [config, setConfig] = useState({})
    useEffect(() => {
        getConfigFromChain()
            .then(setConfig)
            .catch(() => {
                errorToast('Could not load config from chain')
            })
    }, [])
    return config
}
