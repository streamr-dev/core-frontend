const xs = {
    min: null,
    max: 575,
}

const sm = {
    min: xs.max + 1,
    max: 767,
}

const md = {
    min: sm.max + 1,
    max: 991,
}

const lg = {
    min: md.max + 1,
    max: 1199,
}

const xl = {
    min: lg.max + 1,
    max: null,
}

module.exports = {
    xs,
    sm,
    md,
    lg,
    xl,
}
