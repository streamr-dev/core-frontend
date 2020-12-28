import styled from 'styled-components'

const Cell = styled.span`
    display: block;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

export default Cell
