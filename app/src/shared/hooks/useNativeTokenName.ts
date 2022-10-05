import { useSelector } from 'react-redux'
import { selectEthereumNetworkId } from '$mp/modules/global/selectors'
import getNativeTokenName from '$shared/utils/nativeToken'
export default function useNativeTokenName() {
    const networkId = useSelector(selectEthereumNetworkId)
    return getNativeTokenName(networkId)
}
