// @flow

import { useSelector } from 'react-redux'
import { selectContractProduct } from '$mp/modules/contractProduct/selectors'

export default function useContractProduct() {
    const product = useSelector(selectContractProduct)

    return product
}
