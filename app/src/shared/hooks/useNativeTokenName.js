import { useSelector } from 'react-redux'

import { selectEthereumNetworkId } from '$mp/modules/global/selectors'

const useNativeTokenName = () => {
    const currentNetworkId = useSelector(selectEthereumNetworkId) || ''
    let nativeTokenName = 'Ether'

    if (currentNetworkId.toString() === '137') {
        nativeTokenName = 'MATIC'
    } else if (currentNetworkId.toString() === '100') {
        nativeTokenName = 'xDai'
    }

    return nativeTokenName
}

export default useNativeTokenName
