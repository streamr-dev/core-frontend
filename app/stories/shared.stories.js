import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, array, number } from '@storybook/addon-knobs/react'

import Toggle from '$shared/components/Toggle'
import Table from '$shared/components/Table'
import FileUpload from '$shared/components/FileUpload'
import Tabs from '$shared/components/Tabs'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import StatusIcon from '$shared/components/StatusIcon'

const story = (name) => storiesOf(name, module)
    .addDecorator(withKnobs)

story('Toggle')
    .add('basic', () => <Toggle onChange={action('onChange')} />)

story('Dropdown')
    .add('basic', () => (
        <DropdownActions title="Select">
            <DropdownActions.Item onClick={action('clicked')}>
                Click me
            </DropdownActions.Item>
            <DropdownActions.Item>Another option</DropdownActions.Item>
        </DropdownActions>
    ))
    .add('meatball dropdown', () => (
        <DropdownActions
            title={<Meatball alt="Select" />}
            noCaret
        >
            <DropdownActions.Item onClick={action('clicked')}>
                Click me
            </DropdownActions.Item>
            <DropdownActions.Item>Another option</DropdownActions.Item>
        </DropdownActions>
    ))

story('Status icon')
    .add('normal', () => <StatusIcon />)
    .add('error', () => <StatusIcon status={StatusIcon.ERROR} />)

story('Table')
    .add('basic', () => (
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
    ))

storiesOf('FileUpload', module)
    .addDecorator(withKnobs)
    .add('basic', () => (
        <FileUpload
            style={{
                color: 'black',
            }}
            component={<span>Drag a file here or click to browse</span>}
            dropTargetComponent={<span>Drop here!</span>}
            dragOverComponent={<span>Yay, just drop it!</span>}
            onFilesAccepted={action('onFilesAccepted')}
            onError={action('onError')}
            acceptMime={array('acceptMime', ['image/jpeg', 'image/png'])}
            maxFileSizeInMB={number('maxFileSizeInMB', 5)}
            multiple={false}
            disablePreview
        />
    ))

story('Tabs')
    .add('basic', () => (
        <Tabs defaultActiveIndex={1}>
            <Tabs.Tab title={text('tab1Title', 'Tab 1')}><span>Content of tab 1</span></Tabs.Tab>
            <Tabs.Tab title={text('tab2Title', 'Tab 2')}><span>Content of tab 2</span></Tabs.Tab>
            <Tabs.Tab title={text('tab3Title', 'Tab 3 with longer name')}><span>Content of tab 3</span></Tabs.Tab>
        </Tabs>
    ))