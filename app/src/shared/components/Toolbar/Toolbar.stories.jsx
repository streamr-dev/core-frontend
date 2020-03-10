// @flow

import React, { Fragment, useEffect, useRef } from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, boolean } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'
import Toolbar from '.'
import styled from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import { SM, MD, LG, XL } from '$shared/utils/styled'

const Content = styled.div`
    height: 1000px;
`

const story = (name) => storiesOf(`Shared/${name}`, module)
    .addDecorator(styles({
        color: '#323232',
    }))
    .addDecorator(withKnobs)

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
    .addParameters({
        chromatic: {
            // Take 5 snapshots
            viewports: [SM - 1, SM, MD, LG, XL],
        },
    })
    .addWithJSX('basic', () => (
        <Fragment>
            <Toolbar
                actions={toolbarActions}
                altMobileLayout
            />
            <Content>Lorem ipsum dolor sit emat.</Content>
        </Fragment>
    ))

const Autoscrolled = ({ children }: any) => {
    const ref = useRef()

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({
                block: 'end',
            })
        }
    }, [])

    return (
        <div>
            {children}
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <div ref={ref} />
        </div>
    )
}

story('Toolbar').addWithJSX('basic scrolled down', () => (
    <Autoscrolled>
        <Toolbar
            actions={toolbarActions}
            altMobileLayout
        />
        <Content>Lorem ipsum dolor sit emat.</Content>
    </Autoscrolled>
))

story('Toolbar').addWithJSX('left status text', () => (
    <Fragment>
        <Toolbar
            actions={toolbarActions}
            altMobileLayout
            left={text('status text', 'status')}
        />
        <Content>Lorem ipsum dolor sit emat.</Content>
    </Fragment>
))

story('Toolbar').addWithJSX('middle icon', () => (
    <Fragment>
        <Toolbar
            actions={toolbarActions}
            altMobileLayout
            left={text('status text', 'status')}
            middle={<SvgIcon
                name="user"
                style={{
                    width: '40px',
                    height: '40px',
                }}
            />}
        />
        <Content>Lorem ipsum dolor sit emat.</Content>
    </Fragment>
))

