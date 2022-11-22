import styled from 'styled-components'
export const HAPPY = 'happy'
export const WORRIED = 'worried'
export const ANGRY = 'angry'
const colors = {
    [HAPPY]: '#2ac437',
    [WORRIED]: '#ff5c00',
    [ANGRY]: '#ff0f2d',
}
type LabelProps = {
    mood?: string
}

const Label = styled.span<LabelProps>`
    color: ${({ mood }) => colors[mood] || '#323232'};
    transition: 500ms color;
`
export default Label
