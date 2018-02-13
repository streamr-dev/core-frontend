// @flow

import React, {Component} from 'react'
import Helmet from 'react-helmet'
import Nav from './components/Nav'
import {Container} from 'reactstrap'

import 'bootstrap/dist/css/bootstrap.css'
import './commonStyles.pcss'

import type {Node} from 'react'

type Props = {
    children: Node
}

type State = {}

export default class App extends Component<Props, State> {
    render() {
        return (
            <Container>
                <Helmet>
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                </Helmet>
                <Nav/>
                {this.props.children}
            </Container>
        )
    }
}
