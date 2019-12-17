// @flow

import React, { useState } from 'react'
import { connect } from 'react-redux'

import { post } from '$shared/utils/api'
import useIsMounted from '$shared/hooks/useIsMounted'
import useOnMount from '$shared/hooks/useOnMount'
import { logout as logoutAction } from '$shared/modules/user/actions'
import ErrorPageView from '$mp/components/ErrorPageView'
import routes from '$routes'

export type DispatchProps = {
    logout: () => void,
}

type Props = DispatchProps & {}

const LogoutPage = ({ logout }: Props) => {
    const [error, setError] = useState(null)

    const isMounted = useIsMounted()

    useOnMount(() => {
        post({
            url: routes.externalLogout(),
        })
            .then(
                () => {
                    if (isMounted()) {
                        logout()
                    }
                },
                (e) => {
                    if (isMounted()) {
                        setError(e)
                    }
                },
            )
    })

    return !!error && (
        <ErrorPageView />
    )
}

export { LogoutPage }

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    logout: () => dispatch(logoutAction()),
})

export default connect(null, mapDispatchToProps)(LogoutPage)
