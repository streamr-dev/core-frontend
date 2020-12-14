import styled from 'styled-components'
import { SM, LG, REGULAR } from '$shared/utils/styled'

const IW = 504

const Inner = styled.div``

const Row = styled.div`
    display: grid;
    grid-template-columns: 360px 1fr;
    line-height: 28px;
    padding: 14px 0;
`

const Lhs = styled.div`
    padding-right: ${IW}px;
`

const Rhs = styled.div`
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    width: ${IW}px;
`

const Segment = styled.div`
    flex: 0;
    position: relative;
`

const Head = styled(Segment)`
    flex: 0;
    margin-left: calc((100vw - ${IW}px - 1108px) / 2);

    button + button {
        margin-left: 16px;
    }

    > ${Inner} {
        align-items: center;
        display: flex;
        height: 72px;

        h1 {
            font-size: 18px;
            font-weight: ${REGULAR};
            letter-spacing: 0.01em;
            line-height: normal;
            margin: 0;

            @media (min-width: ${LG}px) {
                font-size: 24px;
            }
        }

        h1 span:empty {
            display: none;
        }

        h1 span:not(:last-child)::after {
            content: '&rarr;';
            padding: 0 1em;
        }

        p {
            color: #a3a3a3;
            font-size: 12px;
            letter-spacing: 0.01em;
            line-height: normal;
            margin: 0;

            @media (min-width: ${LG}px) {
                font-size: 14px;
            }
        }

        p:empty {
            display: none;
        }

        @media (min-width: ${SM}px) {
            height: 56px;
        }

        @media (min-width: ${LG}px) {
            p {
                font-size: 14px;
            }
        }
    }
`

const Foot = styled.div`
    background: rgba(0,0,255,0.1);
    flex: 0 0 80px;
    display: none;
`

const Hold = styled.div`
    background: rgba(255,255,0, 0.2);
    height: 100%;
    overflow: auto;
`

const Root = styled.div`
    background: #ffffff;
    color: #323232;
    display: flex;
    flex-direction: column;
    height: 100%;
`

const Toolbar = styled(Segment)`
    ${Lhs},
    ${Rhs} {
        align-items: center;
        display: flex;
    }

    ${Lhs} {
        height: 64px;
    }

    ${Inner} {
        flex-grow: 1;
        margin-left: calc((100vw - 504px - 1108px) / 2);
        max-width: 1108px;
    }

    ${Rhs} {
        justify-content: flex-end;
        padding: 0 16px;
    }
`

const Columns = styled(Toolbar)`
    border: 1px solid #efefef;
    border-width: 1px 0;

    ${Lhs} {
        height: 56px;
    }

    ${Inner} {
    }

    ${Rhs} {
        background: #fafafa;
        border-left: 1px solid #efefef;
        justify-content: normal;
        padding: 0;
    }
`

const Messages = styled.div`
    height: 100%;
    overflow: auto;
`

const Feed = styled(Segment)`
    flex-grow: 1;

    ${Row} {
        border-bottom: 1px solid #efefef;
    }

    ${Lhs} {
        height: 100%;
        left: 0;
        position: absolute;
        top: 0;
        width: 100%;
    }

    ${Inner} {
        max-width: 1108px;
        margin-left: calc((100vw - 504px - 1108px) / 2);
    }
`

const Toy = {
    Foot,
    Head,
    Hold,
    Inner,
    Lhs,
    Rhs,
    Root,
    Row,
    Segment,
    Toolbar,
    Feed,
    Columns,
    Messages,
}

export default Toy
