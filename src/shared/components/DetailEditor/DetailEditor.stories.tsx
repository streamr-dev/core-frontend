import React from 'react'
import { Meta } from '@storybook/react'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import * as yup from 'yup'
import SvgIcon from '~/shared/components/SvgIcon'
import { COLORS } from '~/shared/utils/styled'
import NetworkIcon from '~/shared/components/NetworkIcon'
import { DetailEditor } from './index'

const StandardIcon = styled(SvgIcon)`
    color: ${COLORS.primary};
    width: 16px;
    height: 16px;
    &.twitterBlue {
        color: #1da1f2;
    }
`

const ChainIcon = styled(NetworkIcon)`
    width: 32px;
    height: 32px;
    &.preview {
        width: 16px;
        height: 16px;
    }
`

const ChainOption = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    span {
        margin-left: 12px;
    }
`

export const Default = () => {
    return (
        <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '20px' }}>
                <DetailEditor
                    unsetValueText={'Chain'}
                    defaultIcon={<StandardIcon name={'ellipse'} />}
                    showValue={true}
                    instructionText={'Please select a chain'}
                    onChange={action('detail changed')}
                    placeholder={'Select...'}
                    selectOptions={[
                        {
                            label: (
                                <ChainOption>
                                    <ChainIcon chainId={137} />
                                    <span>Polygon</span>
                                </ChainOption>
                            ),
                            value: 'polygon',
                        },
                        {
                            label: (
                                <ChainOption>
                                    <ChainIcon chainId={1} />
                                    <span>Ethereum</span>
                                </ChainOption>
                            ),
                            value: 'ethereum',
                        },
                        {
                            label: (
                                <ChainOption>
                                    <ChainIcon chainId={100} />
                                    <span>Gnosis Chain (xDai)</span>
                                </ChainOption>
                            ),
                            value: 'xdai',
                        },
                    ]}
                />
            </div>
            <div style={{ marginRight: '20px' }}>
                <DetailEditor
                    unsetValueText={'Chain'}
                    defaultIcon={<StandardIcon name={'ellipse'} />}
                    hasValueIcon={<ChainIcon chainId={100} className={'preview'} />}
                    showValueFormatter={(value) => {
                        switch (value) {
                            case 'polygon':
                                return 'Polygon'
                            case 'ethereum':
                                return 'Ethereum'
                            case 'xdai':
                                return 'Gnosis Chain (xDai)'
                        }
                    }}
                    showValue={true}
                    instructionText={'Please select a chain'}
                    onChange={action('detail changed')}
                    placeholder={'Select...'}
                    value={'xdai'}
                    selectOptions={[
                        {
                            label: (
                                <ChainOption>
                                    <ChainIcon chainId={137} />
                                    <span>Polygon</span>
                                </ChainOption>
                            ),
                            value: 'polygon',
                        },
                        {
                            label: (
                                <ChainOption>
                                    <ChainIcon chainId={1} />
                                    <span>Ethereum</span>
                                </ChainOption>
                            ),
                            value: 'ethereum',
                        },
                        {
                            label: (
                                <ChainOption>
                                    <ChainIcon chainId={100} />
                                    <span>Gnosis Chain (xDai)</span>
                                </ChainOption>
                            ),
                            value: 'xdai',
                        },
                    ]}
                />
            </div>
            <div style={{ marginRight: '20px' }}>
                <DetailEditor
                    unsetValueText={'Site URL'}
                    defaultIcon={<StandardIcon name={'web'} />}
                    showValue={true}
                    instructionText={'Please add a site URL'}
                    ctaButtonText={'site URL'}
                    placeholder={'https://siteinfo.com'}
                    onChange={action('detail changed')}
                    optional={true}
                    validation={[
                        {
                            validator: (value) => {
                                const schema = yup.string().trim().url()
                                return !!schema.isValidSync(value)
                            },
                            message: 'Not a valid URL',
                        },
                    ]}
                />
            </div>
            <div style={{ marginRight: '20px' }}>
                <DetailEditor
                    unsetValueText={'Contact email'}
                    defaultIcon={<StandardIcon name={'email'} />}
                    showValue={true}
                    instructionText={'Please add a contact email'}
                    ctaButtonText={'contact email'}
                    placeholder={'owner@example.com'}
                    onChange={action('detail changed')}
                    validation={[
                        {
                            validator: (value) => {
                                const schema = yup.string().trim().email()
                                return !!schema.isValidSync(value)
                            },
                            message: 'Not a valid email address',
                        },
                    ]}
                    optional={true}
                    value={'john@example.com'}
                />
            </div>
            <div style={{ marginRight: '20px' }}>
                <DetailEditor
                    defaultIcon={<StandardIcon name={'twitter'} />}
                    instructionText={'Please add Twitter link'}
                    ctaButtonText={'Twitter link'}
                    onChange={action('detail changed')}
                    validation={[
                        {
                            validator: (value) => {
                                const schema = yup.string().trim().url()
                                return !!schema.isValidSync(value)
                            },
                            message: 'Not a valid URL',
                        },
                    ]}
                />
            </div>
            <div style={{ marginRight: '20px' }}>
                <DetailEditor
                    defaultIcon={<StandardIcon name={'twitter'} />}
                    hasValueIcon={
                        <StandardIcon name={'twitter'} className={'twitterBlue'} />
                    }
                    instructionText={'Please add Twitter link'}
                    ctaButtonText={'Twitter link'}
                    onChange={action('detail changed')}
                    value={'https://twitter.com/streamr'}
                    optional={true}
                    validation={[
                        {
                            validator: (value) => {
                                const schema = yup.string().trim().url()
                                return !!schema.isValidSync(value)
                            },
                            message: 'Not a valid URL',
                        },
                    ]}
                />
            </div>
        </div>
    )
}

Default.story = {
    name: 'default',
}

const meta: Meta<typeof Default> = {
    title: 'Shared/DetailEditor',
    component: Default,
    decorators: [
        (Story) => {
            return (
                <div
                    style={{
                        color: '#323232',
                        padding: '5rem',
                        background: 'white',
                    }}
                >
                    <Story />
                </div>
            )
        },
    ],
}

export default meta
