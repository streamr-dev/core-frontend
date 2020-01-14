// @flow

import React from 'react'
import { compose } from 'redux'
import OnAutoCompleteDecorator from './OnAutoCompleteDecorator'
import OnCommitDecorator from './OnCommitDecorator'
import StatefulInputDecorator from './StatefulInputDecorator'
import ActionsDropdownDecorator from './ActionsDropdownDecorator'
import FlushHistoryDecorator from './FlushHistoryDecorator'
import SelectAllOnFocusDecorator from './SelectAllOnFocusDecorator'
import UnderlineDecorator from './UnderlineDecorator'

type Props = {
    tag: 'input' | 'textarea',
}

const Input = ({ tag: Tag = 'input', ...props }: Props) => (
    <Tag {...props} />
)

export default compose(
    ActionsDropdownDecorator,
    FlushHistoryDecorator,
    OnAutoCompleteDecorator,
    OnCommitDecorator,
    SelectAllOnFocusDecorator,
    StatefulInputDecorator,
    UnderlineDecorator,
)(Input)
