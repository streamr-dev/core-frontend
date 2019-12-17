// @flow

import React from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'
import styles from '@sambego/storybook-styles'

import CollapsedText from '.'

const stories =
    storiesOf('Marketplace/CollapsedText', module)
        .addDecorator(styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }))
        .addDecorator(withKnobs)

/* eslint-disable max-len */
const shortText = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec mauris nec ipsum malesuada laoreet.',
].join(' ')
const mediumText = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec mauris nec ipsum malesuada laoreet. Duis et hendrerit quam. Donec molestie leo at tellus convallis, ac ultricies felis molestie. Donec eu scelerisque mi. Sed tristique placerat augue ac condimentum. Morbi lacinia ex sit amet pulvinar pulvinar. Aenean a est in dui vehicula blandit. Nullam viverra placerat mattis. Nunc suscipit quis arcu eget posuere.',
    'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur magna est, semper non blandit eu, porta ut ex. Ut euismod pharetra orci id hendrerit. Sed sodales mi ac ipsum pharetra tincidunt. Quisque et urna purus. In et tempus quam. Nam gravida, tellus sed vestibulum laoreet, dui sapien varius diam, tempor ullamcorper augue purus vitae urna. Donec neque ipsum, pharetra a congue non, volutpat at ligula. Sed eget ornare sapien, id vulputate metus. Quisque eget purus malesuada, tincidunt eros eu, ornare leo. Proin faucibus blandit eros nec blandit. Suspendisse vel faucibus lorem, ut euismod sem. Nam non rhoncus quam. Sed vel neque id purus sagittis porttitor. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    'Quisque eget varius lorem. Ut tempor ac risus eget vehicula. Nunc aliquet porttitor lacinia. Nam tincidunt, neque non imperdiet pulvinar, purus leo tempor erat, eu consequat leo odio in nibh. Aenean volutpat magna odio. Pellentesque id lacus vel risus viverra elementum. Donec vestibulum bibendum volutpat. In hac habitasse platea dictumst. Curabitur fringilla id dolor sed interdum. Integer eget feugiat neque. Maecenas tempus nunc eu erat dapibus, ut tristique magna placerat. Duis nec massa ac mi ultrices rhoncus sit amet quis quam. Nulla bibendum nisl id libero viverra, quis rutrum ligula aliquam. Nam massa nisl, ullamcorper nec iaculis id, posuere non ex. Mauris tincidunt purus et nibh pharetra porttitor.',
].join('\n\n')
const longText = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec mauris nec ipsum malesuada laoreet. Duis et hendrerit quam. Donec molestie leo at tellus convallis, ac ultricies felis molestie. Donec eu scelerisque mi. Sed tristique placerat augue ac condimentum. Morbi lacinia ex sit amet pulvinar pulvinar. Aenean a est in dui vehicula blandit. Nullam viverra placerat mattis. Nunc suscipit quis arcu eget posuere.',
    'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur magna est, semper non blandit eu, porta ut ex. Ut euismod pharetra orci id hendrerit. Sed sodales mi ac ipsum pharetra tincidunt. Quisque et urna purus. In et tempus quam. Nam gravida, tellus sed vestibulum laoreet, dui sapien varius diam, tempor ullamcorper augue purus vitae urna. Donec neque ipsum, pharetra a congue non, volutpat at ligula. Sed eget ornare sapien, id vulputate metus. Quisque eget purus malesuada, tincidunt eros eu, ornare leo. Proin faucibus blandit eros nec blandit. Suspendisse vel faucibus lorem, ut euismod sem. Nam non rhoncus quam. Sed vel neque id purus sagittis porttitor. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    'Quisque eget varius lorem. Ut tempor ac risus eget vehicula. Nunc aliquet porttitor lacinia. Nam tincidunt, neque non imperdiet pulvinar, purus leo tempor erat, eu consequat leo odio in nibh. Aenean volutpat magna odio. Pellentesque id lacus vel risus viverra elementum. Donec vestibulum bibendum volutpat. In hac habitasse platea dictumst. Curabitur fringilla id dolor sed interdum. Integer eget feugiat neque. Maecenas tempus nunc eu erat dapibus, ut tristique magna placerat. Duis nec massa ac mi ultrices rhoncus sit amet quis quam. Nulla bibendum nisl id libero viverra, quis rutrum ligula aliquam. Nam massa nisl, ullamcorper nec iaculis id, posuere non ex. Mauris tincidunt purus et nibh pharetra porttitor.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam nec mauris nec ipsum malesuada laoreet. Duis et hendrerit quam. Donec molestie leo at tellus convallis, ac ultricies felis molestie. Donec eu scelerisque mi. Sed tristique placerat augue ac condimentum. Morbi lacinia ex sit amet pulvinar pulvinar. Aenean a est in dui vehicula blandit. Nullam viverra placerat mattis. Nunc suscipit quis arcu eget posuere.',
    'Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Curabitur magna est, semper non blandit eu, porta ut ex. Ut euismod pharetra orci id hendrerit. Sed sodales mi ac ipsum pharetra tincidunt. Quisque et urna purus. In et tempus quam. Nam gravida, tellus sed vestibulum laoreet, dui sapien varius diam, tempor ullamcorper augue purus vitae urna. Donec neque ipsum, pharetra a congue non, volutpat at ligula. Sed eget ornare sapien, id vulputate metus. Quisque eget purus malesuada, tincidunt eros eu, ornare leo. Proin faucibus blandit eros nec blandit. Suspendisse vel faucibus lorem, ut euismod sem. Nam non rhoncus quam. Sed vel neque id purus sagittis porttitor. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    'Quisque eget varius lorem. Ut tempor ac risus eget vehicula. Nunc aliquet porttitor lacinia. Nam tincidunt, neque non imperdiet pulvinar, purus leo tempor erat, eu consequat leo odio in nibh. Aenean volutpat magna odio. Pellentesque id lacus vel risus viverra elementum. Donec vestibulum bibendum volutpat. In hac habitasse platea dictumst. Curabitur fringilla id dolor sed interdum. Integer eget feugiat neque. Maecenas tempus nunc eu erat dapibus, ut tristique magna placerat. Duis nec massa ac mi ultrices rhoncus sit amet quis quam. Nulla bibendum nisl id libero viverra, quis rutrum ligula aliquam. Nam massa nisl, ullamcorper nec iaculis id, posuere non ex. Mauris tincidunt purus et nibh pharetra porttitor.',
].join('\n\n')

