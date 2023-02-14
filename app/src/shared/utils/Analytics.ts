/**
 * Configure analytics data from app state.
 */
import * as Sentry from '@sentry/browser'
import {useAuthController} from "$auth/hooks/useAuthController"

function Analytics(): null {
    const {currentAuthSession} = useAuthController()
    if (currentAuthSession.address) {
        Sentry.configureScope((scope) => {
            scope.setUser({id: currentAuthSession.address})
        })
    }
    return null
}

export default Analytics
