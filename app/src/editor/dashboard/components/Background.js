/**
 * Generates Grid Background
 */

/**
 * Set attributes on elem
 * Object key/value -> attributes
 */

function setAttrs(elem, attrs) {
    if (!attrs) { return elem }
    Object.keys(attrs).forEach((key) => {
        const nkey = key.replace(/([a-z])([A-Z])/g, (_, a, b) => `${a}-${b.toLowerCase()}`)
        elem.setAttribute(nkey, attrs[key])
    })
    return elem
}

/**
 * Create an SVG element with attributes
 * e.g. SVG('rect', { width, height })
 */

function SVG(name, attrs) {
    const elem = document.createElementNS('http://www.w3.org/2000/svg', name)
    if (name === 'svg') {
        elem.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        elem.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
    }
    if (!attrs) { return elem }
    setAttrs(elem, attrs)
    return elem
}

/**
 * Convert SVG element to string so can be used as background
 */

function SVGEncode(svgElement) {
    const div = document.createElement('div')
    div.appendChild(svgElement)
    const content = `
        <?xml version="1.0" encoding="utf-8"?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        ${div.innerHTML}
  `.trim()

    return `data:image/svg+xml;base64,${window.btoa(content)}`
}

export default function Background({ height = 10, width = 10, fill = 'none', ...attrs } = {}) {
    const svg = SVG('svg', {
        width,
        height,
    })

    svg.appendChild(SVG('rect', {
        width: width + 1,
        height: height + 1,
        x: -1,
        y: -1,
        fill,
        ...attrs,
    }))

    return SVGEncode(svg)
}
