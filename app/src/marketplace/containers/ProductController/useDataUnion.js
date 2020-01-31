// @flow

import { useSelector } from 'react-redux'
import { selectDataUnion } from '$mp/modules/dataUnion/selectors'

export default function useDataUnion() {
    const dataUnion = useSelector(selectDataUnion)

    return dataUnion
}
