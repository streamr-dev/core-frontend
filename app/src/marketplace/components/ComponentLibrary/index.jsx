// @flow

import React, { Fragment } from 'react'

import { Container, Row, Col } from 'reactstrap'

import Toggle from '../../../shared/components/Toggle'
import Table from '../../../shared/components/Table'

import styles from './componentLibrary.pcss'

const ComponentLibrary = () => (
    <div className={styles.componentLibrary}>
        <Container>
            <Row>
                <h1>Component Demo Library</h1>
            </Row>
            <Row />
            <Row>
                <Col xs="2">
                    <span className={styles.title}>Toggle</span>
                </Col>
                <Col>
                    <Toggle />
                </Col>
            </Row>
            <Row>
                <Col xs="2">
                    <span className={styles.title}>Table</span>
                </Col>
                <Col>
                    <Table>
                        <Fragment>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Address</th>
                                    <th>Username</th>
                                    <th>Username</th>
                                    <th>Username</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Helsinki Tram Network GPS</th>
                                    <td>Mark</td>
                                    <td>Otto</td>
                                    <td>0xeedcd46d223399e6b3ca395f9d9ca80b429714d9</td>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                                <tr>
                                    <th>Helsinki Tram Network GPS</th>
                                    <td>Jacob</td>
                                    <td>Thornton</td>
                                    <td>0xeedcd46d223399e6b3ca395f9d9ca80b429714d9</td>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                                <tr>
                                    <th>Helsinki Tram Network GPS</th>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>0xeedcd46d223399e6b3ca395f9d9ca80b429714d9</td>
                                    <td>Larry</td>
                                    <td>the Bird</td>
                                    <td>@twitter</td>
                                </tr>
                            </tbody>
                        </Fragment>
                    </Table>
                </Col>
            </Row>
        </Container>
    </div>
)

export default ComponentLibrary
