// @flow

import React, { type Node } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import cx from 'classnames'
import { XL } from '$shared/utils/styled'

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

const UnstyledTOCPage = ({ children, title, ...props }: Props) => {
    const { hash } = useLocation()

    return (
        <div {...props}>
            <div>
                {!!title && (
                    <React.Fragment>
                        <div />
                        <h1 className={styles.pageTitle}>{title}</h1>
                        <div />
                    </React.Fragment>
                )}
                <div>
                    <TOCNav>
                        {React.Children.map(children, (child) => (
                            child.type === TOCSection ? (
                                <Link
                                    active={hash.substr(1) === child.props.id}
                                    href={`#${child.props.id}`}
                                    onlyDesktop={child.props.onlyDesktop}
                                >
                                    {child.props.linkTitle || child.props.title}
                                </Link>
                            ) : null
                        ))}
                    </TOCNav>
                </div>
                <SectionWrapper>
                    {children}
                </SectionWrapper>
                <div />
            </div>
        </div>
    )
}

const TOCPage = styled(UnstyledTOCPage)`
    margin: 0 auto;
    padding-bottom: 3rem;
    width: 1132px;

    > div {
        display: grid;
        grid-template-columns: 160px 1fr 160px;
        grid-column-gap: 4rem;

        @media (min-width: ${XL}px) {
            grid-template-columns: 190px 1fr 190px;
        }
    }
`

TOCPage.Section = TOCSection

export default TOCPage
