import React from 'react'
import { Meta } from '@storybook/react'
import styled from 'styled-components'
import PrestyledPngIcon from '~/shared/components/PngIcon'
import { IconInner, IconListRoot, IconWrapper } from './SvgIcon.stories'

export const All = () => (
    <IconListRoot>
        {PngIcon.names.map((name) => (
            <div key={name}>
                <IconWrapper>
                    <IconInner>
                        <PngIcon name={name} />
                    </IconInner>
                    <span>{name}</span>
                </IconWrapper>
            </div>
        ))}
    </IconListRoot>
)

All.story = {
    name: 'all',
}

const meta: Meta<typeof All> = {
    title: 'Shared/PngIcon',
    component: All,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '15px',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}
export default meta

const PngIcon = styled(PrestyledPngIcon)`
    display: block;
    max-height: 3em;
    max-width: 3em;
`
