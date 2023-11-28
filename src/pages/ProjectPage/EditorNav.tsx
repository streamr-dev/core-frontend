import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { NavContainer } from '~/components/Nav'
import { LogoLink, Navbar, NavbarItem } from '~/components/Nav/Nav.styles'
import Logo from '~/shared/components/Logo'
import Button from '~/shared/components/Button'
import { REGULAR } from '~/shared/utils/styled'
import {
    useIsCurrentProjectDraftClean,
    useIsProjectBusy,
    usePersistCurrentProjectDraft,
    useProject,
} from '~/shared/stores/projectEditor'
import routes from '~/routes'
import { FloatingToolbar } from '~/components/FloatingToolbar'
import { useInViewport } from '~/hooks/useInViewport'

const FlexNavbar = styled(Navbar)`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const FlexNavbarItem = styled(NavbarItem)`
    display: flex;
    align-items: center;

    button {
        margin-left: 10px;
    }

    h1 {
        font-size: 18px;
        font-weight: ${REGULAR};
        margin: 0;
        padding-left: 16px;
    }
`

export default function EditorNav() {
    const busy = useIsProjectBusy()

    const clean = useIsCurrentProjectDraftClean()

    const { id: projectId } = useProject()

    const persist = usePersistCurrentProjectDraft()

    const [attach, isSaveButtonVisible] = useInViewport()

    return (
        <NavContainer>
            <FloatingToolbar $active={!isSaveButtonVisible}>
                <FlexNavbarItem>
                    <Button tag={Link} to={routes.projects.index()} kind="transparent">
                        Exit
                    </Button>
                    <Button
                        type="button"
                        disabled={busy || clean}
                        onClick={() => void persist()}
                    >
                        Publish
                    </Button>
                </FlexNavbarItem>
            </FloatingToolbar>
            <FlexNavbar>
                <FlexNavbarItem>
                    <LogoLink href={routes.root()}>
                        <Logo />
                    </LogoLink>
                    <h1>{projectId ? <>Edit a project</> : <>Create a project</>}</h1>
                </FlexNavbarItem>
                <FlexNavbarItem>
                    <Button tag={Link} to={routes.projects.index()} kind="transparent">
                        Exit
                    </Button>
                    <Button
                        disabled={busy || clean}
                        onClick={() => void persist()}
                        innerRef={attach}
                        type="button"
                    >
                        Publish
                    </Button>
                </FlexNavbarItem>
            </FlexNavbar>
        </NavContainer>
    )
}
