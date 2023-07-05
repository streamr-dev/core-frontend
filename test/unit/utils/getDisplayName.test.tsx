import React from 'react'
import getDisplayName from '~/utils/getDisplayName'
describe('getDisplayName', () => {
    it('defaults to "Component"', () => {
        expect(
            getDisplayName({
                name: null,
                displayName: null,
            } as any),
        ).toBe('Component')
    })
    it('gives name if available', () => {
        expect(
            getDisplayName({
                name: 'Name',
                displayName: null,
            } as any),
        ).toBe('Name')
    })
    it('gives displayName if available', () => {
        expect(
            getDisplayName({
                name: null,
                displayName: 'DisplayName',
            } as any),
        ).toBe('DisplayName')
    })
    it('gives expected value for real components', () => {
        class Komponent1 extends React.Component<any> {} // eslint-disable-line react/prefer-stateless-function

        expect(getDisplayName(Komponent1)).toEqual('Komponent1')

        const Komponent2 = () => <div />

        expect(getDisplayName(Komponent2)).toEqual('Komponent2')
    })
})
