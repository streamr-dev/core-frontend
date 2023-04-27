import React, { useContext } from 'react'
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import { LogoLink, Navbar, NavbarItem, NavContainer } from '$shared/components/Layout/Nav'
import Logo from '$shared/components/Logo'
import Button from '$shared/components/Button'
import { REGULAR } from '$shared/utils/styled'
import { ProjectControllerContext, ValidationError } from '$mp/containers/ProjectEditing/ProjectController'
import { RejectReason } from '$app/src/modals/Modal'
import { errorToast } from '$utils/toast'
import isCodedError from '$utils/isCodedError'
import routes from '$routes'

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

interface Props {
    isNewProject?: boolean
    editedProductHasChanged?: boolean
}

export function EditorNav({ isNewProject = false, editedProductHasChanged = false }: Props) {
    const {create, publishInProgress, update} = useContext(ProjectControllerContext)
    return <NavContainer>
        <FlexNavbar>
            <FlexNavbarItem>
                <LogoLink href={routes.root()}>
                    <Logo />
                </LogoLink>
                <h1>{isNewProject ? 'Creating' : 'Edit'} a project</h1>
            </FlexNavbarItem>
            <FlexNavbarItem>
                <Button tag={Link} to={routes.projects.index()} kind={'transparent'}>Exit</Button>
                <Button
                    disabled={publishInProgress || (!isNewProject && !editedProductHasChanged)}
                    onClick={async () => {
                        try {
                            if (isNewProject) {
                                return void await create()
                            }

                            await update()
                        } catch (e) {
                            if (e instanceof ValidationError) {
                                return void errorToast({
                                    title: 'Failed to publish',
                                    desc: (
                                        <ul>
                                            {e.messages.map((message, index) => (
                                                <li key={index}>
                                                    {message}
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                })
                            }

                            if (isCodedError(e) && e.code === 4001) {
                                return
                            }

                            if (e === RejectReason.Cancel || e === RejectReason.EscapeKey) {
                                return
                            }

                            console.warn('Failed to publish', e)
                        }
                    }}
                >
                    Publish
                </Button>
            </FlexNavbarItem>
        </FlexNavbar>
    </NavContainer>
}
