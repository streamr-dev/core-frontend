import React from 'react'
import { mount as enzymeMount } from 'enzyme'
import sinon from 'sinon'
import { MemoryRouter as Router } from 'react-router-dom'

import AuthPanelNav from '$auth/components/AuthPanelNav'

const noop = () => {}

const mount = (component) => enzymeMount(<Router>{component}</Router>)
    .find(AuthPanelNav)
    .find('div')
    .first()

describe(AuthPanelNav.name, () => {
    describe('with no flags nor callbacks set', () => {
        const el = mount((
            <AuthPanelNav />
        ))

        it('renders 2 children anyway', () => {
            expect(el.children().length).toBe(2)
        })

        it('renders no text, just placeholders', () => {
            expect(el.text()).toMatch(/^\s*$/)
        })
    })

    describe('with all flags and callbacks set, for whatever reason', () => {
        const el = mount((
            <AuthPanelNav
                signin
                signup
                onUseEth={noop}
                onGoBack={noop}
            />
        ))

        it('renders 2 children', () => {
            expect(el.children().length).toBe(2)
        })

        it('defaults to rendering "Back" link', () => {
            expect(el.text()).toMatch(/back/)
        })
    })

    describe('with onGoBack set', () => {
        const onClick = sinon.spy()

        const el = mount((
            <AuthPanelNav
                onGoBack={onClick}
            />
        ))

        beforeEach(() => {
            onClick.resetHistory()
        })

        it('renders a link that call our custom callback', () => {
            el.find('a').simulate('click')
            expect(onClick.calledOnce).toBe(true)
        })
    })

    describe('with onUseEth set', () => {
        const onClick = sinon.spy()

        const el = mount((
            <AuthPanelNav
                onUseEth={onClick}
            />
        ))

        beforeEach(() => {
            onClick.resetHistory()
        })

        it('renders a "Sign in w/ eth" link', () => {
            expect(el.text()).toMatch(/sign\s*in\s*with\s*ethereum/i)
        })

        it('makes the link call our custom callback', () => {
            el.find('a').simulate('click')
            expect(onClick.calledOnce).toBe(true)
        })
    })

    describe('with signin set', () => {
        const el = mount((
            <AuthPanelNav
                signin
            />
        ))

        it('renders a "Sign in" link', () => {
            expect(el.text()).toMatch(/sign\s*in/i)
        })
    })

    describe('with signup set', () => {
        const el = mount((
            <AuthPanelNav
                signup
            />
        ))

        it('renders a "Sign up" link', () => {
            expect(el.text()).toMatch(/sign\s*up/i)
        })
    })
})
