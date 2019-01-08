// @flow

import React from 'react'
import { withRouter } from 'react-router-dom'

type Props = {
    onChange: () => void,
    location: {
        pathname: string,
    },
}

class RouteWatcher extends React.Component<Props> {
    componentDidUpdate({ location: { pathname: prevPathname } }: Props) {
        const { location: { pathname }, onChange } = this.props
        if (pathname !== prevPathname) {
            onChange()
        }
    }

    render() {
        return null
    }
}

export default withRouter(RouteWatcher)
