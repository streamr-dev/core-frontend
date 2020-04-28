import { useDispatch } from 'react-redux'
import { push } from 'connected-react-router'
import useIsMounted from '$shared/hooks/useIsMounted'
import useOnMount from '$shared/hooks/useOnMount'
import routes from '$routes'
import useFailure from '$shared/hooks/useFailure'
import { createStream } from '$userpages/modules/userPageStreams/actions'

const NewStreamPage = () => {
    const dispatch = useDispatch()

    const fail = useFailure()

    const isMounted = useIsMounted()

    useOnMount(async () => {
        try {
            const id = await dispatch(createStream({
                name: 'Untitled Stream',
                description: '',
            }))

            if (isMounted()) {
                dispatch(push(routes.stream({
                    id,
                })))
            }
        } catch (e) {
            fail(e)
        }
    })

    return null
}

export default NewStreamPage
