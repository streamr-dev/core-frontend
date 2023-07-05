import React, {
    ComponentType,
    forwardRef,
    ForwardRefRenderFunction,
    FunctionComponent,
    HTMLProps,
} from 'react'
import { compose } from '~/shared/utils/compose'
import { Props as FlushHistoryProps } from './FlushHistoryDecorator'
import FlushHistoryDecorator from './FlushHistoryDecorator'
import { Props as OnCommitProps } from './OnCommitDecorator'
import OnCommitDecorator from './OnCommitDecorator'
import { Props as RevertOnEscapeProps } from './RevertOnEscapeDecorator'
import RevertOnEscapeDecorator from './RevertOnEscapeDecorator'
import { Props as SelectAllOnFocusProps } from './SelectAllOnFocusDecorator'
import SelectAllOnFocusDecorator from './SelectAllOnFocusDecorator'
import StyledInput from './StyledInput'
export { SpaciousTheme } from './StyledInput'
export type TextInputProps = FlushHistoryProps &
    OnCommitProps &
    RevertOnEscapeProps &
    SelectAllOnFocusProps & {
        tag?: 'input' | 'textarea'
        unstyled?: boolean
        invalid?: boolean
    } & HTMLProps<HTMLInputElement | HTMLTextAreaElement>

const Text: FunctionComponent<TextInputProps> = (
    { tag: Tag = 'input', unstyled, ...props }: TextInputProps,
    ref: any,
) =>
    unstyled ? (
        <Tag {...props} ref={ref} />
    ) : (
        <StyledInput {...props} as={Tag} ref={ref} />
    )

const EnhancedText = compose<ComponentType<TextInputProps>>(
    FlushHistoryDecorator,
    OnCommitDecorator,
    SelectAllOnFocusDecorator,
    RevertOnEscapeDecorator,
)(forwardRef(Text as ForwardRefRenderFunction<Text>))
EnhancedText.displayName = 'Text'
export default EnhancedText
