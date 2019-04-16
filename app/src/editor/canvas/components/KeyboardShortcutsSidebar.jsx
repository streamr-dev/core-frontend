// @flow

import React from 'react'

import { Header, Content, Section } from '$editor/shared/components/Sidebar'

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
