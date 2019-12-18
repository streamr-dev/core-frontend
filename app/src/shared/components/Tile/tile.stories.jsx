// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, number, boolean } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import DropdownActions from '$shared/components/DropdownActions'

import Tile from '.'

const stories = storiesOf('Shared/Tile', module)
    .addDecorator(styles({
        color: '#323232',
        padding: '1rem',
    }))
    .addDecorator(withKnobs)

stories.add('basic', () => (
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

stories.add('with badge & label', () => (
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

stories.add('with deploying badge', () => (
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
            deploying={boolean('Deploying', true)}
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

stories.add('with dropdown actions', () => (
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
