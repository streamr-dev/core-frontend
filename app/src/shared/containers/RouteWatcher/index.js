// @flow

import React from 'react'
import { withRouter } from 'react-router-dom'

type Props = {
    onChange: (urlHash?: string) => void,
    location: {
        pathname: string,
        hash: string,
    },
}

class RouteWatcher extends React.Component<Props> {
    componentDidMount() {
        this.checkIfPathChange('')
    }

    componentDidUpdate({ location: { pathname: prevPathname } }: Props) {
        this.checkIfPathChange(prevPathname)
    }

    checkIfPathChange(prevPathname) {
        const { location: { pathname, hash }, onChange } = this.props
        if (pathname !== prevPathname) {
            onChange(hash)
        }
    }

    render() {
        return null
    }
}

export default withRouter(RouteWatcher)
