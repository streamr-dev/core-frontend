// @flow

import React, { type ComponentType } from 'react'
import Context from '$auth/contexts/Session'

export default (WrappedComponent: ComponentType<any>) => (props: {}) => (
    <Context.Consumer>
        {({ token, setSessionToken }) => (
            <WrappedComponent {...props} token={token} setSessionToken={setSessionToken} />
        )}
    </Context.Consumer>
)
