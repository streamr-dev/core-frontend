import { useHistory } from 'react-router-dom'
import useIsMounted from '$shared/hooks/useIsMounted'
import { useAuthController } from '../auth/hooks/useAuthController'
import useOnMount from '$shared/hooks/useOnMount'
import routes from '$routes'

export default function LogoutPage() {
    const isMounted = useIsMounted()

    const history = useHistory()

    const { removeAuthSession } = useAuthController()

    useOnMount(async () => {
        if (isMounted()) {
            removeAuthSession()
            history.push(routes.root())
        }
    })
    return null
}
