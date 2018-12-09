/* eslint-disable react/no-multi-comp */
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, array, number, boolean } from '@storybook/addon-knobs'
import StoryRouter from 'storybook-react-router'
import styles from '@sambego/storybook-styles'
import { Row, Col } from 'reactstrap'

import Toggle from '$shared/components/Toggle'
import Table from '$shared/components/Table'
import FileUpload from '$shared/components/FileUpload'
import Tabs from '$shared/components/Tabs'
import Checkbox from '$shared/components/Checkbox'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import StatusIcon from '$shared/components/StatusIcon'
import TextInput from '$shared/components/TextInput'
import SelectInput from '$shared/components/SelectInput'
import Calendar from '$shared/components/Calendar'
import WithCalendar from '$shared/components/WithCalendar'
import DatePicker from '$shared/components/DatePicker'
import dateFormatter from '$utils/dateFormatter'
import Search from '$shared/components/Search'
import { arrayMove } from 'react-sortable-hoc'
import SortableList from '$shared/components/SortableList'
import FieldList from '$shared/components/FieldList'
import FieldItem from '$shared/components/FieldList/FieldItem'
import Dialog from '$shared/components/Dialog'
import BackButton from '$shared/components/BackButton'
import SvgIcon from '$shared/components/SvgIcon'
import Dropdown from '$shared/components/Dropdown'
import Modal from '$shared/components/Modal'
import ModalRoot from '$shared/components/ModalRoot'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'

import sharedStyles from './shared.pcss'

const story = (name) => storiesOf(`Shared/${name}`, module)
    .addDecorator(styles({
        color: '#323232',
        padding: '15px',
    }))
    .addDecorator(withKnobs)

story('Toggle')
    .addWithJSX('basic', () => <Toggle onChange={action('onChange')} />)

