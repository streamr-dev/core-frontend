import React, { ComponentType, forwardRef, ForwardRefRenderFunction, FunctionComponent, HTMLProps } from 'react'
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
        tag?: 'input' | 'textarea'
        unstyled?: boolean
        invalid?: boolean
    } &
    HTMLProps<HTMLInputElement | HTMLTextAreaElement>

const Text: FunctionComponent<Props> = ({ tag: Tag = 'input', unstyled, ...props }: Props, ref: any) =>
    unstyled ? <Tag {...props} ref={ref} /> : <StyledInput {...props} as={Tag} ref={ref} />

const EnhancedText= compose<ComponentType<Props>>(
    FlushHistoryDecorator,
    OnCommitDecorator,
    SelectAllOnFocusDecorator,
    RevertOnEscapeDecorator,
)(forwardRef(Text as ForwardRefRenderFunction<Text>))
EnhancedText.displayName = 'Text'
export default EnhancedText