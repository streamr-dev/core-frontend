// @flow

import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

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

    useEffect(() => {
        axios
            .post(routes.externalLogout())
            .then(
                () => {
                    if (setSessionToken) {
                        logout()
                        setSessionToken(null)
                    }
                },
                setError,
            )
    }, [])

    return !!error && (
        <ErrorPageView />
    )
}

export { LogoutPage }

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    logout: () => dispatch(logoutAction()),
})

export default connect(null, mapDispatchToProps)(LogoutPage)
