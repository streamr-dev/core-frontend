/* eslint-disable */

// generateMd Script:
// Generates Markdown files from formatted JSON file - canvasModuleHelpData.json. 
// Script also embeds a broad category hidden comment, so that these modules can be categorised in a module reference list
// inside the Streamr Documentation.
// Script should be run in a node env. with dependencies installed.

// Followon steps:
// markdown parser misses some html, e.g. <span>, <strong>, <i> etc... these need to be manually removed.
// httpRequest-1001 in canvasModuleHelpData is malformed, needs to be manually fixed.

var html2md = require('html-markdown')
var writeFile = require('write-file')

var jsonhelp = require('./canvasModuleHelpData.json')

jsonhelp.forEach((m) => {
    let name = m.name.replace(/\s/g,'').replace(/\(/g,"_").replace(/\)/g,"")
    
    m.help.helpText = html2md.html2mdFromString(m.help.helpText || 'There is no documentation for this module at this time.')

    if (String(m.path).includes("Time Series")) {
        return (writeFile(`./mdFiles/${name}-${m.id}.md`,
        `
[comment]: # (TimeSeriesCanvasModule)
${m.help.helpText}`, function (err) {
            if (err) return console.log(err)
        })
    )
    } else if (String(m.path).includes("Integrations")){
        const path = 'integrations'

        return (writeFile(`./mdFiles/${name}-${m.id}.md`,
        `
[comment]: # (IntegrationsCanvasModule)
${m.help.helpText}`, function (err) {
            if (err) return console.log(err)
        })
    )
    } else {
        return (writeFile(`./mdFiles/${name}-${m.id}.md`,
        `
[comment]: # (${String(m.path)}CanvasModule)
${m.help.helpText}`, function (err) {
            if (err) return console.log(err)
        })
    )
    }
})