story('Popover actions')
    .addWithJSX('basic', () => (
        <DropdownActions title="Select">
            <DropdownActions.Item onClick={action('clicked')}>
                Click me
            </DropdownActions.Item>
            <DropdownActions.Item>Another option</DropdownActions.Item>
        </DropdownActions>
    ))
    .addWithJSX('meatball dropdown', () => (
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
    .addWithJSX('normal', () => <StatusIcon />)
    .addWithJSX('error', () => <StatusIcon status={StatusIcon.ERROR} />)

story('Table')
    .addWithJSX('basic', () => (
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

story('FileUpload')
    .addWithJSX('basic', () => (
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
    .addWithJSX('basic', () => (
        <Tabs defaultActiveIndex={1}>
            <Tabs.Tab title={text('tab1Title', 'Tab 1')}><span>Content of tab 1</span></Tabs.Tab>
            <Tabs.Tab title={text('tab2Title', 'Tab 2')}><span>Content of tab 2</span></Tabs.Tab>
            <Tabs.Tab title={text('tab3Title', 'Tab 3 with longer name')}><span>Content of tab 3</span></Tabs.Tab>
        </Tabs>
    ))

class CheckboxContainer extends React.Component {
    constructor() {
        super()
        this.state = {
            checked: false,
        }
    }
    render() {
        return (
            <Checkbox
                checked={this.state.checked}
                onChange={(e) => {
                    this.setState({
                        checked: e.target.checked,
                    })
                    action('checked')(e)
                }}
            />
        )
    }
}

story('Checkbox')
    .addWithJSX('checked', () => (
        <Checkbox checked={boolean('checked', true)} />
    ))
    .addWithJSX('unchecked', () => (
        <Checkbox checked={boolean('checked', false)} />
    ))
    .addWithJSX('changeable', () => (
        <CheckboxContainer />
    ))

story('Text Field/Text')
    .addWithJSX('basic', () => (
        <TextInput preserveLabelSpace label="Initially empty text input" onChange={action('change')} />
    ))
    .addWithJSX('w/ placeholder', () => (
        <TextInput preserveLabelSpace label="Text input w/ placeholder" placeholder="Placeholder" readOnly />
    ))
    .addWithJSX('w/ value', () => (
        <TextInput preserveLabelSpace label="Text input w/ value" value="Something important!" readOnly />
    ))
    .addWithJSX('processing', () => (
        <TextInput preserveLabelSpace label="Processing" readOnly processing />
    ))
    .addWithJSX('errored', () => (
        <TextInput preserveLabelSpace label="Errored!" readOnly error="Oh, something went wrong!" />
    ))
    .addWithJSX('with invalid value', () => (
        <TextInput preserveLabelSpace label="With invalid value" value="Something invalid" error="Oh, something went wrong!" />
    ))

story('Text Field/Password')
    .addWithJSX('basic', () => (
        <TextInput preserveLabelSpace label="Password…" value={text('value', '')} type="password" measureStrength />
    ))
    .addWithJSX('min strength 0', () => (
        <TextInput preserveLabelSpace label="" value={text('value', 'qwerty')} type="password" measureStrength />
    ))
    .addWithJSX('min strength 1', () => (
        <TextInput preserveLabelSpace label="" value={text('value', 'werty')} type="password" measureStrength />
    ))
    .addWithJSX('min strength 2', () => (
        <TextInput preserveLabelSpace label="" value={text('value', 'You shall not pass!')} type="password" measureStrength />
    ))

class SelectInputContainer extends React.Component {
    static options = [{
        value: 'Leonardo',
        label: 'Leonardo',
    }, {
        value: 'Donatello',
        label: 'Donatello',
    }, {
        value: 'Michelangelo',
        label: 'Michelangelo',
    }, {
        value: 'Raphael',
        label: 'Raphael',
    }]
    state = {
        value: null,
    }
    onValueChange = (val) => {
        action('onChange')(val)
        this.setState({
            value: val,
        })
    }
    render = () => (
        <SelectInput
            label="My Favourite"
            name="name"
            options={SelectInputContainer.options}
            value={this.state.value || SelectInputContainer.options[0]}
            onChange={this.onValueChange}
            required
        />
    )
}

story('Select Field')
    .addDecorator(styles({
        backgroundColor: '#EFEFEF',
    }))
    .addWithJSX('basic', () => (
        <SelectInputContainer />
    ))

const CalendarContainer = () => (
    <WithCalendar
        date={new Date('2019-01-01')}
    >
        {({ toggleCalendar, date }) => (
            <button type="button" onClick={toggleCalendar}>
                {dateFormatter('DD MMMM YYYY')(date)}
            </button>
        )}
    </WithCalendar>
)

story('Calendar')
    .addWithJSX('basic', () => (
        <Calendar value={new Date('2019-01-01')} />
    ))
    .addWithJSX('attached to button', () => (
        <CalendarContainer />
    ))

class DatePickerContainer extends React.Component {
    state = {
        date: this.props.date,
    }

    render() {
        return (
            <DatePicker
                label="Date"
                openOnFocus
                onChange={(date) => {
                    this.setState({
                        date,
                    })
                }}
                value={this.state.date}
                placeholder="Select date…"
                {...this.props}
            />
        )
    }
}

story('Date Picker')
    .addWithJSX('basic', () => (
        <DatePickerContainer
            preserveLabelSpace
        />
    ))
    .addWithJSX('when processing', () => (
        <DatePickerContainer
            label="Processing date"
            date={new Date(2018, 12, 31)}
            processing
            preserveLabelSpace
        />
    ))
    .addWithJSX('with error', () => (
        <DatePickerContainer
            label="DatePicker w/ error"
            date={new Date(2018, 12, 31)}
            error="Errored!"
            preserveLabelSpace
        />
    ))

story('Search')
    .addWithJSX('basic', () => (
        <Search
            placeholder="Placeholder"
            onChange={action('onChange')}
        />
    ))

class SortableListContainer extends React.Component {
    state = {
        items: Array(5).fill(true).map((v, i) => `Item #${i}${i === 0 ? ' (Drag me!)' : ''}`),
    }

    onSortEnd = ({ newIndex, oldIndex }) => {
        this.setState(({ items }) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }))
    }

    render() {
        const { items } = this.state

        return (
            <SortableList onSortEnd={this.onSortEnd} lockAxis="y">
                {items.map((item) => (
                    <span key={item}>{item}</span>
                ))}
            </SortableList>
        )
    }
}

class FieldListContainer extends React.Component {
    state = {
        items: ['Name', 'Price', 'Comment', 'Created at', 'Updated at'],
    }

    onSortEnd = ({ newIndex, oldIndex }) => {
        this.setState(({ items }) => ({
            items: arrayMove(items, oldIndex, newIndex),
        }))
    }

    render() {
        const { items } = this.state

        return (
            <div className={sharedStyles.fieldList}>
                <FieldList onSortEnd={this.onSortEnd} lockAxis="y">
                    {items.map((item) => (
                        <FieldItem key={item} name={item} />
                    ))}
                </FieldList>
            </div>
        )
    }
}

story('Sortable list')
    .addWithJSX('basic', () => (
        <SortableListContainer>
            <div>Item 1</div>
            <div>Item 2</div>
            <div>Item 3</div>
            <div>Item 4</div>
        </SortableListContainer>
    ))
    .addWithJSX('field list', () => (
        <FieldListContainer />
    ))

story('Dialog')
    .addWithJSX('basic', () => {
        const actions = {}

        if (boolean('hasCancel', true)) {
            actions.cancel = {
                title: 'Cancel',
                outline: true,
                onClick: action('onDismiss'),
            }
        }

        if (boolean('hasSave', true)) {
            const waitingForSave = boolean('waitingForSave', false)
            actions.ok = {
                title: waitingForSave ? 'Saving....' : 'Save',
                color: 'primary',
                onClick: action('onSave'),
                disabled: waitingForSave,
                spinner: waitingForSave,
            }
        }

        return (
            <Dialog
                waiting={boolean('waiting', false)}
                title={text('title', 'Dialog Title')}
                actions={actions}
            >
                Content goes here...
            </Dialog>
        )
    })

story('BackButton')
    .addDecorator(StoryRouter())
    .addWithJSX('basic', () => (
        <div>
            <BackButton />
            <hr />
        </div>
    ))

story('SvgIcon')
    .addWithJSX('all', () => (
        <Row>
            {SvgIcon.names.map((name) => (
                <Col xs="4" key={name}>
                    <div key={name} className={sharedStyles.iconWrapper}>
                        <div className={sharedStyles.iconInner}>
                            <SvgIcon name={name} className={sharedStyles.svgIcon} />
                        </div>
                        <span>{name}</span>
                    </div>
                </Col>
            ))}
        </Row>
    ))

story('Dropdown')
    .addWithJSX('basic', () => (
        <Dropdown title="Select item" onChange={action('onChange')}>
            <Dropdown.Item key="item1" value="item1">
                Item 1
            </Dropdown.Item>
            <Dropdown.Item key="item2" value="item2">
                Item 2
            </Dropdown.Item>
        </Dropdown>
    ))
    .addWithJSX('with default selection', () => (
        <Dropdown title="Select item" defaultSelectedItem="item1" onChange={action('onChange')}>
            <Dropdown.Item key="item1" value="item1">
                Item 1
            </Dropdown.Item>
            <Dropdown.Item key="item2" value="item2">
                Item 2
            </Dropdown.Item>
        </Dropdown>
    ))

story('Modal')
    .addDecorator(StoryRouter())
    .addWithJSX('basic', () => (
        <ModalRoot>
            <h1>Lorem ipsum cause dolor sit emat!</h1>
            {boolean('Visible', true) && (
                <Modal>
                    <ErrorDialog
                        title="Godlike!"
                        message="Hello world!"
                        onClose={() => {}}
                    />
                </Modal>
            )}
        </ModalRoot>
    ))
