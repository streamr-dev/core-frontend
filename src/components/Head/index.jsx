// @flow

import React, { Component } from 'react'
import Helmet from 'react-helmet'

export default class Head extends Component<{}> {
    render() {
        return (
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            </Helmet>
        )
    }
}
