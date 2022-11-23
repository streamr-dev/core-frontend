import React from 'react'
import { storiesOf } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import styles from '@sambego/storybook-styles'
import LinkTabs from '.'
const stories = storiesOf('Shared/LinkTabs', module).addDecorator(
    styles({
        padding: '2rem',
        color: '#000'
    })
)
stories.add('default', () => (
    <MemoryRouter>
        <LinkTabs
            options={[{label: 'Value 1', href: '/lorem'}, {label: 'OtherValue', href: '/ipsum'}, {label: 'Very long value label', href: '/foobar'}]}
            selectedOptionHref="/ipsum"
        />
    </MemoryRouter>
))
stories.add('disabled', () => (
    <MemoryRouter>
        <LinkTabs
            options={[
                {label: 'Value 1', href: '/lorem'},
                {label: 'OtherValue', href: '/ipsum'},
                {label: 'Very long value label', href: '/foobar', disabled: true, disabledReason: 'This feature will be available soon!'}]}
            selectedOptionHref="/ipsum"
        />
    </MemoryRouter>
))
stories.add('fullWidth', () => (
    <MemoryRouter>
        <div style={{marginBottom: '20px'}}>
            <p>Always:</p>
            <LinkTabs
                options={[
                    {label: 'Value 1', href: '/lorem'},
                    {label: 'OtherValue', href: '/ipsum'},
                    {label: 'Very long value label', href: '/foobar'}
                ]}
                selectedOptionHref="/lorem"
                fullWidth={'on'}
            />
        </div>
        <div style={{marginBottom: '20px'}}>
            <p>Up until desktop resolutions:</p>
            <LinkTabs
                options={[
                    {label: 'Value 1', href: '/lorem'},
                    {label: 'OtherValue', href: '/ipsum'},
                    {label: 'Very long value label', href: '/foobar'}
                ]}
                selectedOptionHref="/ipsum"
                fullWidth={'mobileAndTablet'}
            />
        </div>
        <div style={{marginBottom: '20px'}}>
            <p>Up until tablet resolutions:</p>
            <LinkTabs
                options={[
                    {label: 'Value 1', href: '/lorem'},
                    {label: 'OtherValue', href: '/ipsum'},
                    {label: 'Very long value label', href: '/foobar'}
                ]}
                selectedOptionHref="/foobar"
                fullWidth={'onlyMobile'}
            />
        </div>
    </MemoryRouter>
))
