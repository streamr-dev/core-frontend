// @flow

import React, { Component } from 'react'

import { Col, Row } from 'reactstrap'

import Layout from '../Layout'
import ProfileSettings from './ProfileSettings'
import APICredentials from './APICredentials'
import IntegrationKeyHandler from './IntegrationKeyHandler'
import IdentityHandler from './IdentityHandler/index'

export default class ProfilePage extends Component<{}> {
    render() {
        return (
            <Layout>
                <div className="container">
                    <Row>
                        <Col xs={12} sm={6}>
                            <ProfileSettings />
                        </Col>
                        <Col xs={12} sm={6}>
                            <APICredentials />
                            <IdentityHandler />
                            <IntegrationKeyHandler />
                        </Col>
                    </Row>
                </div>
            </Layout>
        )
    }
}
