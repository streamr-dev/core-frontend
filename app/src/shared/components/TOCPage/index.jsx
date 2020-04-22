// @flow

import React, { type Node } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { MD, LG, XL } from '$shared/utils/styled'

import TOCSection from './TOCSection'
import TOCNav, { Link } from './TOCNav'
import styles from './tocPage.pcss'

type Props = {
    title?: string,
    children: ?Node,
    className?: string,
}

const SectionWrapper = styled.div`
    > div {
        padding-top: 72px;
    }

    > div + div {
        padding-top: 88px;
    }
`

const Wing = styled.div`
    display: none;

    @media (min-width: ${LG}px) {
        display: block;
    }
`

const UnstyledTOCPage = ({ children, title, ...props }: Props) => {
    const { hash } = useLocation()

    return (
        <div {...props}>
            <div>
                {!!title && (
                    <React.Fragment>
                        <Wing />
                        <h1 className={styles.pageTitle}>{title}</h1>
                        <div />
                    </React.Fragment>
                )}
                <Wing>
                    <TOCNav>
                        {React.Children.map(children, (child) => (
                            child.type === TOCSection ? (
                                <Link
                                    active={hash.substr(1) === child.props.id}
                                    href={`#${child.props.id}`}
                                >
                                    {child.props.linkTitle || child.props.title}
                                </Link>
                            ) : null
                        ))}
                    </TOCNav>
                </Wing>
                <SectionWrapper>
                    {children}
                </SectionWrapper>
                <Wing />
            </div>
        </div>
    )
}

const TOCPage = styled(UnstyledTOCPage)`
    margin: 0 auto;
    max-width: 624px;
    padding: 0 32px 3rem;

    @media (min-width: ${MD}px) {
        width: 896px;
    }

    @media (min-width: ${LG}px) {
        max-width: none;
        padding: 0 0 3rem;
        width: 928px;

        > div {
            display: grid;
            grid-column-gap: 64px;
            grid-template-columns: 160px 1fr 160px;
        }
    }

    @media (min-width: ${XL}px) {
        width: 1132px;

        > div {
            grid-template-columns: 192px 1fr 192px;
        }
    }
`

TOCPage.Section = TOCSection

export default TOCPage
