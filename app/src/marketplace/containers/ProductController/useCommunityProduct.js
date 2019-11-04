// @flow

import { useSelector } from 'react-redux'
import { selectCommunity } from '$mp/modules/communityProduct/selectors'

export default function useCommunityProduct() {
    const community = useSelector(selectCommunity)

    return community
}
