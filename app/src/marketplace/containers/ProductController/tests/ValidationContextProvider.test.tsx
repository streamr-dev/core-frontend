import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { ValidationContextProvider, ValidationContext } from '../ValidationContextProvider'
describe('validation context2', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })
    it('creates validation context', () => {
        let currentContext

        function Test() {
            currentContext = useContext(ValidationContext)
            return null
        }

        mount(
            <ValidationContextProvider>
                <Test />
            </ValidationContextProvider>,
        )
        expect(currentContext.status).toStrictEqual({})
        expect(currentContext.touched).toStrictEqual({})
    })
    describe('touched fields', () => {
        it('marks a field as touched with touch()', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            expect(currentContext.touched).toStrictEqual({})
            act(() => {
                currentContext.setTouched('myField')
            })
            expect(currentContext.touched).toStrictEqual({
                myField: true,
            })
        })
        it('returns true for fields marked as touched with isTouched()', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            expect(currentContext.touched).toStrictEqual({})
            act(() => {
                currentContext.setTouched('myField')
            })
            expect(currentContext.isTouched('myField')).toBe(true)
            expect(currentContext.isTouched('anotherField')).toBe(false)
        })
        it('returns true if any field touched with isAnyTouched()', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            expect(currentContext.isAnyTouched()).toBe(false)
            act(() => {
                currentContext.setTouched('myField')
            })
            expect(currentContext.isAnyTouched()).toBe(true)
        })
        it('resets touched values with resetTouched()', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            expect(currentContext.isAnyTouched()).toBe(false)
            act(() => {
                currentContext.setTouched('myField')
                currentContext.setTouched('anotherField')
            })
            expect(currentContext.isAnyTouched()).toBe(true)
            act(() => {
                currentContext.resetTouched()
            })
            expect(currentContext.isAnyTouched()).toBe(false)
        })
    })
    describe('status', () => {
        it('sets field error status with setStatus()', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            expect(currentContext.status).toStrictEqual({})
            act(() => {
                currentContext.setStatus('myField', 'info', 'message')
            })
            expect(currentContext.status).toStrictEqual({
                myField: {
                    level: 'info',
                    message: 'message',
                },
            })
        })
        it('throws error if no name given to setStatus()', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            act(() => {
                try {
                    currentContext.setStatus()
                } catch (e) {
                    expect(e.message).toBe('validation needs a name')
                }
            })
        })
        it('does nothing when calling setStatus() and unmounted', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            const result = mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            act(() => {
                result.unmount()
                currentContext.setStatus('myField', 'info', 'message')
            })
            expect(currentContext.status).toStrictEqual({})
        })
        it('removes field error status with clearStatus()', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            expect(currentContext.status).toStrictEqual({})
            act(() => {
                currentContext.setStatus('myField', 'info', 'message')
                currentContext.clearStatus('myField')
            })
            expect('myField' in currentContext.status).toBe(false)
        })
        it('throws error if no name given to clearStatus()', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            act(() => {
                try {
                    currentContext.clearStatus()
                } catch (e) {
                    expect(e.message).toBe('validation needs a name')
                }
            })
        })
        it('does nothing if unmounted and calling clearStatus()', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            const result = mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            act(() => {
                currentContext.setStatus('myField', 'info', 'message')
            })
            act(() => {
                result.unmount()
                currentContext.clearStatus('myField')
            })
            expect(currentContext.status).toStrictEqual({
                myField: {
                    level: 'info',
                    message: 'message',
                },
            })
        })
        it('returns true if field has no error and calling isValid()', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            expect(currentContext.status).toStrictEqual({})
            act(() => {
                currentContext.setStatus('myField', 'error', 'message')
            })
            expect(currentContext.isValid('myField')).toBe(false)
            act(() => {
                currentContext.clearStatus('myField')
            })
            expect(currentContext.isValid('myField')).toBe(true)
        })
    })
    describe('validate', () => {
        it('does nothing if product is null', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            expect(currentContext.status).toStrictEqual({})
            act(() => {
                currentContext.validate()
            })
            expect(currentContext.status).toStrictEqual({})
        })
        it('does nothing if unmounted', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext)
                return null
            }

            const result = mount(
                <ValidationContextProvider>
                    <Test />
                </ValidationContextProvider>,
            )
            expect(currentContext.status).toStrictEqual({})
            act(() => {
                result.unmount()
                currentContext.validate({
                    name: '',
                })
            })
            expect(currentContext.status).toStrictEqual({})
        })

    })
})
