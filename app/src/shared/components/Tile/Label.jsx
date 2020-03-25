// @flow

import styled from 'styled-components'

export const HAPPY = 'happy'

export const WORRIED = 'worried'

export const ANGRY = 'angry'

const colors = {
    [HAPPY]: '#2ac437',
    [WORRIED]: '#ff5c00',
    [ANGRY]: '#ff0f2d',
}

const Label = styled.span`
    color: ${({ mood }) => colors[mood] || '#323232'};
    transition: 500ms color;
`

export default Label
