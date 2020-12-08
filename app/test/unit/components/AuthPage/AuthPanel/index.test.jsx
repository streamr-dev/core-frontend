import React from 'react'
import { mount } from 'enzyme'

import AuthPanel from '$auth/components/AuthPanel'
import AuthStep from '$auth/components/AuthStep'
import AuthPanelNav from '$auth/components/AuthPanelNav'
import AuthFormContext from '$auth/contexts/AuthForm'
import * as yup from 'yup'

describe(AuthPanel.name, () => {
    const onPrev = () => {}
    const validationSchema = yup.object()
    const onValidationError = () => {}
    const setIsProcessing = () => {}
    const onNext = () => {}
    const form = {}
    const isProcessing = false
    const onEthClick = () => {}

    const el = (currentStep) => mount((
        <AuthFormContext.Provider
            value={{
                errors: {},
                form,
                isProcessing,
                next: onNext,
                prev: onPrev,
                redirect: () => {},
                setFieldError: () => {},
                setFormField: () => {},
                setIsProcessing,
                step: currentStep,
            }}
        >
            <AuthPanel
                validationSchemas={[validationSchema]}
                onValidationError={onValidationError}
            >
                <AuthStep
                    showSignin
                    showSignup
                    showBack
                    onEthereumClick={onEthClick}
                    title="Step #0"
                >
                    #0
                </AuthStep>
                <AuthStep
                    title="Step #1"
                >
                    #1
                </AuthStep>
            </AuthPanel>
        </AuthFormContext.Provider>
    ))

    it('renders children', () => {
        expect(el(0).children().length).toBe(1)
    })

    describe('navigation', () => {
        it('renders a nav for each step', () => {
            expect(el(0).find(AuthPanelNav).length).toBe(1)
        })

        describe('passing default step\'s props to nav', () => {
            const currentStep = 1
            const el0 = el(currentStep)
            const step = el0.find(AuthStep)
            const nav = el0.find(AuthPanelNav)

            it('sets nav#signin if step#showSignin is set', () => {
                expect(step.prop('showSignin')).not.toBeDefined()
                expect(nav.prop('signin')).toBe(false)
            })

            it('passes (undefined) onEthereumClick to nav#onUseEth', () => {
                expect(step.prop('onEthereumClick')).toBeUndefined()
                expect(nav.prop('onUseEth')).toBeUndefined()
            })

            it('passes step\'s onPrev prop as to nav#onGoBack if step#showBack is set', () => {
                expect(step.prop('showBack')).not.toBeDefined()
                expect(nav.prop('onGoBack')).toBeNull()
            })
        })

        describe('passing custom step\'s props to nav', () => {
            const el1 = el(0)
            const step = el1.find(AuthStep)
            const nav = el1.find(AuthPanelNav)

            it('sets nav#signin if step#showSignin is set', () => {
                expect(step.prop('showSignin')).toBe(true)
                expect(nav.prop('signin')).toBe(true)
            })

            it('passes given onEthereumClick to nav#onUseEth', () => {
                expect(step.prop('onEthereumClick')).toBe(onEthClick)
                expect(nav.prop('onUseEth')).toBe(onEthClick)
            })

            it('passes step\'s onPrev prop as to nav#onGoBack if step#showBack is set', () => {
                expect(step.prop('showBack')).toBe(true)
                expect(nav.prop('onGoBack')).toBe(onPrev)
            })
        })
    })

    describe('title', () => {
        const titles = ['Step #0', 'Step #1']

        describe('mapping', () => {
            titles.forEach((title, index) => {
                it(`step ${index} gives the panel title "${title}"`, () => {
                    expect(el(index).find('.header').text()).toEqual(title)
                })
            })
        })
    })

    describe('passing props to steps', () => {
        const step = el(0).find(AuthStep)

        it('passes current validation schema', () => {
            expect(step.prop('validationSchema')).toBe(validationSchema)
        })

        it('passes step number', () => {
            expect(step.prop('step')).toBe(0)
        })

        it('passes how many steps there are (totalSteps)', () => {
            expect(step.prop('totalSteps')).toBe(2)
        })

        it('passes onValidationError callback', () => {
            expect(step.prop('onValidationError')).toBe(onValidationError)
        })

        it('passes setIsProcessing setter', () => {
            expect(step.prop('setIsProcessing')).toBe(setIsProcessing)
        })

        it('passes isProcessing flag', () => {
            expect(step.prop('isProcessing')).toBe(isProcessing)
        })

        it('passes onNext (next) callback', () => {
            expect(step.prop('next')).toBe(onNext)
        })

        it('passes the form', () => {
            expect(step.prop('form')).toBe(form)
        })

        it('tells a step if it is the current one', () => {
            expect(step.prop('current')).toBe(true)
        })
    })
})
