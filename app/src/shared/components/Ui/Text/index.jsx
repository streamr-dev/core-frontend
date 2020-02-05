// @flow

import React, { forwardRef } from 'react'
import { compose } from 'redux'
import FlushHistoryDecorator, { type Props as FlushHistoryProps } from './FlushHistoryDecorator'
import OnCommitDecorator, { type Props as OnCommitProps } from './OnCommitDecorator'
import RevertOnEscapeDecorator, { type Props as RevertOnEscapeProps } from './RevertOnEscapeDecorator'
import SelectAllOnFocusDecorator, { type Props as SelectAllOnFocusProps } from './SelectAllOnFocusDecorator'
import StyledInput from './StyledInput'

export { SpaciousTheme } from './StyledInput'

type Props =
    & FlushHistoryProps
    & OnCommitProps
    & RevertOnEscapeProps
    & SelectAllOnFocusProps
    & {
        tag: 'input' | 'textarea',
        unstyled?: boolean,
    }

const Text = ({ tag: Tag = 'input', unstyled, ...props }: Props, ref: any) => (
    unstyled ? (
        <Tag {...props} ref={ref} />
    ) : (
        <StyledInput {...props} as={Tag} ref={ref} />
    )
)

const EnhancedText = compose(
    FlushHistoryDecorator,
    OnCommitDecorator,
    SelectAllOnFocusDecorator,
    RevertOnEscapeDecorator,
)(forwardRef(Text))

EnhancedText.displayName = 'Text'

export default EnhancedText
