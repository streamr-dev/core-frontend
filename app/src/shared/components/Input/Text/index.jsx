// @flow

import React, { forwardRef } from 'react'
import { compose } from 'redux'
import OnAutoCompleteDecorator from './OnAutoCompleteDecorator'
import OnCommitDecorator from './OnCommitDecorator'
import StatefulInputDecorator from './StatefulInputDecorator'
import FlushHistoryDecorator from './FlushHistoryDecorator'
import SelectAllOnFocusDecorator from './SelectAllOnFocusDecorator'
import RevertOnEscapeDecorator from './RevertOnEscapeDecorator'

type Props = {
    tag: 'input' | 'textarea',
}

const Input = ({ tag: Tag = 'input', ...props }: Props, ref: any) => (
    <Tag {...props} ref={ref} />
)

export default compose(
    FlushHistoryDecorator,
    OnAutoCompleteDecorator,
    OnCommitDecorator,
    RevertOnEscapeDecorator,
    SelectAllOnFocusDecorator,
    StatefulInputDecorator,
)(forwardRef(Input))
