// @flow

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getStreams } from '$mp/modules/streams/actions'
import { selectStreams, selectFetchingStreams, selectStreamsError } from '$mp/modules/streams/selectors'

type Props = {
    children: Function,
}

const AvailableStreams = ({ children }: Props) => {
    if (!children || typeof children !== 'function') {
        throw new Error('children needs to be a function!')
    }

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getStreams())
    }, [dispatch])

    const streams = useSelector(selectStreams)
    const error = useSelector(selectStreamsError)
    const fetching = useSelector(selectFetchingStreams)

    return children ? children({
        fetching,
        error,
        streams,
    }) : null
}

export default AvailableStreams
