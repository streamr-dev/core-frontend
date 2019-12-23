/* eslint-disable react/no-multi-comp */
import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, number, boolean } from '@storybook/addon-knobs'
import StoryRouter from 'storybook-react-router'
import styles from '@sambego/storybook-styles'
import { Row, Col } from 'reactstrap'

import Toggle from '$shared/components/Toggle'
import Table from '$shared/components/Table'
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
import { arrayMove } from 'react-sortable-hoc'
import SortableList from '$shared/components/SortableList'
import FieldList from '$shared/components/FieldList'
import FieldItem from '$shared/components/FieldList/FieldItem'
import Dialog from '$shared/components/Dialog'
import BackButton from '$shared/components/BackButton'
import SvgIcon from '$shared/components/SvgIcon'
import PngIcon from '$shared/components/PngIcon'
import Dropdown from '$shared/components/Dropdown'
import Slider from '$shared/components/Slider'
import ModalPortal from '$shared/components/ModalPortal'
import { Provider as ModalPortalProvider } from '$shared/contexts/ModalPortal'
import ErrorDialog from '$mp/components/Modal/ErrorDialog'
import Notifications from '$shared/components/Notifications'
import Notification from '$shared/utils/Notification'
import CodeSnippet from '$shared/components/CodeSnippet'
import Tooltip from '$shared/components/Tooltip'
import ContextMenu from '$shared/components/ContextMenu'
import { NotificationIcon } from '$shared/utils/constants'
import Toolbar from '$shared/components/Toolbar'
import Spinner from '$shared/components/Spinner'
import DeploySpinner from '$shared/components/DeploySpinner'
import Label from '$shared/components/Label'
import Tile from '$shared/components/Tile'
import Button from '$shared/components/Button'

import sharedStyles from './shared.pcss'

const story = (name) => storiesOf(`Shared/${name}`, module)
    .addDecorator(styles({
        color: '#323232',
        padding: '15px',
    }))
    .addDecorator(withKnobs)

class ToggleContainer extends React.Component {
    state = {
        value: false,
    }

    render() {
        return (
            <Toggle
                value={this.state.value}
                onChange={(value) => {
                    this.setState({
                        value,
                    })
                    action('onChange')(value)
                }}
            />
        )
    }
}
story('Toggle')
    .addWithJSX('changeable', () => <ToggleContainer />)
    .addWithJSX('off', () => <Toggle value={boolean('value', false)} onChange={action('onChange')} />)
    .addWithJSX('on', () => <Toggle value={boolean('value', true)} onChange={action('onChange')} />)

