const xs = {
    min: null,
    max: 375,
}

const sm = {
    min: xs.max + 1,
    max: 744,
}

const md = {
    min: sm.max + 1,
    max: 1440,
}

const lg = {
    min: md.max + 1,
    max: 1920,
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
