// @flow

import { useSelector } from 'react-redux'
import { selectProduct } from '$mp/modules/product/selectors'

export default function useProduct() {
    const product = useSelector(selectProduct)

    return product
}
