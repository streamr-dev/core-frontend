import styled from 'styled-components'

const Toolbar = styled.div`
    align-items: center;
    display: flex;
    height: 64px;
    margin-left: calc((100vw - var(--LiveDataInspectorWidth, 504px) - 1108px) / 2);
    padding: 0 16px 0 0;
`

const Lhs = styled.div`
    flex-grow: 1;
    display: grid;
    grid-template-columns: 360px 1fr;
`

const Rhs = styled.div`
    display: flex;

    button + button {
        margin-left: 16px;
    }
`

Object.assign(Toolbar, {
    Lhs,
    Rhs,
})

export default Toolbar
