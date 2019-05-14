import React from 'react'
import { mount } from 'enzyme'
import uniqueId from 'lodash/uniqueId'
import BodyClass from './index'

describe('BodyClass', () => {
    it('sets/unsets class on mount/unmount', () => {
        const className = uniqueId('bodyclass')
        const result = mount((
            <BodyClass className={className} />
        ))
        expect(document.body.classList.contains(className)).toBe(true)
        result.unmount()
        expect(document.body.classList.contains(className)).toBe(false)
    })

    it('can update class via prop', () => {
        const className1 = uniqueId('bodyclass')
        const className2 = uniqueId('bodyclass')
        const result = mount((
            <BodyClass className={className1} />
        ))
        result.setProps({
            className: className2,
        })
        expect(document.body.classList.contains(className1)).toBe(false)
        expect(document.body.classList.contains(className2)).toBe(true)
        result.unmount()
        expect(document.body.classList.contains(className1)).toBe(false)
        expect(document.body.classList.contains(className2)).toBe(false)
    })

    it('does not clobber itself', () => {
        const className1 = uniqueId('bodyclass')
        const className2 = uniqueId('bodyclass')
        const className3 = uniqueId('bodyclass')
        const result1 = mount((
            <BodyClass className={className1} />
        ))

        const result2 = mount((
            <BodyClass className={`${className1} ${className2}`} />
        ))

        const result3 = mount((
            <BodyClass className={`${className2} ${className3}`} />
        ))

        expect(document.body.classList.contains(className1)).toBe(true)
        expect(document.body.classList.contains(className2)).toBe(true)
        expect(document.body.classList.contains(className3)).toBe(true)
        result3.unmount()
        expect(document.body.classList.contains(className1)).toBe(true)
        expect(document.body.classList.contains(className2)).toBe(true)
        expect(document.body.classList.contains(className3)).toBe(false)
        result2.unmount()
        expect(document.body.classList.contains(className1)).toBe(true)
        expect(document.body.classList.contains(className2)).toBe(false)
        expect(document.body.classList.contains(className3)).toBe(false)
        result1.unmount()
        expect(document.body.classList.contains(className1)).toBe(false)
        expect(document.body.classList.contains(className2)).toBe(false)
        expect(document.body.classList.contains(className3)).toBe(false)
    })
})

