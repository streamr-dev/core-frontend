import React, { forwardRef } from 'react'
import { compose } from 'redux'
import type { Props as FlushHistoryProps } from './FlushHistoryDecorator'
import FlushHistoryDecorator from './FlushHistoryDecorator'
import type { Props as OnCommitProps } from './OnCommitDecorator'
import OnCommitDecorator from './OnCommitDecorator'
import type { Props as RevertOnEscapeProps } from './RevertOnEscapeDecorator'
import RevertOnEscapeDecorator from './RevertOnEscapeDecorator'
import type { Props as SelectAllOnFocusProps } from './SelectAllOnFocusDecorator'
import SelectAllOnFocusDecorator from './SelectAllOnFocusDecorator'
import StyledInput from './StyledInput'
export { SpaciousTheme } from './StyledInput'
type Props = FlushHistoryProps &
    OnCommitProps &
    RevertOnEscapeProps &
    SelectAllOnFocusProps & {
        tag: 'input' | 'textarea'
        unstyled?: boolean
    }

const Text = ({ tag: Tag = 'input', unstyled, ...props }: Props, ref: any) =>
    unstyled ? <Tag {...props} ref={ref} /> : <StyledInput {...props} as={Tag} ref={ref} />

const EnhancedText = compose(
    FlushHistoryDecorator,
    OnCommitDecorator,
    SelectAllOnFocusDecorator,
    RevertOnEscapeDecorator,
)(forwardRef(Text))
EnhancedText.displayName = 'Text'
export default EnhancedText
