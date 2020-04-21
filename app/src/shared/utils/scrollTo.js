import scrollIntoView from 'smooth-scroll-into-view-if-needed'

export default (el) => {
    if (el) {
        scrollIntoView(el, {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
        })
    }
}
