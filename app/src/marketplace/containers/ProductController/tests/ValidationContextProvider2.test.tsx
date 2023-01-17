import React, { useContext } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import { ValidationContext2Provider, ValidationContext2 } from '../ValidationContextProvider2'
describe('validation context', () => {
    afterEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })
    it('creates validation context', () => {
        let currentContext

        function Test() {
            currentContext = useContext(ValidationContext2)
            return null
        }

        mount(
            <ValidationContext2Provider>
                <Test />
            </ValidationContext2Provider>,
        )
        expect(currentContext.status).toStrictEqual({})
        expect(currentContext.touched).toStrictEqual({})
    })
    describe('touched fields', () => {
        it('marks a field as touched with touch()', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
                currentContext = useContext(ValidationContext2)
                return null
            }

            const result = mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
                currentContext = useContext(ValidationContext2)
                return null
            }

            const result = mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
                currentContext = useContext(ValidationContext2)
                return null
            }

            const result = mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
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
        it('validates empty product free data product', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
            )
            act(() => {
                currentContext.validate({
                    type: 'NORMAL',
                    isFree: true,
                })
            })
            expect(currentContext.isValid('name')).toBe(false)
            expect(currentContext.isValid('description')).toBe(false)
            expect(currentContext.isValid('imageUrl')).toBe(false)
            expect(currentContext.isValid('streams')).toBe(false)
            expect(currentContext.isValid('pricePerSecond')).toBe(true)
            expect(currentContext.isValid('beneficiaryAddress')).toBe(true)
            expect(currentContext.isValid('adminFee')).toBe(true)
        })
        it('validates empty product free data union', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
            )
            act(() => {
                currentContext.validate({
                    type: 'DATAUNION',
                    isFree: true,
                })
            })
            expect(currentContext.isValid('name')).toBe(false)
            expect(currentContext.isValid('description')).toBe(false)
            expect(currentContext.isValid('imageUrl')).toBe(false)
            expect(currentContext.isValid('streams')).toBe(false)
            expect(currentContext.isValid('pricePerSecond')).toBe(true)
            expect(currentContext.isValid('beneficiaryAddress')).toBe(true)
            expect(currentContext.isValid('adminFee')).toBe(false)
        })
        it('validates empty product paid data product', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
            )
            act(() => {
                currentContext.validate({
                    type: 'NORMAL',
                    isFree: false,
                })
            })
            expect(currentContext.isValid('name')).toBe(false)
            expect(currentContext.isValid('description')).toBe(false)
            expect(currentContext.isValid('imageUrl')).toBe(false)
            expect(currentContext.isValid('streams')).toBe(false)
            expect(currentContext.isValid('pricePerSecond')).toBe(false)
            expect(currentContext.isValid('beneficiaryAddress')).toBe(false)
            expect(currentContext.isValid('adminFee')).toBe(true)
        })
        it('validates empty product paid data union', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
            )
            act(() => {
                currentContext.validate({
                    type: 'DATAUNION',
                    isFree: false,
                })
            })
            expect(currentContext.isValid('name')).toBe(false)
            expect(currentContext.isValid('description')).toBe(false)
            expect(currentContext.isValid('imageUrl')).toBe(false)
            expect(currentContext.isValid('streams')).toBe(false)
            expect(currentContext.isValid('pricePerSecond')).toBe(false)
            expect(currentContext.isValid('beneficiaryAddress')).toBe(true)
            expect(currentContext.isValid('adminFee')).toBe(false)
        })
        it('validates name & description', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
            )
            act(() => {
                currentContext.validate({
                    type: 'NORMAL',
                })
            })
            expect(currentContext.isValid('name')).toBe(false)
            expect(currentContext.isValid('description')).toBe(false)
            act(() => {
                currentContext.validate({
                    type: 'NORMAL',
                    name: 'new name',
                    description: 'new description',
                })
            })
            expect(currentContext.isValid('name')).toBe(true)
            expect(currentContext.isValid('description')).toBe(true)
        })
        it('validates image', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
            )
            act(() => {
                currentContext.validate({
                    type: 'NORMAL',
                })
            })
            expect(currentContext.isValid('imageUrl')).toBe(false)
            act(() => {
                currentContext.validate({
                    type: 'NORMAL',
                    imageUrl: 'http://...',
                })
            })
            expect(currentContext.isValid('imageUrl')).toBe(true)
            act(() => {
                currentContext.clearStatus('imageUrl')
                currentContext.validate({
                    type: 'NORMAL',
                    newImageToUpload: 'blob',
                })
            })
            expect(currentContext.isValid('imageUrl')).toBe(true)
        })
        it('validates streams', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
            )
            act(() => {
                currentContext.validate({
                    type: 'NORMAL',
                })
            })
            expect(currentContext.isValid('streams')).toBe(false)
            act(() => {
                currentContext.validate({
                    type: 'NORMAL',
                    streams: ['1', '2'],
                })
            })
            expect(currentContext.isValid('streams')).toBe(true)
        })
        it('validates admin fee', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
            )
            act(() => {
                currentContext.validate({
                    type: 'DATAUNION',
                })
            })
            expect(currentContext.isValid('adminFee')).toBe(false)
            act(() => {
                currentContext.validate({
                    type: 'DATAUNION',
                    adminFee: 0.3,
                })
            })
            expect(currentContext.isValid('adminFee')).toBe(true)
            act(() => {
                currentContext.clearStatus('adminFee')
                currentContext.validate({
                    type: 'DATAUNION',
                    adminFee: 0,
                })
            })
            expect(currentContext.isValid('adminFee')).toBe(true)
            act(() => {
                currentContext.clearStatus('adminFee')
                currentContext.validate({
                    type: 'DATAUNION',
                    adminFee: -2,
                })
            })
            expect(currentContext.isValid('adminFee')).toBe(false)
            act(() => {
                currentContext.clearStatus('adminFee')
                currentContext.validate({
                    type: 'DATAUNION',
                    adminFee: 1.1,
                })
            })
            expect(currentContext.isValid('adminFee')).toBe(false)
        })
        it('validates beneficiary address', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
            )
            act(() => {
                currentContext.validate({
                    type: 'NORMAL',
                    isFree: false,
                })
            })
            expect(currentContext.isValid('beneficiaryAddress')).toBe(false)
            act(() => {
                currentContext.clearStatus('beneficiaryAddress')
                currentContext.validate({
                    type: 'NORMAL',
                    isFree: false,
                    beneficiaryAddress: 'invalidAddress',
                })
            })
            expect(currentContext.isValid('beneficiaryAddress')).toBe(false)
            act(() => {
                currentContext.clearStatus('beneficiaryAddress')
                currentContext.validate({
                    type: 'NORMAL',
                    isFree: false,
                    beneficiaryAddress: '0x7Ce38183F7851EE6eEB9547B1E537fB362C79C10',
                })
            })
            expect(currentContext.isValid('beneficiaryAddress')).toBe(true)
        })
        it('validates price', () => {
            let currentContext

            function Test() {
                currentContext = useContext(ValidationContext2)
                return null
            }

            mount(
                <ValidationContext2Provider>
                    <Test />
                </ValidationContext2Provider>,
            )
            act(() => {
                currentContext.validate({
                    type: 'NORMAL',
                    isFree: false,
                })
            })
            expect(currentContext.isValid('pricePerSecond')).toBe(false)
            act(() => {
                currentContext.clearStatus('pricePerSecond')
                currentContext.validate({
                    type: 'NORMAL',
                    isFree: false,
                    pricePerSecond: '-10',
                })
            })
            expect(currentContext.isValid('pricePerSecond')).toBe(false)
            act(() => {
                currentContext.clearStatus('pricePerSecond')
                currentContext.validate({
                    type: 'NORMAL',
                    isFree: false,
                    pricePerSecond: '123',
                })
            })
            expect(currentContext.isValid('pricePerSecond')).toBe(true)
        })
    })
})