// from https://raw.githubusercontent.com/adamschwartz/github-markdown-kitchen-sink/master/TEST.md
const markdown = `This is a paragraph.

This is a paragraph.



Header 1
========

Header 2
--------

Header 1
========

Header 2
--------



# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6




> Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

    > Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus. Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.



> ## This is a header.
> 1. This is the first list item.
> 2. This is the second list item.
>
> Here's some example code:
>
>     Markdown.generate();

    > ## This is a header.
    > 1. This is the first list item.
    > 2. This is the second list item.
    >
    > Here's some example code:
    >
    >     Markdown.generate();




- Red
- Green
- Blue


+ Red
+ Green
+ Blue


* Red
* Green
* Blue

Paragraph:

    Code

<!-- -->

    Paragraph:

        Code



* * *

***

*****

- - -

---------------------------------------

    * * *

    ***

    *****

    - - -

    ---------------------------------------



This is [an example](http://example.com "Example") link.

[This link](http://example.com) has no title attr.

This is [an example] [id] reference-style link.

[id]: http://example.com "Optional Title"

    This is [an example](http://example.com "Example") link.

    [This link](http://example.com) has no title attr.

    This is [an example] [id] reference-style link.

    [id]: http://example.com "Optional Title"



*single asterisks*

_single underscores_

**double asterisks**

__double underscores__

    *single asterisks*

    _single underscores_

    **double asterisks**

    __double underscores__



This paragraph has some \`code\` in it.

    This paragraph has some \`code\` in it.



![Alt Text](http://placehold.it/200x50 "Image Title")

    ![Alt Text](http://placehold.it/200x50 "Image Title")`

const markdownWithNumberedList = `Normal & numbered list:

* List item 1
* List item 2
* List item 3

1. Item 1
2. Item 2
3. Item 3
4. Item 4
5. Item 5
6. Item 6
7. Item 7
8. Item 8
9. Item 9
10. Item 10
11. Item 11
12. Item 12

> Quote at the end

Bullets should align with dots, same text left align.
`
/* eslint-enable max-len */

stories.add('short', () => (
    <CollapsedText text={shortText} />
))

stories.add('medium', () => (
    <CollapsedText text={mediumText} />
))

stories.add('long', () => (
    <CollapsedText text={longText} />
))

stories.add('markdown', () => (
    <CollapsedText text={markdown} />
))

stories.add('numbered list', () => (
    <CollapsedText text={markdownWithNumberedList} />
))
