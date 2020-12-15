import styled from 'styled-components'

const Feed = styled.div`
    flex-grow: 1;
    position: relative;
`

const Row = styled.div`
    border-bottom: 1px solid #efefef;
    box-sizing: content-box;
    display: grid;
    line-height: 28px;
    padding: 14px 16px;
    transition: 250ms background-color;

    :hover {
        transition-duration: 25ms;
    }
`

const Lhs = styled.div`
    height: 100%;
    left: 0;
    overflow: auto;
    position: absolute;
    right: var(--LiveDataInspectorWidth, 504px);
    top: 0;

    ${Row} {
        grid-template-columns: 360px 1fr;
        margin-left: calc((100vw - var(--LiveDataInspectorWidth, 504px) - 1108px - 32px) / 2);
        width: 1108px;
    }

    ${Row}:hover {
        background: #fafafa;
    }
`

const Rhs = styled.div`
    background: #fafafa;
    border-left: 1px solid #efefef;
    height: 100%;
    overflow: auto;
    position: absolute;
    right: 0;
    top: 0;
    width: var(--LiveDataInspectorWidth, 504px);

    ${Row} {
        grid-template-columns: 164px 1fr;
        column-gap: 8px;
        margin: 0 24px;
    }

    ${Row}:hover {
        background: #f3f3f3;
    }
`

const Cell = styled.span`
    display: block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

Object.assign(Feed, {
    Cell,
    Lhs,
    Rhs,
    Row,
})

export default Feed
