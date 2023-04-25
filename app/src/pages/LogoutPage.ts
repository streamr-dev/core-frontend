import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { errorToast } from '$utils/toast'
import routes from '$routes'

export default function LogoutPage() {
    const history = useHistory()

    useEffect(() => {
        errorToast({
            title: 'Not implemented',
        })

        history.push(routes.root())
    }, [history])

    return null
}
