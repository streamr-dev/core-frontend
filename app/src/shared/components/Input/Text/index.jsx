// @flow

import React, { forwardRef } from 'react'
import { compose } from 'redux'
import FlushHistoryDecorator, { type Props as FlushHistoryProps } from './FlushHistoryDecorator'
import OnAutoCompleteDecorator, { type Props as OnAutoCompleteProps } from './OnAutoCompleteDecorator'
import OnCommitDecorator, { type Props as OnCommitProps } from './OnCommitDecorator'
import RevertOnEscapeDecorator, { type Props as RevertOnEscapeProps } from './RevertOnEscapeDecorator'
import SelectAllOnFocusDecorator, { type Props as SelectAllOnFocusProps } from './SelectAllOnFocusDecorator'
import StatefulInputDecorator, { type Props as StatefulInputProps } from './StatefulInputDecorator'

type Props =
    & FlushHistoryProps
    & OnAutoCompleteProps
    & OnCommitProps
    & RevertOnEscapeProps
    & SelectAllOnFocusProps
    & StatefulInputProps
    & {
        tag: 'input' | 'textarea',
    }

const Input = ({ tag: Tag = 'input', ...props }: Props, ref: any) => (
    <Tag {...props} ref={ref} />
)

export default compose(
    FlushHistoryDecorator,
    OnAutoCompleteDecorator,
    OnCommitDecorator,
    SelectAllOnFocusDecorator,
    RevertOnEscapeDecorator,
    StatefulInputDecorator,
)(forwardRef(Input))
