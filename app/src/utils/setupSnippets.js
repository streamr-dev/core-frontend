import { CodeSnippet } from '@streamr/streamr-layout'
import JavaScript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import Java from 'react-syntax-highlighter/dist/esm/languages/prism/java'
import Python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import Bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'

CodeSnippet.registerLanguages(JavaScript, Java, Python, Bash)
