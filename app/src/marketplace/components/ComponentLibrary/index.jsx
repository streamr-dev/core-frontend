// @flow

import React from 'react'

import { Container, Row, Col } from 'reactstrap'

import Layout from '../Layout'
import Toggle from '$shared/components/Toggle'
import Table from '$shared/components/Table'
import FileUpload from '$shared/components/FileUpload'
import Tabs from '$shared/components/Tabs'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import StatusIcon from '$shared/components/StatusIcon'
import Checkbox from '$shared/components/Checkbox'
import TextInput from '$shared/components/TextInput'
import DatePickerExample from './Examples/DatePickerExample'
import Calendar from '$shared/components/Calendar'
import CalendarExample from './Examples/CalendarExample/index'

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
            <Row className={styles.spacedOut}>
                <Col xs="2">
                    <span className={styles.title}>Calendar</span>
                </Col>
                <Col>
                    <Calendar />
                </Col>
            </Row>
            <Row className={styles.spacedOut}>
                <Col xs="2">
                    <span className={styles.title}>DatePicker</span>
                </Col>
                <Col>
                    <DatePickerExample />
                </Col>
                <Col>
                    <DatePickerExample label="Processing date" date={new Date(2018, 12, 31)} processing />
                </Col>
                <Col>
                    <DatePickerExample label="DatePicker w/ error" date={new Date(2018, 12, 31)} error="Errored!" />
                </Col>
                <Col>
                    <CalendarExample />
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
                        <Table.Head>
                            <Table.Tr>
                                <Table.Th>#</Table.Th>
                                <Table.Th>First Name</Table.Th>
                                <Table.Th>Last Name</Table.Th>
                                <Table.Th>Address</Table.Th>
                                <Table.Th>Username</Table.Th>
                                <Table.Th>Username</Table.Th>
                                <Table.Th>Username</Table.Th>
                            </Table.Tr>
                        </Table.Head>
                        <Table.Body>
                            <Table.Tr>
                                <Table.Th>Helsinki Tram Network GPS</Table.Th>
                                <Table.Td>Mark</Table.Td>
                                <Table.Td>Otto</Table.Td>
                                <Table.Td noWrap title="0xeedcd46d223399e6b3ca395f9d9ca80b429714d9">
                                    0xeedcd46d223399e6b3ca395f9d9ca80b429714d9
                                </Table.Td>
                                <Table.Td>Larry</Table.Td>
                                <Table.Td>the Bird</Table.Td>
                                <Table.Td>@twitter</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Helsinki Tram Network GPS</Table.Th>
                                <Table.Td>Jacob</Table.Td>
                                <Table.Td>Thornton</Table.Td>
                                <Table.Td noWrap title="0xeedcd46d223399e6b3ca395f9d9ca80b429714d9">
                                    0xeedcd46d223399e6b3ca395f9d9ca80b429714d9
                                </Table.Td>
                                <Table.Td>Larry</Table.Td>
                                <Table.Td>the Bird</Table.Td>
                                <Table.Td>@twitter</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Helsinki Tram Network GPS</Table.Th>
                                <Table.Td>Larry</Table.Td>
                                <Table.Td>the Bird</Table.Td>
                                <Table.Td noWrap title="0xeedcd46d223399e6b3ca395f9d9ca80b429714d9">
                                    0xeedcd46d223399e6b3ca395f9d9ca80b429714d9
                                </Table.Td>
                                <Table.Td>Larry</Table.Td>
                                <Table.Td>the Bird</Table.Td>
                                <Table.Td>@twitter</Table.Td>
                            </Table.Tr>
                        </Table.Body>
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
            <Row>
                <Col xs="2">
                    <span className={styles.title}>Checkbox</span>
                </Col>
                <Col>
                    <Checkbox checked={null} />
                </Col>
            </Row>
            <Row className={styles.spacedOut}>
                <Col xs="2">
                    <span className={styles.title}>Text fields</span>
                </Col>
                <Col>
                    <Row>
                        <Col>
                            <TextInput label="Empty text input" readOnly />
                        </Col>
                        <Col>
                            <TextInput label="Text input w/ placeholder" placeholder="Placeholder" readOnly />
                        </Col>
                        <Col>
                            <TextInput label="Text input w/ value" value="Something important!" readOnly />
                        </Col>
                    </Row>
                    <Row className={styles.spacedOut}>
                        <Col>
                            <TextInput label="Processing" readOnly processing />
                        </Col>
                        <Col>
                            <TextInput label="Errored!" readOnly error="Oh, something went wrong!" />
                        </Col>
                        <Col>
                            <TextInput label="With invalid value" value="Something invalid" readOnly error="Oh, something went wrong!" />
                        </Col>
                    </Row>
                    <Row className={styles.spacedOut}>
                        <Col>
                            <TextInput label="Password…" value="You shall not pass!" type="password" readOnly />
                        </Col>
                        <Col>
                            <TextInput label="" value="password" type="password" readOnly measureStrength={0} />
                        </Col>
                        <Col>
                            <TextInput label="" value="password" type="password" readOnly measureStrength={1} />
                        </Col>
                        <Col>
                            <TextInput label="" value="password" type="password" readOnly measureStrength={2} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    </Layout>
)

export default ComponentLibrary
