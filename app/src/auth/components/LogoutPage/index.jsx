// @flow

import React, { useState, useContext } from 'react'
import { connect } from 'react-redux'

import { post } from '$shared/utils/api'
import useIsMountedRef from '$shared/utils/useIsMountedRef'
import useOnMount from '$shared/utils/useOnMount'
import SessionContext from '../../contexts/Session'
import { logout as logoutAction } from '$shared/modules/user/actions'
import ErrorPageView from '$mp/components/ErrorPageView'
import routes from '$routes'

export type DispatchProps = {
    logout: () => void,
}

type Props = DispatchProps & {}

const LogoutPage = ({ logout }: Props) => {
    const [error, setError] = useState(null)
    const { setSessionToken } = useContext(SessionContext)

    const mountedRef = useIsMountedRef()

    useOnMount(() => {
        post(routes.externalLogout())
            .then(
                () => {
                    if (setSessionToken && mountedRef.current) {
                        logout()
                        setSessionToken(null)
                    }
                },
                (e) => {
                    if (mountedRef.current) {
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
