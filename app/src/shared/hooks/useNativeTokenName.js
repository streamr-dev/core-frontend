import { useSelector } from 'react-redux'
import { selectEthereumNetworkId } from '$mp/modules/global/selectors'

export default function useNativeTokenName() {
    const networkId = useSelector(selectEthereumNetworkId)

    switch (`${networkId}`) {
        case '137':
        case '8997':
            return 'MATIC'
        case '100':
            return 'xDai'
        default:
            return 'Ether'
    }
}