story('Popover actions')
    .addWithJSX('basic', () => (
        <DropdownActions title="Select">
            <DropdownActions.Item onClick={action('clicked')}>
                Click me
            </DropdownActions.Item>
            <DropdownActions.Item>Another option</DropdownActions.Item>
        </DropdownActions>
    ))
    .addWithJSX('disabled', () => (
        <DropdownActions title="Select" disabled>
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
    .addWithJSX('disabled meatball dropdown', () => (
        <DropdownActions
            title={<Meatball alt="Select" disabled />}
            noCaret
            disabled
        >
            <DropdownActions.Item onClick={action('clicked')}>
                Click me
            </DropdownActions.Item>
            <DropdownActions.Item>Another option</DropdownActions.Item>
        </DropdownActions>
    ))

story('Status icon')
    .addWithJSX('ok', () => <StatusIcon status={StatusIcon.OK} />)
    .addWithJSX('ok with tooltip', () => <StatusIcon showTooltip status={StatusIcon.OK} />)
    .addWithJSX('inactive', () => <StatusIcon status={StatusIcon.INACTIVE} />)
    .addWithJSX('inactive with tooltip', () => <StatusIcon showTooltip status={StatusIcon.INACTIVE} />)
    .addWithJSX('error', () => <StatusIcon status={StatusIcon.ERROR} />)
    .addWithJSX('error with tooltip', () => <StatusIcon showTooltip status={StatusIcon.ERROR} />)

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

story('Text Field/With actions')
    .addWithJSX('basic', () => (
        <TextInput
            preserveLabelSpace
            label="I have a Meatball menu"
            actions={
                [
                    <DropdownActions.Item>
                        Test 1
                    </DropdownActions.Item>,
                    <DropdownActions.Item>
                        Test 2
                    </DropdownActions.Item>,
                ]
            }
        />
    ))
    .addWithJSX('disabled', () => (
        <TextInput
            preserveLabelSpace
            disabled
            label="I have a Meatball menu"
            actions={
                [
                    <DropdownActions.Item>
                        Test 1
                    </DropdownActions.Item>,
                    <DropdownActions.Item>
                        Test 2
                    </DropdownActions.Item>,
                ]
            }
        />
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

story('Text Field/Number')
    .addWithJSX('basic', () => (
        <TextInput preserveLabelSpace label="Count" type="number" />
    ))
    .addWithJSX('with predefined value', () => (
        <TextInput preserveLabelSpace label="Count" type="number" value="5" />
    ))
    .addWithJSX('with min, max & step', () => (
        <TextInput preserveLabelSpace label="Count" type="number" min="0" max="10" step="2" />
    ))
    .addWithJSX('hidden buttons', () => (
        <TextInput preserveLabelSpace label="Count" type="number" hideButtons />
    ))
    .addWithJSX('without label', () => (
        <TextInput label="" type="number" />
    ))
    .addWithJSX('with error', () => (
        <TextInput preserveLabelSpace label="Count" type="number" error="Error" />
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
                kind: 'link',
                onClick: action('onDismiss'),
            }
        }

        if (boolean('hasSave', true)) {
            const waitingForSave = boolean('waitingForSave', false)
            actions.ok = {
                title: waitingForSave ? 'Saving....' : 'Save',
                kind: 'primary',
                onClick: action('onSave'),
                disabled: waitingForSave,
                spinner: waitingForSave,
            }
        }

        return (
            <Dialog
                showCloseIcon={boolean('showCloseIcon')}
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
            <Col xs="4">
                <div className={sharedStyles.iconWrapper}>
                    <div className={sharedStyles.iconInner}>
                        <SvgIcon name="checkmark" size="large" className={sharedStyles.svgIcon} />
                    </div>
                    <span>checkmark size=large</span>
                </div>
            </Col>
        </Row>
    ))

story('PngIcon')
    .addWithJSX('all', () => (
        <Row>
            {PngIcon.names.map((name) => (
                <Col xs="4" key={name}>
                    <div key={name} className={sharedStyles.iconWrapper}>
                        <div className={sharedStyles.iconInner}>
                            <PngIcon name={name} className={sharedStyles.pngIcon} />
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

class SliderContainer extends React.Component {
    state = {
        sliderValue: 1,
    }

    onChange = (value) => {
        this.setState({
            sliderValue: value,
        })
    }

    render() {
        return (
            <div>
                <Slider
                    min={1}
                    max={100}
                    value={this.state.sliderValue}
                    onChange={this.onChange}
                />
                <div style={{
                    color: '#323232',
                }}
                >
                    Slider value: {this.state.sliderValue}
                </div>
            </div>
        )
    }
}

story('Slider')
    .addWithJSX('basic', () => (
        <SliderContainer />
    ))

story('ModalPortal')
    .addDecorator(StoryRouter())
    .addWithJSX('basic', () => (
        <React.Fragment>
            <div id="modal-root" />
            <ModalPortalProvider>
                <h1>Lorem ipsum cause dolor sit emat!</h1>
                {boolean('Visible', true) && (
                    <ModalPortal>
                        <ErrorDialog
                            title="Godlike!"
                            message="Hello world!"
                            onClose={() => {}}
                        />
                    </ModalPortal>
                )}
            </ModalPortalProvider>
        </React.Fragment>
    ))

story('Notifications')
    .addWithJSX('basic', () => {
        const title = text('Title', 'Lorem ipsum dolor sit. But hey, you always have emat!')

        return (
            <React.Fragment>
                <div id="modal-root" />
                <ModalPortalProvider>
                    <button
                        type="button"
                        onClick={() => {
                            Notification.push({
                                title,
                            })
                        }}
                    >
                        Add notification
                    </button>
                    {Object.values(NotificationIcon).map((icon) => (
                        <button
                            key={icon}
                            type="button"
                            onClick={() => {
                                Notification.push({
                                    title,
                                    icon,
                                })
                            }}
                        >
                            Add {icon} notification
                        </button>
                    ))}
                    <Notifications />
                    {boolean('Show dialog', false) && (
                        <ModalPortal>
                            <ErrorDialog
                                title="Godlike!"
                                message="Hello world!"
                                onClose={() => {}}
                            />
                        </ModalPortal>
                    )}
                </ModalPortalProvider>
            </React.Fragment>
        )
    })

story('CodeSnippet')
    .addWithJSX('basic', () => (
        <CodeSnippet
            language={text('Language', 'javascript')}
            showLineNumbers={boolean('Show line numbers', true)}
            wrapLines={boolean('wrapLines')}
        >{String.raw`const StreamrClient = require('streamr-client')

const streamr = new StreamrClient({
    auth: {
        apiKey: 'YOUR-API-KEY',
    },
})

// Subscribe to a stream
streamr.subscribe({
    stream: 'stream-id'
},
(message, metadata) => {
    // Do something with the message here!
    console.log(message)
}`}
        </CodeSnippet>
    ))

class ContextMenuContainer extends React.Component {
    state = {
        isOpen: false,
    }

    targetRef = React.createRef()

    toggleMenu = () => {
        this.setState((state) => ({
            isOpen: !state.isOpen,
        }))
    }

    render() {
        return (
            <React.Fragment>
                <button ref={this.targetRef} onClick={this.toggleMenu}>Click me</button>
                <ContextMenu isOpen={this.state.isOpen} target={this.targetRef} placement="bottom">
                    <ContextMenu.Item text="Item" onClick={action('1')} />
                    <ContextMenu.Item text="Another item" onClick={action('2')} />
                    <ContextMenu.Item text="I'm the last item" onClick={action('3')} />
                </ContextMenu>
            </React.Fragment>
        )
    }
}

story('ContextMenu')
    .addWithJSX('basic', () => (
        <ContextMenuContainer />
    ))

story('Tooltip')
    .addWithJSX('basic', () => (
        <Tooltip value="This is a tooltip">
            Hover to show tooltip
        </Tooltip>
    ))

const toolbarActions = {
    cancel: {
        title: 'Cancel',
        kind: 'link',
        onClick: action('cancel'),
    },
    ok: {
        title: 'Ok',
        kind: 'primary',
        onClick: action('ok'),
        disabled: boolean('disabled'),
        spinner: boolean('spinner'),
    },
}

story('Toolbar')
    .addDecorator(styles({
        backgroundColor: '#323232',
        padding: '15px',
    }))
    .addWithJSX('basic', () => (
        <Toolbar actions={toolbarActions} />
    ))
    .addWithJSX('left status text', () => (
        <Toolbar
            left={text('status text', 'status')}
            actions={toolbarActions}
        />
    ))
    .addWithJSX('middle icon', () => (
        <Toolbar
            left={text('status text', 'status')}
            middle={<SvgIcon
                name="user"
                style={{
                    width: '40px',
                    height: '40px',
                }}
            />}
            actions={toolbarActions}
        />
    ))

story('DeploySpinner')
    .addWithJSX('basic', () => (
        <DeploySpinner isRunning showCounter />
    ))
    .addWithJSX('stopped', () => (
        <DeploySpinner isRunning={false} showCounter />
    ))
    .addWithJSX('without counter', () => (
        <DeploySpinner isRunning showCounter={false} />
    ))

story('Label')
    .addWithJSX('basic', () => (
        <Label>{text('Label', 'Label')}</Label>
    ))
    .addWithJSX('with position', () => (
        <div style={{
            width: '350px',
            height: '200px',
            border: '1px solid black',
            position: 'relative',
        }}
        >
            <Label topLeft>{text('First', 'First')}</Label>
            <Label bottomRight>{text('Second', 'Second')}</Label>
        </div>
    ))
    .addWithJSX('with badge & tag', () => (
        <div>
            <Label>
                <Label.Badge badge="members" value={number('Community members', 15)} />
            </Label>
            <br />
            <Label>
                <Label.Badge tag="community" />
            </Label>
        </div>
    ))

story('Tile')
    .addWithJSX('basic', () => (
        <div style={{
            width: '350px',
        }}
        >
            <Tile>
                <Tile.Title>{text('Product name', 'Product name')}</Tile.Title>
                <Tile.Description>
                    {text('Description', 'Description')}
                </Tile.Description>
                <Tile.Status>
                    {text('Status', 'Status')}
                </Tile.Status>
            </Tile>
        </div>
    ))
    .addWithJSX('with badge & label', () => (
        <div style={{
            width: '350px',
        }}
        >
            <Tile
                labels={{
                    community: boolean('Community', true),
                }}
                badges={{
                    members: number('Community members', 15),
                }}
            >
                <Tile.Title>{text('Product name', 'Product name')}</Tile.Title>
                <Tile.Description>
                    {text('Description', 'Description')}
                </Tile.Description>
                <Tile.Status>
                    {text('Status', 'Status')}
                </Tile.Status>
            </Tile>
        </div>
    ))
    .addWithJSX('with dropdown actions', () => (
        <div style={{
            width: '350px',
        }}
        >
            <Tile
                dropdownActions={(
                    <React.Fragment>
                        <DropdownActions.Item onClick={action('option 1')}>
                            Option 1
                        </DropdownActions.Item>
                        <DropdownActions.Item onClick={action('option 2')}>
                            Option 2
                        </DropdownActions.Item>
                        <DropdownActions.Item onClick={action('option 3')}>
                            Option 3
                        </DropdownActions.Item>
                    </React.Fragment>
                )}
            >
                <Tile.Title>{text('Product name', 'Product name')}</Tile.Title>
                <Tile.Description>
                    {text('Description', 'Description')}
                </Tile.Description>
                <Tile.Status>
                    {text('Status', 'Status')}
                </Tile.Status>
            </Tile>
        </div>
    ))

story('Spinner')
    .addWithJSX('Small', () => (<Spinner size="small" />))
    .addWithJSX('Large', () => (<Spinner size="large" />))
    .addWithJSX('Green', () => (<Spinner color="green" />))
    .addWithJSX('White', () => (<Spinner color="white" />))

story('Button')
    .addWithJSX('all', () => (
        <div>
            <Button kind="primary" size="mini" onClick={action('Clicked')}>Primary mini</Button>
            <br />
            <Button kind="primary" size="normal" onClick={action('Clicked')}>Primary normal</Button>
            <br />
            <Button kind="primary" size="big" onClick={action('Clicked')}>Primary big</Button>
            <br />
            <Button kind="primary" size="normal" disabled onClick={action('Clicked')}>Primary normal disabled</Button>
            <br />
            <Button kind="primary" size="normal" outline onClick={action('Clicked')}>Primary normal outline</Button>
            <br />
            <Button kind="secondary" size="mini" onClick={action('Clicked')}>Secondary mini</Button>
            <br />
            <Button kind="secondary" size="normal" onClick={action('Clicked')}>Secondary normal</Button>
            <br />
            <Button kind="secondary" size="big" onClick={action('Clicked')}>Secondary big</Button>
            <br />
            <Button kind="secondary" size="normal" disabled onClick={action('Clicked')}>Secondary normal disabled</Button>
            <br />
            <Button kind="secondary" size="normal" outline onClick={action('Clicked')}>Secondary normal outline</Button>
            <br />
            <Button kind="destructive" onClick={action('Clicked')}>Destructive</Button>
            <br />
            <Button kind="destructive" disabled onClick={action('Clicked')}>Destructive disabled</Button>
            <br />
            <Button kind="link" variant="dark" onClick={action('Clicked')}>Link (dark)</Button>
            <br />
            <Button kind="link" variant="light" onClick={action('Clicked')}>Link (light)</Button>
            <br />
            <Button kind="special" variant="dark" onClick={action('Clicked')}>Special (dark)</Button>
            <br />
            <Button kind="special" variant="light" onClick={action('Clicked')}>Special (light)</Button>
            <br />
            <Button tag="a" href="#" onClick={action('Clicked')}>With link tag</Button>
            <br />
            <Button kind="primary" waiting onClick={action('Clicked')}>Waiting primary</Button>
            <br />
            <Button kind="secondary" waiting onClick={action('Clicked')}>Waiting secondary</Button>
        </div>
    ))
