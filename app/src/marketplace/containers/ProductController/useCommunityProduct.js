// @flow

import { useSelector } from 'react-redux'
import { selectDataUnion } from '$mp/modules/dataUnion/selectors'

export default function useCommunityProduct() {
    const community = useSelector(selectDataUnion)

    return community
}
