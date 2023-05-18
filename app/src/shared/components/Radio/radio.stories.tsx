import React from 'react'
import {Meta} from "@storybook/react"
import { action } from '@storybook/addon-actions'
import { Radio } from '.'

export const Default = () => (
    <div>
        <form>
            <p>Default:</p>
            <Radio
                id="radio-example-option1"
                name={'important-selection'}
                label={'Some option'}
                value={'some-option'}
                onChange={action('selected')}
            />
            <Radio
                id="radio-example-option2"
                name={'important-selection'}
                label={'Another option option'}
                value={'some-option2'}
                onChange={action('selected')}
            />
            <Radio
                id="radio-example-option3"
                name={'important-selection'}
                label={'Something else'}
                value={'some-option3'}
                onChange={action('selected')}
            />
        </form>
        <form>
            <p>Disabled:</p>
            <Radio
                id="radio-example-option1=9998"
                name={'disabled-selection'}
                label={'Disabled but checked option'}
                value={'some-option-0000'}
                checked={true}
                disabled={true}
                onChange={action('selected')}
            />
            <Radio
                id="radio-example-option848844"
                name={'disabled-selection'}
                label={'Disabled option'}
                value={'some-option-777'}
                onChange={action('selected')}
                disabled={true}
            />
        </form>
        <form>
            <p>Large:</p>
            <Radio
                id="radio-example-option1483834"
                size={'large'}
                name={'large-selection'}
                label={'Some option'}
                value={'some-option'}
                checked={true}
                onChange={action('selected')}
            />
        </form>
    </div>
)

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/Radio',
    component: Default,
    decorators: [(Story) => {
        return <div style={{
            color: '#323232',
            padding: '2rem',
        }}>
            <Story/>
        </div>
    }]
}

export default meta
