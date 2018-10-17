// @flow

import React from 'react'

import { Container, Row, Col } from 'reactstrap'

import Layout from '../../containers/Layout'
import Toggle from '$shared/components/Toggle'
import Table from '$shared/components/Table'
import FileUpload from '$shared/components/FileUpload'
import Tabs from '$shared/components/Tabs'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import StatusIcon from '$shared/components/StatusIcon'

import styles from './componentLibrary.pcss'

const ComponentLibrary = () => (
    <Layout className={styles.componentLibrary}>
        <Container>
            <h1>Component Demo Library</h1>
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
                    <span className={styles.title}>Dropdown</span>
                </Col>
                <Col>
                    <DropdownActions title="Select">
                        <DropdownActions.Item
                            onClick={() => console.log('I was selected!')} // eslint-disable-line no-console
                        >
                            Click me
                        </DropdownActions.Item>
                        <DropdownActions.Item>Another option</DropdownActions.Item>
                    </DropdownActions>
                </Col>
            </Row>
            <Row>
                <Col xs="2">
                    <span className={styles.title}>Meatball dropdown</span>
                </Col>
                <Col>
                    <DropdownActions
                        title={<Meatball alt="Select" />}
                        noCaret
                    >
                        <DropdownActions.Item
                            onClick={() => console.log('I was selected!')} // eslint-disable-line no-console
                        >
                            Click me
                        </DropdownActions.Item>
                        <DropdownActions.Item>Another option</DropdownActions.Item>
                    </DropdownActions>
                </Col>
            </Row>
            <Row>
                <Col xs="2">
                    <span className={styles.title}>Status icon</span>
                </Col>
                <Col>
                    Normal: <StatusIcon /> Error: <StatusIcon status={StatusIcon.ERROR} />
                </Col>
            </Row>
            <Row>
                <Col xs="2">
                    <span className={styles.title}>Table</span>
                </Col>
                <Col>
                    <Table>
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
                                <td title="0xeedcd46d223399e6b3ca395f9d9ca80b429714d9">0xeedcd46d223399e6b3ca395f9d9ca80b429714d9</td>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                            <tr>
                                <th>Helsinki Tram Network GPS</th>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td title="0xeedcd46d223399e6b3ca395f9d9ca80b429714d9">0xeedcd46d223399e6b3ca395f9d9ca80b429714d9</td>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                            <tr>
                                <th>Helsinki Tram Network GPS</th>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td title="0xeedcd46d223399e6b3ca395f9d9ca80b429714d9">0xeedcd46d223399e6b3ca395f9d9ca80b429714d9</td>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row>
                <Col xs="2">
                    <span className={styles.title}>FileUpload</span>
                </Col>
                <Col>
                    <FileUpload
                        component={<span className={styles.title}>Drag a file here or click to browse</span>}
                        dropTargetComponent={<span className={styles.title}>Drop here!</span>}
                        dragOverComponent={<span className={styles.title}>Yay, just drop it!</span>}
                        onFilesAccepted={(files) => console.log(files)} // eslint-disable-line no-console
                        onError={(error) => console.error(error)}
                        acceptMime={['image/jpeg', 'image/png']}
                        maxFileSizeInMB={5}
                        multiple={false}
                        disablePreview
                    />
                </Col>
            </Row>
            <Row>
                <Col xs="2">
                    <span className={styles.title}>Tabs</span>
                </Col>
                <Col>
                    <Tabs defaultActiveIndex={1}>
                        <Tabs.Tab title="Tab 1"><span>Content of tab 1</span></Tabs.Tab>
                        <Tabs.Tab title="Tab 2"><span>Content of tab 2</span></Tabs.Tab>
                        <Tabs.Tab title="Tab 3 with longer name"><span>Content of tab 3</span></Tabs.Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    </Layout>
)

export default ComponentLibrary
