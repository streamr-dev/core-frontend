import React from 'react'
import StoryRouter from 'storybook-react-router'
import { storiesOf } from '@storybook/react'
import ProjectsComponent, { ProjectsContainer } from '$mp/components/Projects'
import { ProjectList } from '$mp/types/project-types'
import exampleProjectsList from './exampleProjectList.json'

const story = (name) => storiesOf(`Projects/${name}`, module).addDecorator(StoryRouter())

story('ProjectsList')
    .add('basic', () => (
        <ProjectsContainer>
            <ProjectsComponent projects={exampleProjectsList as ProjectList} type="projects" />
        </ProjectsContainer>
    ))
    .add('no products', () => (
        <ProjectsContainer>
            <ProjectsComponent projects={[]} type="projects" />
        </ProjectsContainer>
    ))
    .add('fetching', () => (
        <ProjectsContainer>
            <ProjectsComponent projects={exampleProjectsList as ProjectList} type="projects" isFetching />
        </ProjectsContainer>
    ))
