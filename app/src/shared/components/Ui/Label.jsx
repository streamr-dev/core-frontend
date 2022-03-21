import styled from 'styled-components'
import * as Colors from '$ui/StateColors'
import { MEDIUM } from '$shared/utils/styled'
import UnstyledLabel from '$ui/Label.unstyled'

const Label = styled(UnstyledLabel)`
    color: ${({ state }) => Colors[state] || Colors.DEFAULT};
    display: block;
    font-size: 12px;
    font-weight: ${MEDIUM};
    line-height: 1em;
    margin: 0 0 8px;
    transition: 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    transition-property: color, transform;
    white-space: nowrap;
`

export default Label
