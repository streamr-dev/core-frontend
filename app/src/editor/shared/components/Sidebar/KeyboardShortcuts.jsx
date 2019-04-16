// @flow

import React from 'react'

import Header from './Header'
import Content from './Content'
import Section from './Section'

type Props = {
    onClose: () => void,
}

export const KeyboardShortcuts = ({ onClose }: Props) => (
    <React.Fragment>
        <Header
            title="Keyboard Shortcuts"
            onClose={onClose}
        />
        <Content>
            <Section label="General" initialIsOpen>
                asd
            </Section>
            <Section label="Regularly used  modules">
                asd
            </Section>
        </Content>
    </React.Fragment>
)

export default KeyboardShortcuts
